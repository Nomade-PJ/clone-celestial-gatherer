
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  WrenchIcon, 
  UsersIcon, 
  SmartphoneIcon, 
  PackageIcon, 
  ArrowRightIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  Loader2Icon,
  FileTextIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/ui/StatCard';
import ServiceCard from '@/components/ui/ServiceCard';
import CustomerCard from '@/components/ui/CustomerCard';
import DocumentCard from '@/components/ui/DocumentCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State for real-time data
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Load data from localStorage
  const loadData = useCallback(() => {
    setIsRefreshing(true);
    
    try {
      // Load customers
      const savedCustomers = localStorage.getItem('pauloCell_customers');
      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers));
      }
      
      // Load services
      const savedServices = localStorage.getItem('pauloCell_services');
      if (savedServices) {
        setServices(JSON.parse(savedServices));
      }
      
      // Load devices
      const savedDevices = localStorage.getItem('pauloCell_devices');
      if (savedDevices) {
        setDevices(JSON.parse(savedDevices));
      }
      
      // Load inventory
      const savedInventory = localStorage.getItem('pauloCell_inventory');
      if (savedInventory) {
        setInventory(JSON.parse(savedInventory));
      }
      
      // Load documents
      const savedDocuments = localStorage.getItem('pauloCell_documents');
      if (savedDocuments) {
        setDocuments(JSON.parse(savedDocuments));
      }
      
      setLastUpdated(new Date());
      console.log('Dashboard loaded');
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsRefreshing(false);
    }
  }, []);
  
  // Initial load and set up polling
  useEffect(() => {
    // Initial load
    loadData();
    
    // Set up interval to check for data changes (real-time updates)
    const interval = setInterval(loadData, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [loadData]);
  
  // Manual refresh function
  const handleRefresh = () => {
    loadData();
    toast.success('Dados atualizados');
  };
  
  // Get recent services (up to 3)
  const recentServices = services.slice(0, 3);
  
  // Get recent customers (up to 2)
  const recentCustomers = customers.slice(0, 2);
  
  // Get low stock items (up to 3)
  const lowStockItems = inventory
    .filter(item => Number(item.currentStock) < 5)
    .slice(0, 3);
  
  const handleServiceClick = (id: string) => {
    navigate(`/services/${id}`);
  };
  
  const handleCustomerClick = (id: string) => {
    navigate(`/customers/${id}`);
  };
  
  // Calculate total revenue from services
  const totalRevenue = services.reduce((total, service) => total + (service.price || 0), 0);
  
  // Format the last updated time
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `há ${diffInSeconds} segundo${diffInSeconds === 1 ? '' : 's'}`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `há ${diffInMinutes} minuto${diffInMinutes === 1 ? '' : 's'}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `há ${diffInHours} hora${diffInHours === 1 ? '' : 's'}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `há ${diffInDays} dia${diffInDays === 1 ? '' : 's'}`;
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
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do seu negócio</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Atualizado {formatLastUpdated(lastUpdated)}
            </p>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2Icon size={16} className="animate-spin" />
              ) : (
                <RefreshCwIcon size={16} />
              )}
            </Button>
            <Button onClick={() => navigate('/reports')}>Ver relatórios completos</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/services')}
            className="cursor-pointer"
          >
            <StatCard 
              title="Serviços Ativos"
              value={String(services.filter(s => s.status === 'in_progress' || s.status === 'waiting').length)}
              description="serviços em andamento"
              trend={{ value: 0, positive: true }}
              icon={<WrenchIcon size={20} />}
            />
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/customers')}
            className="cursor-pointer"
          >
            <StatCard 
              title="Clientes"
              value={String(customers.length)}
              description="clientes cadastrados"
              trend={{ value: 0, positive: true }}
              icon={<UsersIcon size={20} />}
            />
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/devices')}
            className="cursor-pointer"
          >
            <StatCard 
              title="Dispositivos"
              value={String(devices.length)}
              description="dispositivos cadastrados"
              trend={{ value: 0, positive: true }}
              icon={<SmartphoneIcon size={20} />}
            />
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/reports')}
            className="cursor-pointer"
          >
            <StatCard 
              title="Faturamento"
              value={`R$ ${totalRevenue.toFixed(2)}`}
              description="em serviços"
              trend={{ value: 0, positive: true }}
              icon={<TrendingUpIcon size={20} />}
            />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Serviços Recentes</h2>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate('/services')}>
                <span>Ver todos</span>
                <ArrowRightIcon size={16} />
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentServices.length > 0 ? (
                recentServices.map((service, idx) => (
                  <div key={service.id} onClick={() => handleServiceClick(service.id)} className="cursor-pointer">
                    <ServiceCard service={service} index={idx} />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-32 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground mb-2">Nenhum serviço cadastrado</p>
                  <Button size="sm" onClick={() => navigate('/services/new')}>Cadastrar Serviço</Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Clientes Recentes</h2>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate('/customers')}>
                  <span>Ver todos</span>
                  <ArrowRightIcon size={16} />
                </Button>
              </div>
              
              <div className="space-y-3">
                {recentCustomers.length > 0 ? (
                  recentCustomers.map((customer, idx) => (
                    <div key={customer.id} onClick={() => handleCustomerClick(customer.id)} className="cursor-pointer">
                      <CustomerCard customer={customer} index={idx} />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground mb-2">Nenhum cliente cadastrado</p>
                    <Button size="sm" onClick={() => navigate('/customers/new')}>Cadastrar Cliente</Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Estoque Baixo</h2>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate('/inventory')}>
                  <span>Ver estoque</span>
                  <ArrowRightIcon size={16} />
                </Button>
              </div>
              
              <div className="bg-card rounded-xl border border-border p-4 space-y-3">
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item) => (
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
                  ))
                ) : (
                  <div className="flex items-center justify-center h-20">
                    <p className="text-muted-foreground">Nenhum item com estoque baixo</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Documentos Recentes</h2>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate('/documents')}>
                  <span>Ver todos</span>
                  <ArrowRightIcon size={16} />                  
                </Button>
              </div>
              
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Documentos Fiscais</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">NF-e: {documents.filter(d => d.type === 'nfe').length}</span>
                    <span className="text-xs text-muted-foreground">NFC-e: {documents.filter(d => d.type === 'nfce').length}</span>
                    <span className="text-xs text-muted-foreground">NFS-e: {documents.filter(d => d.type === 'nfse').length}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  <span className="font-medium">{documents.length}</span> Total
                </div>
                <div className="text-xs text-muted-foreground mb-1">Valor Total</div>
                <div className="text-lg font-semibold mb-3">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(documents.reduce((sum, doc) => sum + doc.value, 0))}
                </div>
                
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="text-xs text-muted-foreground mb-1">Documentos Recentes</div>
                  {documents && documents.length > 0 ? (
                    documents.slice(0, 1).map((document) => (
                      <div key={document.id} onClick={() => navigate(`/documents/${document.id}`)} 
                           className="flex justify-between items-center cursor-pointer hover:bg-muted/50 p-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <FileTextIcon size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {document.type.toUpperCase()} - {document.number}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(document.date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(document.value)}
                          </div>
                          <div className={`text-xs px-2 py-0.5 rounded-full ${document.status === 'Emitida' ? 'bg-green-100 text-green-700' : document.status === 'Cancelada' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {document.status}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <p className="text-muted-foreground mb-2 text-sm">Nenhum documento cadastrado</p>
                      <Button size="sm" onClick={() => navigate('/documents/new', { state: { documentType: 'nfe' } })}>Cadastrar Documento</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;
