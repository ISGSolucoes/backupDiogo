
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useModules } from '@/hooks/useModules';
import { Module } from '@/types/modular';

interface ModuleContextType {
  activeModules: Module[];
  isModuleActive: (moduleType: string) => boolean;
  getModuleConfig: (moduleType: string) => Record<string, any> | null;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

interface ModuleProviderProps {
  children: ReactNode;
}

export const ModuleProvider = ({ children }: ModuleProviderProps) => {
  const { modules, loading } = useModules();
  const [activeModules, setActiveModules] = useState<Module[]>([]);

  useEffect(() => {
    if (!loading) {
      const active = modules.filter(module => module.status === 'ativo');
      setActiveModules(active);
    }
  }, [modules, loading]);

  const isModuleActive = (moduleType: string): boolean => {
    return activeModules.some(module => module.type === moduleType);
  };

  const getModuleConfig = (moduleType: string): Record<string, any> | null => {
    const module = activeModules.find(m => m.type === moduleType);
    return module?.config_schema || null;
  };

  const value = {
    activeModules,
    isModuleActive,
    getModuleConfig
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModuleContext = () => {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModuleContext deve ser usado dentro de um ModuleProvider');
  }
  return context;
};
