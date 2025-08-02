import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CriarPORequest {
  origem: 'cotacao' | 'requisicao' | 'contrato' | 'manual'
  origemId?: string
  fornecedor?: {
    id: string
    cnpj: string
    nome: string
  }
  dados: {
    centroCusto?: string
    projeto?: string
    dataEntregaPrevista?: string
    observacoes?: string
  }
  itens: Array<{
    descricao: string
    especificacao?: string
    quantidade: number
    unidade: string
    precoUnitario?: number
    codigoProduto?: string
    categoria?: string
    centroCusto?: string
  }>
  usuarioId?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const requestData = await req.json() as CriarPORequest

    console.log('Criando PO automaticamente:', {
      origem: requestData.origem,
      origemId: requestData.origemId,
      fornecedor: requestData.fornecedor?.nome,
      quantidadeItens: requestData.itens.length
    })

    // Preparar dados para a função SQL
    const dadosPedido = {
      origem_demanda: requestData.origem,
      fornecedor_id: requestData.fornecedor?.id || null,
      fornecedor_cnpj: requestData.fornecedor?.cnpj || null,
      fornecedor_nome: requestData.fornecedor?.nome || null,
      centro_custo: requestData.dados.centroCusto || null,
      projeto: requestData.dados.projeto || null,
      data_entrega_prevista: requestData.dados.dataEntregaPrevista || null,
      observacoes: requestData.dados.observacoes || null,
      usuario_id: requestData.usuarioId || null
    }

    // Preparar itens em formato JSONB
    const itensJsonb = requestData.itens.map(item => ({
      descricao: item.descricao,
      especificacao: item.especificacao || '',
      quantidade: item.quantidade,
      unidade: item.unidade,
      preco_unitario: item.precoUnitario || 0,
      codigo_produto: item.codigoProduto || '',
      categoria: item.categoria || '',
      centro_custo: item.centroCusto || requestData.dados.centroCusto || ''
    }))

    // Chamar função SQL para criar o PO
    const { data: pedidoId, error: errorCriarPO } = await supabaseClient.rpc('criar_po_automatico', {
      p_origem: requestData.origem,
      p_origem_id: requestData.origemId || crypto.randomUUID(),
      p_fornecedor_id: dadosPedido.fornecedor_id,
      p_fornecedor_cnpj: dadosPedido.fornecedor_cnpj,
      p_fornecedor_nome: dadosPedido.fornecedor_nome,
      p_solicitante_id: dadosPedido.usuario_id,
      p_centro_custo: dadosPedido.centro_custo,
      p_projeto: dadosPedido.projeto,
      p_data_entrega_prevista: dadosPedido.data_entrega_prevista,
      p_itens: JSON.stringify(itensJsonb),
      p_observacoes: dadosPedido.observacoes
    })

    if (errorCriarPO) {
      console.error('Erro ao criar PO:', errorCriarPO)
      throw errorCriarPO
    }

    console.log('PO criado com sucesso:', pedidoId)

    // Buscar dados completos do pedido criado
    const { data: pedidoCriado, error: errorBuscar } = await supabaseClient
      .from('pedidos')
      .select(`
        *,
        itens_pedido (*)
      `)
      .eq('id', pedidoId)
      .single()

    if (errorBuscar) {
      console.error('Erro ao buscar pedido criado:', errorBuscar)
      throw errorBuscar
    }

    // Enviar notificação (opcional - pode ser implementado depois)
    try {
      // Aqui você pode adicionar lógica de notificação
      console.log('Notificação enviada para criação do PO:', pedidoId)
    } catch (notificationError) {
      console.warn('Erro ao enviar notificação:', notificationError)
      // Não falhar por causa de notificação
    }

    return new Response(JSON.stringify({
      success: true,
      pedidoId: pedidoId,
      pedido: pedidoCriado,
      message: `Pedido criado automaticamente via ${requestData.origem}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Erro na função criar-po-automatico:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro interno do servidor',
      details: error
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})