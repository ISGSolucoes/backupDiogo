import { useState } from "react";
import { useLLMCNPJ } from "./useLLMCNPJ";

interface ReceitaWSData {
  cnpj: string;
  nome: string;         // Razão Social
  fantasia: string;     // Nome Fantasia
  situacao: string;     // Situação Cadastral
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
  message?: string;
}

// Interface para BrasilAPI
interface BrasilAPIData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  cnae_fiscal: string;
  cnae_fiscal_descricao: string;
  descricao_situacao_cadastral: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  ddd_telefone_1: string;
  telefone_1: string;
  email: string;
}

export const useReceitaWS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { buscarCNPJComLLM, loading: loadingLLM } = useLLMCNPJ();

  const buscarCNPJ = async (cnpj: string): Promise<ReceitaWSData | null> => {
    // Remove caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    // Valida se o CNPJ tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      setError("CNPJ deve ter 14 dígitos");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Primeiro tenta a BrasilAPI (mais confiável para CORS)
      const brasilApiResponse = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      
      if (brasilApiResponse.ok) {
        const brasilApiData: BrasilAPIData = await brasilApiResponse.json();
        
        // Converte os dados da BrasilAPI para o formato esperado
        const dadosConvertidos: ReceitaWSData = {
          cnpj: brasilApiData.cnpj,
          nome: brasilApiData.razao_social || "",
          fantasia: brasilApiData.nome_fantasia || "",
          situacao: brasilApiData.descricao_situacao_cadastral || "",
          logradouro: brasilApiData.logradouro || "",
          numero: brasilApiData.numero || "",
          complemento: brasilApiData.complemento || "",
          bairro: brasilApiData.bairro || "",
          municipio: brasilApiData.municipio || "",
          uf: brasilApiData.uf || "",
          cep: brasilApiData.cep || "",
          telefone: brasilApiData.ddd_telefone_1 && brasilApiData.telefone_1 
            ? `(${brasilApiData.ddd_telefone_1}) ${brasilApiData.telefone_1}` 
            : "",
          email: brasilApiData.email || "",
          atividade_principal: [{
            code: brasilApiData.cnae_fiscal || "",
            text: brasilApiData.cnae_fiscal_descricao || ""
          }],
          status: "OK"
        };
        
        return dadosConvertidos;
      }

      // Se a BrasilAPI falhar, tenta a ReceitaWS como fallback
      console.log("BrasilAPI falhou, tentando ReceitaWS...");
      const receitaResponse = await fetch(`https://receitaws.com.br/v1/cnpj/${cnpjLimpo}`);
      
      if (receitaResponse.ok) {
        const receitaData: ReceitaWSData = await receitaResponse.json();
        
        if (receitaData.status === "OK") {
          return receitaData;
        }
      }

      // Se ambas as APIs falharem, tenta usar LLM como último recurso
      console.log("APIs tradicionais falharam, tentando LLM...");
      const dadosLLM = await buscarCNPJComLLM(cnpj);
      
      if (dadosLLM) {
        // Converte os dados da LLM para o formato esperado
        const dadosConvertidos: ReceitaWSData = {
          cnpj: dadosLLM.cnpj,
          nome: dadosLLM.nome,
          fantasia: dadosLLM.fantasia,
          situacao: dadosLLM.situacao,
          logradouro: dadosLLM.logradouro,
          numero: dadosLLM.numero,
          complemento: dadosLLM.complemento,
          bairro: dadosLLM.bairro,
          municipio: dadosLLM.municipio,
          uf: dadosLLM.uf,
          cep: dadosLLM.cep,
          telefone: dadosLLM.telefone,
          email: dadosLLM.email,
          atividade_principal: dadosLLM.atividade_principal,
          status: "LLM_FALLBACK"
        };
        
        return dadosConvertidos;
      }

      throw new Error("Todas as fontes de dados falharam");

    } catch (err) {
      console.error("Erro na consulta de CNPJ:", err);
      setError("Erro ao consultar dados do CNPJ. Verifique sua conexão ou tente novamente.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { buscarCNPJ, loading: loading || loadingLLM, error };
};
