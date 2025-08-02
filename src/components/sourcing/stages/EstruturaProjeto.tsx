import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Building2, Package, Wrench, Zap, FileText, Users, Calendar, FileCheck, Calculator, Gavel, Tag } from 'lucide-react';
import { SourcingWizardData } from '../SourcingWizard';
import { useSmartRules } from '@/hooks/useSmartRules';
import { RuleAlert } from '../RuleAlert';
import { ModeloBanner } from '../ModeloBanner';
import { AderenciaIndicator } from '../AderenciaIndicator';
import { LoteManager, Lote, LoteItem } from '../LoteManager';
import { ItemTypeTags, detectItemType, ItemType } from '../ItemTypeTags';

export interface EstruturaProjetoData {
  nome_projeto: string;
  descricao: string;
  setor: string;
  categoria: string;
  cliente_id?: string;
  tipo_aquisicao: 'materiais' | 'servicos' | 'misto';
  regiao: string;
  departamento: string;
  proprietario: string;
  template_selecionado: string;
  tipo_evento: 'rfi' | 'rfp' | 'rfq' | 'leilao_reverso';
  configuracoes_leilao?: {
    leilao_reverso: boolean;
    lance_minimo: number;
    incremento_lance: number;
    tempo_prorrogacao: number;
  };
  nivel_complexidade: 'baixa' | 'media' | 'alta';
  valor_estimado_total?: number;
  prazo_evento_dias: number;
  // Novos campos para recursos avançados
  lotes?: Array<{
    id: string;
    nome: string;
    descricao?: string;
    tipo: 'material' | 'servico' | 'misto';
    ordem: number;
  }>;
  itens_projeto?: Array<{
    id: string;
    descricao: string;
    tipo: 'material' | 'servico' | 'misto';
    loteId?: string;
  }>;
  criterios_definidos?: string[];
  campos_preenchidos?: string[];
}

interface EstruturaProjetoProps {
  data?: EstruturaProjetoData;
  onComplete: (data: EstruturaProjetoData) => void;
  wizardData?: SourcingWizardData;
}

const TEMPLATES_SOURCING = [
  {
    id: 'materiais_basicos',
    nome: 'Materiais Básicos',
    descricao: 'Template para aquisição de materiais básicos como papelaria, EPI, material de limpeza',
    tipo: 'materiais',
    icone: Package,
    criterios_padrao: ['preco', 'qualidade', 'prazo_entrega'],
    complexidade: 'baixa'
  },
  {
    id: 'servicos_manutencao',
    nome: 'Serviços de Manutenção',
    descricao: 'Template para contratação de serviços de manutenção predial, equipamentos',
    tipo: 'servicos',
    icone: Wrench,
    criterios_padrao: ['preco', 'experiencia', 'certificacoes', 'tempo_resposta'],
    complexidade: 'media'
  },
  {
    id: 'equipamentos_tecnologia',
    nome: 'Equipamentos de Tecnologia',
    descricao: 'Template para aquisição de equipamentos de TI, software, hardware',
    tipo: 'materiais',
    icone: Zap,
    criterios_padrao: ['preco', 'especificacoes_tecnicas', 'garantia', 'suporte'],
    complexidade: 'alta'
  },
  {
    id: 'servicos_consultoria',
    nome: 'Serviços de Consultoria',
    descricao: 'Template para contratação de consultorias especializadas e assessorias',
    tipo: 'servicos',
    icone: Users,
    criterios_padrao: ['preco', 'experiencia', 'metodologia', 'equipe'],
    complexidade: 'alta'
  },
  {
    id: 'obra_construcao',
    nome: 'Obras e Construção',
    descricao: 'Template para projetos de obras, reformas e construções',
    tipo: 'misto',
    icone: Building2,
    criterios_padrao: ['preco', 'experiencia', 'cronograma', 'qualidade_tecnica'],
    complexidade: 'alta'
  }
];

