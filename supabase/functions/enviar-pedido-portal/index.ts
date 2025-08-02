import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnviarPedidoRequest {
  pedido_id: string;
  fornecedor_id: string;
  webhook_callback?: string;
  prazo_resposta_dias?: number;
  permite_alteracao?: boolean;
  permite_questionamento?: boolean;
  mensagem_personalizada?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { pedido_id, fornecedor_id, webhook_callback, prazo_resposta_dias = 5, permite_alteracao = true, permite_questionamento = true, mensagem_personalizada }: EnviarPedidoRequest = await req.json();

    console.log('Iniciando envio de pedido para portal:', { pedido_id, fornecedor_id });

    // 1. Buscar dados completos do pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .select(`
        *,
        itens_pedido (*),
        profiles!pedidos_criado_por_fkey (nome_completo, email)
      `)
      .eq('id', pedido_id)
      .single();

    if (pedidoError || !pedido) {
      throw new Error('Pedido não encontrado');
    }

    // 2. Buscar dados do fornecedor (assumindo que temos uma tabela de fornecedores)
    const { data: fornecedor, error: fornecedorError } = await supabase
      .from('fornecedores')
      .select('*')
      .eq('id', fornecedor_id)
      .single();

    if (fornecedorError) {
      console.warn('Fornecedor não encontrado na base, usando dados do pedido');
    }

    // 3. Gerar token de acesso para o fornecedor
    const token_portal = crypto.randomUUID();
    const token_expira_em = new Date();
    token_expira_em.setDate(token_expira_em.getDate() + prazo_resposta_dias);

    // 4. Preparar payload para o portal externo
    const portalPayload = {
      pedido: {
        id: pedido.id,
        numero: pedido.numero_pedido,
        data_emissao: pedido.data_emissao,
        data_entrega_prevista: pedido.data_entrega_prevista,
        valor_total: pedido.valor_total,
        moeda: pedido.moeda,
        observacoes: pedido.observacoes,
        centro_custo: pedido.centro_custo,
        local_entrega: pedido.local_entrega,
        condicao_pagamento: pedido.condicao_pagamento,
        tipo_frete: pedido.tipo_frete,
        mensagem_personalizada
      },
      itens: pedido.itens_pedido.map((item: any) => ({
        sequencia: item.sequencia,
        codigo_produto: item.codigo_produto,
        descricao: item.descricao,
        especificacao: item.especificacao,
        quantidade: item.quantidade,
        unidade: item.unidade,
        preco_unitario: item.preco_unitario,
        valor_total: item.valor_total,
        data_entrega_item: item.data_entrega_item,
        observacoes: item.observacoes
      })),
      solicitante: {
        nome: pedido.profiles?.nome_completo,
        email: pedido.profiles?.email
      },
      fornecedor: {
        id: fornecedor_id,
        cnpj: pedido.fornecedor_cnpj,
        razao_social: pedido.fornecedor_razao_social
      },
      configuracoes: {
        prazo_resposta_dias,
        permite_alteracao,
        permite_questionamento,
        webhook_callback: webhook_callback || `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-portal-fornecedor`,
        token_acesso: token_portal,
        expira_em: token_expira_em.toISOString()
      }
    };

    // 5. Simular envio para portal externo (substituir por API real)
    console.log('Enviando para portal externo:', portalPayload);
    
    // Simular chamada HTTP para portal real
    // const portalResponse = await fetch('https://api.portal-fornecedor.com/v1/pedidos', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${Deno.env.get('PORTAL_API_KEY')}`
    //   },
    //   body: JSON.stringify(portalPayload)
    // });

    // Simular resposta de sucesso
    const portal_pedido_id = `PRT-${pedido.numero_pedido}-${Date.now()}`;
    const portal_url = `https://portal.fornecedor.com/pedido/${portal_pedido_id}`;

    // 6. Registrar integração na base
    const { error: integracaoError } = await supabase
      .from('pedidos')
      .update({
        data_envio_portal: new Date().toISOString(),
        portal_pedido_id,
        status_portal: 'enviado',
        historico_acoes: pedido.historico_acoes ? [
          ...pedido.historico_acoes,
          {
            timestamp: new Date().toISOString(),
            acao: 'pedido_enviado_portal',
            usuario_nome: 'Sistema',
            detalhes: `Pedido enviado para portal do fornecedor ${pedido.fornecedor_razao_social}`,
            portal_pedido_id,
            token_portal
          }
        ] : [{
          timestamp: new Date().toISOString(),
          acao: 'pedido_enviado_portal',
          usuario_nome: 'Sistema',
          detalhes: `Pedido enviado para portal do fornecedor ${pedido.fornecedor_razao_social}`,
          portal_pedido_id,
          token_portal
        }]
      })
      .eq('id', pedido_id);

    if (integracaoError) {
      throw new Error(`Erro ao registrar integração: ${integracaoError.message}`);
    }

    // 7. Inserir log de integração
    await supabase
      .from('logs_integracao_portal')
      .insert({
        pedido_id,
        fornecedor_id,
        operacao: 'envio_pedido',
        status: 'sucesso',
        dados_enviados: portalPayload,
        portal_pedido_id,
        token_portal,
        tentativa: 1,
        data_operacao: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Pedido enviado com sucesso para o portal',
        dados: {
          portal_pedido_id,
          portal_url,
          token_portal,
          expira_em: token_expira_em.toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erro ao enviar pedido para portal:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});