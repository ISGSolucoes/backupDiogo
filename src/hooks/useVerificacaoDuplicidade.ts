
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VerificacaoDuplicidadeResult {
  existe: boolean;
  dados?: {
    id: string;
    razao_social?: string;
    nome_completo?: string;
    cidade: string;
    created_at: string;
    contato_nome: string;
    contato_email: string;
  };
}

export const useVerificacaoDuplicidade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verificarCNPJ = async (cnpj: string): Promise<VerificacaoDuplicidadeResult> => {
    if (!cnpj || cnpj.length < 14) {
      return { existe: false };
    }

    // Remove caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) {
      return { existe: false };
    }

    setLoading(true);
    setError(null);

    try {
      // Primeiro verificar na nova estrutura
      const { data: novoFornecedor, error: errorNovo } = await supabase
        .from('fornecedores')
        .select(`
          id,
          razao_social,
          nome_fantasia,
          created_at
        `)
        .eq('documento', cnpjLimpo)
        .eq('tipo_documento', 'cnpj')
        .maybeSingle();

      if (novoFornecedor) {
        return {
          existe: true,
          dados: {
            id: novoFornecedor.id,
            razao_social: novoFornecedor.razao_social,
            cidade: '',
            created_at: novoFornecedor.created_at,
            contato_nome: '',
            contato_email: ''
          }
        };
      }

      // Fallback: verificar na estrutura antiga
      const { data, error } = await supabase
        .from('cadastro_fornecedores')
        .select(`
          id,
          razao_social,
          endereco_cidade,
          created_at,
          contato_nome,
          contato_email
        `)
        .eq('cnpj', cnpjLimpo)
        .eq('tipo_fornecedor', 'cnpj')
        .maybeSingle();

      if (error) {
        console.error("Erro ao verificar CNPJ:", error);
        setError("Erro ao verificar CNPJ");
        return { existe: false };
      }

      if (data) {
        return {
          existe: true,
          dados: {
            id: data.id,
            razao_social: data.razao_social,
            cidade: data.endereco_cidade,
            created_at: data.created_at,
            contato_nome: data.contato_nome,
            contato_email: data.contato_email
          }
        };
      }

      return { existe: false };
    } catch (err) {
      console.error("Erro na verificação do CNPJ:", err);
      setError("Erro ao verificar CNPJ");
      return { existe: false };
    } finally {
      setLoading(false);
    }
  };

  const verificarCPF = async (cpf: string): Promise<VerificacaoDuplicidadeResult> => {
    if (!cpf || cpf.length < 11) {
      return { existe: false };
    }

    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
      return { existe: false };
    }

    setLoading(true);
    setError(null);

    try {
      // Primeiro verificar na nova estrutura
      const { data: novoFornecedor, error: errorNovo } = await supabase
        .from('fornecedores')
        .select(`
          id,
          nome_completo,
          created_at
        `)
        .eq('documento', cpfLimpo)
        .eq('tipo_documento', 'cpf')
        .maybeSingle();

      if (novoFornecedor) {
        return {
          existe: true,
          dados: {
            id: novoFornecedor.id,
            nome_completo: novoFornecedor.nome_completo,
            cidade: '',
            created_at: novoFornecedor.created_at,
            contato_nome: '',
            contato_email: ''
          }
        };
      }

      // Fallback: verificar na estrutura antiga
      const { data, error } = await supabase
        .from('cadastro_fornecedores')
        .select(`
          id,
          nome_completo,
          endereco_cidade,
          created_at,
          contato_nome,
          contato_email
        `)
        .eq('cpf', cpfLimpo)
        .eq('tipo_fornecedor', 'cpf')
        .maybeSingle();

      if (error) {
        console.error("Erro ao verificar CPF:", error);
        setError("Erro ao verificar CPF");
        return { existe: false };
      }

      if (data) {
        return {
          existe: true,
          dados: {
            id: data.id,
            nome_completo: data.nome_completo,
            cidade: data.endereco_cidade,
            created_at: data.created_at,
            contato_nome: data.contato_nome,
            contato_email: data.contato_email
          }
        };
      }

      return { existe: false };
    } catch (err) {
      console.error("Erro na verificação do CPF:", err);
      setError("Erro ao verificar CPF");
      return { existe: false };
    } finally {
      setLoading(false);
    }
  };

  return { 
    verificarCNPJ, 
    verificarCPF, 
    loading, 
    error 
  };
};
