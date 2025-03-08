
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  WrenchIcon, 
  UsersIcon, 
  SmartphoneIcon, 
  PackageIcon, 
  ArrowRightIcon,
  TrendingUpIcon,
  AlertCircleIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/ui/StatCard';
import ServiceCard from '@/components/ui/ServiceCard';
import CustomerCard from '@/components/ui/CustomerCard';
import { Button } from '@/components/ui/button';

// Mock data
const recentServices = [
  {
    id: '1',
    type: 'Troca de Tela',
    status: 'in_progress',
    customer: 'João Silva',
    device: 'iPhone 13 Pro',
    createDate: '22/10/2023',
    estimatedCompletion: '24/10/2023',
    price: 450,
    technician: 'Carlos Oliveira'
  },
  {
    id: '2',
    type: 'Substituição de Bateria',
    status: 'waiting',
    customer: 'Maria Santos',
    device: 'Samsung Galaxy S22',
    createDate: '21/10/2023',
    estimatedCompletion: '23/10/2023',
    price: 180,
    technician: undefined
  },
  {
    id: '3',
    type: 'Reparo de Placa',
    status: 'completed',
    customer: 'Pedro Almeida',
    device: 'iPhone 12',
    createDate: '20/10/2023',
    estimatedCompletion: '22/10/2023',
    price: 320,
    technician: 'Ana Ferreira'
  }
] as const;

const recentCustomers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    lastVisit: '22/10/2023',
    totalServices: 3
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 91234-5678',
    lastVisit: '21/10/2023',
    totalServices: 1
  }
] as const;

const lowStockItems = [
  {
    id: '1',
    name: 'Tela iPhone 13 Pro',
    currentStock: 2,
    minimumStock: 5
  },
  {
    id: '2',
    name: 'Bateria Samsung Galaxy S22',
    currentStock: 1,
    minimumStock: 3
  },
  {
    id: '3',
    name: 'Conector de Carga iPhone 12',
    currentStock: 3,
    minimumStock: 5
  }
] as const;

const Dashboard: React.FC = () => {
  // Simulate data loading
  useEffect(() => {
    console.log('Dashboard loaded');
  }, []);
  
  return (
    <MainLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do seu negócio</p>
          </div>
          <Button>Ver relatórios completos</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Serviços Ativos"
            value="24"
            description="vs. mês anterior"
            trend={{ value: 12, positive: true }}
            icon={<WrenchIcon size={20} />}
          />
          <StatCard 
            title="Clientes"
            value="152"
            description="5 novos este mês"
            trend={{ value: 8, positive: true }}
            icon={<UsersIcon size={20} />}
          />
          <StatCard 
            title="Dispositivos"
            value="201"
            description="vs. mês anterior"
            trend={{ value: 4, positive: true }}
            icon={<SmartphoneIcon size={20} />}
          />
          <StatCard 
            title="Faturamento"
            value="R$ 12.450"
            description="vs. mês anterior"
            trend={{ value: 2, positive: false }}
            icon={<TrendingUpIcon size={20} />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Serviços Recentes</h2>
              <Button variant="outline" size="sm" className="gap-1">
                <span>Ver todos</span>
                <ArrowRightIcon size={16} />
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentServices.map((service, idx) => (
                <ServiceCard key={service.id} service={service} index={idx} />
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Clientes Recentes</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  <span>Ver todos</span>
                  <ArrowRightIcon size={16} />
                </Button>
              </div>
              
              <div className="space-y-3">
                {recentCustomers.map((customer, idx) => (
                  <CustomerCard key={customer.id} customer={customer} index={idx} />
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Estoque Baixo</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  <span>Ver estoque</span>
                  <ArrowRightIcon size={16} />
                </Button>
              </div>
              
              <div className="bg-card rounded-xl border border-border p-4 space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-red-100">
                        <AlertCircleIcon size={16} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Mínimo: {item.minimumStock}</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-red-600">
                      {item.currentStock}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;
