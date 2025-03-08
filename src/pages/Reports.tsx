
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SearchIcon, 
  FilterIcon,
  ChevronDownIcon,
  DownloadIcon,
  BarChart2Icon,
  LineChartIcon,
  PieChartIcon,
  CalendarIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for sales report
const salesData = [
  { month: 'Janeiro', revenue: 12500, services: 45 },
  { month: 'Fevereiro', revenue: 14200, services: 52 },
  { month: 'Março', revenue: 15800, services: 58 },
  { month: 'Abril', revenue: 13600, services: 49 },
  { month: 'Maio', revenue: 16200, services: 61 },
  { month: 'Junho', revenue: 17500, services: 65 },
];

// Mock data for service types
const serviceTypes = [
  { type: 'Troca de Tela', count: 85, revenue: 18700 },
  { type: 'Troca de Bateria', count: 62, revenue: 9300 },
  { type: 'Reparo de Placa', count: 29, revenue: 8700 },
  { type: 'Atualização de Software', count: 48, revenue: 4800 },
  { type: 'Limpeza Interna', count: 35, revenue: 3500 },
];

// Mock data for technician performance
const technicianData = [
  { name: 'Carlos Oliveira', services: 56, revenue: 15400, rating: 4.8 },
  { name: 'Ana Ferreira', services: 48, revenue: 13200, rating: 4.9 },
  { name: 'Pedro Almeida', services: 42, revenue: 11800, rating: 4.7 },
  { name: 'João Silva', services: 38, revenue: 10500, rating: 4.6 },
];

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
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
            <p className="text-muted-foreground">Análise de desempenho e métricas da sua loja</p>
          </div>
          <Button variant="outline" className="gap-2">
            <DownloadIcon size={16} />
            <span>Exportar Dados</span>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar relatórios..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/50 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2">
              <FilterIcon size={16} />
              <span>Filtrar</span>
              <ChevronDownIcon size={16} />
            </Button>
            
            <Button variant="outline" className="gap-2">
              <CalendarIcon size={16} />
              <span>Período</span>
              <ChevronDownIcon size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          <Button 
            variant={dateRange === 'week' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => setDateRange('week')}
          >
            <span>Semanal</span>
          </Button>
          <Button 
            variant={dateRange === 'month' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => setDateRange('month')}
          >
            <span>Mensal</span>
          </Button>
          <Button 
            variant={dateRange === 'quarter' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => setDateRange('quarter')}
          >
            <span>Trimestral</span>
          </Button>
          <Button 
            variant={dateRange === 'year' ? 'default' : 'outline'} 
            className="gap-2 whitespace-nowrap"
            onClick={() => setDateRange('year')}
          >
            <span>Anual</span>
          </Button>
        </div>
        
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="sales" className="gap-2">
              <BarChart2Icon size={16} />
              <span>Vendas</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <PieChartIcon size={16} />
              <span>Serviços</span>
            </TabsTrigger>
            <TabsTrigger value="technicians" className="gap-2">
              <LineChartIcon size={16} />
              <span>Técnicos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Faturamento Total</h3>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(salesData.reduce((acc, item) => acc + item.revenue, 0))}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Últimos 6 meses
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Serviços Realizados</h3>
                <p className="text-3xl font-bold text-primary">
                  {salesData.reduce((acc, item) => acc + item.services, 0)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Últimos 6 meses
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-2">Ticket Médio</h3>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(
                    salesData.reduce((acc, item) => acc + item.revenue, 0) / 
                    salesData.reduce((acc, item) => acc + item.services, 0)
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Por serviço
                </p>
              </Card>
            </div>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Faturamento Mensal</h3>
              <div className="h-[300px] w-full">
                {/* This would be replaced with an actual chart component */}
                <div className="flex items-end h-[220px] gap-2">
                  {salesData.map((month, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary/80 rounded-t-md" 
                        style={{ height: `${(month.revenue / 18000) * 200}px` }}
                      ></div>
                      <p className="text-xs mt-2 font-medium">{month.month.substring(0, 3)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(month.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Serviços por Tipo</h3>
                <div className="divide-y">
                  {serviceTypes.map((service, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{service.type}</p>
                        <p className="text-sm text-muted-foreground">{service.count} serviços</p>
                      </div>
                      <p className="font-semibold">{formatCurrency(service.revenue)}</p>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Distribuição de Serviços</h3>
                <div className="h-[300px] flex items-center justify-center">
                  {/* This would be replaced with an actual pie chart component */}
                  <div className="w-[200px] h-[200px] rounded-full bg-gray-200 flex items-center justify-center relative">
                    <div 
                      className="absolute w-[200px] h-[200px] rounded-full border-[30px] border-primary"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}
                    ></div>
                    <div 
                      className="absolute w-[200px] h-[200px] rounded-full border-[30px] border-primary/70"
                      style={{ clipPath: 'polygon(100% 0, 100% 35%, 0 100%, 0 65%)' }}
                    ></div>
                    <div 
                      className="absolute w-[200px] h-[200px] rounded-full border-[30px] border-primary/50"
                      style={{ clipPath: 'polygon(100% 35%, 100% 70%, 0 70%, 0 100%)' }}
                    ></div>
                    <div 
                      className="absolute w-[200px] h-[200px] rounded-full border-[30px] border-primary/30"
                      style={{ clipPath: 'polygon(100% 70%, 100% 100%, 0 100%, 0 70%)' }}
                    ></div>
                    <div className="w-[140px] h-[140px] rounded-full bg-card flex items-center justify-center">
                      <p className="text-center text-sm font-medium">
                        Total:<br/>
                        <span className="text-lg font-bold">
                          {serviceTypes.reduce((acc, item) => acc + item.count, 0)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="technicians" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Desempenho de Técnicos</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3">Técnico</th>
                      <th className="text-center pb-3">Serviços</th>
                      <th className="text-center pb-3">Faturamento</th>
                      <th className="text-center pb-3">Avaliação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {technicianData.map((tech, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-3 font-medium">{tech.name}</td>
                        <td className="py-3 text-center">{tech.services}</td>
                        <td className="py-3 text-center">{formatCurrency(tech.revenue)}</td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center">
                            <span className="font-semibold">{tech.rating}</span>
                            <span className="text-yellow-500 ml-1">★</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  );
};

export default Reports;
