import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { 
  Orcamento, 
  ReservaOrcamentaria, 
  RegraOrcamentaria, 
  SaldoOrcamentario,
  ConfiguracaoControleOrcamentario 
} from '@/types/orcamento';

export const useControleOrcamentario = () => {
  const [loading, setLoading] = useState(false);
  const [regras, setRegras] = useState<RegraOrcamentaria[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoControleOrcamentario>({
    ativo: false,
    modo: 'desativado',
    regras_ativas: [],
    notificacoes_ativas: false,
    emails_notificacao: []
  });
  const { toast } = useToast();

  // Carregar orçamentos
  const carregarOrcamentos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('ano', new Date().getFullYear())
        .order('centro_custo');

      if (error) throw error;
      setOrcamentos((data as Orcamento[]) || []);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os orçamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Carregar regras orçamentárias
  const carregarRegras = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('regras_orcamentarias')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegras((data as RegraOrcamentaria[]) || []);
    } catch (error) {
      console.error('Erro ao carregar regras:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as regras orçamentárias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Verificar se deve aplicar controle orçamentário
  const verificarControleAplicavel = useCallback(async (
    tipoRequisicao: string,
    valorEstimado: number,
    centroCusto: string,
    categoria?: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('should_apply_budget_control', {
        p_tipo_requisicao: tipoRequisicao as any,
        p_valor_estimado: valorEstimado,
        p_centro_custo: centroCusto,
        p_categoria: categoria
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Erro ao verificar controle orçamentário:', error);
      return false;
    }
  }, []);

  // Obter saldo orçamentário
  const obterSaldoOrcamentario = useCallback(async (
    centroCusto: string,
    projeto?: string,
    categoria?: string
  ): Promise<SaldoOrcamentario | null> => {
    try {
      const anoAtual = new Date().getFullYear();
      
      const { data, error } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('ano', anoAtual)
        .eq('centro_custo', centroCusto)
        .eq('projeto', projeto || null)
        .eq('categoria', categoria || null)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        return {
          centro_custo: centroCusto,
          projeto,
          categoria,
          valor_total: 0,
          valor_disponivel: 0,
          valor_reservado: 0,
          valor_utilizado: 0,
          percentual_usado: 0,
          tem_saldo_suficiente: false,
          status_alerta: 'critico'
        };
      }

      const percentualUsado = data.valor_total > 0 ? 
        ((data.valor_utilizado + data.valor_reservado) / data.valor_total) * 100 : 0;

      let statusAlerta: 'normal' | 'atencao' | 'critico' = 'normal';
      if (percentualUsado >= 90) statusAlerta = 'critico';
      else if (percentualUsado >= 80) statusAlerta = 'atencao';

      return {
        centro_custo: centroCusto,
        projeto,
        categoria,
        valor_total: data.valor_total,
        valor_disponivel: data.valor_disponivel,
        valor_reservado: data.valor_reservado,
        valor_utilizado: data.valor_utilizado,
        percentual_usado: percentualUsado,
        tem_saldo_suficiente: data.valor_disponivel > 0,
        status_alerta: statusAlerta
      };
    } catch (error) {
      console.error('Erro ao obter saldo orçamentário:', error);
      return null;
    }
  }, []);

  // Criar reserva orçamentária
  const criarReserva = useCallback(async (
    requisicaoId: string,
    centroCusto: string,
    valorReservado: number,
    categoria?: string,
    projeto?: string
  ): Promise<string | null> => {
    try {
      const { data, error } = await supabase.rpc('create_budget_reservation', {
        p_requisicao_id: requisicaoId,
        p_centro_custo: centroCusto,
        p_valor_reservado: valorReservado,
        p_categoria: categoria,
        p_projeto: projeto
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a reserva orçamentária.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Cancelar reserva
  const cancelarReserva = useCallback(async (
    reservaId: string,
    motivo: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reserva_orcamentaria')
        .update({
          status: 'cancelada',
          motivo_cancelamento: motivo
        })
        .eq('id', reservaId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a reserva orçamentária.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Confirmar reserva (transformar em realizado)
  const confirmarReserva = useCallback(async (
    reservaId: string,
    valorRealizado: number
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reserva_orcamentaria')
        .update({
          status: 'confirmada',
          valor_realizado: valorRealizado,
          data_confirmacao: new Date().toISOString()
        })
        .eq('id', reservaId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao confirmar reserva:', error);
      toast({
        title: "Erro",
        description: "Não foi possível confirmar a reserva orçamentária.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Salvar configuração
  const salvarConfiguracao = useCallback(async (
    novaConfiguracao: ConfiguracaoControleOrcamentario
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      for (const regra of regras) {
        const ativa = novaConfiguracao.regras_ativas.includes(regra.id);
        if (regra.ativo !== ativa) {
          const { error } = await supabase
            .from('regras_orcamentarias')
            .update({ ativo: ativa })
            .eq('id', regra.id);
          
          if (error) throw error;
        }
      }

      setConfiguracao(novaConfiguracao);
      
      toast({
        title: "Sucesso",
        description: "Configuração de controle orçamentário salva.",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [regras, toast]);

  useEffect(() => {
    carregarRegras();
    carregarOrcamentos();
  }, [carregarRegras, carregarOrcamentos]);

  // Atualizar configuração baseada nas regras carregadas
  useEffect(() => {
    if (regras.length > 0) {
      const regrasAtivas = regras.filter(r => r.ativo);
      const temRegraGlobal = regrasAtivas.some(r => r.tipo_condicao === 'global');
      
      setConfiguracao(prev => ({
        ...prev,
        ativo: regrasAtivas.length > 0,
        modo: temRegraGlobal ? 'global' : (regrasAtivas.length > 0 ? 'condicional' : 'desativado'),
        regras_ativas: regrasAtivas.map(r => r.id)
      }));
    }
  }, [regras]);

  return {
    loading,
    regras,
    orcamentos,
    configuracao,
    carregarRegras,
    carregarOrcamentos,
    verificarControleAplicavel,
    obterSaldoOrcamentario,
    criarReserva,
    cancelarReserva,
    confirmarReserva,
    salvarConfiguracao
  };
};
