
import { useState, useEffect } from 'react';

export interface FeedPreferences {
  filtros: {
    tipos: string[];
    relevancia: string[];
    periodo: number; // dias
    autores: string[];
  };
  layout: {
    compacto: boolean;
    itemsPorPagina: number;
    altura: number;
  };
  ordenacao: {
    criterio: 'tempo' | 'relevancia' | 'tipo';
    direcao: 'asc' | 'desc';
    tiposOrdem: string[];
  };
}

const defaultPreferences: FeedPreferences = {
  filtros: {
    tipos: ['acao', 'atualizacao', 'contato', 'economia', 'alerta', 'sucesso'],
    relevancia: ['alta', 'media', 'baixa'],
    periodo: 7,
    autores: []
  },
  layout: {
    compacto: false,
    itemsPorPagina: 6,
    altura: 400
  },
  ordenacao: {
    criterio: 'tempo',
    direcao: 'desc',
    tiposOrdem: ['economia', 'alerta', 'sucesso', 'acao', 'contato', 'atualizacao']
  }
};

export const useFeedPreferences = () => {
  const [preferences, setPreferences] = useState<FeedPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar preferências do localStorage
    const savedPreferences = localStorage.getItem('feed-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updatePreferences = (newPreferences: Partial<FeedPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('feed-preferences', JSON.stringify(updated));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('feed-preferences');
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isLoading
  };
};
