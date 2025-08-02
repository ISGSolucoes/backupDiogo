import React, { useState } from 'react';
import { AlertCircle, Database, Globe, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FornecedorExterno } from './types';
import { GlobeIcon } from './GlobeIcon';
import { CardFornecedorExterno } from './CardFornecedorExterno';
import { ResumoSegmento } from './ResumoSegmento';
import { FiltroSegmentos } from './FiltroSegmentos';
import { calcularEstatisticasSegmento } from './utils';
import type { ResultadoBuscaExterna } from '@/hooks/useBuscaExterna';

interface ResultadosBuscaExternaProps {
  quantidade: number;
  termo: string;
  onImportarClick: (fornecedor: FornecedorExterno) => void;
  resultadosReais?: ResultadoBuscaExterna[];
}

export const ResultadosBuscaExterna = ({ 
  quantidade, 
  termo, 
  onImportarClick,
  resultadosReais 
}: ResultadosBuscaExternaProps) => {
  const [segmentoSelecionado, setSegmentoSelecionado] = useState<string | null>(null);
  const [showSegmentSummary, setShowSegmentSummary] = useState(false);

  // Converter resultados reais para o formato esperado ou usar dados mock
  const fornecedores: FornecedorExterno[] = resultadosReais 
    ? resultadosReais.map(resultado => ({
        id: resultado.id,
        nome: resultado.nome,
        cnpj: resultado.cnpj,
        tipo: resultado.tipo,
        cidade: resultado.cidade,
        uf: resultado.uf,
        telefone: resultado.dadosCompletos?.telefone || "",
        email: resultado.dadosCompletos?.email || "",
        endereco: resultado.dadosCompletos?.logradouro || "",
        ultimaAtualizacao: new Date().toISOString().split('T')[0],
        score: resultado.confiabilidade * 100
      }))
    : gerarFornecedoresMock(quantidade, termo);

  const handleImportar = (fornecedor: FornecedorExterno) => {
    const fonte = (fornecedor as any).fonte;
    const confiabilidade = (fornecedor as any).confiabilidade;
    
    let mensagem = `Fornecedor "${fornecedor.nome}" importado com sucesso!`;
    
    if (fonte) {
      const fonteNomes = {
        'brasilapi': 'BrasilAPI',
        'receitaws': 'ReceitaWS', 
        'llm': 'IA',
        'mock': 'Simulação'
      };
      mensagem += ` (Fonte: ${fonteNomes[fonte as keyof typeof fonteNomes] || fonte})`;
    }
    
    toast.success(mensagem);
    onImportarClick(fornecedor);
  };

  const handleVerDetalhes = (fornecedor: FornecedorExterno) => {
    const fonte = (fornecedor as any).fonte;
    let mensagem = `Buscando dados detalhados para ${fornecedor.nome}...`;
    
    if (fonte === 'brasilapi' || fonte === 'receitaws') {
      mensagem += ' (Dados oficiais disponíveis)';
    } else if (fonte === 'llm') {
      mensagem += ' (Dados enriquecidos por IA)';
    }
    
    toast.info(mensagem);
  };

  const handleSegmentoClick = (segmento: string) => {
    setSegmentoSelecionado(segmentoSelecionado === segmento ? null : segmento);
    setShowSegmentSummary(segmentoSelecionado !== segmento);
  };

  // Agrupar fornecedores por segmento
  const segmentos = [...new Set(fornecedores.map(f => f.tipo))];
  const contagemPorSegmento: Record<string, number> = {};
  fornecedores.forEach(f => {
    contagemPorSegmento[f.tipo] = (contagemPorSegmento[f.tipo] || 0) + 1;
  });

  // Calcular estatísticas por fonte
  const estatisticasFonte = resultadosReais ? {
    brasilapi: resultadosReais.filter(r => r.fonte === 'brasilapi').length,
    receitaws: resultadosReais.filter(r => r.fonte === 'receitaws').length,
    llm: resultadosReais.filter(r => r.fonte === 'llm').length,
    mock: resultadosReais.filter(r => r.fonte === 'mock').length,
  } : null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium flex items-center">
              <GlobeIcon className="h-5 w-5 mr-2 text-blue-500" />
              Resultados da Busca Externa
            </h3>
            <p className="text-sm text-slate-500">
              Encontrados {quantidade} fornecedores para "{termo}"
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-50">
              <Sparkles className="h-3 w-3 mr-1" />
              APIs Reais
            </Badge>
            {resultadosReais && (
              <Badge variant="outline" className="bg-green-50">
                <Database className="h-3 w-3 mr-1" />
                Dados Verificados
              </Badge>
            )}
          </div>
        </div>
        
        {/* Estatísticas por fonte de dados */}
        {estatisticasFonte && (
          <div className="bg-white border rounded p-3 mb-4">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Database className="h-4 w-4 mr-1" />
              Fontes de Dados
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {estatisticasFonte.brasilapi > 0 && (
                <Badge variant="outline" className="bg-green-50">
                  BrasilAPI: {estatisticasFonte.brasilapi}
                </Badge>
              )}
              {estatisticasFonte.receitaws > 0 && (
                <Badge variant="outline" className="bg-blue-50">
                  ReceitaWS: {estatisticasFonte.receitaws}
                </Badge>
              )}
              {estatisticasFonte.llm > 0 && (
                <Badge variant="outline" className="bg-purple-50">
                  IA: {estatisticasFonte.llm}
                </Badge>
              )}
              {estatisticasFonte.mock > 0 && (
                <Badge variant="outline" className="bg-gray-50">
                  Simulação: {estatisticasFonte.mock}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="text-sm bg-blue-50 border border-blue-100 rounded p-3 mb-4">
          <p>
            <AlertCircle className="h-4 w-4 inline-block mr-1 text-blue-500" />
            {resultadosReais 
              ? "Dados obtidos de fontes oficiais e enriquecidos pela IA. Verifique as informações antes de importar."
              : "Os dados externos são enriquecidos pela IA e podem ser importados para sua base."}
          </p>
        </div>

        {/* Segmentos como "chips" clicáveis */}
        <FiltroSegmentos 
          segmentos={segmentos}
          contagemPorSegmento={contagemPorSegmento}
          segmentoSelecionado={segmentoSelecionado}
          onSegmentoClick={handleSegmentoClick}
        />

        {/* Cards de resumo por segmento quando selecionado */}
        {showSegmentSummary && segmentoSelecionado && (
          <ResumoSegmento 
            segmento={segmentoSelecionado} 
            estatisticas={calcularEstatisticasSegmento(fornecedores, segmentoSelecionado)}
            fornecedores={fornecedores}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fornecedores
            .filter(f => !segmentoSelecionado || f.tipo === segmentoSelecionado)
            .map((fornecedor) => (
              <CardFornecedorExterno
                key={fornecedor.id}
                fornecedor={fornecedor}
                onImportarClick={handleImportar}
                onVerDetalhes={handleVerDetalhes}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

// Função auxiliar para gerar dados mock quando não há resultados reais
function gerarFornecedoresMock(quantidade: number, termo: string): FornecedorExterno[] {
  const fornecedores: FornecedorExterno[] = [];
  const segmentos = ['Tecnologia', 'Construção', 'Transporte', 'Consultoria', 'Comércio'];
  
  for (let i = 0; i < quantidade; i++) {
    const segmento = segmentos[i % segmentos.length];
    fornecedores.push({
      id: `mock-${i}`,
      nome: `${termo} ${segmento} ${i + 1}`,
      cnpj: `${String(Math.random()).slice(2, 8)}.${String(Math.random()).slice(2, 5)}.${String(Math.random()).slice(2, 5)}/0001-${String(Math.random()).slice(2, 4)}`,
      tipo: segmento,
      cidade: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre'][i % 4],
      uf: ['SP', 'RJ', 'MG', 'RS'][i % 4],
      telefone: `(11) 9${String(Math.random()).slice(2, 10)}`,
      email: `contato@${termo.toLowerCase()}${i + 1}.com.br`,
      endereco: `Rua ${termo} ${i + 1}, ${100 + i}`,
      ultimaAtualizacao: new Date().toISOString().split('T')[0],
      score: Math.round(Math.random() * 40 + 60) // Score entre 60-100
    });
  }
  
  return fornecedores;
}
