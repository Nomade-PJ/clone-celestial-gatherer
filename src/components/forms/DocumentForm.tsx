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

const documentFormSchema = z.object({
  type: z.string(),
  customer: z.string().min(1, 'Cliente é obrigatório'),
  items: z.array(z.object({
    description: z.string().min(1, 'Descrição é obrigatória'),
    quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
    unitValue: z.number().min(0.01, 'Valor unitário deve ser maior que 0'),
  })).min(1, 'Adicione pelo menos um item'),
  paymentMethod: z.string().min(1, 'Método de pagamento é obrigatório'),
  observations: z.string().optional(),
});

type DocumentFormData = z.infer<typeof documentFormSchema>;

interface DocumentFormProps {
  type: 'nfe' | 'nfce' | 'nfse';
  onSubmit: (data: DocumentFormData) => void;
  onCancel: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ type, onSubmit, onCancel }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      type,
      items: [{ description: '', quantity: 1, unitValue: 0 }],
      observations: '',
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
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDocument = {
        id: uuidv4(),
        type: data.type,
        number: `${type.toUpperCase()}-${Math.floor(Math.random() * 100000)}`,
        customer: data.customer,
        date: new Date().toISOString(),
        value: data.items.reduce((acc, item) => acc + (item.quantity * item.unitValue), 0),
        status: 'Emitida',
        items: data.items,
        paymentMethod: data.paymentMethod,
        observations: data.observations,
      };

      // Salvar no localStorage
      const savedDocs = localStorage.getItem('pauloCell_documents') || '[]';
      const documents = JSON.parse(savedDocs);
      documents.push(newDocument);
      localStorage.setItem('pauloCell_documents', JSON.stringify(documents));

      toast.success('Documento fiscal emitido com sucesso!');
      onSubmit(data);
    } catch (error) {
      toast.error('Erro ao emitir documento fiscal');
      console.error(error);
    } finally {
      setIsLoading(false);
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

              {form.watch('items').map((_, index) => (
                <div key={index} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição do Item {index + 1}</FormLabel>
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
                </div>
              ))}

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
                        <SelectItem value="cartao">Cartão</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
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