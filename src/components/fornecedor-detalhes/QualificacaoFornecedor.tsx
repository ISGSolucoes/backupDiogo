
import React, { useState } from 'react';
import { Award, Edit, Eye, RefreshCw, History, FileText, Library, CheckCircle, XCircle, AlertTriangle, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuestionarioEditor } from './questionario/QuestionarioEditor';
import { Fornecedor, QualificacaoArea } from '@/types/fornecedor';
import { QualificacaoAcoes } from './qualificacao/QualificacaoAcoes';
import { HistoricoQualificacao } from './qualificacao/HistoricoQualificacao';
import { SolicitarAtualizacao } from './qualificacao/SolicitarAtualizacao';
import { QualificarFornecedor } from './qualificacao/QualificarFornecedor';
import { BibliotecaQuestionarios } from './BibliotecaQuestionarios';
import { AreaSolicitante } from '@/types/questionario';
import { toast } from 'sonner';

interface QualificacaoFornecedorProps {
  fornecedor: Fornecedor;
}

export const QualificacaoFornecedor = ({ fornecedor }: QualificacaoFornecedorProps) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showAcoes, setShowAcoes] = useState(false);
  const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
  const [isAtualizacaoOpen, setIsAtualizacaoOpen] = useState(false);
  const [isQualificarOpen, setIsQualificarOpen] = useState(false);
  const [isBibliotecaOpen, setIsBibliotecaOpen] = useState(false);

  const getStatusInfo = () => {
    switch (fornecedor.status) {
      case 'qualificado':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          situacao: 'Qualificado',
          motivo: 'Todos os critérios atendidos',
          cor: 'text-green-700'
        };
      case 'preferido':
        return {
          icon: <CheckCircle className="h-5 w-5 text-purple-600" />,
          situacao: 'Fornecedor Preferido',
          motivo: 'Excelente histórico de desempenho',
          cor: 'text-purple-700'
        };
      case 'aguardando_complementacao':
        return {
          icon: <Clock className="h-5 w-5 text-orange-600" />,
          situacao: 'Aguardando Complementação',
          motivo: 'Informações pendentes do fornecedor',
          cor: 'text-orange-700'
        };
      case 'pendente_com_ressalvas':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
          situacao: 'Pendente com Ressalvas',
          motivo: 'Aguardando revisão interna',
          cor: 'text-amber-700'
        };
      case 'aguardando_atualizacao':
        return {
          icon: <RefreshCw className="h-5 w-5 text-blue-600" />,
          situacao: 'Aguardando Atualização',
          motivo: 'Solicitação de atualização enviada',
          cor: 'text-blue-700'
        };
      case 'em_qualificacao':
        return {
          icon: <Clock className="h-5 w-5 text-indigo-600" />,
          situacao: 'Em Qualificação',
          motivo: 'Processo de avaliação em andamento',
          cor: 'text-indigo-700'
        };
      default:
        return {
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          situacao: 'Não Qualificado',
          motivo: 'Documentos pendentes',
          cor: 'text-red-700'
        };
    }
  };

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch (e) {
      return dataString;
    }
  };

  const handleAcaoRealizada = (acao: string, detalhes: any) => {
    console.log("Ação realizada:", acao, detalhes);
    setShowAcoes(false);
  };

  const handleSolicitacaoEnviada = (tiposAtualizacao: string[]) => {
    const novoEvento = {
      id: `hist-${Date.now()}`,
      fornecedor_id: fornecedor.id,
      data: new Date().toISOString(),
      tipoEvento: 'sistema' as const,
      descricao: `Solicitação de atualização enviada: ${tiposAtualizacao.join(", ")}`,
      usuario: "Admin",
      detalhes: { tiposAtualizacao }
    };
    
    toast.success(`Status do fornecedor atualizado para: Aguardando Atualização`);
  };

  const handleQualificacaoRealizada = (areas: AreaSolicitante[]) => {
    const novasQualificacoes: QualificacaoArea[] = areas.map(area => ({
      area: area.charAt(0).toUpperCase() + area.slice(1),
      status: 'qualificado',
      dataQualificacao: new Date().toISOString(),
      pontuacao: Math.floor(Math.random() * 30) + 70,
    }));
    
    const areasTxt = areas.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ');
    console.log(`Fornecedor ${fornecedor.nome} qualificado para as áreas: ${areasTxt}`);
    
    toast.success(`Fornecedor qualificado para: ${areasTxt}`);
  };

  const handleVerDocumentosPendentes = () => {
    toast.info("Redirecionando para documentos pendentes...");
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Qualificação do Fornecedor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Layout principal em 3 colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Status Atual (Esquerda) */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Status Atual</h3>
              
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  {statusInfo.icon}
                  <span className={`font-medium ${statusInfo.cor}`}>
                    {statusInfo.situacao}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Motivo</p>
                  <p className="text-sm font-medium text-slate-800">{statusInfo.motivo}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">Última qualificação</p>
                  <p className="text-sm font-medium text-slate-800">
                    {fornecedor.ultimaAtualizacao 
                      ? formatarData(fornecedor.ultimaAtualizacao)
                      : "Nenhuma qualificação realizada"}
                  </p>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsHistoricoOpen(true)}
                    className="mt-2 text-slate-600 hover:text-slate-800 p-0 h-auto"
                  >
                    <History className="h-4 w-4 mr-2" />
                    Ver Histórico
                  </Button>
                </div>

                {/* Qualificações por área */}
                {fornecedor.qualificacoesPorArea && fornecedor.qualificacoesPorArea.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Qualificações por Área</p>
                    <div className="flex flex-wrap gap-1">
                      {fornecedor.qualificacoesPorArea.map((qualificacao) => {
                        let badgeClass = "bg-gray-50 text-gray-700 border-gray-200";
                        
                        if (qualificacao.status === 'qualificado') {
                          badgeClass = "bg-green-50 text-green-700 border-green-200";
                        } else if (qualificacao.status === 'em_qualificacao') {
                          badgeClass = "bg-blue-50 text-blue-700 border-blue-200";
                        } else if (qualificacao.status === 'reprovado') {
                          badgeClass = "bg-red-50 text-red-700 border-red-200";
                        }
                        
                        return (
                          <Badge 
                            key={qualificacao.area}
                            variant="outline" 
                            className={`${badgeClass} text-xs`}
                          >
                            {qualificacao.area}
                            {qualificacao.pontuacao && ` (${qualificacao.pontuacao})`}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Ações Principais (Centro) */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Ações Principais</h3>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAtualizacaoOpen(true)}
                  className="w-full flex items-center justify-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Solicitar Atualização
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleVerDocumentosPendentes}
                  className="w-full flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Documentos Pendentes
                </Button>
                
                {/* Botão principal em destaque */}
                <Button 
                  onClick={() => setShowAcoes(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                  size="lg"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Avaliar Qualificação
                </Button>
              </div>
            </div>

            {/* 3. Ações Secundárias (Direita) */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Ações Secundárias</h3>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsBibliotecaOpen(true)}
                  className="w-full flex items-center justify-center"
                >
                  <Library className="h-4 w-4 mr-2" />
                  Biblioteca de Modelos
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditorOpen(true)}
                  className="w-full flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Questionário
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setIsQualificarOpen(true)}
                  className="w-full flex items-center justify-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Qualificar Fornecedor
                </Button>
              </div>
            </div>
          </div>

          {/* Painel de ações expandido */}
          {showAcoes && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <QualificacaoAcoes 
                fornecedorId={fornecedor.id} 
                fornecedorNome={fornecedor.nome}
                onAcaoRealizada={handleAcaoRealizada}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Modais existentes mantidos */}
      <QuestionarioEditor 
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        fornecedorId={fornecedor.id}
        fornecedorNome={fornecedor.nome}
      />

      <HistoricoQualificacao 
        open={isHistoricoOpen}
        onOpenChange={setIsHistoricoOpen}
        fornecedorId={fornecedor.id}
      />

      <SolicitarAtualizacao 
        open={isAtualizacaoOpen}
        onOpenChange={setIsAtualizacaoOpen}
        fornecedorId={fornecedor.id}
        fornecedorNome={fornecedor.nome}
        onSolicitacaoEnviada={handleSolicitacaoEnviada}
      />
      
      <QualificarFornecedor
        open={isQualificarOpen}
        onOpenChange={setIsQualificarOpen}
        fornecedorId={fornecedor.id}
        fornecedorNome={fornecedor.nome}
        onQualificacaoRealizada={handleQualificacaoRealizada}
      />

      <BibliotecaQuestionarios 
        open={isBibliotecaOpen}
        onOpenChange={setIsBibliotecaOpen}
        fornecedorId={fornecedor.id}
        fornecedorNome={fornecedor.nome}
      />
    </>
  );
};
