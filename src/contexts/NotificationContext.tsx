
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  notificationsEnabled: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  toggleNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  
  // Load notifications and settings from localStorage on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('pauloCell_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    
    const savedSettings = localStorage.getItem('pauloCell_notification_settings');
    if (savedSettings) {
      setNotificationsEnabled(JSON.parse(savedSettings).enabled);
    }
  }, []);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pauloCell_notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Save notification settings whenever they change
  useEffect(() => {
    localStorage.setItem('pauloCell_notification_settings', JSON.stringify({ enabled: notificationsEnabled }));
  }, [notificationsEnabled]);
  
  // Auto-generate notifications for low inventory, overdue services, and pending documents
  useEffect(() => {
    if (!notificationsEnabled) return;
    
    const checkForNotifications = () => {
      // Check for low inventory items
      const savedInventory = localStorage.getItem('pauloCell_inventory');
      if (savedInventory) {
        const inventory = JSON.parse(savedInventory);
        const lowStockItems = inventory.filter((item: any) => 
          item.currentStock < item.minimumStock
        );
        
        // Only notify about low stock items that don't already have notifications
        lowStockItems.forEach((item: any) => {
          const existingNotification = notifications.find(
            (n) => n.title.includes('Estoque Baixo') && n.message.includes(item.name)
          );
          
          if (!existingNotification) {
            addNotification({
              title: 'Estoque Baixo',
              message: `${item.name} está com estoque abaixo do mínimo (${item.currentStock}/${item.minimumStock})`,
              type: 'warning',
              link: '/inventory',
            });
          }
        });
      }
      
      // Check for overdue services
      const savedServices = localStorage.getItem('pauloCell_services');
      if (savedServices) {
        const services = JSON.parse(savedServices);
        const currentDate = new Date();
        
        const overdueServices = services.filter((service: any) => {
          if (!service.expectedCompletionDate || service.status === 'completed' || service.status === 'cancelled') {
            return false;
          }
          
          const completionDate = new Date(service.expectedCompletionDate);
          return completionDate < currentDate;
        });
        
        // Only notify about overdue services that don't already have notifications
        overdueServices.forEach((service: any) => {
          const existingNotification = notifications.find(
            (n) => n.title.includes('Serviço Atrasado') && n.message.includes(service.id)
          );
          
          if (!existingNotification) {
            addNotification({
              title: 'Serviço Atrasado',
              message: `O serviço para ${service.customer || 'Cliente'} está atrasado`,
              type: 'error',
              link: `/services/${service.id}`,
            });
          }
        });
      }
      
      // Check for pending documents
      const savedDocuments = localStorage.getItem('pauloCell_documents');
      if (savedDocuments) {
        const documents = JSON.parse(savedDocuments);
        
        // Check for pending documents
        const pendingDocuments = documents.filter((doc: any) => doc.status === 'Pendente');
        pendingDocuments.forEach((document: any) => {
          const existingNotification = notifications.find(
            (n) => n.title.includes('Documento Pendente') && n.message.includes(document.number)
          );
          
          if (!existingNotification) {
            addNotification({
              title: 'Documento Pendente',
              message: `O documento ${document.type.toUpperCase()} ${document.number} está pendente`,
              type: 'info',
              link: `/documents/${document.id}`,
            });
          }
        });
        
        // Check for documents with invoice information from API
        const documentsWithInvoice = documents.filter((doc: any) => doc.invoiceId && doc.status === 'Emitida');
        documentsWithInvoice.forEach((document: any) => {
          const existingNotification = notifications.find(
            (n) => n.title.includes('Documento Fiscal Emitido') && n.message.includes(document.number)
          );
          
          if (!existingNotification) {
            addNotification({
              title: 'Documento Fiscal Emitido',
              message: `O documento ${document.type.toUpperCase()} ${document.number} foi emitido com sucesso`,
              type: 'success',
              link: `/documents/${document.id}`,
            });
          }
        });
        
        // Check for canceled documents
        const canceledDocuments = documents.filter((doc: any) => 
          doc.status === 'Cancelada' && doc.invoiceId && 
          // Only notify about recently canceled documents (last 24 hours)
          new Date(doc.updatedAt || doc.date).getTime() > Date.now() - 24 * 60 * 60 * 1000
        );
        
        canceledDocuments.forEach((document: any) => {
          const existingNotification = notifications.find(
            (n) => n.title.includes('Documento Fiscal Cancelado') && n.message.includes(document.number)
          );
          
          if (!existingNotification) {
            addNotification({
              title: 'Documento Fiscal Cancelado',
              message: `O documento ${document.type.toUpperCase()} ${document.number} foi cancelado`,
              type: 'warning',
              link: `/documents/${document.id}`,
            });
          }
        });
      }
    };
    
    // Check when component mounts and then every 5 minutes
    checkForNotifications();
    const interval = setInterval(checkForNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [notificationsEnabled]);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (!notificationsEnabled) return;
    
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        notificationsEnabled,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        toggleNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
