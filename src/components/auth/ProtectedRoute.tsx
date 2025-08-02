
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles 
}) => {
  const { user, profile, loading } = useAuth();
  
  console.log("🛡️ ProtectedRoute:", { user: !!user, profile: !!profile, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Se há roles requeridos, verificar se o usuário tem algum deles
  if (requiredRoles && requiredRoles.length > 0 && profile) {
    const hasRequiredRole = requiredRoles.some(role => 
      profile.roles.includes(role)
    );
    
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Acesso Negado
            </h2>
            <p className="text-muted-foreground">
              Você não tem permissão para acessar esta área
            </p>
          </div>
        </div>
      );
    }
  }

  return <AppLayout>{children}</AppLayout>;
};
