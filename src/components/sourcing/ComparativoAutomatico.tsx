import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  FileText, 
  DollarSign,
  Trophy,
  Clock
} from "lucide-react";
import { PropostaComparacao, RFPData } from "@/hooks/useProposalComparison";

interface ComparativoAutomaticoProps {
  propostas: PropostaComparacao[];
  rfpData: RFPData;
}

export function ComparativoAutomatico({ propostas, rfpData }: ComparativoAutomaticoProps) {
  const [selectedProposta, setSelectedProposta] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enviada':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'analise':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'aprovada':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejeitada':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'enviada': 'default',
      'analise': 'secondary',
      'aprovada': 'default',
      'rejeitada': 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getRankingIcon = (ranking: number) => {
    if (ranking === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (ranking === 2) return <Trophy className="h-4 w-4 text-gray-400" />;
    if (ranking === 3) return <Trophy className="h-4 w-4 text-amber-600" />;
    return <span className="text-sm font-medium">{ranking}º</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 7) return "text-yellow-600";
    return "text-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Mapa Comparativo Automático
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Fornecedor</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Documentos</th>
                <th className="text-left p-3 font-medium">Valor Total</th>
                <th className="text-left p-3 font-medium">Tributos</th>
                <th className="text-left p-3 font-medium">Prazo</th>
                <th className="text-left p-3 font-medium">Nota Técnica</th>
                <th className="text-left p-3 font-medium">Nota Final</th>
                <th className="text-left p-3 font-medium">Ranking</th>
                <th className="text-left p-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {propostas.map((proposta) => (
                <tr 
                  key={proposta.id} 
                  className={`border-b hover:bg-muted/50 ${
                    selectedProposta === proposta.id ? 'bg-muted' : ''
                  }`}
                >
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {proposta.fornecedor.nome.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{proposta.fornecedor.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          {proposta.fornecedor.documento}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(proposta.status)}
                      {getStatusBadge(proposta.status)}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {proposta.documentos.enviados}/{proposta.documentos.total}
                      </span>
                      <Progress 
                        value={(proposta.documentos.enviados / proposta.documentos.total) * 100} 
                        className="w-16 h-2"
                      />
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div>
                      <div className="font-medium">
                        {(proposta.valorComImpostos || proposta.valorTotal).toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </div>
                      {proposta.valorComImpostos && proposta.valorComImpostos !== proposta.valorTotal && (
                        <div className="text-sm text-muted-foreground">
                          Sem impostos: {proposta.valorTotal.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    {proposta.tributos > 0 ? (
                      <div className="text-sm">
                        <div className="font-medium text-green-600">
                          {proposta.tributos.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </div>
                        <div className="text-muted-foreground">Detalhado</div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Não informado
                      </Badge>
                    )}
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {proposta.prazoEntrega} {proposta.unidadePrazo}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className={`font-medium ${getScoreColor(proposta.notaTecnica)}`}>
                      {proposta.notaTecnica.toFixed(1)}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className={`font-bold ${getScoreColor(proposta.notaFinal)}`}>
                      {proposta.notaFinal.toFixed(1)}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      {getRankingIcon(proposta.ranking)}
                      <span className="text-sm font-medium">
                        {proposta.ranking}º lugar
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProposta(
                          selectedProposta === proposta.id ? null : proposta.id
                        )}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detalhes expandidos */}
        {selectedProposta && (
          <div className="mt-6 border-t pt-6">
            {(() => {
              const proposta = propostas.find(p => p.id === selectedProposta);
              if (!proposta) return null;

              return (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">
                    Detalhes - {proposta.fornecedor.nome}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Observações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {proposta.observacoes || "Nenhuma observação"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Anexos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {proposta.anexos.map((anexo) => (
                            <div key={anexo.id} className="flex items-center space-x-2 text-sm">
                              <FileText className="h-3 w-3" />
                              <span className="truncate">{anexo.nome}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Data de Envio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          {new Date(proposta.dataEnvio).toLocaleString('pt-BR')}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}