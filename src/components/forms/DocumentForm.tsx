import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { TrashIcon } from 'lucide-react';

const documentFormSchema = z.object({
  type: z.enum(['nfe', 'nfce', 'nfse']),
  customer: z.string().min(1, 'Cliente é obrigatório'),
  items: z.array(z.object({
    description: z.string().min(1, 'Descrição é obrigatória'),
    quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
    unitValue: z.number().min(0.01, 'Valor unitário deve ser maior que 0'),
    ncm: z.string().optional(),
    cfop: z.string().optional(),
  })).min(1, 'Adicione pelo menos um item'),
  paymentMethod: z.string().min(1, 'Método de pagamento é obrigatório'),
  observations: z.string().optional(),
  // Campos específicos para NF-e
  naturezaOperacao: z.string().optional(),
  // Campos específicos para NFC-e
  cpfCnpjConsumidor: z.string().optional(),
  // Campos específicos para NFS-e
  servicosPrestados: z.string().optional(),
  aliquotaIss: z.number().optional(),
});

type DocumentFormData = z.infer<typeof documentFormSchema>;

interface DocumentFormProps {
  type: 'nfe' | 'nfce' | 'nfse';
  onSubmit: (data: DocumentFormData) => void;
  onCancel: () => void;
  customerId?: string;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ type, onSubmit, onCancel, customerId }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      type,
      customer: customerId || '',
      items: [{ description: '', quantity: 1, unitValue: 0 }],
      observations: '',
      paymentMethod: '',
      naturezaOperacao: type === 'nfe' ? 'Venda de Mercadoria' : undefined,
      cpfCnpjConsumidor: type === 'nfce' ? '' : undefined,
      servicosPrestados: type === 'nfse' ? '' : undefined,
      aliquotaIss: type === 'nfse' ? 5 : undefined,
    },
  });

  useEffect(() => {
    // Carregar clientes do localStorage
    const savedCustomers = localStorage.getItem('pauloCell_customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  const handleSubmit = async (data: DocumentFormData) => {
    setIsLoading(true);
    try {
      // Show initial processing message
      toast.info('Preparando documento fiscal...');

      // Get customer details for the API
      const customerObj = customers.find(c => c.id === data.customer);
      if (!customerObj) {
        throw new Error('Cliente não encontrado');
      }
      
      // Validate customer data for invoice
      if (!customerObj.document && !customerObj.cpfCnpj) {
        throw new Error('CPF/CNPJ do cliente é obrigatório para emissão de documento fiscal');
      }
      
      // Validate address if it's a NF-e
      if (data.type === 'nfe') {
        if (!customerObj.address) {
          throw new Error('Endereço do cliente é obrigatório para emissão de NF-e');
        }
        
        // Check for all required address fields
        const requiredFields = ['street', 'number', 'neighborhood', 'city', 'state', 'postalCode'];
        const missingFields = requiredFields.filter(
          field => !customerObj.address[field] || customerObj.address[field].trim() === ''
        );
        
        if (missingFields.length > 0) {
          const fieldNames = {
            street: 'Rua/Logradouro',
            number: 'Número',
            neighborhood: 'Bairro',
            city: 'Cidade',
            state: 'Estado',
            postalCode: 'CEP'
          };
          
          const missingFieldNames = missingFields.map(field => fieldNames[field] || field);
          throw new Error(`Os seguintes campos de endereço são obrigatórios para NF-e: ${missingFieldNames.join(', ')}`);
        }
      }
      
      // Validate items
      if (!data.items || data.items.length === 0) {
        throw new Error('Pelo menos um item é obrigatório');
      }
      
      for (const item of data.items) {
        if (!item.description || item.description.trim() === '') {
          throw new Error('Descrição do item é obrigatória');
        }
        if (item.quantity <= 0) {
          throw new Error('Quantidade do item deve ser maior que zero');
        }
        if (item.unitValue <= 0) {
          throw new Error('Valor unitário do item deve ser maior que zero');
        }
      }
      
      // Create document object
      const newDocument = {
        id: uuidv4(),
        type: data.type,
        number: `${type.toUpperCase()}-${Math.floor(Math.random() * 100000)}`,
        customer: customerObj.name,
        customerId: data.customer,
        date: new Date().toISOString(),
        value: data.items.reduce((acc, item) => acc + (item.quantity * item.unitValue), 0),
        status: 'Emitida',
        items: data.items,
        paymentMethod: data.paymentMethod,
        observations: data.observations,
        naturezaOperacao: data.naturezaOperacao,
        cpfCnpjConsumidor: data.cpfCnpjConsumidor,
        servicosPrestados: data.servicosPrestados,
        aliquotaIss: data.aliquotaIss,
      };

      // Import the invoice API service
      const { issueInvoice, convertDocumentToApiFormat } = await import('@/lib/invoice-api');
      
      // Convert document to API format and issue invoice
      const apiData = convertDocumentToApiFormat(newDocument, customerObj);
      
      // Show processing message
      toast.info('Processando emissão do documento fiscal...');
      
      const invoiceResponse = await issueInvoice(apiData);
      
      if (!invoiceResponse.success) {
        throw new Error(invoiceResponse.error || 'Erro ao emitir documento fiscal');
      }
      
      // Add API response data to the document
      const documentWithApiData = {
        ...newDocument,
        invoiceId: invoiceResponse.invoiceId,
        invoiceNumber: invoiceResponse.invoiceNumber,
        invoiceKey: invoiceResponse.invoiceKey,
        invoiceUrl: invoiceResponse.invoiceUrl,
      };

      // Salvar no localStorage
      const savedDocs = localStorage.getItem('pauloCell_documents') || '[]';
      const documents = JSON.parse(savedDocs);
      documents.push(documentWithApiData);
      localStorage.setItem('pauloCell_documents', JSON.stringify(documents));

      toast.success('Documento fiscal emitido com sucesso!');
      if (invoiceResponse.message) {
        toast.info(invoiceResponse.message);
      }
      onSubmit(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao emitir documento fiscal';
      toast.error(errorMessage);
      console.error('Error issuing invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = (index: number) => {
    const items = form.watch('items');
    if (items.length > 1) {
      form.setValue('items', items.filter((_, i) => i !== index));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {type === 'nfe' && (
                <FormField
                  control={form.control}
                  name="naturezaOperacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Natureza da Operação</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {type === 'nfce' && (
                <FormField
                  control={form.control}
                  name="cpfCnpjConsumidor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ do Consumidor</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {type === 'nfse' && (
                <>
                  <FormField
                    control={form.control}
                    name="servicosPrestados"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serviços Prestados</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aliquotaIss"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alíquota ISS (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="space-y-4">
                {form.watch('items').map((_, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Item {index + 1}</h3>
                        {form.watch('items').length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantidade</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`items.${index}.unitValue`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valor Unitário</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {type === 'nfe' && (
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`items.${index}.ncm`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>NCM</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`items.${index}.cfop`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CFOP</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => form.setValue('items', [
                  ...form.watch('items'),
                  { description: '', quantity: 1, unitValue: 0 }
                ])}
              >
                Adicionar Item
              </Button>

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método de pagamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                        <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                        <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Emitindo...' : 'Emitir Documento'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentForm;