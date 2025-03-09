
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  SearchIcon, 
  PlusIcon, 
  FilterIcon,
  ChevronDownIcon,
  DownloadIcon,
  XIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  MailIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import CustomerCard from '@/components/ui/CustomerCard';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Empty initial data - ready for new entries
const initialCustomers: any[] = [];

const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState(initialCustomers);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  
  // Load customers from localStorage on component mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem('pauloCell_customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  // Save customers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pauloCell_customers', JSON.stringify(customers));
  }, [customers]);
  
  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };
  
  const applyFilters = (customerList: any[]) => {
    // First apply search term
    let filtered = customerList.filter(customer => 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
    );
    
    // Then apply active filters
    if (activeFilters.includes('companies')) {
      filtered = filtered.filter(customer => customer.isCompany);
    }
    
    if (activeFilters.includes('individuals')) {
      filtered = filtered.filter(customer => !customer.isCompany);
    }
    
    return filtered;
  };
  
  const filteredCustomers = applyFilters(customers);
  
  const handleCustomerClick = (id: string) => {
    navigate(`/customers/${id}`);
  };
  
  const exportCustomers = (format: string) => {
    // In a real app, this would generate the actual file
    // For now, just show a toast
    toast.success(`Clientes exportados em formato ${format.toUpperCase()}`);
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
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">Gerencie os clientes da sua loja</p>
          </div>
          <Button className="gap-2" onClick={() => navigate('/customers/new')}>
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
                  <DropdownMenuItem onClick={() => handleFilterToggle('companies')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Empresas</span>
                    {activeFilters.includes('companies') && <Badge className="ml-auto">Ativo</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterToggle('individuals')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Pessoas Físicas</span>
                    {activeFilters.includes('individuals') && <Badge className="ml-auto">Ativo</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clearFilters}>
                    <XIcon className="mr-2 h-4 w-4" />
                    <span>Limpar Filtros</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <DownloadIcon size={16} />
                  <span className="hidden sm:inline">Exportar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => exportCustomers('pdf')}>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    <span>Exportar como PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportCustomers('excel')}>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    <span>Exportar como Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportCustomers('csv')}>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    <span>Exportar como CSV</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(filter => (
              <Badge key={filter} variant="outline" className="flex items-center gap-1 px-3 py-1">
                {filter === 'companies' ? 'Empresas' : 'Pessoas Físicas'}
                <XIcon size={14} className="cursor-pointer" onClick={() => handleFilterToggle(filter)} />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
              Limpar filtros
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, idx) => (
              <div key={customer.id} onClick={() => handleCustomerClick(customer.id)} className="cursor-pointer">
                <CustomerCard customer={customer} index={idx} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-60 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-4">Nenhum cliente cadastrado</p>
              <Button onClick={() => navigate('/customers/new')}>Cadastrar Novo Cliente</Button>
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Customers;
