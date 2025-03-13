
import React, { useState, useEffect } from 'react';
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
  PackageIcon,
  XIcon,
  CalendarIcon,
  TagIcon,
  UserIcon
} from 'lucide-react';
// Re-import MainLayout with a different approach
import MainLayout from '../components/layout/MainLayout';
import ServiceCard from '@/components/ui/ServiceCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { exportToPDF, exportToExcel, exportToCSV } from "@/lib/export-utils";

// Empty initial data - ready for new entries
const initialServices: any[] = [];

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState(initialServices);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  
  console.log("Loading services page");
  
  // Load services from localStorage on component mount
  useEffect(() => {
    const savedServices = localStorage.getItem('pauloCell_services');
    console.log("Saved services from localStorage:", savedServices);
    if (savedServices) {
      const parsedServices = JSON.parse(savedServices);
      console.log("Parsed services:", parsedServices);
      setServices(parsedServices);
    }
  }, []);

  // Save services to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pauloCell_services', JSON.stringify(services));
  }, [services]);
  
  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
    setStatusFilter('all');
    setSearchTerm('');
  };
  
  const applyFilters = (serviceList: any[]) => {
    // First apply search term
    let filtered = serviceList.filter(service => 
      service.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.device?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => service.status === statusFilter);
    }
    
    // Then apply any additional filters
    if (activeFilters.includes('high-priority')) {
      filtered = filtered.filter(service => service.priority === 'high');
    }
    
    if (activeFilters.includes('this-week')) {
      // In a real app, this would use actual date logic
      filtered = filtered.filter(service => service.dueDate && service.dueDate.includes('2023'));
    }
    
    return filtered;
  };
  
  const filteredServices = applyFilters(services);
  
  const handleServiceClick = (id: string) => {
    navigate(`/services/${id}`);
  };
  
  // Removed exportServices function
  
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
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
          <div className="flex-1"></div> {/* Empty div to maintain layout structure */}
          
          <div className="flex gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FilterIcon size={16} />
                  <span>Filtrar</span>
                  <ChevronDownIcon size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleFilterToggle('high-priority')}>
                    <TagIcon className="mr-2 h-4 w-4" />
                    <span>Alta Prioridade</span>
                    {activeFilters.includes('high-priority') && <Badge className="ml-auto">Ativo</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterToggle('this-week')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Esta Semana</span>
                    {activeFilters.includes('this-week') && <Badge className="ml-auto">Ativo</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clearFilters}>
                    <XIcon className="mr-2 h-4 w-4" />
                    <span>Limpar Filtros</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Removed Export dropdown menu */}
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => handleStatusFilterChange('all')}
          >
            <span>Todos os serviços</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {services.length}
            </span>
          </Button>
          <Button 
            variant={statusFilter === 'waiting' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => handleStatusFilterChange('waiting')}
          >
            <ClockIcon size={16} className="text-blue-600" />
            <span>Em espera</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {services.filter(s => s.status === 'waiting').length}
            </span>
          </Button>
          <Button 
            variant={statusFilter === 'in_progress' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => handleStatusFilterChange('in_progress')}
          >
            <ActivityIcon size={16} className="text-amber-500" />
            <span>Em andamento</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {services.filter(s => s.status === 'in_progress').length}
            </span>
          </Button>
          <Button 
            variant={statusFilter === 'completed' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => handleStatusFilterChange('completed')}
          >
            <CheckCircleIcon size={16} className="text-green-600" />
            <span>Concluídos</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {services.filter(s => s.status === 'completed').length}
            </span>
          </Button>
          <Button 
            variant={statusFilter === 'delivered' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => handleStatusFilterChange('delivered')}
          >
            <PackageIcon size={16} className="text-purple-600" />
            <span>Entregues</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {services.filter(s => s.status === 'delivered').length}
            </span>
          </Button>
        </div>
        
        {(activeFilters.length > 0 || statusFilter !== 'all') && (
          <div className="flex flex-wrap gap-2">
            {statusFilter !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                Status: {
                  statusFilter === 'waiting' ? 'Em espera' : 
                  statusFilter === 'in_progress' ? 'Em andamento' : 
                  statusFilter === 'completed' ? 'Concluídos' : 
                  'Entregues'
                }
                <XIcon size={14} className="cursor-pointer" onClick={() => setStatusFilter('all')} />
              </Badge>
            )}
            {activeFilters.map(filter => (
              <Badge key={filter} variant="outline" className="flex items-center gap-1 px-3 py-1">
                {filter === 'high-priority' ? 'Alta Prioridade' : 'Esta Semana'}
                <XIcon size={14} className="cursor-pointer" onClick={() => handleFilterToggle(filter)} />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
              Limpar filtros
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, idx) => (
              <div key={service.id} onClick={() => handleServiceClick(service.id)} className="cursor-pointer">
                <ServiceCard key={service.id} service={service} index={idx} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-60 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-4">Nenhum serviço cadastrado</p>
              <Button onClick={() => navigate('/services/new')}>Cadastrar Novo Serviço</Button>
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Services;
