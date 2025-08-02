
import React, { useState } from "react";
import { 
  Brain, 
  RefreshCw, 
  Eye, 
  Mail, 
  RotateCcw, 
  CheckCircle, 
  Star,
  AlertTriangle,
  Calendar,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpandedDialog } from "@/components/ui/expanded-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAcoesRecomendadas, useExecutarAcao, useReprocessarIA } from "@/hooks/useAcoesRecomendadas";
import { AcaoRecomendada, PrioridadeAcao, TipoAcaoRecomendada } from "@/types/acoes-recomendadas";
import { toast } from "sonner";
import { useFullscreenModal } from "@/hooks/useFullscreenModal";

interface AcoesRecomendadasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AcoesRecomendadasModal = ({ open, onOpenChange }: AcoesRecomendadasModalProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();
  const { data: acoes = [], isLoading } = useAcoesRecomendadas();
  const executarAcao = useExecutarAcao();
  const reprocessarIA = useReprocessarIA();

  const getPrioridadeConfig = (prioridade: PrioridadeAcao) => {
    switch (prioridade) {
      case 'alta':
        return { 
          color: 'bg-red-500', 
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: '🔴',
          label: 'URGENTE'
        };
      case 'media':
        return { 
          color: 'bg-amber-500', 
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          icon: '🟠',
          label: 'MÉDIA'
        };
      case 'baixa':
        return { 
          color: 'bg-green-500', 
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: '🟢',
          label: 'BAIXA'
        };
      default:
        return { 
          color: 'bg-gray-500', 
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: '⚪',
          label: 'NORMAL'
        };
    }
  };

  const getTipoAcaoConfig = (tipo: TipoAcaoRecomendada) => {
    switch (tipo) {
      case 'documento_vencendo':
        return { icon: <Calendar className="h-4 w-4" />, label: 'Documento vencendo' };
      case 'documento_vencido':
        return { icon: <AlertTriangle className="h-4 w-4" />, label: 'Documento vencido' };
      case 'avaliacao_pendente':
        return { icon: <Clock className="h-4 w-4" />, label: 'Avaliação pendente' };
      case 'fornecedor_inativo':
        return { icon: <AlertTriangle className="h-4 w-4" />, label: 'Fornecedor inativo' };
      case 'desempenho_baixo':
        return { icon: <AlertTriangle className="h-4 w-4" />, label: 'Desempenho baixo' };
      case 'promover_preferencial':
        return { icon: <Star className="h-4 w-4" />, label: 'Promover a preferencial' };
      case 'reavaliar_qualificacao':
        return { icon: <RotateCcw className="h-4 w-4" />, label: 'Reavaliar qualificação' };
      case 'solicitar_atualizacao':
        return { icon: <RefreshCw className="h-4 w-4" />, label: 'Solicitar atualização' };
      default:
        return { icon: <Brain className="h-4 w-4" />, label: 'Ação geral' };
    }
  };

  const getAcaoBotao = (tipo: TipoAcaoRecomendada) => {
    switch (tipo) {
      case 'documento_vencendo':
      case 'documento_vencido':
        return { icon: <Mail className="h-4 w-4" />, label: 'Solicitar Atualização', variant: 'default' as const };
      case 'avaliacao_pendente':
      case 'reavaliar_qualificacao':
        return { icon: <RotateCcw className="h-4 w-4" />, label: 'Reavaliar', variant: 'default' as const };
      case 'fornecedor_inativo':
        return { icon: <CheckCircle className="h-4 w-4" />, label: 'Reativar', variant: 'default' as const };
      case 'promover_preferencial':
        return { icon: <Star className="h-4 w-4" />, label: 'Promover', variant: 'default' as const };
      default:
        return { icon: <Eye className="h-4 w-4" />, label: 'Ver Detalhes', variant: 'outline' as const };
    }
  };

  const handleExecutarAcao = (acao: AcaoRecomendada) => {
    const botao = getAcaoBotao(acao.tipo_acao);
    
    executarAcao.mutate({ 
      id: acao.id, 
      executada_por: 'Usuario Atual' // Em produção, pegar do contexto de auth
    });
    
    toast.info(`Executando: ${botao.label} para ${acao.fornecedor_nome}`);
  };

  const handleVerDetalhes = (acao: AcaoRecomendada) => {
    toast.info(`Visualizando detalhes de ${acao.fornecedor_nome}`);
    // Aqui poderia abrir um modal de detalhes ou navegar para a página do fornecedor
  };

  const handleReprocessar = () => {
    reprocessarIA.mutate();
  };

  const acoesAgrupadas = acoes.reduce((acc, acao) => {
    if (!acc[acao.prioridade]) {
      acc[acao.prioridade] = [];
    }
    acc[acao.prioridade].push(acao);
    return acc;
  }, {} as Record<PrioridadeAcao, AcaoRecomendada[]>);

  const contadores = {
    alta: acoesAgrupadas.alta?.length || 0,
    media: acoesAgrupadas.media?.length || 0,
    baixa: acoesAgrupadas.baixa?.length || 0,
    total: acoes.length
  };

  return (
    <ExpandedDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ações Recomendadas pela IA"
      description="📋 Visão geral das prioridades e sugestões para os fornecedores sob sua gestão"
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold">Ações Recomendadas pela IA</span>
            <Badge variant="secondary" className="text-xs">
              {contadores.total} ações pendentes
            </Badge>
          </div>
          <div className="flex justify-start">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReprocessar}
                    disabled={reprocessarIA.isPending}
                  >
                    <RefreshCw className={`h-4 w-4 ${reprocessarIA.isPending ? 'animate-spin' : ''}`} />
                    Reprocessar IA
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refazer análise e atualizar recomendações</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando ações...</span>
            </div>
          ) : (
            <>
              {(['alta', 'media', 'baixa'] as PrioridadeAcao[]).map((prioridade) => {
                const acoesGrupo = acoesAgrupadas[prioridade] || [];
                const config = getPrioridadeConfig(prioridade);
                
                if (acoesGrupo.length === 0) return null;
                
                return (
                  <div key={prioridade} className="space-y-3">
                    <h3 className={`font-semibold text-lg flex items-center gap-2 ${config.textColor}`}>
                      <span>{config.icon}</span>
                      {config.label} ({acoesGrupo.length})
                    </h3>
                    
                    <div className="space-y-3">
                      {acoesGrupo.map((acao, index) => {
                        const tipoConfig = getTipoAcaoConfig(acao.tipo_acao);
                        const botao = getAcaoBotao(acao.tipo_acao);
                        
                        return (
                          <Card key={acao.id} className={`${config.bgColor} ${config.borderColor} border`}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-900">
                                    {index + 1}. {acao.fornecedor_nome} – CNPJ {acao.fornecedor_cnpj}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    {tipoConfig.icon}
                                    <span className="text-sm font-medium">{acao.titulo}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {new Date(acao.sugerida_em).toLocaleDateString('pt-BR')}
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            
                            <CardContent className="pt-0">
                              <p className="text-sm text-slate-600 mb-3">{acao.descricao}</p>
                              
                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleVerDetalhes(acao)}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="h-3 w-3" />
                                  Ver Detalhes
                                </Button>
                                
                                <Button
                                  variant={botao.variant}
                                  size="sm"
                                  onClick={() => handleExecutarAcao(acao)}
                                  disabled={executarAcao.isPending}
                                  className="flex items-center gap-1"
                                >
                                  {botao.icon}
                                  {botao.label}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}
          
          {!isLoading && acoes.length === 0 && (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                Nenhuma ação pendente
              </h3>
              <p className="text-slate-500">
                Todos os fornecedores estão em conformidade. A IA irá gerar novas recomendações conforme necessário.
              </p>
            </div>
          )}
        
        <div className="border-t pt-3 mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>🧠 Classificação por IA | Atualizado em: {new Date().toLocaleString('pt-BR')}</span>
            <span>{contadores.alta + contadores.media + contadores.baixa} ações pendentes</span>
          </div>
        </div>
      </div>
    </ExpandedDialog>
  );
};
