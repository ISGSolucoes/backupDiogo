import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, Star } from "lucide-react";
import { PropostaComparacao } from "@/hooks/useProposalComparison";

interface CriteriosTecnicosProps {
  propostas: PropostaComparacao[];
  criterios: any[];
}

export function CriteriosTecnicos({ propostas, criterios }: CriteriosTecnicosProps) {
  const getAvaliacaoIcon = (tipo: string, valor: any) => {
    if (tipo === 'boolean') {
      return valor ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      );
    }
    
    if (tipo === 'rating') {
      const score = parseInt(valor);
      if (score >= 8) return <Star className="h-4 w-4 text-green-500" />;
      if (score >= 6) return <Star className="h-4 w-4 text-yellow-500" />;
      return <Star className="h-4 w-4 text-red-500" />;
    }
    
    return <AlertTriangle className="h-4 w-4 text-gray-400" />;
  };

  const getAvaliacaoTexto = (tipo: string, valor: any) => {
    if (tipo === 'boolean') {
      return valor ? 'Atende' : 'Não atende';
    }
    
    if (tipo === 'rating') {
      return `${valor}/10`;
    }
    
    return valor || 'N/A';
  };

  const getAvaliacaoVariant = (tipo: string, valor: any) => {
    if (tipo === 'boolean') {
      return valor ? 'default' : 'destructive';
    }
    
    if (tipo === 'rating') {
      const score = parseInt(valor);
      if (score >= 8) return 'default';
      if (score >= 6) return 'secondary';
      return 'destructive';
    }
    
    return 'outline';
  };

  const calcularNotaTotal = (proposta: PropostaComparacao) => {
    let notaTotal = 0;
    let pesoTotal = 0;

    criterios.forEach((criterio) => {
      const avaliacao = proposta.avaliacoesCriterios[criterio.id];
      let nota = 0;

      if (criterio.tipo === 'boolean') {
        nota = avaliacao ? 10 : 0;
      } else if (criterio.tipo === 'rating') {
        nota = parseInt(avaliacao) || 0;
      }

      notaTotal += nota * (criterio.peso / 100);
      pesoTotal += criterio.peso;
    });

    return notaTotal;
  };

  return (
    <div className="space-y-6">
      {/* Resumo das Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Avaliações Técnicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {propostas.map((proposta) => {
              const notaCalculada = calcularNotaTotal(proposta);
              const critériosAtendidos = criterios.filter((c) => {
                const avaliacao = proposta.avaliacoesCriterios[c.id];
                if (c.tipo === 'boolean') return avaliacao;
                if (c.tipo === 'rating') return parseInt(avaliacao) >= 7;
                return false;
              }).length;

              return (
                <Card key={proposta.id} className={proposta.ranking === 1 ? 'border-primary' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>{proposta.fornecedor.nome}</span>
                      {proposta.ranking === 1 && (
                        <Badge variant="default">🏆 1º</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Nota Técnica</span>
                          <span className="font-medium">{proposta.notaTecnica.toFixed(1)}</span>
                        </div>
                        <Progress value={(proposta.notaTecnica / 10) * 100} className="h-2" />
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <div>Critérios atendidos: {critériosAtendidos}/{criterios.length}</div>
                        <div>Nota calculada: {notaCalculada.toFixed(1)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabela Detalhada de Critérios */}
      <Card>
        <CardHeader>
          <CardTitle>Avaliação Detalhada por Critério</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium min-w-64">Critério</th>
                  <th className="text-center p-3 font-medium">Peso</th>
                  {propostas.map((proposta) => (
                    <th key={proposta.id} className="text-center p-3 font-medium min-w-32">
                      {proposta.fornecedor.nome}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criterios.map((criterio) => (
                  <tr key={criterio.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{criterio.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          Tipo: {criterio.tipo === 'boolean' ? 'Sim/Não' : 'Nota 0-10'}
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="font-medium">
                        {criterio.peso}%
                      </Badge>
                    </td>
                    
                    {propostas.map((proposta) => {
                      const avaliacao = proposta.avaliacoesCriterios[criterio.id];
                      return (
                        <td key={proposta.id} className="p-3 text-center">
                          <div className="flex flex-col items-center space-y-2">
                            {getAvaliacaoIcon(criterio.tipo, avaliacao)}
                            <Badge variant={getAvaliacaoVariant(criterio.tipo, avaliacao)}>
                              {getAvaliacaoTexto(criterio.tipo, avaliacao)}
                            </Badge>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                
                {/* Linha de Total */}
                <tr className="border-b bg-muted/30 font-medium">
                  <td className="p-3">
                    <div className="font-semibold">TOTAL TÉCNICO</div>
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="default">100%</Badge>
                  </td>
                  {propostas.map((proposta) => (
                    <td key={proposta.id} className="p-3 text-center">
                      <div className="text-lg font-bold">
                        {proposta.notaTecnica.toFixed(1)}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Análise por Critério */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {criterios.map((criterio) => (
          <Card key={criterio.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{criterio.nome}</span>
                <Badge variant="outline">{criterio.peso}%</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {propostas.map((proposta) => {
                  const avaliacao = proposta.avaliacoesCriterios[criterio.id];
                  return (
                    <div key={proposta.id} className="flex items-center justify-between">
                      <span className="text-sm">{proposta.fornecedor.nome}</span>
                      <div className="flex items-center space-x-2">
                        {getAvaliacaoIcon(criterio.tipo, avaliacao)}
                        <Badge variant={getAvaliacaoVariant(criterio.tipo, avaliacao)}>
                          {getAvaliacaoTexto(criterio.tipo, avaliacao)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <div className="text-sm text-muted-foreground">
                    <strong>Resumo:</strong> {
                      criterios.find(c => c.id === criterio.id)?.tipo === 'boolean'
                        ? `${propostas.filter(p => p.avaliacoesCriterios[criterio.id]).length} de ${propostas.length} fornecedores atendem`
                        : `Nota média: ${(propostas.reduce((acc, p) => acc + (parseInt(p.avaliacoesCriterios[criterio.id]) || 0), 0) / propostas.length).toFixed(1)}`
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}