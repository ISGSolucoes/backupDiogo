import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RamificacaoData {
  fornecedorId: string;
  contato: {
    nome: string;
    sobrenome: string;
    email: string;
    telefone?: string;
    cargo?: string;
    departamento?: string;
  };
  categoria?: {
    categoria_principal: string;
    descricao_servicos?: string;
    regiao_atendimento?: string[];
  };
  unidade?: {
    nome_unidade: string;
    tipo_unidade: string;
    endereco: {
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
    };
  };
  relacionamento?: {
    cliente_codigo: string;
    cliente_nome: string;
    convite_id?: string;
  };
}

export function useRamificacoesFornecedor() {
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const criarNovoContato = async (data: RamificacaoData) => {
    setProcessando(true);
    setErro(null);

    try {
      // 1. Criar novo contato
      const { data: novoContato, error: errorContato } = await supabase
        .from('contatos_fornecedor')
        .insert({
          fornecedor_id: data.fornecedorId,
          nome: data.contato.nome,
          sobrenome: data.contato.sobrenome,
          email: data.contato.email,
          telefone: data.contato.telefone,
          cargo: data.contato.cargo,
          departamento: data.contato.departamento,
          principal: false, // Nunca será principal em ramificação
          ativo: true,
          perfil_acesso: 'operacional'
        })
        .select()
        .single();

      if (errorContato) throw errorContato;

      // 2. Criar categoria se fornecida
      if (data.categoria) {
        await supabase
          .from('categorias_fornecimento')
          .insert({
            contato_id: novoContato.id,
            categoria_principal: data.categoria.categoria_principal,
            descricao_servicos: data.categoria.descricao_servicos,
            regiao_atendimento: data.categoria.regiao_atendimento || [],
            ativa: true
          });
      }

      // 3. Criar relacionamento se fornecido
      if (data.relacionamento) {
        await supabase
          .from('relacionamentos_clientes_fornecedores')
          .insert({
            fornecedor_id: data.fornecedorId,
            contato_id: novoContato.id,
            cliente_codigo: data.relacionamento.cliente_codigo,
            cliente_nome: data.relacionamento.cliente_nome,
            status: 'ativo',
            data_aceite: new Date().toISOString(),
            convite_id: data.relacionamento.convite_id,
            origem: 'convite_cliente'
          });
      }

      return { sucesso: true, contato: novoContato };
    } catch (error) {
      console.error('Erro ao criar novo contato:', error);
      setErro('Erro ao criar novo contato');
      return { sucesso: false, erro };
    } finally {
      setProcessando(false);
    }
  };

  const criarNovaUnidade = async (data: RamificacaoData) => {
    setProcessando(true);
    setErro(null);

    try {
      // 1. Criar nova unidade operacional
      const { data: novaUnidade, error: errorUnidade } = await supabase
        .from('unidades_operacionais')
        .insert({
          fornecedor_id: data.fornecedorId,
          nome_unidade: data.unidade!.nome_unidade,
          tipo_unidade: data.unidade!.tipo_unidade,
          logradouro: data.unidade!.endereco.logradouro,
          numero: data.unidade!.endereco.numero,
          complemento: data.unidade!.endereco.complemento,
          bairro: data.unidade!.endereco.bairro,
          cidade: data.unidade!.endereco.cidade,
          estado: data.unidade!.endereco.estado,
          cep: data.unidade!.endereco.cep,
          principal: false, // Nunca será principal em ramificação
          ativa: true
        })
        .select()
        .single();

      if (errorUnidade) throw errorUnidade;

      // 2. Criar contato para a nova unidade
      const { data: novoContato, error: errorContato } = await supabase
        .from('contatos_fornecedor')
        .insert({
          fornecedor_id: data.fornecedorId,
          nome: data.contato.nome,
          sobrenome: data.contato.sobrenome,
          email: data.contato.email,
          telefone: data.contato.telefone,
          cargo: data.contato.cargo,
          departamento: data.contato.departamento,
          principal: false,
          ativo: true,
          perfil_acesso: 'operacional'
        })
        .select()
        .single();

      if (errorContato) throw errorContato;

      // 3. Criar categoria se fornecida
      if (data.categoria) {
        await supabase
          .from('categorias_fornecimento')
          .insert({
            contato_id: novoContato.id,
            categoria_principal: data.categoria.categoria_principal,
            descricao_servicos: data.categoria.descricao_servicos,
            regiao_atendimento: data.categoria.regiao_atendimento || [],
            ativa: true
          });
      }

      // 4. Criar relacionamento se fornecido
      if (data.relacionamento) {
        await supabase
          .from('relacionamentos_clientes_fornecedores')
          .insert({
            fornecedor_id: data.fornecedorId,
            contato_id: novoContato.id,
            cliente_codigo: data.relacionamento.cliente_codigo,
            cliente_nome: data.relacionamento.cliente_nome,
            status: 'ativo',
            data_aceite: new Date().toISOString(),
            convite_id: data.relacionamento.convite_id,
            origem: 'convite_cliente'
          });
      }

      return { sucesso: true, unidade: novaUnidade, contato: novoContato };
    } catch (error) {
      console.error('Erro ao criar nova unidade:', error);
      setErro('Erro ao criar nova unidade');
      return { sucesso: false, erro };
    } finally {
      setProcessando(false);
    }
  };

  const criarNovaCategoria = async (data: RamificacaoData) => {
    setProcessando(true);
    setErro(null);

    try {
      // 1. Buscar contato principal do fornecedor
      const { data: contatoPrincipal, error: errorBusca } = await supabase
        .from('contatos_fornecedor')
        .select('id')
        .eq('fornecedor_id', data.fornecedorId)
        .eq('principal', true)
        .single();

      if (errorBusca || !contatoPrincipal) {
        throw new Error('Contato principal não encontrado');
      }

      // 2. Criar nova categoria para o contato principal
      const { data: novaCategoria, error: errorCategoria } = await supabase
        .from('categorias_fornecimento')
        .insert({
          contato_id: contatoPrincipal.id,
          categoria_principal: data.categoria!.categoria_principal,
          descricao_servicos: data.categoria!.descricao_servicos,
          regiao_atendimento: data.categoria!.regiao_atendimento || [],
          ativa: true
        })
        .select()
        .single();

      if (errorCategoria) throw errorCategoria;

      // 3. Criar relacionamento se fornecido
      if (data.relacionamento) {
        await supabase
          .from('relacionamentos_clientes_fornecedores')
          .insert({
            fornecedor_id: data.fornecedorId,
            contato_id: contatoPrincipal.id,
            cliente_codigo: data.relacionamento.cliente_codigo,
            cliente_nome: data.relacionamento.cliente_nome,
            status: 'ativo',
            data_aceite: new Date().toISOString(),
            convite_id: data.relacionamento.convite_id,
            origem: 'convite_cliente'
          });
      }

      return { sucesso: true, categoria: novaCategoria };
    } catch (error) {
      console.error('Erro ao criar nova categoria:', error);
      setErro('Erro ao criar nova categoria');
      return { sucesso: false, erro };
    } finally {
      setProcessando(false);
    }
  };

  const vincularRelacionamento = async (data: RamificacaoData) => {
    setProcessando(true);
    setErro(null);

    try {
      // 1. Buscar contato principal do fornecedor
      const { data: contatoPrincipal, error: errorBusca } = await supabase
        .from('contatos_fornecedor')
        .select('id')
        .eq('fornecedor_id', data.fornecedorId)
        .eq('principal', true)
        .single();

      if (errorBusca || !contatoPrincipal) {
        throw new Error('Contato principal não encontrado');
      }

      // 2. Criar relacionamento
      const { data: novoRelacionamento, error: errorRelacionamento } = await supabase
        .from('relacionamentos_clientes_fornecedores')
        .insert({
          fornecedor_id: data.fornecedorId,
          contato_id: contatoPrincipal.id,
          cliente_codigo: data.relacionamento!.cliente_codigo,
          cliente_nome: data.relacionamento!.cliente_nome,
          status: 'ativo',
          data_aceite: new Date().toISOString(),
          convite_id: data.relacionamento!.convite_id,
          origem: 'convite_cliente'
        })
        .select()
        .single();

      if (errorRelacionamento) throw errorRelacionamento;

      return { sucesso: true, relacionamento: novoRelacionamento };
    } catch (error) {
      console.error('Erro ao vincular relacionamento:', error);
      setErro('Erro ao vincular relacionamento');
      return { sucesso: false, erro };
    } finally {
      setProcessando(false);
    }
  };

  return {
    criarNovoContato,
    criarNovaUnidade,
    criarNovaCategoria,
    vincularRelacionamento,
    processando,
    erro
  };
}