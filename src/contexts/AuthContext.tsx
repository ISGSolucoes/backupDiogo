
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  nome_completo: string;
  email: string;
  area: string;
  cargo?: string;
  centro_custo?: string;
  telefone?: string;
  avatar_url?: string;
  status: 'ativo' | 'inativo' | 'pendente_ativacao';
  roles: string[];
  pode_aprovar_nivel_1: boolean;
  pode_aprovar_nivel_2: boolean;
  limite_aprovacao?: number;
  pode_criar_requisicoes: boolean;
  pode_ver_todos: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('=== AuthContext Debug ===');
  console.log('User:', user?.id, user?.email);
  console.log('Session:', session?.user?.id);
  console.log('Profile:', profile?.nome_completo);
  console.log('Loading:', loading);

  // Função para buscar perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .rpc('get_user_profile', { _user_id: userId })
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      console.log('Profile fetched:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) return { error };

      // Atualizar perfil local
      if (profile) {
        setProfile({ ...profile, ...updates });
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Função para recarregar perfil
  const refreshProfile = async () => {
    if (!user) return;
    
    const profileData = await fetchProfile(user.id);
    if (profileData) {
      setProfile(profileData);
    }
  };

  // Configurar listener de autenticação
  useEffect(() => {
    console.log('Setting up auth listener...');
    
    // Configurar listener PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Usar setTimeout para evitar deadlock
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // DEPOIS verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });

    if (error) {
      toast.error(`Erro no cadastro: ${error.message}`);
    } else {
      toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.');
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Sign in error:', error);
      toast.error(`Erro no login: ${error.message}`);
    } else {
      console.log('Sign in successful');
    }

    return { error };
  };

  const signOut = async () => {
    console.log('Signing out...');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    toast.success('Logout realizado com sucesso');
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
