
import { useAuth } from '@/contexts/AuthContext';

export type UserProfile = 'solicitante' | 'aprovador_nivel_1' | 'aprovador_nivel_2' | 'gestor';

export interface UserProfileData {
  profile: UserProfile;
  name: string;
  area: string;
  pendingApprovals: number;
  myRequests: number;
  canCreateRequests: boolean;
  canApproveLevel1: boolean;
  canApproveLevel2: boolean;
  canViewAll: boolean;
}

export const useUserProfile = () => {
  const { profile, loading } = useAuth();
  
  // Converter perfil do AuthContext para formato legado
  const profileData: UserProfileData | null = profile ? {
    profile: (profile.roles[0] as UserProfile) || 'solicitante',
    name: profile.nome_completo,
    area: profile.area,
    pendingApprovals: 0, // Será implementado posteriormente
    myRequests: 0, // Será implementado posteriormente  
    canCreateRequests: profile.pode_criar_requisicoes,
    canApproveLevel1: profile.pode_aprovar_nivel_1,
    canApproveLevel2: profile.pode_aprovar_nivel_2,
    canViewAll: profile.pode_ver_todos
  } : null;

  return { profileData, loading };
};
