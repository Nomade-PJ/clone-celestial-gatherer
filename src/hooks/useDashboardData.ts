
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export const useDashboardData = () => {
  // State for real-time data
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
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
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      if (isInitialLoad) {
        // Só mostra erro no primeiro carregamento
        toast.error('Erro ao carregar dados');
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [isInitialLoad]);
  
  // Initial load and set up polling
  useEffect(() => {
    // Initial load
    loadData();
    
    // Set up interval to check for data changes, mas menos frequente (a cada 30 segundos em vez de 5)
    const interval = setInterval(loadData, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [loadData]);
  
  // Manual refresh function
  const handleRefresh = () => {
    loadData();
    toast.success('Dados atualizados');
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
  
  return {
    customers,
    services,
    devices,
    inventory,
    documents,
    isRefreshing,
    lastUpdated,
    handleRefresh,
    totalRevenue,
    formatLastUpdated,
    isInitialLoad
  };
};
