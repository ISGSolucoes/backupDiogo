import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, DollarSign, Clock, FileText } from "lucide-react";
import { PropostaComparacao, RFPData } from "@/hooks/useProposalComparison";

interface ComparativoItensProps {
  propostas: PropostaComparacao[];
  rfpData: RFPData;
}

export function ComparativoItens({ propostas, rfpData }: ComparativoItensProps) {
  const [itemSelecionado, setItemSelecionado] = useState(0);

  // Agrupa itens por descrição para comparação
  const itensAgrupados = rfpData.itensTemplate.map((template, index) => {
    const itensDoTemplate = propostas.map((proposta) => {
      const item = proposta.itens.find((i) => 
        i.descricao.toLowerCase().includes(template.descricao.toLowerCase()) ||
        template.descricao.toLowerCase().includes(i.descricao.toLowerCase())
      );
      return {
        fornecedor: proposta.fornecedor.nome,
        fornecedorId: proposta.fornecedor.id,
        item: item || null,
        ranking: proposta.ranking
      };
    });

    return {
      template,
      index,
      propostas: itensDoTemplate
    };
  });

  const getMelhorPreco = (itens: any[]) => {
    const precos = itens
      .filter(i => i.item)
      .map(i => i.item.precoTotal);
    return precos.length > 0 ? Math.min(...precos) : 0;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Comparativo por Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={itemSelecionado.toString()} onValueChange={(v) => setItemSelecionado(parseInt(v))}>
            <TabsList className="grid w-full grid-cols-3">
              {itensAgrupados.map((grupo, index) => (
                <TabsTrigger key={index} value={index.toString()} className="text-sm">
                  Item {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {itensAgrupados.map((grupo, index) => (
              <TabsContent key={index} value={index.toString()} className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-semibold text-lg">{grupo.template.descricao}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    Quantidade: {grupo.template.quantidade} {grupo.template.unidade}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Fornecedor</th>
                        <th className="text-left p-3 font-medium">Preço Unitário</th>
                        <th className="text-left p-3 font-medium">Preço Total</th>
                        <th className="text-left p-3 font-medium">Tributos</th>
                        <th className="text-left p-3 font-medium">Valor c/ Tributos</th>
                        <th className="text-left p-3 font-medium">Prazo</th>
                        <th className="text-left p-3 font-medium">Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grupo.propostas.map((proposta, propIndex) => {
                        const item = proposta.item;
                        const melhorPreco = getMelhorPreco(grupo.propostas);
                        const isMelhorPreco = item && item.precoTotal === melhorPreco;

                        return (
                          <tr key={propIndex} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{proposta.fornecedor}</span>
                                {proposta.ranking === 1 && (
                                  <Badge variant="default" className="text-xs">1º Geral</Badge>
                                )}
                              </div>
                            </td>
                            
                            <td className="p-3">
                              {item ? (
                                <span className="font-medium">
                                  {formatCurrency(item.precoUnitario)}
                                </span>
                              ) : (
                                <Badge variant="outline">Não cotado</Badge>
                              )}
                            </td>
                            
                            <td className="p-3">
                              {item ? (
                                <div className="flex items-center space-x-2">
                                  <span className={`font-medium ${isMelhorPreco ? 'text-green-600' : ''}`}>
                                    {formatCurrency(item.precoTotal)}
                                  </span>
                                  {isMelhorPreco && (
                                    <Badge variant="default" className="text-xs bg-green-600">
                                      Melhor
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            
                            <td className="p-3">
                              {item && item.tributos > 0 ? (
                                <span className="text-sm font-medium text-blue-600">
                                  {formatCurrency(item.tributos)}
                                </span>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Não informado
                                </Badge>
                              )}
                            </td>
                            
                            <td className="p-3">
                              {item ? (
                                <span className="font-semibold">
                                  {formatCurrency(item.precoTotal + (item.tributos || 0))}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            
                            <td className="p-3">
                              {item && item.prazoEntrega ? (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">
                                    {item.prazoEntrega} dias
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  Conforme proposta geral
                                </span>
                              )}
                            </td>
                            
                            <td className="p-3">
                              {item && item.observacoes ? (
                                <div className="max-w-48">
                                  <span className="text-sm text-muted-foreground truncate block">
                                    {item.observacoes}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Resumo do Item */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Menor Preço
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(getMelhorPreco(grupo.propostas))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Variação de Preços</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const precos = grupo.propostas
                          .filter(p => p.item)
                          .map(p => p.item!.precoTotal);
                        
                        if (precos.length === 0) {
                          return <span className="text-muted-foreground">-</span>;
                        }

                        const min = Math.min(...precos);
                        const max = Math.max(...precos);
                        const variacao = ((max - min) / min) * 100;

                        return (
                          <div className="text-sm">
                            <div>Menor: {formatCurrency(min)}</div>
                            <div>Maior: {formatCurrency(max)}</div>
                            <div className="font-medium">
                              Variação: {variacao.toFixed(1)}%
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Propostas Recebidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">
                        {grupo.propostas.filter(p => p.item).length} / {grupo.propostas.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((grupo.propostas.filter(p => p.item).length / grupo.propostas.length) * 100)}% de cobertura
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}