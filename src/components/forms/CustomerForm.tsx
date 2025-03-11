
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { v4 as uuidv4 } from 'uuid';

interface CustomerFormProps {
  onSubmit?: (customerData: any) => void;
  initialData?: any;
  isEdit?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  isEdit = false 
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: initialData.id || uuidv4(),
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    postalCode: initialData.postalCode || '',
    cpfCnpj: initialData.cpfCnpj || '',
    notes: initialData.notes || '',
    isCompany: initialData.isCompany || false,
    createdAt: initialData.createdAt || new Date().toISOString(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // If the field is postalCode and has 8 digits (without mask) or 9 characters (with mask)
    if (name === 'postalCode' && (value.replace(/\D/g, '').length === 8)) {
      fetchAddressByCep(value);
    }
  };

  const fetchAddressByCep = async (cep: string) => {
    // Remove any non-digit character
    const cepDigits = cep.replace(/\D/g, '');
    
    if (cepDigits.length !== 8) return;
    
    setIsLoadingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || prev.address,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
        toast.success('Endereço preenchido automaticamente');
      } else {
        toast.error('CEP não encontrado');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      toast.error('Erro ao buscar endereço pelo CEP');
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, isCompany: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Retrieve existing customers from localStorage
      const savedCustomers = localStorage.getItem('pauloCell_customers');
      let customers = savedCustomers ? JSON.parse(savedCustomers) : [];
      
      if (isEdit) {
        // Update existing customer
        customers = customers.map((customer: any) => 
          customer.id === formData.id ? formData : customer
        );
      } else {
        // Add new customer
        customers.push(formData);
      }
      
      // Save updated customers list to localStorage
      localStorage.setItem('pauloCell_customers', JSON.stringify(customers));
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      toast.success(
        isEdit ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!'
      );
      
      // Navigate back to customers list
      navigate('/customers');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Ocorreu um erro ao salvar o cliente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            <p className="text-sm text-muted-foreground">
              Forneça as informações principais do cliente.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome do cliente"
                required
              />
            </div>
            
            <div className="flex items-center gap-2 mt-8">
              <Checkbox 
                id="isCompany" 
                checked={formData.isCompany}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isCompany" className="text-sm font-normal">
                Cliente é uma empresa (pessoa jurídica)
              </Label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
            <Input
              id="cpfCnpj"
              name="cpfCnpj"
              value={formData.cpfCnpj}
              onChange={handleChange}
              placeholder={formData.isCompany ? "00.000.000/0000-00" : "000.000.000-00"}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Endereço</h3>
            <p className="text-sm text-muted-foreground">
              Informações de endereço do cliente.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">CEP</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="00000-000"
                className={isLoadingCep ? "opacity-70" : ""}
                disabled={isLoadingCep}
              />
              {isLoadingCep && (
                <p className="text-xs text-muted-foreground mt-1">Buscando endereço...</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Cidade"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Estado"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Rua, número, complemento"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Observações</h3>
            <p className="text-sm text-muted-foreground">
              Informações adicionais sobre o cliente.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Observações sobre o cliente"
              className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/customers')}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || isLoadingCep}>
            {isSubmitting ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CustomerForm;
