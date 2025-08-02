import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RelatorioRequest {
  filtros?: any;
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

    const { filtros }: RelatorioRequest = await req.json();

    // Buscar dados para o relatório
    let query = supabase
      .from('pedidos')
      .select(`
        numero_pedido,
        status,
        tipo,
        fornecedor_razao_social,
        fornecedor_cnpj,
        valor_total,
        data_criacao,
        data_entrega_prevista,
        centro_custo,
        moeda
      `)
      .order('data_criacao', { ascending: false });

    // Aplicar filtros
    if (filtros?.status) query = query.eq('status', filtros.status);
    if (filtros?.tipo) query = query.eq('tipo', filtros.tipo);
    if (filtros?.dataInicio) query = query.gte('data_criacao', filtros.dataInicio);
    if (filtros?.dataFim) query = query.lte('data_criacao', filtros.dataFim);
    if (filtros?.valorMinimo) query = query.gte('valor_total', filtros.valorMinimo);
    if (filtros?.valorMaximo) query = query.lte('valor_total', filtros.valorMaximo);

    const { data: pedidos, error } = await query;

    if (error) {
      console.error('Erro ao buscar pedidos:', error);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar pedidos' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Calcular estatísticas
    const stats = calcularEstatisticas(pedidos || []);

    // Gerar HTML do relatório
    const htmlContent = gerarHTMLRelatorio(pedidos || [], stats, filtros);

    // Simular PDF (em produção usar Puppeteer)
    const pdfBuffer = new TextEncoder().encode(htmlContent);

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Relatorio-Pedidos-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    });

  } catch (error) {
    console.error('Erro na geração do relatório:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function calcularEstatisticas(pedidos: any[]) {
  const total = pedidos.length;
  const valorTotal = pedidos.reduce((sum, p) => sum + (p.valor_total || 0), 0);
  
  const porStatus = pedidos.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const porTipo = pedidos.reduce((acc, p) => {
    acc[p.tipo] = (acc[p.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    valorTotal,
    valorMedio: total > 0 ? valorTotal / total : 0,
    porStatus,
    porTipo
  };
}

function gerarHTMLRelatorio(pedidos: any[], stats: any, filtros: any): string {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const statusLabels: Record<string, string> = {
    'rascunho': 'Rascunho',
    'aguardando_aprovacao': 'Aguardando Aprovação',
    'aprovado': 'Aprovado',
    'enviado': 'Enviado',
    'confirmado': 'Confirmado',
    'cancelado': 'Cancelado'
  };

  const tipoLabels: Record<string, string> = {
    'material': 'Material',
    'servico': 'Serviço',
    'bem_permanente': 'Bem Permanente'
  };

  const pedidosHTML = pedidos.slice(0, 50).map((pedido) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 6px; font-size: 12px;">${pedido.numero_pedido}</td>
      <td style="border: 1px solid #ddd; padding: 6px; font-size: 12px;">${statusLabels[pedido.status] || pedido.status}</td>
      <td style="border: 1px solid #ddd; padding: 6px; font-size: 12px;">${tipoLabels[pedido.tipo] || pedido.tipo}</td>
      <td style="border: 1px solid #ddd; padding: 6px; font-size: 12px;">${pedido.fornecedor_razao_social || 'N/A'}</td>
      <td style="border: 1px solid #ddd; padding: 6px; font-size: 12px; text-align: right;">${formatarMoeda(pedido.valor_total)}</td>
      <td style="border: 1px solid #ddd; padding: 6px; font-size: 12px; text-align: center;">${formatarData(pedido.data_criacao)}</td>
    </tr>
  `).join('');

  const statusHTML = Object.entries(stats.porStatus).map(([status, count]) => `
    <li style="margin: 5px 0;">
      ${statusLabels[status] || status}: <strong>${count} pedidos</strong>
    </li>
  `).join('');

  const tipoHTML = Object.entries(stats.porTipo).map(([tipo, count]) => `
    <li style="margin: 5px 0;">
      ${tipoLabels[tipo] || tipo}: <strong>${count} pedidos</strong>
    </li>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Relatório de Pedidos</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          font-size: 14px;
          line-height: 1.4;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .stats-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 20px; 
          margin-bottom: 30px; 
        }
        .stats-card { 
          border: 1px solid #ddd; 
          padding: 15px; 
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        .stats-card h3 { 
          margin-top: 0; 
          color: #333; 
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px; 
          font-size: 12px;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 6px; 
          text-align: left; 
        }
        th { 
          background-color: #f2f2f2; 
          font-weight: bold;
        }
        .big-number { 
          font-size: 24px; 
          font-weight: bold; 
          color: #2563eb; 
        }
        .filtros {
          background-color: #f0f0f0;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>RELATÓRIO DE PEDIDOS DE COMPRA</h1>
        <p>Gerado em ${new Date().toLocaleString('pt-BR')}</p>
      </div>

      ${filtros ? `
        <div class="filtros">
          <h3>Filtros Aplicados:</h3>
          <ul>
            ${filtros.status ? `<li><strong>Status:</strong> ${statusLabels[filtros.status] || filtros.status}</li>` : ''}
            ${filtros.tipo ? `<li><strong>Tipo:</strong> ${tipoLabels[filtros.tipo] || filtros.tipo}</li>` : ''}
            ${filtros.dataInicio ? `<li><strong>Data Início:</strong> ${formatarData(filtros.dataInicio)}</li>` : ''}
            ${filtros.dataFim ? `<li><strong>Data Fim:</strong> ${formatarData(filtros.dataFim)}</li>` : ''}
            ${filtros.valorMinimo ? `<li><strong>Valor Mínimo:</strong> ${formatarMoeda(filtros.valorMinimo)}</li>` : ''}
            ${filtros.valorMaximo ? `<li><strong>Valor Máximo:</strong> ${formatarMoeda(filtros.valorMaximo)}</li>` : ''}
          </ul>
        </div>
      ` : ''}

      <div class="stats-grid">
        <div class="stats-card">
          <h3>Resumo Geral</h3>
          <p>Total de Pedidos: <span class="big-number">${stats.total}</span></p>
          <p>Valor Total: <span class="big-number">${formatarMoeda(stats.valorTotal)}</span></p>
          <p>Valor Médio: <strong>${formatarMoeda(stats.valorMedio)}</strong></p>
        </div>

        <div class="stats-card">
          <h3>Por Status</h3>
          <ul style="list-style: none; padding: 0;">
            ${statusHTML}
          </ul>
        </div>

        <div class="stats-card">
          <h3>Por Tipo</h3>
          <ul style="list-style: none; padding: 0;">
            ${tipoHTML}
          </ul>
        </div>

        <div class="stats-card">
          <h3>Informações do Relatório</h3>
          <p>Registros encontrados: <strong>${stats.total}</strong></p>
          <p>Registros exibidos: <strong>${Math.min(50, stats.total)}</strong></p>
          ${stats.total > 50 ? '<p style="color: #666; font-style: italic;">* Lista limitada a 50 registros</p>' : ''}
        </div>
      </div>

      <h3>Detalhamento dos Pedidos</h3>
      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Status</th>
            <th>Tipo</th>
            <th>Fornecedor</th>
            <th>Valor Total</th>
            <th>Data Criação</th>
          </tr>
        </thead>
        <tbody>
          ${pedidosHTML}
        </tbody>
      </table>

      <div style="margin-top: 30px; font-size: 11px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
        <p><strong>Observações:</strong></p>
        <ul>
          <li>Este relatório foi gerado automaticamente pelo sistema</li>
          <li>Os valores estão em Reais (BRL)</li>
          <li>As datas estão no formato brasileiro (DD/MM/AAAA)</li>
          ${stats.total > 50 ? '<li>Apenas os primeiros 50 registros são exibidos na listagem detalhada</li>' : ''}
        </ul>
      </div>
    </body>
    </html>
  `;
}