import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConviteInfo {
  id: string;
  cliente_nome: string;
  cliente_codigo: string;
  mensagem_personalizada?: string;
  categorias_solicitadas?: string[];
}

interface UseDeteccaoOrigemResult {
  origem: 'convite' | 'auto_registro';
  convite: ConviteInfo | null;
  carregando: boolean;
  erro: string | null;
}

export function useDeteccaoOrigem(token?: string | null): UseDeteccaoOrigemResult {
  const [origem, setOrigem] = useState<'convite' | 'auto_registro'>('auto_registro');
  const [convite, setConvite] = useState<ConviteInfo | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setOrigem('auto_registro');
      return;
    }

    async function buscarConvite() {
      setCarregando(true);
      setErro(null);

      try {
        const { data, error } = await supabase
          .from('convites_fornecedor')
          .select('*')
          .eq('token_unico', token)
          .eq('status', 'enviado')
          .single();

        if (error) {
          console.error('Erro ao buscar convite:', error);
          setErro('Token de convite inválido ou expirado');
          setOrigem('auto_registro');
          return;
        }

        // Verificar se o convite não expirou
        const dataExpiracao = new Date(data.data_expiracao);
        if (dataExpiracao < new Date()) {
          setErro('Este convite expirou');
          setOrigem('auto_registro');
          return;
        }

        setOrigem('convite');
        setConvite({
          id: data.id,
          cliente_nome: data.cliente_nome || data.nome_empresa,
          cliente_codigo: data.cliente_codigo || 'CLIENTE',
          mensagem_personalizada: data.mensagem_personalizada,
          categorias_solicitadas: data.categorias_solicitadas
        });

        // Registrar visualização do convite
        await supabase
          .from('convites_fornecedor')
          .update({
            data_visualizacao: new Date().toISOString(),
            status: 'visualizado'
          })
          .eq('id', data.id);

      } catch (error) {
        console.error('Erro inesperado:', error);
        setErro('Erro ao processar convite');
        setOrigem('auto_registro');
      } finally {
        setCarregando(false);
      }
    }

    buscarConvite();
  }, [token]);

  return {
    origem,
    convite,
    carregando,
    erro
  };
}