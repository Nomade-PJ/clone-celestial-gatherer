
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DocumentForm from '@/components/forms/DocumentForm';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

interface LocationState {
  customerId?: string;
  documentType: 'nfe' | 'nfce' | 'nfse';
}

const NewDocument: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Properly handle the case when location.state is null
  const locationState = location.state as LocationState | null;
  
  // Log the location state for debugging
  console.log('Location state:', locationState);
  
  // Ensure customerId is properly extracted and defaulted
  const customerId = locationState?.customerId || undefined;
  
  // Ensure documentType is properly set, defaulting to 'nfe' if not provided
  // Use explicit type checking to ensure we get a valid document type
  let documentType: 'nfe' | 'nfce' | 'nfse' = 'nfe';
  if (locationState?.documentType && ['nfe', 'nfce', 'nfse'].includes(locationState.documentType)) {
    documentType = locationState.documentType as 'nfe' | 'nfce' | 'nfse';
  }
  const [apiConfigured, setApiConfigured] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [showAddressAlert, setShowAddressAlert] = useState(false);
  const [missingAddressFields, setMissingAddressFields] = useState<string[]>([]);

  // Verificar configuração da API ao carregar a página
  useEffect(() => {
    const checkApiConfiguration = () => {
      const apiConfig = localStorage.getItem('pauloCell_invoiceApiConfig');
      if (!apiConfig) {
        setApiConfigured(false);
        return false;
      }
      
      const config = JSON.parse(apiConfig);
      if (!config.apiKey || config.apiKey.trim() === '') {
        setApiConfigured(false);
        return false;
      }
      
      setApiConfigured(true);
      return true;
    };
    
    // Se a API não estiver configurada, alertar o usuário
    if (!checkApiConfiguration() && (documentType === 'nfce' || documentType === 'nfse')) {
      toast.error('API de notas fiscais não configurada', {
        description: 'Você precisa configurar a API antes de emitir este tipo de documento.',
        action: {
          label: 'Configurar',
          onClick: () => navigate('/settings', { state: { openTab: 'fiscalApi' } })
        }
      });
    }
    
    // Carregar dados do cliente se houver um customerId
    if (customerId) {
      const savedCustomers = localStorage.getItem('pauloCell_customers');
      if (savedCustomers) {
        const customers = JSON.parse(savedCustomers);
        const customerData = customers.find((c: any) => c.id === customerId);
        setCustomer(customerData);
        
        // Verificar se o cliente tem todos os campos de endereço necessários para NF-e
        if (documentType === 'nfe' && customerData) {
          checkCustomerAddress(customerData);
        }
      }
    }
  }, [customerId, documentType, navigate]);
  
  // Função para verificar endereço do cliente
  const checkCustomerAddress = (customerData: any) => {
    if (!customerData) return;
    
    const missingFields = [];
    
    // Verificar se o cliente tem CPF/CNPJ
    if (!customerData.document && !customerData.cpfCnpj) {
      missingFields.push('CPF/CNPJ');
    }
    
    // Para NF-e, verificamos todos os campos de endereço necessários
    const requiredAddressFields = [
      { field: 'address', name: 'Rua/Logradouro' },
      { field: 'number', name: 'Número' },
      { field: 'neighborhood', name: 'Bairro' },
      { field: 'city', name: 'Cidade' },
      { field: 'state', name: 'Estado' },
      { field: 'postalCode', name: 'CEP' }
    ];
    
    for (const { field, name } of requiredAddressFields) {
      // Para campos especiais, verificar dentro do objeto de endereço se existir
      if (field === 'number' || field === 'neighborhood') {
        if (!customerData.address || !customerData.address[field] || customerData.address[field].trim() === '') {
          missingFields.push(name);
        }
      } 
      // Para campos simples, verificar diretamente no objeto do cliente
      else if (field === 'address') {
        if (!customerData[field] || customerData[field].trim() === '') {
          missingFields.push(name);
        }
      }
      // Campos que podem estar no objeto principal ou no objeto de endereço
      else {
        const hasField = (
          (customerData[field] && customerData[field].trim() !== '') || 
          (customerData.address && customerData.address[field] && customerData.address[field].trim() !== '')
        );
        
        if (!hasField) {
          missingFields.push(name);
        }
      }
    }
    
    if (missingFields.length > 0) {
      setMissingAddressFields(missingFields);
      setShowAddressAlert(true);
    } else {
      setShowAddressAlert(false);
    }
  };

  const handleSubmit = (data: any) => {
    // Save the document data to localStorage
    try {
      // The document data is already saved in the DocumentForm component's handleSubmit function
      // We just need to show a success message and redirect
      toast.success('Documento fiscal emitido com sucesso!');
      
      // Redirecionar para a página de documentos ou detalhes do cliente
      if (customerId) {
        navigate(`/customers/${customerId}`);
      } else {
        navigate('/documents');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Erro ao salvar documento');
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

        {!apiConfigured && (documentType === 'nfce' || documentType === 'nfse') && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Configuração necessária</AlertTitle>
            <AlertDescription>
              A API de notas fiscais não está configurada. Configure a API nas configurações antes de emitir este tipo de documento.
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/settings', { state: { openTab: 'fiscalApi' } })}
                >
                  Ir para configurações
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {showAddressAlert && documentType === 'nfe' && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Informações de endereço incompletas</AlertTitle>
            <AlertDescription>
              <p>O cliente selecionado possui os seguintes campos de endereço ausentes ou incompletos:</p>
              <ul className="list-disc pl-5 mt-2">
                {missingAddressFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
              <p className="mt-2">Estes campos são obrigatórios para a emissão de NF-e.</p>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/customers/edit/${customerId}`)}
                >
                  Atualizar dados do cliente
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <DocumentForm
          type={documentType}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          customerId={customerId}
          requiresApiConfig={!apiConfigured && (documentType === 'nfce' || documentType === 'nfse')}
          customer={customer}
        />
      </motion.div>
    </MainLayout>
  );
};

export default NewDocument;
