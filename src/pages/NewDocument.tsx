import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DocumentForm from '@/components/forms/DocumentForm';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationState {
  customerId?: string;
  documentType: 'nfe' | 'nfce' | 'nfse';
}

const NewDocument: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId, documentType } = location.state as LocationState || { documentType: 'nfe' };

  const handleSubmit = (data: any) => {
    // Redirecionar para a página de documentos ou detalhes do cliente
    if (customerId) {
      navigate(`/customers/${customerId}`);
    } else {
      navigate('/documents');
    }
  };

  const handleCancel = () => {
    // Voltar para a página anterior
    if (customerId) {
      navigate(`/customers/${customerId}`);
    } else {
      navigate('/documents');
    }
  };

  const getDocumentTitle = () => {
    switch (documentType) {
      case 'nfe':
        return 'Nova Nota Fiscal Eletrônica (NF-e)';
      case 'nfce':
        return 'Nova Nota Fiscal de Consumidor (NFC-e)';
      case 'nfse':
        return 'Nova Nota Fiscal de Serviço (NFS-e)';
      default:
        return 'Novo Documento';
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{getDocumentTitle()}</h1>
        </div>

        <DocumentForm
          type={documentType}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          customerId={customerId}
        />
      </motion.div>
    </MainLayout>
  );
};

export default NewDocument; 