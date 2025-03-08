
import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PhoneIcon, 
  MailIcon, 
  MapPinIcon, 
  EditIcon,
  WrenchIcon,
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  SmartphoneIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/ui/ServiceCard';

// Mock data
// In a real app, this would come from a database
const customerData = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '(11) 98765-4321',
  address: 'Rua das Flores, 123',
  city: 'São Paulo',
  state: 'SP',
  postalCode: '01234-567',
  cpfCnpj: '123.456.789-00',
  notes: 'Cliente preferencial, sempre traz dispositivos para conserto.',
  isCompany: false,
  lastVisit: '22/10/2023',
  totalServices: 3
};

// Mock service history
const serviceHistory = [
  {
    id: '1',
    type: 'Troca de Tela',
    status: 'completed',
    customer: 'João Silva',
    device: 'iPhone 13 Pro',
    createDate: '22/10/2023',
    estimatedCompletion: '24/10/2023',
    price: 450,
    technician: 'Carlos Oliveira'
  },
  {
    id: '2',
    type: 'Substituição de Bateria',
    status: 'delivered',
    customer: 'João Silva',
    device: 'Samsung Galaxy S22',
    createDate: '15/09/2023',
    estimatedCompletion: '17/09/2023',
    price: 180,
    technician: 'Ana Ferreira'
  },
  {
    id: '3',
    type: 'Reparo de Placa',
    status: 'delivered',
    customer: 'João Silva',
    device: 'iPhone 12',
    createDate: '10/08/2023',
    estimatedCompletion: '15/08/2023',
    price: 320,
    technician: 'Pedro Santos'
  }
] as const;

// Mock devices
const customerDevices = [
  {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    serialNumber: 'IMEI: 123456789012345',
    type: 'ios',
    status: 'good',
    lastService: '22/10/2023',
    owner: 'João Silva'
  },
  {
    id: '2',
    brand: 'Samsung',
    model: 'Galaxy S22',
    serialNumber: 'IMEI: 987654321098765',
    type: 'android',
    status: 'good',
    lastService: '15/09/2023',
    owner: 'João Silva'
  }
];

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // In a real app, you would fetch the customer data based on the ID
  // For now, we'll use our mock data
  const customer = customerData;
  
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
            onClick={() => navigate('/customers')}
            className="h-8 w-8"
          >
            <ArrowLeftIcon size={16} />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes do Cliente</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              className="bg-card rounded-xl border border-border p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-medium text-lg">
                      {customer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{customer.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        Cliente desde {customer.lastVisit}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => navigate(`/customers/edit/${customer.id}`)}
                >
                  <EditIcon size={16} />
                  <span>Editar</span>
                </Button>
              </div>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3">
                  <PhoneIcon size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-sm">{customer.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MailIcon size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">E-mail</p>
                    <p className="text-sm">{customer.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPinIcon size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Endereço</p>
                    <p className="text-sm">{customer.address}</p>
                    <p className="text-sm">{customer.city}, {customer.state} - {customer.postalCode}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-1">CPF/CNPJ</p>
                  <p className="text-sm">{customer.cpfCnpj}</p>
                </div>
                
                {customer.notes && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium mb-1">Observações</p>
                    <p className="text-sm">{customer.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button className="gap-2 w-full">
                  <WrenchIcon size={16} />
                  <span>Novo Serviço</span>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-xl border border-border p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Dispositivos</h3>
                <Button variant="outline" size="sm" className="gap-1">
                  <SmartphoneIcon size={16} />
                  <span>Adicionar</span>
                </Button>
              </div>
              
              <div className="space-y-4">
                {customerDevices.map((device, index) => (
                  <div 
                    key={device.id}
                    className="flex justify-between items-center p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/devices/${device.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <SmartphoneIcon size={18} />
                      </div>
                      <div>
                        <p className="font-medium">{device.brand} {device.model}</p>
                        <p className="text-xs text-muted-foreground">
                          {device.serialNumber}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Último serviço: {device.lastService}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              className="bg-card rounded-xl border border-border p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Histórico de Serviços</h3>
                  <p className="text-sm text-muted-foreground">
                    Total de {serviceHistory.length} serviços realizados
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <CalendarIcon size={16} />
                    <span>Agendar</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ClockIcon size={16} />
                    <span>Histórico</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {serviceHistory.map((service, idx) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    index={idx} 
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default CustomerDetail;
