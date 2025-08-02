import { useState } from "react";
import { useReceitaWS } from "./useReceitaWS";
import { useLLMCNPJ } from "./useLLMCNPJ";

export interface FiltrosBuscaExterna {
  uf?: string;
  cidade?: string;
  porte?: string;
  segmento?: string;
}

export interface ResultadoBuscaExterna {
  id: string;
  nome: string;
  cnpj: string;
  tipo: string;
  cidade: string;
  uf: string;
  fonte: 'brasilapi' | 'receitaws' | 'llm' | 'mock';
  confiabilidade: number;
  dadosCompletos?: any;
}

export const useBuscaExterna = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { buscarCNPJ } = useReceitaWS();
  const { buscarCNPJComLLM } = useLLMCNPJ();

  const buscarFornecedoresExternos = async (
    termo: string, 
    filtros?: FiltrosBuscaExterna
  ): Promise<ResultadoBuscaExterna[]> => {
    setLoading(true);
    setError(null);

    try {
      const resultados: ResultadoBuscaExterna[] = [];
      
      // Se o termo parecer ser um CNPJ, tenta busca direta
      const cnpjLimpo = termo.replace(/\D/g, '');
      if (cnpjLimpo.length === 14) {
        console.log("Detectado CNPJ, fazendo busca direta...");
        
        const dadosCNPJ = await buscarCNPJ(cnpjLimpo);
        if (dadosCNPJ && dadosCNPJ.status === "OK") {
          resultados.push({
            id: `cnpj-${cnpjLimpo}`,
            nome: dadosCNPJ.nome,
            cnpj: dadosCNPJ.cnpj,
            tipo: dadosCNPJ.atividade_principal?.[0]?.text || "Não informado",
            cidade: dadosCNPJ.municipio,
            uf: dadosCNPJ.uf,
            fonte: 'brasilapi',
            confiabilidade: 0.9,
            dadosCompletos: dadosCNPJ
          });
        } else if (dadosCNPJ && dadosCNPJ.status === "LLM_FALLBACK") {
          resultados.push({
            id: `cnpj-${cnpjLimpo}`,
            nome: dadosCNPJ.nome,
            cnpj: dadosCNPJ.cnpj,
            tipo: dadosCNPJ.atividade_principal?.[0]?.text || "Não informado",
            cidade: dadosCNPJ.municipio,
            uf: dadosCNPJ.uf,
            fonte: 'llm',
            confiabilidade: 0.6,
            dadosCompletos: dadosCNPJ
          });
        }
      }

      // Se não encontrou por CNPJ ou não é CNPJ, tenta busca por segmento/LLM
      if (resultados.length === 0) {
        console.log("Fazendo busca por segmento com LLM...");
        
        // Monta prompt contextualizado para a LLM
        const promptSegmento = `Buscar empresas do segmento "${termo}" ${
          filtros?.uf ? `no estado ${filtros.uf}` : ''
        } ${
          filtros?.cidade ? `na cidade ${filtros.cidade}` : ''
        } ${
          filtros?.porte ? `de porte ${filtros.porte}` : ''
        }. Retornar lista de empresas reais ou similares com CNPJ, razão social, cidade, estado e atividade principal.`;

        try {
          // Simula múltiplas consultas LLM para diferentes CNPJs do segmento
          const cnpjsSimulados = gerarCNPJsDoSegmento(termo, filtros);
          
          for (const cnpjSimulado of cnpjsSimulados.slice(0, 5)) { // Limita a 5 para não sobrecarregar
            try {
              const dadosLLM = await buscarCNPJComLLM(cnpjSimulado.cnpj);
              if (dadosLLM) {
                resultados.push({
                  id: `llm-${cnpjSimulado.cnpj}`,
                  nome: cnpjSimulado.nome,
                  cnpj: cnpjSimulado.cnpj,
                  tipo: cnpjSimulado.tipo,
                  cidade: filtros?.cidade || cnpjSimulado.cidade,
                  uf: filtros?.uf || cnpjSimulado.uf,
                  fonte: 'llm',
                  confiabilidade: 0.7,
                  dadosCompletos: dadosLLM
                });
              }
            } catch (error) {
              console.log(`Erro ao buscar ${cnpjSimulado.cnpj}:`, error);
            }
          }
        } catch (llmError) {
          console.error("Erro na busca LLM:", llmError);
        }
      }

      // Fallback para dados mock se nenhuma API retornou resultados
      if (resultados.length === 0) {
        console.log("Usando fallback mock...");
        const mockResults = gerarResultadosMock(termo, filtros);
        resultados.push(...mockResults);
      }

      return resultados;

    } catch (err) {
      console.error("Erro na busca externa:", err);
      setError("Erro ao realizar busca externa");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { buscarFornecedoresExternos, loading, error };
};

// Função auxiliar para gerar CNPJs simulados baseados no segmento
function gerarCNPJsDoSegmento(termo: string, filtros?: FiltrosBuscaExterna) {
  const segmentos: Record<string, any[]> = {
    'tecnologia': [
      { nome: 'Tech Solutions Ltda', cnpj: '12345678000190', tipo: 'Desenvolvimento de Software', cidade: 'São Paulo', uf: 'SP' },
      { nome: 'Digital Systems SA', cnpj: '98765432000110', tipo: 'Consultoria em TI', cidade: 'Rio de Janeiro', uf: 'RJ' },
    ],
    'construcao': [
      { nome: 'Construções ABC Ltda', cnpj: '45678912000134', tipo: 'Construção Civil', cidade: 'Belo Horizonte', uf: 'MG' },
      { nome: 'Engenharia Total SA', cnpj: '78912345000167', tipo: 'Engenharia Civil', cidade: 'Porto Alegre', uf: 'RS' },
    ],
    'transporte': [
      { nome: 'Transportes Rápidos ME', cnpj: '23456789000121', tipo: 'Transporte Rodoviário', cidade: 'Curitiba', uf: 'PR' },
      { nome: 'Logística Express Ltda', cnpj: '56789123000198', tipo: 'Logística', cidade: 'Salvador', uf: 'BA' },
    ]
  };

  const termoLower = termo.toLowerCase();
  let empresas: any[] = [];

  // Busca por segmento específico
  for (const [segmento, listaEmpresas] of Object.entries(segmentos)) {
    if (termoLower.includes(segmento)) {
      empresas = [...listaEmpresas];
      break;
    }
  }

  // Se não encontrou segmento específico, usa uma lista geral
  if (empresas.length === 0) {
    empresas = Object.values(segmentos).flat();
  }

  // Aplica filtros se fornecidos
  if (filtros?.uf) {
    empresas = empresas.filter(e => e.uf.toLowerCase().includes(filtros.uf!.toLowerCase()));
  }
  
  if (filtros?.cidade) {
    empresas = empresas.filter(e => e.cidade.toLowerCase().includes(filtros.cidade!.toLowerCase()));
  }

  return empresas;
}

// Função auxiliar para gerar resultados mock como último fallback
function gerarResultadosMock(termo: string, filtros?: FiltrosBuscaExterna): ResultadoBuscaExterna[] {
  const mockEmpresas = [
    {
      id: `mock-1-${Date.now()}`,
      nome: `${termo} Solutions Ltda`,
      cnpj: '12.345.678/0001-90',
      tipo: `Serviços de ${termo}`,
      cidade: filtros?.cidade || 'São Paulo',
      uf: filtros?.uf || 'SP',
      fonte: 'mock' as const,
      confiabilidade: 0.5
    },
    {
      id: `mock-2-${Date.now()}`,
      nome: `Empresa ${termo} ME`,
      cnpj: '98.765.432/0001-10',
      tipo: `Comércio de ${termo}`,
      cidade: filtros?.cidade || 'Rio de Janeiro', 
      uf: filtros?.uf || 'RJ',
      fonte: 'mock' as const,
      confiabilidade: 0.5
    }
  ];

  return mockEmpresas;
}
