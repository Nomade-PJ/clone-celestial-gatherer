
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CustomerForm from '@/components/forms/CustomerForm';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load customer data from localStorage based on ID
    const loadCustomerData = () => {
      try {
        const savedCustomers = localStorage.getItem('pauloCell_customers');
        if (savedCustomers) {
          const customers = JSON.parse(savedCustomers);
          const foundCustomer = customers.find((c: any) => c.id === id);
          
          if (foundCustomer) {
            setCustomerData(foundCustomer);
          } else {
            toast.error('Cliente não encontrado');
            navigate('/customers');
          }
        } else {
          toast.error('Nenhum cliente cadastrado');
          navigate('/customers');
        }
      } catch (error) {
        console.error('Error loading customer data:', error);
        toast.error('Erro ao carregar dados do cliente');
      } finally {
        setLoading(false);
      }
    };
    
    loadCustomerData();
  }, [id, navigate]);

  const handleSubmit = (updatedCustomerData: any) => {
    console.log('Updated customer data:', updatedCustomerData);
    navigate(`/customers/${id}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!customerData) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-4">Cliente não encontrado</h2>
          <Button onClick={() => navigate('/customers')}>Voltar para Clientes</Button>
        </div>
      </MainLayout>
    );
  }

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
