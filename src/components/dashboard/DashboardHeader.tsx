
import React from 'react';
import { RefreshCwIcon, Loader2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  lastUpdated: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
  formatLastUpdated: (date: Date) => string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  lastUpdated, 
  isRefreshing, 
  onRefresh,
  formatLastUpdated
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Atualizado {formatLastUpdated(lastUpdated)}
        </p>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2Icon size={16} className="animate-spin" />
          ) : (
            <RefreshCwIcon size={16} />
          )}
        </Button>
        <Button onClick={() => navigate('/reports')}>Ver relatórios completos</Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
