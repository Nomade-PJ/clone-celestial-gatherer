
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVerticalIcon, FileTextIcon, PrinterIcon, DownloadIcon } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { exportDocumentToPDF } from '@/lib/export-utils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface DocumentCardProps {
  document: {
    id: string;
    type: 'nfe' | 'nfce' | 'nfse';
    number: string;
    customer: string;
    date: string;
    value: number;
    status: 'Emitida' | 'Cancelada' | 'Pendente';
    items?: Array<{
      description: string;
      quantity: number;
      unitValue: number;
    }>;
    paymentMethod?: string;
    observations?: string;
  };
  index: number;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, index }) => {
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'number', 'type', 'customer', 'date', 'value', 'status', 'paymentMethod'
  ]);

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

  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  const handlePrintConfirm = () => {
    if (!document) return;

    try {
      // Import on demand to avoid circular references
      const { generateDocumentPrintContent } = require('@/lib/export-utils');
      const content = generateDocumentPrintContent(document, selectedColumns);
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          printWindow.onafterprint = () => {
            printWindow.close();
            setShowPrintDialog(false);
          };
        }, 250);
        toast.success('Documento enviado para impressão');
      } else {
        toast.error('Não foi possível abrir a janela de impressão');
      }
    } catch (error) {
      console.error('Error printing document:', error);
      toast.error('Erro ao imprimir documento');
    }
  };

  const handleDownload = () => {
    try {
      const success = exportDocumentToPDF(document, [
        'number', 'type', 'customer', 'date', 'value', 'status', 
        'paymentMethod', 'items', 'observations'
      ]);
      if (success) {
        toast.success('Documento exportado com sucesso');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Erro ao baixar documento');
    }
  };
  
  return (
    <>
      <AlertDialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opções de Impressão</AlertDialogTitle>
            <AlertDialogDescription>
              Selecione as informações que deseja incluir na impressão:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes('number')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns([...selectedColumns, 'number']);
                  } else {
                    setSelectedColumns(selectedColumns.filter(col => col !== 'number'));
                  }
                }}
                className="form-checkbox h-4 w-4"
              />
              <span>Número</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes('type')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns([...selectedColumns, 'type']);
                  } else {
                    setSelectedColumns(selectedColumns.filter(col => col !== 'type'));
                  }
                }}
                className="form-checkbox h-4 w-4"
              />
              <span>Tipo</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes('customer')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns([...selectedColumns, 'customer']);
                  } else {
                    setSelectedColumns(selectedColumns.filter(col => col !== 'customer'));
                  }
                }}
                className="form-checkbox h-4 w-4"
              />
              <span>Cliente</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes('date')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns([...selectedColumns, 'date']);
                  } else {
                    setSelectedColumns(selectedColumns.filter(col => col !== 'date'));
                  }
                }}
                className="form-checkbox h-4 w-4"
              />
              <span>Data</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes('value')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns([...selectedColumns, 'value']);
                  } else {
                    setSelectedColumns(selectedColumns.filter(col => col !== 'value'));
                  }
                }}
                className="form-checkbox h-4 w-4"
              />
              <span>Valor</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes('status')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns([...selectedColumns, 'status']);
                  } else {
                    setSelectedColumns(selectedColumns.filter(col => col !== 'status'));
                  }
                }}
                className="form-checkbox h-4 w-4"
              />
              <span>Status</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes('paymentMethod')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns([...selectedColumns, 'paymentMethod']);
                  } else {
                    setSelectedColumns(selectedColumns.filter(col => col !== 'paymentMethod'));
                  }
                }}
                className="form-checkbox h-4 w-4"
              />
              <span>Forma de Pagamento</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes('items')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns([...selectedColumns, 'items']);
                  } else {
                    setSelectedColumns(selectedColumns.filter(col => col !== 'items'));
                  }
                }}
                className="form-checkbox h-4 w-4"
              />
              <span>Itens</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes('observations')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns([...selectedColumns, 'observations']);
                  } else {
                    setSelectedColumns(selectedColumns.filter(col => col !== 'observations'));
                  }
                }}
                className="form-checkbox h-4 w-4"
              />
              <span>Observações</span>
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handlePrintConfirm}>Imprimir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-muted transition-colors">
                <MoreVerticalIcon size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePrint}>
                <PrinterIcon className="mr-2 h-4 w-4" />
                <span>Imprimir</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                <span>Baixar PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
    </>
  );
};

export default DocumentCard;
