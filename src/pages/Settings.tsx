
import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  BuildingIcon, 
  BellIcon, 
  LockIcon,
  PaintbrushIcon,
  DatabaseIcon,
  LanguagesIcon,
  HelpCircleIcon
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Settings: React.FC = () => {
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
          <p className="text-muted-foreground">Gerencie as configurações do seu sistema</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-6 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <UserIcon size={20} />
              </div>
              <h3 className="font-semibold">Perfil de Usuário</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Informações pessoais, foto de perfil e preferências
            </p>
            <div className="mt-auto">
              <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-full">
                Administrador
              </span>
            </div>
          </Card>
          
          <Card className="p-6 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <BuildingIcon size={20} />
              </div>
              <h3 className="font-semibold">Informações da Empresa</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Dados da empresa, logo, endereço e contatos
            </p>
            <div className="mt-auto">
              <span className="text-xs bg-green-100 text-green-600 py-1 px-2 rounded-full">
                Completo
              </span>
            </div>
          </Card>
          
          <Card className="p-6 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <BellIcon size={20} />
              </div>
              <h3 className="font-semibold">Notificações</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Configurações de alertas, emails e lembretes
            </p>
            <div className="mt-auto">
              <span className="text-xs bg-blue-100 text-blue-600 py-1 px-2 rounded-full">
                Personalizado
              </span>
            </div>
          </Card>
          
          <Card className="p-6 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <LockIcon size={20} />
              </div>
              <h3 className="font-semibold">Segurança</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Senha, autenticação de dois fatores e logs de acesso
            </p>
            <div className="mt-auto">
              <span className="text-xs bg-amber-100 text-amber-600 py-1 px-2 rounded-full">
                Verificar 2FA
              </span>
            </div>
          </Card>
          
          <Card className="p-6 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <PaintbrushIcon size={20} />
              </div>
              <h3 className="font-semibold">Aparência</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tema, cores e personalização da interface
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm">Tema Escuro</span>
              <Switch id="theme-mode" />
            </div>
          </Card>
          
          <Card className="p-6 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <DatabaseIcon size={20} />
              </div>
              <h3 className="font-semibold">Backup & Dados</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Backup, exportação e importação de dados
            </p>
            <div className="mt-auto">
              <span className="text-xs bg-green-100 text-green-600 py-1 px-2 rounded-full">
                Último backup: Hoje
              </span>
            </div>
          </Card>
          
          <Card className="p-6 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <LanguagesIcon size={20} />
              </div>
              <h3 className="font-semibold">Idiomas</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Configurações de idioma e formatos regionais
            </p>
            <div className="mt-auto flex items-center gap-2">
              <span className="font-medium text-sm">Português - BR</span>
            </div>
          </Card>
          
          <Card className="p-6 flex flex-col hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <HelpCircleIcon size={20} />
              </div>
              <h3 className="font-semibold">Ajuda & Suporte</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Documentação, tutoriais e contato com suporte
            </p>
            <div className="mt-auto">
              <span className="text-xs bg-blue-100 text-blue-600 py-1 px-2 rounded-full">
                Disponível 24/7
              </span>
            </div>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Settings;
