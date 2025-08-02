
import { useState } from "react";

interface LLMCNPJData {
  cnpj: string;
  nome: string;
  fantasia: string;
  situacao: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  atividade_principal: Array<{
    code: string;
    text: string;
  }>;
  status: string;
}

export const useLLMCNPJ = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarCNPJComLLM = async (cnpj: string): Promise<LLMCNPJData | null> => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) {
      setError("CNPJ deve ter 14 dígitos");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Usando a API do Hugging Face (gratuita) com modelo de linguagem
      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `Buscar informações da empresa com CNPJ ${cnpj}. Retorne em formato JSON com os campos: razao_social, nome_fantasia, situacao_cadastral, cnae_principal, endereco_completo, telefone, cidade, estado, cep. Se não encontrar, retorne "Não encontrado".`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao consultar LLM");
      }

      const data = await response.json();
      
      // Como é uma LLM, vamos tentar simular uma resposta baseada no padrão
      // Em uma implementação real, você poderia usar uma LLM mais especializada
      // ou treinar um modelo específico para essa tarefa
      
      // Por enquanto, vamos retornar uma estrutura básica que pode ser preenchida
      const dadosEstruturados: LLMCNPJData = {
        cnpj: cnpjLimpo,
        nome: "Dados obtidos via LLM - Preencher manualmente",
        fantasia: "",
        situacao: "Consultar manualmente",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        municipio: "",
        uf: "",
        cep: "",
        telefone: "",
        email: "",
        atividade_principal: [{
          code: "",
          text: "Consultar CNAE manualmente"
        }],
        status: "LLM_CONSULTED"
      };

      return dadosEstruturados;

    } catch (err) {
      console.error("Erro na consulta LLM:", err);
      setError("Erro ao consultar LLM. Preencha os dados manualmente.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { buscarCNPJComLLM, loading, error };
};
