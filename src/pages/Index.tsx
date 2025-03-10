import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SmartphoneIcon, WrenchIcon, UsersIcon, ShieldCheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100">
      <motion.div 
        className="text-center max-w-3xl px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <SmartphoneIcon size={40} />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4 text-primary">PauloCell</h1>
        <p className="text-2xl text-gray-700 mb-6">Sistema de Gerenciamento para Assistência Técnica</p>
        <p className="text-lg text-muted-foreground mb-8">
          Gerencie clientes, dispositivos e serviços de reparo com facilidade e eficiência.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div 
            className="bg-card rounded-xl border border-border p-4 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-center mb-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <SmartphoneIcon size={24} />
              </div>
            </div>
            <h3 className="font-medium mb-1">Dispositivos</h3>
            <p className="text-sm text-muted-foreground">Cadastre e acompanhe o histórico de dispositivos</p>
          </motion.div>

          <motion.div 
            className="bg-card rounded-xl border border-border p-4 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-center mb-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <WrenchIcon size={24} />
              </div>
            </div>
            <h3 className="font-medium mb-1">Serviços</h3>
            <p className="text-sm text-muted-foreground">Gerencie ordens de serviço e reparos</p>
          </motion.div>

          <motion.div 
            className="bg-card rounded-xl border border-border p-4 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-center mb-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <UsersIcon size={24} />
              </div>
            </div>
            <h3 className="font-medium mb-1">Clientes</h3>
            <p className="text-sm text-muted-foreground">Mantenha um cadastro completo de clientes</p>
          </motion.div>
        </div>

        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/login')}
            className="px-12 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Entrar no Sistema
          </Button>
        </div>
      </motion.div>

      <div className="mt-16 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} PauloCell - Todos os direitos reservados</p>
      </div>
    </div>
  );
};

export default Index;
