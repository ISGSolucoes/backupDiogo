import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PedidoPDFRequest {
  pedido_id: string;
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

    const { pedido_id }: PedidoPDFRequest = await req.json();

    if (!pedido_id) {
      return new Response(
        JSON.stringify({ error: 'pedido_id é obrigatório' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Buscar dados do pedido com itens
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .select(`
        *,
        itens:itens_pedido(*)
      `)
      .eq('id', pedido_id)
      .single();

    if (pedidoError || !pedido) {
      console.error('Erro ao buscar pedido:', pedidoError);
      return new Response(
        JSON.stringify({ error: 'Pedido não encontrado' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Gerar HTML do PDF
    const htmlContent = gerarHTMLPedido(pedido);

    // Simular geração de PDF (em produção, usar biblioteca como Puppeteer)
    const pdfBuffer = new TextEncoder().encode(htmlContent);

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Pedido-${pedido.numero_pedido}.pdf"`
      }
    });

  } catch (error) {
    console.error('Erro na geração do PDF:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function gerarHTMLPedido(pedido: any): string {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const itensHTML = pedido.itens?.map((item: any) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.sequencia}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.descricao}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.quantidade}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.unidade}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${formatarMoeda(item.preco_unitario)}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${formatarMoeda(item.valor_total)}</td>
    </tr>
  `).join('') || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pedido ${pedido.numero_pedido}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .info-section { margin-bottom: 20px; }
        .info-row { display: flex; margin-bottom: 10px; }
        .info-label { font-weight: bold; width: 150px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { font-weight: bold; font-size: 1.2em; text-align: right; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>PEDIDO DE COMPRA</h1>
        <h2>${pedido.numero_pedido}</h2>
      </div>

      <div class="info-section">
        <h3>Informações Gerais</h3>
        <div class="info-row">
          <span class="info-label">Status:</span>
          <span>${pedido.status}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Data Criação:</span>
          <span>${formatarData(pedido.data_criacao)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Fornecedor:</span>
          <span>${pedido.fornecedor_razao_social || pedido.fornecedor_id}</span>
        </div>
        <div class="info-row">
          <span class="info-label">CNPJ:</span>
          <span>${pedido.fornecedor_cnpj || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Centro de Custo:</span>
          <span>${pedido.centro_custo || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Data Entrega:</span>
          <span>${pedido.data_entrega_prevista ? formatarData(pedido.data_entrega_prevista) : 'N/A'}</span>
        </div>
      </div>

      <h3>Itens do Pedido</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Qtd</th>
            <th>Unidade</th>
            <th>Preço Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itensHTML}
        </tbody>
      </table>

      <div class="total">
        <p>VALOR TOTAL: ${formatarMoeda(pedido.valor_total)}</p>
      </div>

      ${pedido.observacoes ? `
        <div class="info-section">
          <h3>Observações</h3>
          <p>${pedido.observacoes}</p>
        </div>
      ` : ''}

      <div style="margin-top: 50px; font-size: 0.8em; color: #666;">
        <p>Documento gerado automaticamente em ${new Date().toLocaleString('pt-BR')}</p>
      </div>
    </body>
    </html>
  `;
}