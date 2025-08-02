
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteEmailRequest {
  inviteId: string;
  email: string;
  nome_completo: string;
  area: string;
  cargo?: string;
  mensagem_personalizada?: string;
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { inviteId, email, nome_completo, area, cargo, mensagem_personalizada, token }: InviteEmailRequest = await req.json();

    // Criar link do convite
    const baseUrl = Deno.env.get('SITE_URL') || 'http://localhost:8080';
    const inviteLink = `${baseUrl}/convite/${token}`;

    // Simular envio de email (substituir por serviço real)
    console.log('=== EMAIL SIMULADO ===');
    console.log('Para:', email);
    console.log('Assunto: Convite para acessar o Sistema de Suprimentos');
    console.log('Conteúdo:');
    console.log(`
      Olá ${nome_completo},
      
      Você foi convidado(a) para acessar o Sistema de Suprimentos.
      
      Detalhes do convite:
      - Nome: ${nome_completo}
      - Email: ${email}
      - Área: ${area}
      ${cargo ? `- Cargo: ${cargo}` : ''}
      ${mensagem_personalizada ? `- Mensagem: ${mensagem_personalizada}` : ''}
      
      Para aceitar o convite e criar sua conta, clique no link abaixo:
      ${inviteLink}
      
      Este convite expira em 7 dias.
      
      ---
      Sistema de Suprimentos
    `);
    console.log('=======================');

    // Atualizar status do convite no banco
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase
      .from('user_invites')
      .update({ 
        status: 'enviado',
        data_envio: new Date().toISOString()
      })
      .eq('id', inviteId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Convite enviado com sucesso',
        invite_link: inviteLink
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Erro ao enviar convite:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
