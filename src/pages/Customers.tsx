
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SearchIcon, 
  PlusIcon, 
  FilterIcon,
  ChevronDownIcon,
  DownloadIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import CustomerCard from '@/components/ui/CustomerCard';
import { Button } from '@/components/ui/button';

// Mock data
const customers = [
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
  },
  {
    id: '3',
    name: 'Pedro Almeida',
    email: 'pedro.almeida@email.com',
    phone: '(11) 99876-5432',
    lastVisit: '18/10/2023',
    totalServices: 5
  },
  {
    id: '4',
    name: 'Ana Ferreira',
    email: 'ana.ferreira@email.com',
    phone: '(11) 97654-3210',
    lastVisit: '15/10/2023',
    totalServices: 2
  },
  {
    id: '5',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '(11) 98877-6655',
    lastVisit: '10/10/2023',
    totalServices: 4
  },
  {
    id: '6',
    name: 'Mariana Costa',
    email: 'mariana.costa@email.com',
    phone: '(11) 96655-4433',
    lastVisit: '05/10/2023',
    totalServices: 2
  }
] as const;

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
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
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">Gerencie os clientes da sua loja</p>
          </div>
          <Button className="gap-2">
            <PlusIcon size={16} />
            <span>Novo Cliente</span>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar clientes..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2">
              <FilterIcon size={16} />
              <span>Filtrar</span>
              <ChevronDownIcon size={16} />
            </Button>
            
            <Button variant="outline" className="gap-2">
              <DownloadIcon size={16} />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, idx) => (
              <CustomerCard key={customer.id} customer={customer} index={idx} />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center h-60 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Nenhum cliente encontrado</p>
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Customers;
