
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeftIcon, PenIcon, TrashIcon, CheckCircleIcon, AlertCircleIcon, XCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

// Mock device data (in a real app, this would come from a database)
const devices = [
  {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    serialNumber: 'IMEI: 123456789012345',
    type: 'ios',
    status: 'good',
    lastService: '22/10/2023',
    owner: 'João Silva',
    ownerId: '1',
    purchaseDate: '15/08/2022',
    color: 'Grafite',
    capacity: '256GB',
    notes: 'Aparelho em boas condições físicas, com pequeno risco na parte traseira.',
    serviceHistory: [
      { id: '1', type: 'Troca de Tela', date: '22/10/2023', technician: 'Carlos Oliveira', cost: 450 },
      { id: '2', type: 'Diagnóstico', date: '15/09/2023', technician: 'Ana Ferreira', cost: 80 }
    ]
  },
  {
    id: '2',
    brand: 'Samsung',
    model: 'Galaxy S22',
    serialNumber: 'IMEI: 987654321098765',
    type: 'android',
    status: 'issue',
    lastService: '18/10/2023',
    owner: 'Maria Santos',
    ownerId: '2',
    purchaseDate: '20/03/2023',
    color: 'Preto',
    capacity: '128GB',
    notes: 'Problemas na bateria, descarrega muito rápido. Tela com arranhões leves.',
    serviceHistory: [
      { id: '1', type: 'Substituição de Bateria', date: '18/10/2023', technician: 'João Silva', cost: 180 }
    ]
  },
  {
    id: '3',
    brand: 'Apple',
    model: 'iPhone 12',
    serialNumber: 'IMEI: 567890123456789',
    type: 'ios',
    status: 'good',
    lastService: '15/10/2023',
    owner: 'Pedro Almeida',
    ownerId: '3',
    purchaseDate: '05/01/2022',
    color: 'Azul',
    capacity: '128GB',
    notes: 'Aparelho em excelentes condições.',
    serviceHistory: [
      { id: '1', type: 'Reparo de Placa', date: '15/10/2023', technician: 'Carlos Oliveira', cost: 320 }
    ]
  },
  {
    id: '4',
    brand: 'Xiaomi',
    model: 'Redmi Note 11',
    serialNumber: 'IMEI: 345678901234567',
    type: 'android',
    status: 'critical',
    lastService: '10/10/2023',
    owner: 'Ana Ferreira',
    ownerId: '4',
    purchaseDate: '12/04/2023',
    color: 'Branco',
    capacity: '64GB',
    notes: 'Problemas sérios no touch da tela e conector de carga danificado.',
    serviceHistory: [
      { id: '1', type: 'Troca de Conector de Carga', date: '10/10/2023', technician: 'Pedro Almeida', cost: 150 }
    ]
  }
];

const DeviceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find the device with the matching ID
  const device = devices.find(d => d.id === id);
  
  if (!device) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-4">Dispositivo não encontrado</h2>
          <Button onClick={() => navigate('/devices')}>Voltar para Dispositivos</Button>
        </div>
      </MainLayout>
    );
  }
  
  const handleDelete = () => {
    toast({
      title: "Dispositivo excluído",
      description: `${device.brand} ${device.model} foi removido com sucesso.`,
    });
    navigate('/devices');
  };
  
  const handleNewService = () => {
    navigate('/services/new', { state: { deviceId: device.id, customerId: device.ownerId } });
  };
  
  return (
    <MainLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/devices')}
            className="h-8 w-8"
          >
            <ArrowLeftIcon size={16} />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes do Dispositivo</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">{device.brand} {device.model}</h2>
                <p className="text-muted-foreground">{device.serialNumber}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/customers/${device.ownerId}`)}
                >
                  Ver proprietário
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate(`/devices/edit/${device.id}`)}
                >
                  <PenIcon size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleDelete}
                >
                  <TrashIcon size={16} />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Proprietário</h3>
                <p className="font-medium">{device.owner}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <div className="flex items-center">
                  {device.status === 'good' ? (
                    <>
                      <CheckCircleIcon size={16} className="text-green-600 mr-1" />
                      <span>Bom estado</span>
                    </>
                  ) : device.status === 'issue' ? (
                    <>
                      <AlertCircleIcon size={16} className="text-amber-500 mr-1" />
                      <span>Problemas leves</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon size={16} className="text-red-600 mr-1" />
                      <span>Problemas críticos</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Tipo</h3>
                <p className="font-medium capitalize">{device.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Último Serviço</h3>
                <p className="font-medium">{device.lastService}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Data de Compra</h3>
                <p className="font-medium">{device.purchaseDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Cor</h3>
                <p className="font-medium">{device.color}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Capacidade</h3>
                <p className="font-medium">{device.capacity}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Observações</h3>
              <p>{device.notes}</p>
            </div>
            
            <Button onClick={handleNewService}>Novo Serviço</Button>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Histórico de Serviços</h2>
            
            {device.serviceHistory.length > 0 ? (
              <div className="space-y-4">
                {device.serviceHistory.map((service, idx) => (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium">{service.type}</h3>
                      <span className="text-sm font-medium text-primary">R$ {service.cost}</span>
                    </div>
                    <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                      <span>{service.date}</span>
                      <span>{service.technician}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum serviço registrado.</p>
            )}
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default DeviceDetail;
