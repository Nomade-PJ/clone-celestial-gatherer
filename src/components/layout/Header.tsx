
import React from 'react';
import { 
  BellIcon, 
  MenuIcon, 
  PlusIcon,
  CheckIcon,
  Trash2Icon,
  XIcon,
  LogOutIcon,
  Mail,
  Phone,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useNotifications();
  const [developerModalOpen, setDeveloperModalOpen] = React.useState(false);
  
  const handleNewService = () => {
    navigate('/services/new');
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
      .format(
        -Math.round((Date.now() - timestamp) / (1000 * 60)),
        'minute'
      );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeveloperContact = () => {
    setDeveloperModalOpen(true);
  };

  const handleEmailContact = () => {
    window.open('mailto:josecarlosdev24h@gmail.com', '_blank');
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/5598992022352', '_blank');
  };
  
  const handleGithubContact = () => {
    window.open('https://github.com/Nomade-PJ', '_blank');
  };
  
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
          
          {/* Search bar removed as requested */}
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleNewService}
          >
            <PlusIcon size={16} />
            <span className="hidden sm:inline">Novo atendimento</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-muted relative">
                <BellIcon size={20} />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notificações</span>
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <CheckIcon size={14} />
                    </button>
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Trash2Icon size={14} />
                    </button>
                  </div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-4 px-2 text-center text-sm text-muted-foreground">
                  Nenhuma notificação
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{notification.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <XIcon size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <Badge variant="default" className="mt-1">
                          Nova
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/logo.svg" alt="Logo" className="p-0" />
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDeveloperContact} className="cursor-pointer">
                <Mail className="mr-2 h-4 w-4" />
                <span>Desenvolvedor</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-700">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Developer Contact Modal */}
      <Dialog open={developerModalOpen} onOpenChange={setDeveloperModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contato com o Desenvolvedor</DialogTitle>
            <DialogDescription>
              Entre em contato com o desenvolvedor do projeto.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-3 border rounded-md hover:bg-muted/50 cursor-pointer" onClick={handleEmailContact}>
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">josecarlosdev24h@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 border rounded-md hover:bg-muted/50 cursor-pointer" onClick={handleWhatsAppContact}>
              <Phone className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">(98) 99202-2352</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 border rounded-md hover:bg-muted/50 cursor-pointer" onClick={handleGithubContact}>
              <Github className="h-6 w-6 text-gray-800" />
              <div>
                <p className="font-medium">GitHub</p>
                <p className="text-sm text-muted-foreground">Nomade-PJ</p>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              ©Todos os direitos reserved - NomadePJ/jose Carlos
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setDeveloperModalOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
