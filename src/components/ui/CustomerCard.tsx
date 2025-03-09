
import React from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, MailIcon, MoreVerticalIcon } from 'lucide-react';

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    createdAt?: string;
    avatar?: string;
  };
  index: number;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, index }) => {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <motion.div 
      className="bg-card rounded-xl border border-border p-4 card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            {customer.avatar ? (
              <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              customer.name?.slice(0, 2).toUpperCase() || 'CL'
            )}
          </div>
          
          <div>
            <h3 className="font-medium">{customer.name || 'Cliente'}</h3>
            <div className="flex flex-col gap-1 mt-1">
              {customer.phone && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <PhoneIcon size={14} className="mr-1.5" />
                  {customer.phone}
                </div>
              )}
              {customer.email && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MailIcon size={14} className="mr-1.5" />
                  {customer.email}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button className="p-1 rounded-full hover:bg-muted transition-colors">
          <MoreVerticalIcon size={18} />
        </button>
      </div>
      
      <div className="flex gap-3 mt-3 text-xs">
        <div className="px-2.5 py-1 rounded-full bg-muted">
          Cadastro: <span className="font-medium">{formatDate(customer.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCard;
