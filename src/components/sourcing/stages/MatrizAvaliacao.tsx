import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Scale, TrendingUp, FileCheck, Info, AlertTriangle } from 'lucide-react';
import { useEventTypeLogic } from '@/hooks/useEventTypeLogic';

interface CriterioAvaliacao {
  id: string;
  nome: string;
  descricao: string;
  peso: number;
  tipo: 'tecnico' | 'comercial' | 'qualitativo';
  obrigatorio: boolean;
  escala_min: number;
  escala_max: number;
  unidade?: string;
}

interface MatrizAvaliacaoData {
  criterios: CriterioAvaliacao[];
  peso_tecnico: number;
  peso_comercial: number;
  permite_empate: boolean;
  criterio_desempate: string;
  notas_minimas: {
    tecnica: number;
    comercial: number;
  };
}

interface MatrizAvaliacaoProps {
  data?: MatrizAvaliacaoData;
  onComplete: (data: MatrizAvaliacaoData) => void;
  wizardData?: any;
}

export function MatrizAvaliacao({ data, onComplete, wizardData }: MatrizAvaliacaoProps) {
  const tipoEvento = wizardData?.estrutura?.tipo_evento || 'rfq';
  const { fieldVisibility, config, evaluationSettings, isRFI } = useEventTypeLogic(tipoEvento);

  const [formData, setFormData] = useState<MatrizAvaliacaoData>({
    criterios: data?.criterios || [],
    peso_tecnico: data?.peso_tecnico || evaluationSettings.weights.technical,
    peso_comercial: data?.peso_comercial || evaluationSettings.weights.commercial,
    permite_empate: data?.permite_empate || false,
    criterio_desempate: data?.criterio_desempate || 'menor_preco',
    notas_minimas: data?.notas_minimas || {
      tecnica: 7.0,
      comercial: 0
    }
  });

  // Critérios pré-definidos por tipo de evento
  const criteriosPredefinidos = {
    rfi: [
      { nome: 'Capacidade Técnica', tipo: 'tecnico', peso: 30 },
      { nome: 'Experiência no Segmento', tipo: 'tecnico', peso: 25 },
      { nome: 'Estrutura Organizacional', tipo: 'tecnico', peso: 20 },
      { nome: 'Certificações', tipo: 'qualitativo', peso: 15 },
      { nome: 'Referências', tipo: 'qualitativo', peso: 10 }
    ],
    rfp: [
      { nome: 'Solução Técnica', tipo: 'tecnico', peso: 40 },
      { nome: 'Metodologia', tipo: 'tecnico', peso: 20 },
      { nome: 'Equipe Proposta', tipo: 'tecnico', peso: 10 },
      { nome: 'Preço Total', tipo: 'comercial', peso: 25 },
      { nome: 'Prazo de Entrega', tipo: 'comercial', peso: 5 }
    ],
    rfq: [
      { nome: 'Preço Unitário', tipo: 'comercial', peso: 70 },
      { nome: 'Prazo de Entrega', tipo: 'comercial', peso: 20 },
      { nome: 'Conformidade Técnica', tipo: 'tecnico', peso: 10 }
    ],
    leilao_reverso: [
      { nome: 'Qualificação Técnica', tipo: 'tecnico', peso: 30 },
      { nome: 'Valor do Lance', tipo: 'comercial', peso: 60 },
      { nome: 'Condições de Pagamento', tipo: 'comercial', peso: 10 }
    ]
  };

  useEffect(() => {
    // Carrega critérios pré-definidos se não houver dados
    if (formData.criterios.length === 0) {
      const criteriosDefault = criteriosPredefinidos[tipoEvento as keyof typeof criteriosPredefinidos] || [];
      const novoscCriterios = criteriosDefault.map((criterio, index) => ({
        id: `criterio_${index + 1}`,
        nome: criterio.nome,
        descricao: `Avaliação de ${criterio.nome.toLowerCase()}`,
        peso: criterio.peso,
        tipo: criterio.tipo as 'tecnico' | 'comercial' | 'qualitativo',
        obrigatorio: true,
        escala_min: 0,
        escala_max: 10
      }));
      
      setFormData(prev => ({
        ...prev,
        criterios: novoscCriterios
      }));
    }
  }, [tipoEvento]);

  useEffect(() => {
    onComplete(formData);
  }, [formData, onComplete]);

  const adicionarCriterio = () => {
    const novoCriterio: CriterioAvaliacao = {
      id: `criterio_${Date.now()}`,
      nome: '',
      descricao: '',
      peso: 10,
      tipo: 'tecnico',
      obrigatorio: false,
      escala_min: 0,
      escala_max: 10
    };

    setFormData(prev => ({
      ...prev,
      criterios: [...prev.criterios, novoCriterio]
    }));
  };

  const removerCriterio = (id: string) => {
    setFormData(prev => ({
      ...prev,
      criterios: prev.criterios.filter(c => c.id !== id)
    }));
  };

  const atualizarCriterio = (id: string, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      criterios: prev.criterios.map(c => 
        c.id === id ? { ...c, [campo]: valor } : c
      )
    }));
  };

  const ajustarPesos = (novoTecnico: number) => {
    const novoComercial = 100 - novoTecnico;
    setFormData(prev => ({
      ...prev,
      peso_tecnico: novoTecnico,
      peso_comercial: novoComercial
    }));
  };

  const pesoTotal = formData.criterios.reduce((sum, c) => sum + c.peso, 0);
  const pesoTecnico = formData.criterios.filter(c => c.tipo === 'tecnico').reduce((sum, c) => sum + c.peso, 0);
  const pesoComercial = formData.criterios.filter(c => c.tipo === 'comercial').reduce((sum, c) => sum + c.peso, 0);

  if (isRFI) {
    return (
      <div className="space-y-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">RFI - Request for Information</span>
            </div>
            <p className="text-sm text-blue-700">
              Para RFI, a avaliação é qualitativa e manual. Não há pontuação automática ou ranking.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Critérios de Análise (RFI)
            </CardTitle>
            <CardDescription>
              Defina os aspectos que serão analisados nas respostas dos fornecedores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.criterios.map((criterio) => (
              <div key={criterio.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    value={criterio.nome}
                    onChange={(e) => atualizarCriterio(criterio.id, 'nome', e.target.value)}
                    placeholder="Nome do critério"
                    className="font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removerCriterio(criterio.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={criterio.descricao}
                  onChange={(e) => atualizarCriterio(criterio.id, 'descricao', e.target.value)}
                  placeholder="Descreva o que será analisado neste critério..."
                  rows={2}
                />
              </div>
            ))}

            <Button onClick={adicionarCriterio} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Critério de Análise
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informações do Tipo de Evento */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-primary" />
            <span className="font-medium text-primary">Tipo de Evento: {tipoEvento.toUpperCase()}</span>
          </div>
          <p className="text-sm text-muted-foreground">{config.focusArea}</p>
        </CardContent>
      </Card>

      {/* Configuração de Pesos */}
      {fieldVisibility.technicalCriteria && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Pesos da Avaliação
            </CardTitle>
            <CardDescription>
              Configure o balanceamento entre critérios técnicos e comerciais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Peso Técnico: {formData.peso_tecnico}%</Label>
                <Slider
                  value={[formData.peso_tecnico]}
                  onValueChange={(value) => ajustarPesos(value[0])}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Peso Comercial: {formData.peso_comercial}%</Label>
                <div className="text-sm text-muted-foreground">
                  Ajustado automaticamente para {formData.peso_comercial}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critérios de Avaliação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Critérios de Avaliação
          </CardTitle>
          <CardDescription>
            Defina os critérios que serão utilizados para avaliar as propostas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pesoTotal !== 100 && formData.criterios.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                A soma dos pesos deve ser 100%. Atualmente: {pesoTotal.toFixed(1)}%
              </span>
            </div>
          )}

          {formData.criterios.map((criterio) => (
            <div key={criterio.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <Input
                    value={criterio.nome}
                    onChange={(e) => atualizarCriterio(criterio.id, 'nome', e.target.value)}
                    placeholder="Nome do critério"
                    className="font-medium"
                  />
                  <Textarea
                    value={criterio.descricao}
                    onChange={(e) => atualizarCriterio(criterio.id, 'descricao', e.target.value)}
                    placeholder="Descreva como este critério será avaliado..."
                    rows={2}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removerCriterio(criterio.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={criterio.tipo}
                    onValueChange={(value) => atualizarCriterio(criterio.id, 'tipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="qualitativo">Qualitativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Peso (%)</Label>
                  <Input
                    type="number"
                    value={criterio.peso}
                    onChange={(e) => atualizarCriterio(criterio.id, 'peso', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div>
                  <Label>Escala Mín.</Label>
                  <Input
                    type="number"
                    value={criterio.escala_min}
                    onChange={(e) => atualizarCriterio(criterio.id, 'escala_min', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Escala Máx.</Label>
                  <Input
                    type="number"
                    value={criterio.escala_max}
                    onChange={(e) => atualizarCriterio(criterio.id, 'escala_max', parseFloat(e.target.value) || 10)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={criterio.obrigatorio}
                  onCheckedChange={(checked) => atualizarCriterio(criterio.id, 'obrigatorio', checked)}
                />
                <Label>Critério obrigatório</Label>
              </div>
            </div>
          ))}

          <Button onClick={adicionarCriterio} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Critério
          </Button>

          {/* Resumo dos Pesos */}
          {formData.criterios.length > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Resumo dos Pesos</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Técnico:</span> {pesoTecnico.toFixed(1)}%
                </div>
                <div>
                  <span className="font-medium">Comercial:</span> {pesoComercial.toFixed(1)}%
                </div>
                <div>
                  <span className="font-medium">Total:</span> {pesoTotal.toFixed(1)}%
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações de Julgamento */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Julgamento</CardTitle>
          <CardDescription>
            Defina regras para avaliação e desempate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nota Mínima Técnica</Label>
              <Input
                type="number"
                value={formData.notas_minimas.tecnica}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notas_minimas: {
                    ...prev.notas_minimas,
                    tecnica: parseFloat(e.target.value) || 0
                  }
                }))}
                min="0"
                max="10"
                step="0.1"
              />
            </div>

            <div>
              <Label>Critério de Desempate</Label>
              <Select
                value={formData.criterio_desempate}
                onValueChange={(value) => setFormData(prev => ({ ...prev, criterio_desempate: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menor_preco">Menor Preço</SelectItem>
                  <SelectItem value="maior_nota_tecnica">Maior Nota Técnica</SelectItem>
                  <SelectItem value="prazo_entrega">Menor Prazo de Entrega</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.permite_empate}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, permite_empate: checked }))}
            />
            <Label>Permitir empates na classificação final</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}