
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  SearchIcon, 
  PlusIcon, 
  FilterIcon,
  ChevronDownIcon,
  DownloadIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XCircleIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import DeviceCard from '@/components/ui/DeviceCard';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

// Empty initial data - ready for new entries
const initialDevices: any[] = [];

const Devices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [devices, setDevices] = useState(initialDevices);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  const filteredDevices = devices.filter(device => 
    device.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.owner?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeviceClick = (id: string) => {
    navigate(`/devices/${id}`);
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
          <div className="relative w-full sm:w-80">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar dispositivos..." 
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
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <span>Todos os dispositivos</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {devices.length}
            </span>
          </Button>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <CheckCircleIcon size={16} className="text-green-600" />
            <span>Bom estado</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {devices.filter(d => d.status === 'good').length}
            </span>
          </Button>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <AlertCircleIcon size={16} className="text-amber-500" />
            <span>Problemas leves</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {devices.filter(d => d.status === 'issue').length}
            </span>
          </Button>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <XCircleIcon size={16} className="text-red-600" />
            <span>Problemas críticos</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {devices.filter(d => d.status === 'critical').length}
            </span>
          </Button>
        </div>
        
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
