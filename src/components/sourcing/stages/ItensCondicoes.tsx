import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  FileText, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  Info
} from 'lucide-react';
import { useEventTypeLogic } from '@/hooks/useEventTypeLogic';

interface Item {
  id: string;
  codigo?: string;
  descricao: string;
  especificacao: string;
  quantidade: number;
  unidade: string;
  valorEstimado: number;
  categoria: string;
  prazoEntrega: number;
  prioridade: 'alta' | 'media' | 'baixa';
  observacoes?: string;
}

interface ItensCondicoesData {
  itens: Item[];
  condicoesGerais: {
    prazoEntregaMaximo: number;
    localEntrega: string;
    condicoesPagamento: string;
    validadeProposta: number;
    garantiaMinima: number;
    clausulasEspeciais: string[];
  };
  documentosExigidos: string[];
  criteriosHabilitacao: string[];
  finalizado: boolean;
}

interface ItensCondicoesProps {
  data?: ItensCondicoesData;
  onComplete: (data: ItensCondicoesData & { finalizado: boolean }) => void;
  wizardData?: any;
}

export function ItensCondicoes({ data, onComplete, wizardData }: ItensCondicoesProps) {
  const tipoEvento = wizardData?.estrutura?.tipo_evento || 'rfq';
  const { fieldVisibility, config } = useEventTypeLogic(tipoEvento);
  
  const [formData, setFormData] = useState<ItensCondicoesData>({
    itens: data?.itens || [],
    condicoesGerais: data?.condicoesGerais || {
      prazoEntregaMaximo: 60,
      localEntrega: 'Matriz - São Paulo/SP',
      condicoesPagamento: '30 dias após entrega',
      validadeProposta: 90,
      garantiaMinima: 12,
      clausulasEspeciais: []
    },
    documentosExigidos: data?.documentosExigidos || [
      'Proposta Técnica Detalhada',
      'Proposta Comercial',
      'Certidão Negativa de Débitos',
      'Comprovante de Regularidade Fiscal',
      'Referências Comerciais'
    ],
    criteriosHabilitacao: data?.criteriosHabilitacao || [
      'Experiência mínima de 2 anos no segmento',
      'Certificações de qualidade (ISO 9001)',
      'Capacidade técnica comprovada',
      'Situação fiscal regular'
    ],
    finalizado: data?.finalizado || false
  });

  // Dados mockados dos itens
  const itensMockados: Item[] = [
    {
      id: '1',
      codigo: 'SW-001',
      descricao: 'Sistema de Gestão Empresarial',
      especificacao: 'Software ERP completo com módulos financeiro, RH, vendas e estoque',
      quantidade: 1,
      unidade: 'Licença',
      valorEstimado: 80000,
      categoria: 'Software',
      prazoEntrega: 45,
      prioridade: 'alta',
      observacoes: 'Deve incluir customizações específicas para o setor'
    },
    {
      id: '2',
      codigo: 'SV-001',
      descricao: 'Serviços de Implementação',
      especificacao: 'Implementação completa do sistema ERP incluindo migração de dados',
      quantidade: 1,
      unidade: 'Projeto',
      valorEstimado: 45000,
      categoria: 'Serviços',
      prazoEntrega: 60,
      prioridade: 'alta',
      observacoes: 'Inclui treinamento da equipe'
    },
    {
      id: '3',
      codigo: 'TR-001',
      descricao: 'Treinamento de Usuários',
      especificacao: 'Capacitação completa para 50 usuários do sistema',
      quantidade: 50,
      unidade: 'Usuário',
      valorEstimado: 400,
      categoria: 'Treinamento',
      prazoEntrega: 15,
      prioridade: 'media',
      observacoes: 'Preferencialmente presencial'
    },
    {
      id: '4',
      codigo: 'SP-001',
      descricao: 'Suporte Técnico Anual',
      especificacao: 'Suporte técnico 24/7 durante o primeiro ano',
      quantidade: 12,
      unidade: 'Mês',
      valorEstimado: 3500,
      categoria: 'Suporte',
      prazoEntrega: 1,
      prioridade: 'media',
      observacoes: 'Deve incluir atualizações e correções'
    }
  ];

  useEffect(() => {
    setFormData(prev => ({ ...prev, itens: itensMockados }));
  }, []);

  useEffect(() => {
    const isValid = formData.itens.length > 0;
    onComplete({ ...formData, finalizado: isValid });
  }, [formData, onComplete]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const prioridadeMap = {
      'alta': { label: 'Alta', variant: 'destructive' as const },
      'media': { label: 'Média', variant: 'secondary' as const },
      'baixa': { label: 'Baixa', variant: 'outline' as const }
    };
    const config = prioridadeMap[prioridade as keyof typeof prioridadeMap];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const calcularValorTotal = () => {
    return formData.itens.reduce((total, item) => total + (item.valorEstimado * item.quantidade), 0);
  };

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

      {/* Resumo dos Itens */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Itens</p>
                <p className="text-2xl font-bold">{formData.itens.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {fieldVisibility.priceFields && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(calcularValorTotal())}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Prazo Máximo</p>
                <p className="text-2xl font-bold">{formData.condicoesGerais.prazoEntregaMaximo} dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Documentos</p>
                <p className="text-2xl font-bold">{formData.documentosExigidos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Itens */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Especificação de Itens
              </CardTitle>
              <CardDescription>
                Definição detalhada dos produtos e serviços a serem contratados
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.itens.map((item, index) => (
              <Card key={item.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{item.codigo}</Badge>
                        <h4 className="font-medium">{item.descricao}</h4>
                        {getPrioridadeBadge(item.prioridade)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.especificacao}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Quantidade</p>
                          <p className="font-medium">{item.quantidade} {item.unidade}</p>
                        </div>
                        {fieldVisibility.priceFields && (
                          <>
                            <div>
                              <p className="text-sm text-muted-foreground">Valor Unitário</p>
                              <p className="font-medium">{formatCurrency(item.valorEstimado)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Valor Total</p>
                              <p className="font-medium text-green-600">
                                {formatCurrency(item.valorEstimado * item.quantidade)}
                              </p>
                            </div>
                          </>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">Prazo Entrega</p>
                          <p className="font-medium">{item.prazoEntrega} dias</p>
                        </div>
                      </div>

                      {item.observacoes && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm">
                            <strong>Observações:</strong> {item.observacoes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Condições Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Condições Gerais do Processo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Condições Comerciais</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Local de Entrega</p>
                  <p className="font-medium">{formData.condicoesGerais.localEntrega}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condições de Pagamento</p>
                  <p className="font-medium">{formData.condicoesGerais.condicoesPagamento}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Validade da Proposta</p>
                  <p className="font-medium">{formData.condicoesGerais.validadeProposta} dias</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Garantia Mínima</p>
                  <p className="font-medium">{formData.condicoesGerais.garantiaMinima} meses</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Documentos Exigidos</h4>
              <div className="space-y-2">
                {formData.documentosExigidos.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critérios de Habilitação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Critérios de Habilitação
          </CardTitle>
          <CardDescription>
            Requisitos mínimos que os fornecedores devem atender
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {formData.criteriosHabilitacao.map((criterio, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{criterio}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status da Validação */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">Especificação Validada</h3>
              <p className="text-sm text-green-700">
                {formData.itens.length} itens especificados com valor total de {formatCurrency(calcularValorTotal())}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}