const SUGESTOES_IA = {
  materiais: [
    'Baseado no valor estimado, recomendo utilizar processo de cotação simples',
    'Considere incluir critérios de sustentabilidade para materiais',
    'Avalie a possibilidade de contratos com entrega programada'
  ],
  servicos: [
    'Para serviços especializados, priorize a experiência do fornecedor',
    'Considere incluir período de garantia dos serviços',
    'Avalie a necessidade de visita técnica prévia'
  ],
  misto: [
    'Projetos mistos requerem coordenação entre diferentes fornecedores',
    'Considere separar em lotes por tipo de fornecimento',
    'Avalie a necessidade de um fornecedor principal (prime contractor)'
  ]
};

export function EstruturaProjeto({ data, onComplete, wizardData }: EstruturaProjetoProps) {
  const [formData, setFormData] = useState<EstruturaProjetoData>({
    nome_projeto: '',
    descricao: '',
    setor: '',
    categoria: '',
    cliente_id: undefined,
    tipo_aquisicao: 'materiais',
    regiao: '',
    departamento: '',
    proprietario: '',
    template_selecionado: '',
    tipo_evento: 'rfq',
    nivel_complexidade: 'baixa',
    prazo_evento_dias: 10,
    lotes: [],
    itens_projeto: [],
    criterios_definidos: [],
    campos_preenchidos: [],
    ...data
  });

  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [templateSelecionado, setTemplateSelecionado] = useState<any>(null);
  const [mostrarLoteManager, setMostrarLoteManager] = useState(false);
  
  // Sistema de regras inteligentes
  const smartRules = useSmartRules(formData.setor, formData.categoria, formData.cliente_id, formData.departamento);

  // Aplicar configurações automáticas baseadas em regras inteligentes
  useEffect(() => {
    if (smartRules.recommendation) {
      const rec = smartRules.recommendation;
      setFormData(prev => ({
        ...prev,
        tipo_evento: rec.tipoEvento,
        tipo_aquisicao: rec.tipoAquisicao,
        // usar_leilao: rec.leilaoPermitido !== 'desabilitado'
      }));
    }
  }, [formData.setor, formData.categoria, formData.cliente_id]);

  useEffect(() => {
    if (formData.template_selecionado) {
      const template = TEMPLATES_SOURCING.find(t => t.id === formData.template_selecionado);
      setTemplateSelecionado(template);
    }
  }, [formData.template_selecionado]);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const isValid = formData.nome_projeto && 
                   formData.tipo_aquisicao && 
                   formData.regiao && 
                   formData.departamento && 
                   formData.proprietario &&
                   formData.template_selecionado;
    
    if (isValid) {
      onComplete(formData);
    }
  };

  const updateFormData = (field: keyof EstruturaProjetoData, value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      // Atualizar campos preenchidos para o indicador de aderência
      campos_preenchidos: prev.campos_preenchidos?.includes(field as string) 
        ? prev.campos_preenchidos 
        : [...(prev.campos_preenchidos || []), field as string]
    }));
  };

  // Funções para gerenciar lotes e itens
  const handleLotesChange = (lotes: Array<{ id: string; nome: string; descricao?: string; tipo: ItemType; ordem: number }>) => {
    updateFormData('lotes', lotes);
  };

  const handleItensChange = (itens: Array<{ id: string; descricao: string; tipo: ItemType; loteId?: string }>) => {
    updateFormData('itens_projeto', itens);
  };

  // Detectar tipo de aquisição automaticamente baseado nos itens
  useEffect(() => {
    if (formData.itens_projeto && formData.itens_projeto.length > 0) {
      const tipos = formData.itens_projeto.map(item => item.tipo);
      const hasServico = tipos.includes('servico');
      const hasMaterial = tipos.includes('material');
      
      if (hasServico && hasMaterial) {
        updateFormData('tipo_aquisicao', 'misto');
      } else if (hasServico) {
        updateFormData('tipo_aquisicao', 'servicos');
      } else {
        updateFormData('tipo_aquisicao', 'materiais');
      }
    }
  }, [formData.itens_projeto]);

  const gerarDescricaoIA = () => {
    const template = TEMPLATES_SOURCING.find(t => t.id === formData.template_selecionado);
    if (template && formData.nome_projeto) {
      const descricao = `Projeto de aquisição de ${formData.tipo_aquisicao} utilizando template ${template.nome}. ${template.descricao}. Departamento solicitante: ${formData.departamento}. Região de entrega: ${formData.regiao}.`;
      updateFormData('descricao', descricao);
    }
  };

  const templatesFiltrados = formData.tipo_aquisicao === 'misto' 
    ? TEMPLATES_SOURCING 
    : TEMPLATES_SOURCING.filter(t => t.tipo === formData.tipo_aquisicao || t.tipo === 'misto');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Estrutura do Projeto</h3>
          <p className="text-sm text-muted-foreground">
            Configure os parâmetros iniciais do projeto de sourcing
          </p>
        </div>
      </div>

      {/* Banner do Modelo Aplicado */}
      <ModeloBanner 
        setor={formData.setor}
        categoria={formData.categoria}
        clienteId={formData.cliente_id}
        tipoEvento={formData.tipo_evento}
        departamento={formData.departamento}
      />

      {/* Indicador de Aderência Técnica */}
      <AderenciaIndicator 
        setor={formData.setor}
        categoria={formData.categoria}
        clienteId={formData.cliente_id}
        criteriosDefinidos={formData.criterios_definidos || []}
        camposPreenchidos={formData.campos_preenchidos || []}
      />

      {/* Sistema de Regras Aplicadas */}
      {smartRules.recommendation && (
        <RuleAlert 
          alertas={smartRules.recommendation.alertas}
          regrasAplicadas={smartRules.recommendation.regrasAplicadas}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome_projeto">Nome do Projeto *</Label>
              <Input
                id="nome_projeto"
                placeholder="Ex: Aquisição Material de Escritório 2024"
                value={formData.nome_projeto}
                onChange={(e) => updateFormData('nome_projeto', e.target.value)}
                disabled={smartRules.clientRules.isFieldBlocked('nome_projeto')}
              />
              {smartRules.clientRules.getFieldReason('nome_projeto') && (
                <p className="text-xs text-muted-foreground mt-1">
                  🔒 {smartRules.clientRules.getFieldReason('nome_projeto')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="setor">
                <Building2 className="w-4 h-4 inline mr-2" />
                Setor/Segmento
              </Label>
              <Select value={formData.setor} onValueChange={(value) => updateFormData('setor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {smartRules.sourcingRules?.sectorOptions?.map(sector => (
                    <SelectItem key={sector.value} value={sector.value}>
                      <div>
                        <div className="font-medium">{sector.label}</div>
                        <div className="text-xs text-muted-foreground">
                          Evento padrão: {sector.defaultEvent?.toUpperCase()}
                        </div>
                      </div>
                    </SelectItem>
                  )) || smartRules.sectorLogic.sectorOptions.map(sector => (
                    <SelectItem key={sector.value} value={sector.value}>
                      <div>
                        <div className="font-medium">{sector.label}</div>
                        <div className="text-xs text-muted-foreground">{sector.observacoes}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">
                <Tag className="w-4 h-4 inline mr-2" />
                Categoria
              </Label>
              <Select 
                value={formData.categoria} 
                onValueChange={(value) => updateFormData('categoria', value)}
                disabled={!formData.setor}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {smartRules.sourcingRules?.categoryOptions?.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <div>
                        <div className="font-medium">{category.label}</div>
                        {category.suggestedEvent && (
                          <div className="text-xs text-muted-foreground">
                            Sugerido: {category.suggestedEvent.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  )) || smartRules.categoryLogic.categoryOptions.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente (Opcional)</Label>
              <Select value={formData.cliente_id || 'none'} onValueChange={(value) => updateFormData('cliente_id', value === 'none' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum cliente específico</SelectItem>
                  {smartRules.clientRules.clientOptions.map(client => (
                    <SelectItem key={client.value} value={client.value}>
                      <div>
                        <div className="font-medium">{client.label}</div>
                        <div className="text-xs text-muted-foreground">{client.setor} • {client.tipo}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_aquisicao">Tipo de Aquisição *</Label>
              <Select
                value={formData.tipo_aquisicao}
                onValueChange={(value) => updateFormData('tipo_aquisicao', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materiais">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Materiais
                    </div>
                  </SelectItem>
                  <SelectItem value="servicos">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Serviços
                    </div>
                  </SelectItem>
                  <SelectItem value="misto">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Misto (Materiais + Serviços)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="regiao">Região *</Label>
                <Select
                  value={formData.regiao}
                  onValueChange={(value) => updateFormData('regiao', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sudeste">Sudeste</SelectItem>
                    <SelectItem value="sul">Sul</SelectItem>
                    <SelectItem value="nordeste">Nordeste</SelectItem>
                    <SelectItem value="norte">Norte</SelectItem>
                    <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
                    <SelectItem value="nacional">Nacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento/Responsável *</Label>
                <Select
                  value={formData.departamento}
                  onValueChange={(value) => updateFormData('departamento', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Depto" />
                  </SelectTrigger>
                  <SelectContent>
                    {smartRules.sourcingRules?.departmentOptions?.map(dept => (
                      <SelectItem key={dept.value} value={dept.value}>
                        <div>
                          <div className="font-medium">{dept.label}</div>
                          {dept.responsavel && (
                            <div className="text-xs text-muted-foreground">
                              Responsável: {dept.responsavel}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    )) || [
                      <SelectItem key="compras" value="compras">Compras - João Silva</SelectItem>,
                      <SelectItem key="ti" value="ti">Tecnologia - Maria Santos</SelectItem>,
                      <SelectItem key="rh" value="rh">Recursos Humanos - Pedro Costa</SelectItem>,
                      <SelectItem key="financeiro" value="financeiro">Financeiro - Ana Oliveira</SelectItem>,
                      <SelectItem key="operacoes" value="operacoes">Operações - Carlos Lima</SelectItem>,
                      <SelectItem key="manutencao" value="manutencao">Manutenção - Roberto Alves</SelectItem>
                    ]}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proprietario">Proprietário do Projeto *</Label>
              <Input
                id="proprietario"
                placeholder="Nome do responsável"
                value={formData.proprietario}
                onChange={(e) => updateFormData('proprietario', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Template e Configurações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Template e Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Template de Sourcing *</Label>
              <Select
                value={formData.template_selecionado}
                onValueChange={(value) => updateFormData('template_selecionado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  {templatesFiltrados.map((template) => {
                    const IconeTemplate = template.icone;
                    return (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <IconeTemplate className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{template.nome}</div>
                            <div className="text-xs text-muted-foreground">
                              {template.descricao}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {templateSelecionado && (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{templateSelecionado.complexidade}</Badge>
                  <Badge variant="outline">{templateSelecionado.tipo}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {templateSelecionado.descricao}
                </p>
                <div className="text-xs">
                  <strong>Critérios padrão:</strong> {templateSelecionado.criterios_padrao.join(', ')}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tipo_evento">
                Tipo de Evento
                {smartRules.clientRules.isFieldBlocked('tipo_evento') && (
                  <Badge variant="secondary" className="ml-2 text-xs">Bloqueado</Badge>
                )}
              </Label>
              <Select 
                value={formData.tipo_evento} 
                onValueChange={(value) => updateFormData('tipo_evento', value)}
                disabled={smartRules.clientRules.isFieldBlocked('tipo_evento')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  {smartRules.sourcingRules?.eventOptions?.map(event => (
                    <SelectItem key={event.value} value={event.value}>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">{event.label}</div>
                          <div className="text-xs text-muted-foreground">{event.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  )) || [
                    <SelectItem key="rfi" value="rfi">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <div>
                          <div className="font-medium">RFI - Request for Information</div>
                          <div className="text-xs text-muted-foreground">Coleta de informações e capacidades técnicas</div>
                        </div>
                      </div>
                    </SelectItem>,
                    <SelectItem key="rfp" value="rfp">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4" />
                        <div>
                          <div className="font-medium">RFP - Request for Proposal</div>
                          <div className="text-xs text-muted-foreground">Proposta técnica e comercial integrada</div>
                        </div>
                      </div>
                    </SelectItem>,
                    <SelectItem key="rfq" value="rfq">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        <div>
                          <div className="font-medium">RFQ - Request for Quotation</div>
                          <div className="text-xs text-muted-foreground">Cotação de preços e condições comerciais</div>
                        </div>
                      </div>
                    </SelectItem>,
                    <SelectItem key="leilao_reverso" value="leilao_reverso">
                      <div className="flex items-center gap-2">
                        <Gavel className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Leilão Reverso</div>
                          <div className="text-xs text-muted-foreground">Processo competitivo com lances em tempo real</div>
                        </div>
                      </div>
                    </SelectItem>
                  ]}
                </SelectContent>
              </Select>
              {smartRules.clientRules.getFieldReason('tipo_evento') && (
                <p className="text-xs text-muted-foreground mt-1">
                  🔒 {smartRules.clientRules.getFieldReason('tipo_evento')}
                </p>
              )}
            </div>

            {formData.tipo_evento === 'leilao_reverso' && (
              <div className="space-y-3 p-3 border rounded-lg">
                <Label className="text-sm font-medium">Configurações do Leilão</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Lance Mínimo (R$)</Label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={formData.configuracoes_leilao?.lance_minimo || ''}
                      onChange={(e) => updateFormData('configuracoes_leilao', {
                        ...formData.configuracoes_leilao,
                        lance_minimo: Number(e.target.value)
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Incremento (R$)</Label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={formData.configuracoes_leilao?.incremento_lance || ''}
                      onChange={(e) => updateFormData('configuracoes_leilao', {
                        ...formData.configuracoes_leilao,
                        incremento_lance: Number(e.target.value)
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complexidade">Complexidade *</Label>
                <Select
                  value={formData.nivel_complexidade}
                  onValueChange={(value) => updateFormData('nivel_complexidade', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">
                      <Badge variant="secondary">Baixa</Badge>
                    </SelectItem>
                    <SelectItem value="media">
                      <Badge variant="outline">Média</Badge>
                    </SelectItem>
                    <SelectItem value="alta">
                      <Badge variant="destructive">Alta</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prazo">Prazo do Evento (dias) *</Label>
                <Input
                  id="prazo"
                  type="number"
                  placeholder="10"
                  value={formData.prazo_evento_dias}
                  onChange={(e) => updateFormData('prazo_evento_dias', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_estimado">Valor Estimado Total (R$)</Label>
              <Input
                id="valor_estimado"
                type="number"
                placeholder="Ex: 50000"
                value={formData.valor_estimado_total || ''}
                onChange={(e) => updateFormData('valor_estimado_total', Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gerenciamento de Lotes (Opcional) */}
      {formData.nivel_complexidade === 'alta' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gerenciamento de Lotes
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMostrarLoteManager(!mostrarLoteManager)}
              >
                {mostrarLoteManager ? 'Ocultar' : 'Configurar'} Lotes
              </Button>
            </CardTitle>
          </CardHeader>
          {mostrarLoteManager && (
            <CardContent>
              <LoteManager
                itens={formData.itens_projeto?.map(item => ({
                  id: item.id,
                  descricao: item.descricao,
                  tipo: item.tipo,
                  loteId: item.loteId
                })) || []}
                lotes={formData.lotes?.map(lote => ({
                  id: lote.id,
                  nome: lote.nome,
                  descricao: lote.descricao,
                  tipo: lote.tipo,
                  ordem: lote.ordem
                })) || []}
                onLotesChange={handleLotesChange}
                onItensChange={handleItensChange}
              />
            </CardContent>
          )}
        </Card>
      )}

      {/* Descrição do Projeto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Descrição do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição Detalhada</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva o escopo, objetivos e requisitos do projeto..."
              value={formData.descricao}
              onChange={(e) => updateFormData('descricao', e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={gerarDescricaoIA}
              disabled={!formData.template_selecionado || !formData.nome_projeto}
            >
              <Zap className="h-4 w-4 mr-2" />
              Gerar com IA
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMostrarSugestoes(!mostrarSugestoes)}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              {mostrarSugestoes ? 'Ocultar' : 'Ver'} Sugestões
            </Button>
          </div>

          {mostrarSugestoes && formData.tipo_aquisicao && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">💡 Sugestões da IA</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {SUGESTOES_IA[formData.tipo_aquisicao].map((sugestao, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {sugestao}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags de Tipo de Aquisição */}
          {formData.tipo_aquisicao && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm font-medium">Tipo detectado:</span>
              <ItemTypeTags type={formData.tipo_aquisicao as ItemType} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}