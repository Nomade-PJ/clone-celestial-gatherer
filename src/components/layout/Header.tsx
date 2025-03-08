
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BellIcon, 
  SearchIcon, 
  MenuIcon, 
  PlusIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
          >
            <MenuIcon size={20} />
          </button>
          
          <div className="relative">
            <motion.div 
              className={`
                flex items-center bg-accent rounded-full pl-3 pr-4 py-2
                ${searchFocused ? 'ring-2 ring-primary/50' : ''}
              `}
              animate={{ width: searchFocused ? 320 : 250 }}
              transition={{ duration: 0.2 }}
            >
              <SearchIcon size={18} className="text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="ml-2 bg-transparent border-none outline-none w-full text-sm"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </motion.div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <PlusIcon size={16} />
            <span className="hidden sm:inline">Novo atendimento</span>
          </Button>
          
          <button className="p-2 rounded-full hover:bg-muted relative">
            <BellIcon size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            PC
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
