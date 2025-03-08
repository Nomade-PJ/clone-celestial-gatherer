
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SearchIcon, 
  PlusIcon, 
  FilterIcon,
  ChevronDownIcon,
  DownloadIcon,
  AlertCircleIcon,
  ShieldAlertIcon,
  CheckIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

// Empty initial data - ready for new entries
const initialInventoryItems: any[] = [];

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Load inventory items from localStorage on component mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('pauloCell_inventory');
    if (savedInventory) {
      setInventoryItems(JSON.parse(savedInventory));
    }
  }, []);

  // Save inventory items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pauloCell_inventory', JSON.stringify(inventoryItems));
  }, [inventoryItems]);
  
  const filteredItems = inventoryItems.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.compatibility?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewItem = () => {
    // Will be implemented in a separate component
    toast({
      title: "Novo item",
      description: "Funcionalidade de adicionar novo item em breve disponível!",
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
            <h1 className="text-2xl font-bold">Estoque</h1>
            <p className="text-muted-foreground">Gerencie o estoque da sua assistência</p>
          </div>
          <Button className="gap-2" onClick={handleNewItem}>
            <PlusIcon size={16} />
            <span>Novo Item</span>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar no estoque..." 
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
              <DownloadIcon size={16} />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <span>Todos os itens</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {inventoryItems.length}
            </span>
          </Button>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <ShieldAlertIcon size={16} className="text-red-600" />
            <span>Estoque crítico</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {inventoryItems.filter(i => i.currentStock === 0).length}
            </span>
          </Button>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <AlertCircleIcon size={16} className="text-amber-500" />
            <span>Estoque baixo</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {inventoryItems.filter(i => i.currentStock > 0 && i.currentStock < i.minimumStock).length}
            </span>
          </Button>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <CheckIcon size={16} className="text-green-600" />
            <span>Estoque adequado</span>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              {inventoryItems.filter(i => i.currentStock >= i.minimumStock).length}
            </span>
          </Button>
        </div>
        
        {filteredItems.length > 0 ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Produto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Compatibilidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Preço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estoque</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Última Compra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {filteredItems.map((item, idx) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.compatibility}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        R$ {item.price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.currentStock === 0 ? (
                            <div className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                              Crítico
                            </div>
                          ) : item.currentStock < item.minimumStock ? (
                            <div className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                              Baixo
                            </div>
                          ) : (
                            <div className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                              OK
                            </div>
                          )}
                          <span className="ml-2">{item.currentStock}</span>
                          <span className="text-muted-foreground text-xs ml-1">/ {item.minimumStock} min</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {item.lastPurchase}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center h-60 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-4">Nenhum item no estoque</p>
            <Button onClick={handleNewItem}>Cadastrar Novo Item</Button>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Inventory;
