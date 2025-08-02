
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AcaoRecomendada } from "@/types/acoes-recomendadas";
import { toast } from "sonner";

export const useAcoesRecomendadas = () => {
  return useQuery({
    queryKey: ['acoes-recomendadas'],
    queryFn: async (): Promise<AcaoRecomendada[]> => {
      const { data, error } = await supabase
        .from('acoes_recomendadas')
        .select('*')
        .eq('executada', false)
        .order('prioridade', { ascending: true })
        .order('sugerida_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar ações recomendadas:', error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useExecutarAcao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, executada_por }: { id: string; executada_por: string }) => {
      const { data, error } = await supabase
        .from('acoes_recomendadas')
        .update({
          executada: true,
          executada_em: new Date().toISOString(),
          executada_por,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao executar ação:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acoes-recomendadas'] });
      toast.success('Ação executada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao executar ação:', error);
      toast.error('Erro ao executar ação');
    },
  });
};

export const useReprocessarIA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Simular reprocessamento da IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acoes-recomendadas'] });
      toast.success('IA reprocessada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao reprocessar IA');
    },
  });
};
