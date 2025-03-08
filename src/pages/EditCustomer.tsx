
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CustomerForm from '@/components/forms/CustomerForm';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// This is mock data for editing, in a real app you'd fetch this from your backend
const mockCustomerData = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '(11) 98765-4321',
  address: 'Rua das Flores, 123',
  city: 'São Paulo',
  state: 'SP',
  postalCode: '01234-567',
  cpfCnpj: '123.456.789-00',
  notes: 'Cliente preferencial, sempre traz dispositivos para conserto.',
  isCompany: false
};

const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real app, you would fetch the customer data based on the ID
  // For now, we'll use our mock data
  const customerData = mockCustomerData;

  const handleSubmit = (updatedCustomerData: any) => {
    console.log('Updated customer data:', updatedCustomerData);
    // In a real app, you would send this data to your backend
  };

  return (
    <MainLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/customers/${id}`)}
            className="h-8 w-8"
          >
            <ArrowLeftIcon size={16} />
          </Button>
          <h1 className="text-2xl font-bold">Editar Cliente</h1>
        </div>
        
        <CustomerForm 
          onSubmit={handleSubmit} 
          initialData={customerData}
          isEdit={true}
        />
      </motion.div>
    </MainLayout>
  );
};

export default EditCustomer;
