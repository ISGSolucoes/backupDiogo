import React from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { AprovadorDashboard } from "@/components/requisicoes/AprovadorDashboard";
import { GestorDashboard } from "@/components/requisicoes/GestorDashboard";
import { Loader2, ShieldAlert } from "lucide-react";

const CentralAprovacao = () => {
  const { profileData, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-slate-600">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Erro ao carregar perfil do usuário</p>
          <p className="text-slate-500 text-sm">Tente recarregar a página</p>
        </div>
      </div>
    );
  }

  // Verificar se tem permissão de aprovador
  if (!['aprovador_nivel_1', 'aprovador_nivel_2', 'gestor'].includes(profileData.profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Acesso Negado</h2>
          <p className="text-slate-600">Você não tem permissão para acessar a Central de Aprovação</p>
          <p className="text-sm text-slate-500 mt-2">
            Esta área é restrita para aprovadores e gestores
          </p>
        </div>
      </div>
    );
  }

  // Renderizar dashboard baseado no perfil
  switch (profileData.profile) {
    case 'aprovador_nivel_1':
    case 'aprovador_nivel_2':
      return <AprovadorDashboard profileData={profileData} />;
    
    case 'gestor':
      return <GestorDashboard profileData={profileData} />;
    
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600">Perfil não reconhecido</p>
          </div>
        </div>
      );
  }
};

export default CentralAprovacao;