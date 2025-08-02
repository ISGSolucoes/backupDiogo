
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Bell, UserCircle, Menu, Crown, Users, Shield, Package, Flag, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';

interface NavItem {
  nome: string;
  rota: string;
}

interface NavigationBarProps {
  abas: NavItem[];
}

export const NavigationBar = ({ abas }: NavigationBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const { isAdmin } = usePermissions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (rota: string) => {
    navigate(rota);
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const handleSettingsClick = () => {
    navigate('/configuracoes');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActive = (rota: string) => {
    return location.pathname === rota;
  };

  // Use apenas as abas passadas como props
  const extendedAbas = abas;

  return (
    <nav className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center min-w-0 flex-1">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-xl sm:text-2xl lg:text-3xl">
                Source<span className="text-secondary">Xpress</span>
              </span>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden lg:flex ml-6 space-x-1 flex-1">
              {extendedAbas.map((item) => (
                <button
                  key={item.rota}
                  onClick={() => handleNavigation(item.rota)}
                  className={cn(
                    "nav-item whitespace-nowrap",
                    isActive(item.rota) 
                      ? "nav-item-active" 
                      : "nav-item-inactive"
                  )}
                >
                  {item.nome}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <UserCircle className="h-6 w-6" />
                  {isAdmin() && (
                    <Crown className="h-3 w-3 absolute -top-1 -right-1 text-amber-500" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.nome_completo || 'Usuário'}
                    </p>
                    {isAdmin() && (
                      <p className="text-xs font-bold leading-none text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                        ADMIN
                      </p>
                    )}
                    {profile?.area && (
                      <p className="text-xs leading-none text-muted-foreground font-medium">
                        {profile.area}
                      </p>
                    )}
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                
                {/* Admin Menu - Only visible for admin users */}
                {isAdmin() && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/gerenciar-usuarios')}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Gerenciar Usuários</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/gerenciar-permissoes')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Permissões</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/gerenciar-modulos')}>
                      <Package className="mr-2 h-4 w-4" />
                      <span>Módulos</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/configurar-features')}>
                      <Flag className="mr-2 h-4 w-4" />
                      <span>Feature Flags</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/painel-governanca')}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Governança</span>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuItem>
                  <span>Suporte</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg z-10 absolute w-full">
            {extendedAbas.map((item) => (
              <button
                key={item.rota}
                onClick={() => handleNavigation(item.rota)}
                className={cn(
                  "block w-full text-left nav-item",
                  isActive(item.rota)
                    ? "nav-item-active"
                    : "nav-item-inactive"
                )}
              >
                {item.nome}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
