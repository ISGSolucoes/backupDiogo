
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Brain, Edit, Save, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface EstrategiaCategoriaProps {
  categoriaId: string;
}

export const EstrategiaCategoria = ({ categoriaId }: EstrategiaCategoriaProps) => {
  const [editandoEstrategia, setEditandoEstrategia] = useState(false);
  const [estrategia, setEstrategia] = useState({
    objetivo_estrategico: "Redução de custo e melhoria de qualidade",
    acao_recomendada: "Implementar dual sourcing e renegociar contratos com fornecedores principais",
    modelo_compra: "contrato",
    meta_saving: 12,
    sazonalidade: "Maior demanda no Q4 devido a projetos de expansão",
    periodicidade_revisao: 6
  });

  const [sugestaoIA, setSugestaoIA] = useState({
    acao_recomendada: "Abrir novo leilão reverso com contrato de 12 meses",
    justificativa: "Volume alto + risco elevado + NPS abaixo de 50. Mercado aquecido permite competição.",
    meta_saving: 15,
    fornecedores_sugeridos: ["ElectroMax Ltda", "TechCables S.A.", "PowerLine Solutions"],
    prioridade: "alta" as const
  });

  const salvarEstrategia = () => {
    // Simular salvamento
    setTimeout(() => {
      toast.success("Estratégia atualizada com sucesso!");
      setEditandoEstrategia(false);
    }, 1000);
  };

  const aplicarSugestaoIA = () => {
    setEstrategia(prev => ({
      ...prev,
      acao_recomendada: sugestaoIA.acao_recomendada,
      meta_saving: sugestaoIA.meta_saving,
      modelo_compra: "leilao"
    }));
    toast.success("Sugestão da IA aplicada à estratégia!");
  };

  const getPrioridadeCor = (prioridade: string) => {
    const cores = {
      baixa: "bg-green-100 text-green-700",
      media: "bg-yellow-100 text-yellow-700",
      alta: "bg-red-100 text-red-700"
    };
    return cores[prioridade as keyof typeof cores] || cores.baixa;
  };

  return (
    <div className="space-y-6">
      {/* Estratégia Atual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Estratégia da Categoria
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditandoEstrategia(!editandoEstrategia)}
            >
              {editandoEstrategia ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editandoEstrategia ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="objetivo">Objetivo Estratégico</Label>
                <Textarea
                  id="objetivo"
                  value={estrategia.objetivo_estrategico}
                  onChange={(e) => setEstrategia(prev => ({ ...prev, objetivo_estrategico: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="acao">Ação Recomendada</Label>
                <Textarea
                  id="acao"
                  value={estrategia.acao_recomendada}
                  onChange={(e) => setEstrategia(prev => ({ ...prev, acao_recomendada: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="modelo">Modelo de Compra</Label>
                  <Select
                    value={estrategia.modelo_compra}
                    onValueChange={(value) => setEstrategia(prev => ({ ...prev, modelo_compra: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spot">Spot</SelectItem>
                      <SelectItem value="contrato">Contrato</SelectItem>
                      <SelectItem value="leilao">Leilão</SelectItem>
                      <SelectItem value="catalogo">Catálogo</SelectItem>
                      <SelectItem value="framework">Framework</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="saving">Meta Saving (%)</Label>
                  <Input
                    id="saving"
                    type="number"
                    value={estrategia.meta_saving}
                    onChange={(e) => setEstrategia(prev => ({ ...prev, meta_saving: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="revisao">Revisão (meses)</Label>
                  <Input
                    id="revisao"
                    type="number"
                    value={estrategia.periodicidade_revisao}
                    onChange={(e) => setEstrategia(prev => ({ ...prev, periodicidade_revisao: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sazonalidade">Sazonalidade</Label>
                <Textarea
                  id="sazonalidade"
                  value={estrategia.sazonalidade}
                  onChange={(e) => setEstrategia(prev => ({ ...prev, sazonalidade: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={salvarEstrategia}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Estratégia
                </Button>
                <Button variant="outline" onClick={() => setEditandoEstrategia(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Objetivo Estratégico</h4>
                <p className="text-slate-700">{estrategia.objetivo_estrategico}</p>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-2">Ação Recomendada</h4>
                <p className="text-slate-700">{estrategia.acao_recomendada}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-slate-600">Modelo de Compra</span>
                  <p className="font-medium text-slate-900 capitalize">{estrategia.modelo_compra}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Meta Saving</span>
                  <p className="font-medium text-green-600">{estrategia.meta_saving}%</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Revisão</span>
                  <p className="font-medium text-slate-900">{estrategia.periodicidade_revisao} meses</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-2">Sazonalidade</h4>
                <p className="text-slate-700">{estrategia.sazonalidade}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sugestão da IA */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Brain className="h-5 w-5" />
            IA Rê Sugere
            <Badge className={getPrioridadeCor(sugestaoIA.prioridade)}>
              Prioridade {sugestaoIA.prioridade}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-indigo-900 mb-2">Ação Recomendada</h4>
            <p className="text-indigo-800">{sugestaoIA.acao_recomendada}</p>
          </div>

          <div>
            <h4 className="font-medium text-indigo-900 mb-2">Justificativa</h4>
            <p className="text-indigo-700">{sugestaoIA.justificativa}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-indigo-600">Saving Projetado</span>
              <p className="font-bold text-indigo-900 flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {sugestaoIA.meta_saving}%
              </p>
            </div>
            <Button onClick={aplicarSugestaoIA} className="bg-indigo-600 hover:bg-indigo-700">
              Aplicar Sugestão
            </Button>
          </div>

          <div>
            <h4 className="font-medium text-indigo-900 mb-2">Fornecedores Sugeridos</h4>
            <div className="flex flex-wrap gap-2">
              {sugestaoIA.fornecedores_sugeridos.map((fornecedor, index) => (
                <Badge key={index} variant="secondary" className="bg-white text-indigo-700">
                  {fornecedor}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cronograma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cronograma de Ações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Benchmarking de Mercado</p>
                <p className="text-sm text-blue-700">Análise de preços e novos entrantes</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700">Em 30 dias</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-yellow-900">Renegociação de Contratos</p>
                <p className="text-sm text-yellow-700">Revisar condições com fornecedores atuais</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700">Em 60 dias</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Revisão Estratégica Completa</p>
                <p className="text-sm text-green-700">Avaliação de resultados e ajustes</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Em 6 meses</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
