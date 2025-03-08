
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  SearchIcon, 
  PlusIcon, 
  FilterIcon,
  ChevronDownIcon,
  ClockIcon,
  ActivityIcon,
  CheckCircleIcon,
  PackageIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ServiceCard from '@/components/ui/ServiceCard';
import { Button } from '@/components/ui/button';

// Mock data
const services = [
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
  },
  {
    id: '4',
    type: 'Troca de Conector de Carga',
    status: 'waiting',
    customer: 'Ana Ferreira',
    device: 'Xiaomi Redmi Note 11',
    createDate: '19/10/2023',
    estimatedCompletion: '21/10/2023',
    price: 150,
    technician: undefined
  },
  {
    id: '5',
    type: 'Atualização de Software',
    status: 'delivered',
    customer: 'Carlos Oliveira',
    device: 'iPhone 14',
    createDate: '18/10/2023',
    estimatedCompletion: '18/10/2023',
    price: 80,
    technician: 'Pedro Almeida'
  },
  {
    id: '6',
    type: 'Limpeza Interna',
    status: 'completed',
    customer: 'Mariana Costa',
    device: 'Motorola Moto G32',
    createDate: '17/10/2023',
    estimatedCompletion: '18/10/2023',
    price: 120,
    technician: 'João Silva'
  }
] as const;

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredServices = services.filter(service => 
    service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.device.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleServiceClick = (id: string) => {
    navigate(`/services/${id}`);
  };
  
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
            <h1 className="text-2xl font-bold">Serviços</h1>
            <p className="text-muted-foreground">Gerencie os serviços da sua assistência</p>
          </div>
          <Button className="gap-2" onClick={() => navigate('/services/new')}>
            <PlusIcon size={16} />
            <span>Novo Serviço</span>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar serviços..." 
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
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <span>Todos os serviços</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {services.length}
            </span>
          </Button>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <ClockIcon size={16} className="text-blue-600" />
            <span>Em espera</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {services.filter(s => s.status === 'waiting').length}
            </span>
          </Button>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <ActivityIcon size={16} className="text-amber-500" />
            <span>Em andamento</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {services.filter(s => s.status === 'in_progress').length}
            </span>
          </Button>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <CheckCircleIcon size={16} className="text-green-600" />
            <span>Concluídos</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {services.filter(s => s.status === 'completed').length}
            </span>
          </Button>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <PackageIcon size={16} className="text-purple-600" />
            <span>Entregues</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {services.filter(s => s.status === 'delivered').length}
            </span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, idx) => (
              <div key={service.id} onClick={() => handleServiceClick(service.id)} className="cursor-pointer">
                <ServiceCard key={service.id} service={service} index={idx} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center h-60 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">Nenhum serviço encontrado</p>
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Services;
