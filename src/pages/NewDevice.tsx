
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeftIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const NewDevice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const customerId = location.state?.customerId;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Dispositivo adicionado",
      description: "O dispositivo foi cadastrado com sucesso.",
    });
    
    // Navegue de volta para a página do cliente se foi redirecionado de lá
    if (customerId) {
      navigate(`/customers/${customerId}`);
    } else {
      navigate('/devices');
    }
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
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ArrowLeftIcon size={16} />
          </Button>
          <h1 className="text-2xl font-bold">Novo Dispositivo</h1>
        </div>
        
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="owner">Proprietário</Label>
                <Select defaultValue={customerId || undefined}>
                  <SelectTrigger id="owner">
                    <SelectValue placeholder="Selecione o proprietário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">João Silva</SelectItem>
                    <SelectItem value="2">Maria Santos</SelectItem>
                    <SelectItem value="3">Pedro Almeida</SelectItem>
                    <SelectItem value="4">Ana Ferreira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ios">iOS (iPhone)</SelectItem>
                    <SelectItem value="android">Android</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Select>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="samsung">Samsung</SelectItem>
                    <SelectItem value="xiaomi">Xiaomi</SelectItem>
                    <SelectItem value="motorola">Motorola</SelectItem>
                    <SelectItem value="lg">LG</SelectItem>
                    <SelectItem value="huawei">Huawei</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input id="model" placeholder="Ex: iPhone 13 Pro" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serial">Número de Série / IMEI</Label>
                <Input id="serial" placeholder="Ex: 123456789012345" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Condição</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione a condição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Bom estado</SelectItem>
                    <SelectItem value="issue">Problemas leves</SelectItem>
                    <SelectItem value="critical">Problemas críticos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <Input id="color" placeholder="Ex: Preto" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade</Label>
                <Select>
                  <SelectTrigger id="capacity">
                    <SelectValue placeholder="Selecione a capacidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="32GB">32GB</SelectItem>
                    <SelectItem value="64GB">64GB</SelectItem>
                    <SelectItem value="128GB">128GB</SelectItem>
                    <SelectItem value="256GB">256GB</SelectItem>
                    <SelectItem value="512GB">512GB</SelectItem>
                    <SelectItem value="1TB">1TB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Data de Compra</Label>
                <Input id="purchaseDate" type="date" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea 
                id="notes" 
                placeholder="Informações adicionais sobre o dispositivo, condições físicas, etc."
                className="min-h-32"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Dispositivo</Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default NewDevice;
