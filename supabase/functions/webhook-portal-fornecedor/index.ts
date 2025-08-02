import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPortalRequest {
  portal_pedido_id: string;
  token_portal: string;
  acao: 'confirmacao' | 'alteracao' | 'questionamento' | 'recusa' | 'entrega';
  dados: any;
  timestamp: string;
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

    const webhookData: WebhookPortalRequest = await req.json();
    console.log('Webhook recebido do portal:', webhookData);

    // 1. Validar token e buscar pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .select('*')
      .eq('portal_pedido_id', webhookData.portal_pedido_id)
      .single();

    if (pedidoError || !pedido) {
      throw new Error('Pedido não encontrado ou token inválido');
    }

    // 2. Validar token no histórico
    const historico = pedido.historico_acoes || [];
    const tokenValido = historico.some((acao: any) => 
      acao.token_portal === webhookData.token_portal
    );

    if (!tokenValido) {
      throw new Error('Token de acesso inválido');
    }

    let novoStatus = pedido.status;
    let statusPortal = pedido.status_portal;
    let observacoes = '';

    // 3. Processar ação do fornecedor
    switch (webhookData.acao) {
      case 'confirmacao':
        novoStatus = 'confirmado';
        statusPortal = 'confirmado';
        observacoes = `Pedido confirmado pelo fornecedor. ${webhookData.dados.observacoes || ''}`;
        break;

      case 'alteracao':
        statusPortal = 'alteracao_proposta';
        observacoes = `Fornecedor propôs alterações: ${JSON.stringify(webhookData.dados.alteracoes)}`;
        break;

      case 'questionamento':
        statusPortal = 'questionamento';
        observacoes = `Questionamento do fornecedor: ${webhookData.dados.questionamento}`;
        break;

      case 'recusa':
        novoStatus = 'rejeitado';
        statusPortal = 'recusado';
        observacoes = `Pedido recusado pelo fornecedor. Motivo: ${webhookData.dados.motivo}`;
        break;

      case 'entrega':
        novoStatus = 'entregue';
        statusPortal = 'entregue';
        observacoes = `Entrega realizada. Tracking: ${webhookData.dados.codigo_rastreamento || ''}`;
        break;

      default:
        throw new Error(`Ação não reconhecida: ${webhookData.acao}`);
    }

    // 4. Atualizar pedido
    const { error: updateError } = await supabase
      .from('pedidos')
      .update({
        status: novoStatus,
        status_portal: statusPortal,
        data_resposta_fornecedor: new Date().toISOString(),
        historico_acoes: [
          ...historico,
          {
            timestamp: new Date().toISOString(),
            acao: `fornecedor_${webhookData.acao}`,
            usuario_nome: 'Portal Fornecedor',
            detalhes: observacoes,
            dados_webhook: webhookData.dados
          }
        ]
      })
      .eq('id', pedido.id);

    if (updateError) {
      throw new Error(`Erro ao atualizar pedido: ${updateError.message}`);
    }

    // 5. Log da integração
    await supabase
      .from('logs_integracao_portal')
      .insert({
        pedido_id: pedido.id,
        fornecedor_id: pedido.fornecedor_id,
        operacao: `webhook_${webhookData.acao}`,
        status: 'sucesso',
        dados_recebidos: webhookData,
        portal_pedido_id: webhookData.portal_pedido_id,
        data_operacao: new Date().toISOString()
      });

    // 6. Enviar notificação (se necessário)
    if (['confirmacao', 'recusa', 'entrega'].includes(webhookData.acao)) {
      // Aqui você pode implementar notificação por email/sistema
      console.log(`Notificação: Pedido ${pedido.numero_pedido} - ${webhookData.acao}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processado com sucesso',
        pedido_id: pedido.id,
        novo_status: novoStatus,
        status_portal: statusPortal
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});