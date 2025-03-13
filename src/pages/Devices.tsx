
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  SearchIcon, 
  PlusIcon, 
  FilterIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XCircleIcon,
  XIcon,
  SmartphoneIcon,
  TagIcon,
  UserIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import DeviceCard from '@/components/ui/DeviceCard';
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
const initialDevices: any[] = [];

const Devices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [devices, setDevices] = useState(initialDevices);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  
  // Load devices from localStorage on component mount
  useEffect(() => {
    const savedDevices = localStorage.getItem('pauloCell_devices');
    if (savedDevices) {
      setDevices(JSON.parse(savedDevices));
    }
  }, []);

  // Save devices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pauloCell_devices', JSON.stringify(devices));
  }, [devices]);
  
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
  
  const applyFilters = (deviceList: any[]) => {
    // First apply search term
    let filtered = deviceList.filter(device => 
      device.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.owner?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(device => device.status === statusFilter);
    }
    
    // Then apply any additional filters
    if (activeFilters.includes('cellphones')) {
      filtered = filtered.filter(device => device.type === 'cellphone');
    }
    
    if (activeFilters.includes('tablets')) {
      filtered = filtered.filter(device => device.type === 'tablet');
    }
    
    if (activeFilters.includes('notebooks')) {
      filtered = filtered.filter(device => device.type === 'notebook');
    }
    
    return filtered;
  };
  
  const filteredDevices = applyFilters(devices);
  
  const handleDeviceClick = (id: string) => {
    navigate(`/devices/${id}`);
  };
  

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
            <h1 className="text-2xl font-bold">Dispositivos</h1>
            <p className="text-muted-foreground">Gerencie os dispositivos dos seus clientes</p>
          </div>
          <Button className="gap-2" onClick={() => navigate('/devices/new')}>
            <PlusIcon size={16} />
            <span>Novo Dispositivo</span>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1">{/* Empty div to maintain layout structure */}</div>
          
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
                  <DropdownMenuItem onClick={() => handleFilterToggle('cellphones')}>
                    <SmartphoneIcon className="mr-2 h-4 w-4" />
                    <span>Celulares</span>
                    {activeFilters.includes('cellphones') && <Badge className="ml-auto">Ativo</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterToggle('tablets')}>
                    <SmartphoneIcon className="mr-2 h-4 w-4" />
                    <span>Tablets</span>
                    {activeFilters.includes('tablets') && <Badge className="ml-auto">Ativo</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterToggle('notebooks')}>
                    <SmartphoneIcon className="mr-2 h-4 w-4" />
                    <span>Notebooks</span>
                    {activeFilters.includes('notebooks') && <Badge className="ml-auto">Ativo</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clearFilters}>
                    <XIcon className="mr-2 h-4 w-4" />
                    <span>Limpar Filtros</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            

          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => handleStatusFilterChange('all')}
          >
            <span>Todos os dispositivos</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {devices.length}
            </span>
          </Button>
          <Button 
            variant={statusFilter === 'good' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => handleStatusFilterChange('good')}
          >
            <CheckCircleIcon size={16} className="text-green-600" />
            <span>Bom estado</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {devices.filter(d => d.status === 'good').length}
            </span>
          </Button>
          <Button 
            variant={statusFilter === 'issue' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => handleStatusFilterChange('issue')}
          >
            <AlertCircleIcon size={16} className="text-amber-500" />
            <span>Problemas leves</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {devices.filter(d => d.status === 'issue').length}
            </span>
          </Button>
          <Button 
            variant={statusFilter === 'critical' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => handleStatusFilterChange('critical')}
          >
            <XCircleIcon size={16} className="text-red-600" />
            <span>Problemas críticos</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {devices.filter(d => d.status === 'critical').length}
            </span>
          </Button>
        </div>
        
        {(activeFilters.length > 0 || statusFilter !== 'all') && (
          <div className="flex flex-wrap gap-2">
            {statusFilter !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                Status: {
                  statusFilter === 'good' ? 'Bom estado' : 
                  statusFilter === 'issue' ? 'Problemas leves' : 
                  'Problemas críticos'
                }
                <XIcon size={14} className="cursor-pointer" onClick={() => setStatusFilter('all')} />
              </Badge>
            )}
            {activeFilters.map(filter => (
              <Badge key={filter} variant="outline" className="flex items-center gap-1 px-3 py-1">
                {filter === 'cellphones' ? 'Celulares' : 
                 filter === 'tablets' ? 'Tablets' : 'Notebooks'}
                <XIcon size={14} className="cursor-pointer" onClick={() => handleFilterToggle(filter)} />
              </Badge>
            ))}
            {(activeFilters.length > 0 || statusFilter !== 'all') && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
                Limpar filtros
              </Button>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.length > 0 ? (
            filteredDevices.map((device, idx) => (
              <div key={device.id} onClick={() => handleDeviceClick(device.id)} className="cursor-pointer">
                <DeviceCard device={device} index={idx} />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-60 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-4">Nenhum dispositivo cadastrado</p>
              <Button onClick={() => navigate('/devices/new')}>Cadastrar Novo Dispositivo</Button>
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Devices;
