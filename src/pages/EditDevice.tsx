import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EditDevice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    serialNumber: '',
    type: '',
    status: '',
    purchaseDate: '',
    owner: '',
    notes: ''
  });
  
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    // Load device data from localStorage based on ID
    const loadDeviceData = () => {
      try {
        const savedDevices = localStorage.getItem('pauloCell_devices');
        if (savedDevices) {
          const devices = JSON.parse(savedDevices);
          const foundDevice = devices.find((d: any) => d.id === id);
          
          if (foundDevice) {
            setFormData({
              brand: foundDevice.brand || '',
              model: foundDevice.model || '',
              serialNumber: foundDevice.serialNumber || '',
              type: foundDevice.type || '',
              status: foundDevice.status || '',
              purchaseDate: foundDevice.purchaseDate || '',
              owner: foundDevice.owner || '',
              notes: foundDevice.notes || ''
            });
          } else {
            toast.error('Dispositivo não encontrado');
            navigate('/devices');
          }
        } else {
          toast.error('Nenhum dispositivo cadastrado');
          navigate('/devices');
        }
        
        // Load customers for owner selection
        const savedCustomers = localStorage.getItem('pauloCell_customers');
        if (savedCustomers) {
          setCustomers(JSON.parse(savedCustomers));
        }
      } catch (error) {
        console.error('Error loading device data:', error);
        toast.error('Erro ao carregar dados do dispositivo');
      } finally {
        setLoading(false);
      }
    };
    
    loadDeviceData();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get existing devices
      const savedDevices = localStorage.getItem('pauloCell_devices');
      if (!savedDevices) {
        toast.error('Não foi possível encontrar os dispositivos cadastrados.');
        return;
      }
      
      const devices = JSON.parse(savedDevices);
      
      // Find the device to update
      const deviceIndex = devices.findIndex((d: any) => d.id === id);
      if (deviceIndex === -1) {
        toast.error('Dispositivo não encontrado.');
        return;
      }
      
      // Get customer name
      const customer = customers.find(c => c.id === formData.owner);
      
      // Create updated device data
      const updatedDevice = {
        ...devices[deviceIndex],
        ...formData,
        ownerName: customer?.name || 'Proprietário não encontrado',
        updatedAt: new Date().toISOString()
      };
      
      // Update the device in the array
      devices[deviceIndex] = updatedDevice;
      
      // Save to localStorage
      localStorage.setItem('pauloCell_devices', JSON.stringify(devices));
      
      toast.success('Dispositivo atualizado com sucesso.');
      navigate(`/devices/${id}`);
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('Erro ao atualizar dispositivo.');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

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
            onClick={() => navigate(`/devices/${id}`)}
            className="h-8 w-8"
          >
            <ArrowLeftIcon size={16} />
          </Button>
          <h1 className="text-2xl font-bold">Editar Dispositivo</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Select 
                  value={formData.brand} 
                  onValueChange={(value) => handleSelectChange('brand', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="samsung">Samsung</SelectItem>
                    <SelectItem value="xiaomi">Xiaomi</SelectItem>
                    <SelectItem value="motorola">Motorola</SelectItem>
                    <SelectItem value="lg">LG</SelectItem>
                    <SelectItem value="other">Outra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="model">Modelo</Label>
                <Input 
                  id="model" 
                  name="model" 
                  value={formData.model} 
                  onChange={handleInputChange} 
                  placeholder="Ex: iPhone 13 Pro" 
                />
              </div>
              
              <div>
                <Label htmlFor="serialNumber">Número de Série</Label>
                <Input 
                  id="serialNumber" 
                  name="serialNumber" 
                  value={formData.serialNumber} 
                  onChange={handleInputChange} 
                  placeholder="Ex: IMEI ou S/N" 
                />
              </div>
              
              <div>
                <Label htmlFor="type">Tipo de Dispositivo</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cellphone">Celular</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="notebook">Notebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Estado do Dispositivo</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Bom estado</SelectItem>
                    <SelectItem value="issue">Problemas leves</SelectItem>
                    <SelectItem value="critical">Problemas críticos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="purchaseDate">Data de Compra</Label>
                <Input 
                  id="purchaseDate" 
                  name="purchaseDate" 
                  type="date" 
                  value={formData.purchaseDate} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="owner">Proprietário</Label>
                <Select 
                  value={formData.owner} 
                  onValueChange={(value) => handleSelectChange('owner', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o proprietário" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Observações</Label>
            <textarea 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleInputChange} 
              className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
              placeholder="Informações adicionais sobre o dispositivo..."
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/devices/${id}`)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </motion.div>
    </MainLayout>
  );
};

export default EditDevice;