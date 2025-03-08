
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Mock data para peças e acessórios disponíveis
const availableParts = [
  { id: '1', name: 'Tela iPhone 13 Pro', price: 350, stock: 5 },
  { id: '2', name: 'Bateria Samsung Galaxy S22', price: 120, stock: 3 },
  { id: '3', name: 'Conector de Carga iPhone 12', price: 80, stock: 8 },
  { id: '4', name: 'Tela Xiaomi Redmi Note 11', price: 180, stock: 4 },
  { id: '5', name: 'Alto Falante iPhone 13', price: 60, stock: 12 },
  { id: '6', name: 'Cabo Flex Motorola Moto G32', price: 45, stock: 6 },
];

// Mock data para técnicos
const technicians = [
  { id: '1', name: 'Carlos Oliveira' },
  { id: '2', name: 'Ana Ferreira' },
  { id: '3', name: 'Pedro Almeida' },
  { id: '4', name: 'João Silva' },
];

interface SelectedPart {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const NewService: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { customerId, deviceId } = location.state || {};
  
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([]);
  const [laborCost, setLaborCost] = useState<number>(100);
  
  const addPart = (partId: string) => {
    const part = availableParts.find(p => p.id === partId);
    if (part) {
      const existingPart = selectedParts.find(p => p.id === partId);
      if (existingPart) {
        setSelectedParts(prev => 
          prev.map(p => p.id === partId ? { ...p, quantity: p.quantity + 1 } : p)
        );
      } else {
        setSelectedParts(prev => [...prev, { ...part, quantity: 1 }]);
      }
    }
  };
  
  const removePart = (partId: string) => {
    setSelectedParts(prev => prev.filter(p => p.id !== partId));
  };
  
  const updatePartQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removePart(partId);
      return;
    }
    
    setSelectedParts(prev => 
      prev.map(p => p.id === partId ? { ...p, quantity } : p)
    );
  };
  
  const calculateTotalParts = () => {
    return selectedParts.reduce((total, part) => total + (part.price * part.quantity), 0);
  };
  
  const calculateTotal = () => {
    return calculateTotalParts() + laborCost;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Serviço adicionado",
      description: "O serviço foi registrado com sucesso.",
    });
    navigate('/services');
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
          <h1 className="text-2xl font-bold">Novo Serviço</h1>
        </div>
        
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer">Cliente</Label>
                <Select defaultValue={customerId || undefined}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Selecione o cliente" />
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
                <Label htmlFor="device">Dispositivo</Label>
                <Select defaultValue={deviceId || undefined}>
                  <SelectTrigger id="device">
                    <SelectValue placeholder="Selecione o dispositivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">iPhone 13 Pro - João Silva</SelectItem>
                    <SelectItem value="2">Galaxy S22 - Maria Santos</SelectItem>
                    <SelectItem value="3">iPhone 12 - Pedro Almeida</SelectItem>
                    <SelectItem value="4">Redmi Note 11 - Ana Ferreira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceType">Tipo de Serviço</Label>
                <Select>
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Selecione o tipo de serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screen">Troca de Tela</SelectItem>
                    <SelectItem value="battery">Substituição de Bateria</SelectItem>
                    <SelectItem value="board">Reparo de Placa</SelectItem>
                    <SelectItem value="connector">Troca de Conector de Carga</SelectItem>
                    <SelectItem value="software">Atualização de Software</SelectItem>
                    <SelectItem value="cleaning">Limpeza Interna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="technician">Técnico</Label>
                <Select>
                  <SelectTrigger id="technician">
                    <SelectValue placeholder="Selecione o técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map(tech => (
                      <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedCompletion">Previsão de Conclusão</Label>
                <Input id="estimatedCompletion" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="waiting">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiting">Em espera</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-base">Peças Utilizadas</Label>
                <div className="flex items-center gap-2">
                  <Select onValueChange={addPart}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Adicionar peça" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableParts.map(part => (
                        <SelectItem key={part.id} value={part.id}>
                          {part.name} - R$ {part.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    size="icon" 
                    onClick={() => {
                      const selectEl = document.querySelector('select[name="parts"]') as HTMLSelectElement;
                      if (selectEl && selectEl.value) addPart(selectEl.value);
                    }}
                  >
                    <PlusIcon size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase py-3 px-4">Peça</th>
                      <th className="text-center text-xs font-medium text-muted-foreground uppercase py-3 px-4">Quantidade</th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase py-3 px-4">Preço</th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase py-3 px-4">Total</th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase py-3 px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedParts.length > 0 ? (
                      selectedParts.map((part, idx) => (
                        <tr key={part.id} className={idx < selectedParts.length - 1 ? "border-b" : ""}>
                          <td className="py-3 px-4">{part.name}</td>
                          <td className="py-3 px-4 text-center">
                            <Input 
                              type="number" 
                              value={part.quantity}
                              min={1}
                              className="w-16 text-center mx-auto"
                              onChange={e => updatePartQuantity(part.id, parseInt(e.target.value))}
                            />
                          </td>
                          <td className="py-3 px-4 text-right">R$ {part.price.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right">R$ {(part.price * part.quantity).toFixed(2)}</td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removePart(part.id)}
                            >
                              <TrashIcon size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-4 px-4 text-center text-muted-foreground">
                          Nenhuma peça adicionada
                        </td>
                      </tr>
                    )}
                    
                    <tr className="border-t">
                      <td colSpan={3} className="py-3 px-4 font-medium text-right">Total de Peças:</td>
                      <td className="py-3 px-4 text-right font-bold">R$ {calculateTotalParts().toFixed(2)}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-3 px-4 font-medium text-right">Mão de Obra:</td>
                      <td className="py-3 px-4 text-right">
                        <Input 
                          type="number" 
                          value={laborCost}
                          className="w-24 text-right"
                          onChange={e => setLaborCost(parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td></td>
                    </tr>
                    <tr className="bg-muted/60">
                      <td colSpan={3} className="py-3 px-4 font-bold text-right">Valor Total:</td>
                      <td className="py-3 px-4 text-right font-bold text-primary">R$ {calculateTotal().toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea 
                id="notes" 
                placeholder="Informações adicionais sobre o serviço, condições do dispositivo, solicitações do cliente, etc."
                className="min-h-32"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Serviço</Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default NewService;
