import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  UserIcon, 
  StoreIcon, 
  BellIcon, 
  SaveIcon,
  DatabaseIcon,
  TrashIcon,
  RefreshCwIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [isResettingDatabase, setIsResettingDatabase] = useState(false);
  
  // Company information state
  const [companyData, setCompanyData] = useState({
    name: 'Paulo Cell',
    phone: '(11) 98765-4321',
    email: 'contato@paulocell.com.br',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01234-567',
    logo: '',
    notes: 'Assistência técnica especializada em celulares, tablets e notebooks.',
  });
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    newService: true,
    serviceCompleted: true,
    lowInventory: true,
    customerBirthday: false,
    emailNotifications: true,
    smsNotifications: false,
  });
  
  const handleCompanyDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (setting: string, checked: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: checked }));
  };
  
  const handleSaveCompanyData = () => {
    localStorage.setItem('pauloCell_companyData', JSON.stringify(companyData));
    toast.success('Informações da empresa salvas com sucesso!');
  };
  
  const handleSaveNotificationSettings = () => {
    localStorage.setItem('pauloCell_notificationSettings', JSON.stringify(notificationSettings));
    toast.success('Configurações de notificações salvas com sucesso!');
  };
  
  const handleResetDatabase = () => {
    try {
      // Clear all app data from localStorage
      localStorage.removeItem('pauloCell_customers');
      localStorage.removeItem('pauloCell_devices');
      localStorage.removeItem('pauloCell_services');
      localStorage.removeItem('pauloCell_inventory');
      
      // Keep the settings
      toast.success('Todos os dados foram apagados com sucesso!');
      setIsResettingDatabase(false);
    } catch (error) {
      console.error('Error resetting database:', error);
      toast.error('Ocorreu um erro ao resetar os dados.');
    }
  };
  
  const handleExportData = () => {
    try {
      // Gather all app data
      const exportData = {
        customers: JSON.parse(localStorage.getItem('pauloCell_customers') || '[]'),
        devices: JSON.parse(localStorage.getItem('pauloCell_devices') || '[]'),
        services: JSON.parse(localStorage.getItem('pauloCell_services') || '[]'),
        inventory: JSON.parse(localStorage.getItem('pauloCell_inventory') || '[]'),
        companyData: JSON.parse(localStorage.getItem('pauloCell_companyData') || '{}'),
        notificationSettings: JSON.parse(localStorage.getItem('pauloCell_notificationSettings') || '{}'),
      };
      
      // Convert to JSON string
      const jsonData = JSON.stringify(exportData, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `pauloCell_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Backup exportado com sucesso!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Ocorreu um erro ao exportar os dados.');
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
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>
        
        <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 sm:w-[400px]">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <StoreIcon size={16} />
              <span>Empresa</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <DatabaseIcon size={16} />
              <span>Sistema</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="company" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Informações da Empresa</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input
                    id="name"
                    name="name"
                    value={companyData.name}
                    onChange={handleCompanyDataChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={companyData.phone}
                    onChange={handleCompanyDataChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={companyData.email}
                    onChange={handleCompanyDataChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    name="address"
                    value={companyData.address}
                    onChange={handleCompanyDataChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    name="city"
                    value={companyData.city}
                    onChange={handleCompanyDataChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      name="state"
                      value={companyData.state}
                      onChange={handleCompanyDataChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">CEP</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={companyData.postalCode}
                      onChange={handleCompanyDataChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mt-6">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={companyData.notes}
                  onChange={handleCompanyDataChange}
                  rows={4}
                />
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveCompanyData} className="gap-2">
                  <SaveIcon size={16} />
                  <span>Salvar Informações</span>
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="mt-6 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Dados do Sistema</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <h3 className="text-md font-medium">Backup e Restauração</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 border-dashed">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h4 className="font-medium">Exportar Dados</h4>
                          <p className="text-sm text-muted-foreground mt-2">
                            Exporte todos os dados do sistema para um arquivo JSON. Você pode usar este arquivo para fazer backup ou transferir dados.
                          </p>
                        </div>
                        <Button 
                          className="mt-4 gap-2" 
                          onClick={handleExportData}
                        >
                          <RefreshCwIcon size={16} />
                          <span>Exportar Dados</span>
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4 border-dashed">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h4 className="font-medium">Resetar Banco de Dados</h4>
                          <p className="text-sm text-muted-foreground mt-2 text-red-600">
                            CUIDADO: Esta ação apagará todos os dados do sistema (clientes, dispositivos, serviços e estoque). Esta ação não pode ser desfeita.
                          </p>
                        </div>
                        <Button 
                          variant="destructive" 
                          className="mt-4 gap-2" 
                          onClick={() => setIsResettingDatabase(true)}
                        >
                          <TrashIcon size={16} />
                          <span>Resetar Dados</span>
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Reset Database Dialog */}
      <AlertDialog open={isResettingDatabase} onOpenChange={setIsResettingDatabase}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá apagar <strong>todos</strong> os seus dados, incluindo clientes, dispositivos, serviços e estoque.
              <br /><br />
              Esta ação <strong>não pode ser desfeita</strong>. Recomendamos fazer um backup antes de prosseguir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetDatabase}
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, resetar todos os dados
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Settings;
