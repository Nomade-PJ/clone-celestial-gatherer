
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, DownloadIcon, LineChartIcon, PieChartIcon, BarChart2Icon } from 'lucide-react';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [periodFilter, setPeriodFilter] = useState('month');
  const [services, setServices] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load services
    const savedServices = localStorage.getItem('pauloCell_services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }

    // Load devices
    const savedDevices = localStorage.getItem('pauloCell_devices');
    if (savedDevices) {
      setDevices(JSON.parse(savedDevices));
    }

    // Load customers
    const savedCustomers = localStorage.getItem('pauloCell_customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }

    // Load inventory
    const savedInventory = localStorage.getItem('pauloCell_inventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  };

  // Generate random data for demonstration purposes
  const getRandomData = (count: number, min: number, max: number) => {
    return Array(count).fill(0).map(() => Math.floor(min + Math.random() * (max - min)));
  };

  // Sample data for various charts
  const generateSalesData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const weeks = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    const quarters = ['1º Trimestre', '2º Trimestre', '3º Trimestre', '4º Trimestre'];
    
    switch (periodFilter) {
      case 'week':
        return weeks.map((week, index) => ({
          name: week,
          Serviços: getRandomData(1, 10, 30)[0],
          Peças: getRandomData(1, 5, 20)[0]
        }));
      case 'month':
        return months.map((month, index) => ({
          name: month,
          Serviços: getRandomData(1, 20, 50)[0],
          Peças: getRandomData(1, 10, 40)[0]
        }));
      case 'quarter':
        return quarters.map((quarter, index) => ({
          name: quarter,
          Serviços: getRandomData(1, 50, 120)[0],
          Peças: getRandomData(1, 30, 100)[0]
        }));
      case 'year':
        return ['2022', '2023', '2024'].map((year) => ({
          name: year,
          Serviços: getRandomData(1, 200, 500)[0],
          Peças: getRandomData(1, 150, 400)[0]
        }));
      default:
        return [];
    }
  };

  const generateDeviceTypeData = () => {
    const deviceTypes = [
      { name: 'Celular', value: devices.filter(d => d.type === 'cellphone').length || 8 },
      { name: 'Tablet', value: devices.filter(d => d.type === 'tablet').length || 4 },
      { name: 'Notebook', value: devices.filter(d => d.type === 'notebook').length || 2 },
    ];
    
    // Add at least some data if no devices exist
    if (deviceTypes.reduce((sum, item) => sum + item.value, 0) === 0) {
      deviceTypes[0].value = 8;
      deviceTypes[1].value = 4;
      deviceTypes[2].value = 2;
    }
    
    return deviceTypes;
  };

  const generateDeviceStatusData = () => {
    const statusTypes = [
      { name: 'Bom Estado', value: devices.filter(d => d.status === 'good').length || 10 },
      { name: 'Problemas Leves', value: devices.filter(d => d.status === 'issue').length || 5 },
      { name: 'Problemas Críticos', value: devices.filter(d => d.status === 'critical').length || 3 },
    ];
    
    // Add at least some data if no devices exist
    if (statusTypes.reduce((sum, item) => sum + item.value, 0) === 0) {
      statusTypes[0].value = 10;
      statusTypes[1].value = 5;
      statusTypes[2].value = 3;
    }
    
    return statusTypes;
  };

  const generateServiceStatusData = () => {
    return [
      { name: 'Em espera', value: services.filter(s => s.status === 'pending').length || 5 },
      { name: 'Em andamento', value: services.filter(s => s.status === 'in-progress').length || 8 },
      { name: 'Concluídos', value: services.filter(s => s.status === 'completed').length || 12 },
      { name: 'Entregues', value: services.filter(s => s.status === 'delivered').length || 7 },
      { name: 'Cancelados', value: services.filter(s => s.status === 'cancelled').length || 2 },
    ];
  };

  const generateCustomerTypeData = () => {
    return [
      { name: 'Pessoa Física', value: customers.filter(c => !c.isCompany).length || 15 },
      { name: 'Empresa', value: customers.filter(c => c.isCompany).length || 5 },
    ];
  };

  const inventoryCategoryData = () => {
    const categories = {
      'Tela': inventory.filter(i => i.category === 'Tela').length || 7,
      'Bateria': inventory.filter(i => i.category === 'Bateria').length || 12,
      'Acessório': inventory.filter(i => i.category === 'Acessório').length || 8,
      'Placa': inventory.filter(i => i.category === 'Placa').length || 4,
      'Outro': inventory.filter(i => i.category === 'Outro' || !i.category).length || 3,
    };
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#D35400'];

  const getPeriodLabel = () => {
    switch (periodFilter) {
      case 'week':
        return 'Semanal';
      case 'month':
        return 'Mensal';
      case 'quarter':
        return 'Trimestral';
      case 'year':
        return 'Anual';
      default:
        return 'Período';
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">Métricas e estatísticas da sua assistência técnica</p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="mr-2" />
                    <SelectValue placeholder="Selecione o período" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semanal</SelectItem>
                  <SelectItem value="month">Mensal</SelectItem>
                  <SelectItem value="quarter">Trimestral</SelectItem>
                  <SelectItem value="year">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="gap-2">
              <DownloadIcon size={16} />
              <span>Exportar</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 sm:grid-cols-4 w-full">
            <TabsTrigger value="sales" className="flex gap-1">
              <LineChartIcon size={16} /> <span className="hidden sm:inline">Vendas</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex gap-1">
              <BarChart2Icon size={16} /> <span className="hidden sm:inline">Dispositivos</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex gap-1">
              <PieChartIcon size={16} /> <span className="hidden sm:inline">Serviços</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex gap-1">
              <PieChartIcon size={16} /> <span className="hidden sm:inline">Clientes</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Faturamento {getPeriodLabel()}</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={generateSalesData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${value}`, undefined]} />
                    <Legend />
                    <Bar dataKey="Serviços" fill="#8884d8" />
                    <Bar dataKey="Peças" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">Faturamento Total</h3>
                <p className="text-3xl font-bold">R$ {(services.reduce((sum, s) => sum + (Number(s.price) || 0), 0) + inventory.reduce((sum, i) => sum + ((Number(i.price) || 0) * (Number(i.soldQuantity) || 0)), 0)).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">+12% em relação ao período anterior</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">Serviços</h3>
                <p className="text-3xl font-bold">R$ {services.reduce((sum, s) => sum + (Number(s.price) || 0), 0).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">+8% em relação ao período anterior</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-2">Peças</h3>
                <p className="text-3xl font-bold">R$ {inventory.reduce((sum, i) => sum + ((Number(i.price) || 0) * (Number(i.soldQuantity) || 0)), 0).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">+15% em relação ao período anterior</p>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="devices" className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Dispositivos por Tipo</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generateDeviceTypeData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {generateDeviceTypeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} unid.`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Dispositivos por Status</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generateDeviceStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {generateDeviceStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} unid.`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Dispositivos por Marca</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Apple', value: devices.filter(d => d.brand === 'apple').length || 12 },
                      { name: 'Samsung', value: devices.filter(d => d.brand === 'samsung').length || 8 },
                      { name: 'Xiaomi', value: devices.filter(d => d.brand === 'xiaomi').length || 5 },
                      { name: 'Motorola', value: devices.filter(d => d.brand === 'motorola').length || 6 },
                      { name: 'LG', value: devices.filter(d => d.brand === 'lg').length || 3 },
                      { name: 'Outros', value: devices.filter(d => !['apple', 'samsung', 'xiaomi', 'motorola', 'lg'].includes(d.brand)).length || 4 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} unidades`, 'Quantidade']} />
                    <Bar dataKey="value" fill="#8884d8" name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Serviços por Status</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generateServiceStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {generateServiceStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} serviços`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Tempo Médio por Serviço</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Troca de Tela', value: 2 },
                      { name: 'Troca de Bateria', value: 1 },
                      { name: 'Reparo de Placa', value: 4 },
                      { name: 'Conector de Carga', value: 1.5 },
                      { name: 'Diagnóstico', value: 1 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} dias`, 'Tempo Médio']} />
                    <Bar dataKey="value" fill="#82ca9d" name="Tempo Médio (dias)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Faturamento por Tipo de Serviço</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Troca de Tela', value: 4500 },
                      { name: 'Troca de Bateria', value: 2200 },
                      { name: 'Reparo de Placa', value: 3800 },
                      { name: 'Conector de Carga', value: 1800 },
                      { name: 'Software', value: 900 },
                      { name: 'Outros', value: 1200 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${value}`, 'Faturamento']} />
                    <Bar dataKey="value" fill="#8884d8" name="Faturamento (R$)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Clientes por Tipo</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generateCustomerTypeData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {generateCustomerTypeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} clientes`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Distribuição de Clientes</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryCategoryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {inventoryCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} itens`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Novos Clientes ({getPeriodLabel()})</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={generateSalesData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Serviços" fill="#8884d8" name="Novos Clientes" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  );
};

export default Reports;
