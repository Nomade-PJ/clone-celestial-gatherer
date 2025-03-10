import React from 'react';
import { motion } from 'framer-motion';
import { MoreVerticalIcon, FileTextIcon } from 'lucide-react';

interface DocumentCardProps {
  document: {
    id: string;
    type: 'nfe' | 'nfce' | 'nfse';
    number: string;
    customer: string;
    date: string;
    value: number;
    status: 'Emitida' | 'Cancelada' | 'Pendente';
  };
  index: number;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, index }) => {
  const getStatusColor = () => {
    switch(document.status) {
      case 'Emitida':
        return 'bg-green-100 text-green-700';
      case 'Cancelada':
        return 'bg-red-100 text-red-700';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getDocumentTypeText = () => {
    switch(document.type) {
      case 'nfe':
        return 'NF-e';
      case 'nfce':
        return 'NFC-e';
      case 'nfse':
        return 'NFS-e';
      default:
        return 'Documento';
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return dateString;
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <FileTextIcon size={20} />
          </div>
          
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{getDocumentTypeText()} {document.number}</h3>
              <div className={`text-xs px-2 py-0.5 rounded-full ml-2 ${getStatusColor()}`}>
                {document.status}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-0.5">
              Cliente: <span className="font-medium">{document.customer}</span>
            </p>
          </div>
        </div>
        
        <button className="p-1 rounded-full hover:bg-muted transition-colors">
          <MoreVerticalIcon size={18} />
        </button>
      </div>
      
      <div className="border-t border-border mt-3 pt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Data de emissão:</span>
          <p className="font-medium">{formatDate(document.date)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Valor:</span>
          <p className="font-medium">{formatCurrency(document.value)}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard;