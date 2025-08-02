import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExportRequest {
  filtros?: any;
  formato?: 'xlsx' | 'csv';
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

    const { filtros, formato = 'xlsx' }: ExportRequest = await req.json();

    // Buscar pedidos com filtros
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
        moeda,
        observacoes
      `)
      .order('data_criacao', { ascending: false });

    // Aplicar filtros se fornecidos
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }
    if (filtros?.dataInicio) {
      query = query.gte('data_criacao', filtros.dataInicio);
    }
    if (filtros?.dataFim) {
      query = query.lte('data_criacao', filtros.dataFim);
    }
    if (filtros?.valorMinimo) {
      query = query.gte('valor_total', filtros.valorMinimo);
    }
    if (filtros?.valorMaximo) {
      query = query.lte('valor_total', filtros.valorMaximo);
    }

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

    if (formato === 'csv') {
      const csvContent = gerarCSV(pedidos || []);
      return new Response(csvContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="pedidos-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } else {
      // Simular XLSX (em produção, usar biblioteca como xlsx)
      const xlsxContent = gerarXLSXSimulado(pedidos || []);
      return new Response(xlsxContent, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="pedidos-${new Date().toISOString().split('T')[0]}.xlsx"`
        }
      });
    }

  } catch (error) {
    console.error('Erro na exportação:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function gerarCSV(pedidos: any[]): string {
  const headers = [
    'Número',
    'Status',
    'Tipo',
    'Fornecedor',
    'CNPJ',
    'Valor Total',
    'Data Criação',
    'Data Entrega',
    'Centro Custo',
    'Moeda',
    'Observações'
  ];

  const rows = pedidos.map(pedido => [
    pedido.numero_pedido,
    pedido.status,
    pedido.tipo,
    pedido.fornecedor_razao_social || '',
    pedido.fornecedor_cnpj || '',
    pedido.valor_total,
    new Date(pedido.data_criacao).toLocaleDateString('pt-BR'),
    pedido.data_entrega_prevista ? new Date(pedido.data_entrega_prevista).toLocaleDateString('pt-BR') : '',
    pedido.centro_custo || '',
    pedido.moeda,
    pedido.observacoes || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return '\uFEFF' + csvContent; // BOM para UTF-8
}

function gerarXLSXSimulado(pedidos: any[]): Uint8Array {
  // Em produção, usar biblioteca como xlsx
  // Por enquanto, retornar CSV como fallback
  const csvContent = gerarCSV(pedidos);
  return new TextEncoder().encode(csvContent);
}