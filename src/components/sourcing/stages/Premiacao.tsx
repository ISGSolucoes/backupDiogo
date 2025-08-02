import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Award, FileText, Send, CheckCircle, Download, User } from 'lucide-react';

interface FornecedorPremiado {
  id: string;
  fornecedor: string;
  cnpj: string;
  valorTotal: number;
  scoreTotal: number;
  rank: number;
  itensAdjudicados: string[];
  observacoes?: string;
}

interface PremiacaoData {
  vencedores: FornecedorPremiado[];
  justificativa: string;
  condicoes: {
    prazoAssinatura: number;
    validadeProposta: number;
    condicoesPagamento: string;
    observacoesContrato: string;
  };
  comunicacao: {
    notificarVencedores: boolean;
    notificarPerdedores: boolean;
    publicarResultado: boolean;
    mensagemVencedores: string;
    mensagemPerdedores: string;
  };
  documentos: {
    gerarAta: boolean;
    gerarContrato: boolean;
    gerarTermoAdjudicacao: boolean;
    anexarPropostas: boolean;
  };
  aprovacoes: {
    aprovadorId?: string;
    aprovadorNome?: string;
    dataAprovacao?: string;
    assinaturaDiretor?: string;
  };
  finalizado: boolean;
}

interface PremiacaoProps {
  data: Partial<PremiacaoData>;
  onComplete: (data: PremiacaoData) => void;
  wizardData: any;
}

export function Premiacao({ data, onComplete, wizardData }: PremiacaoProps) {
  const [formData, setFormData] = useState<PremiacaoData>({
    vencedores: [],
    justificativa: '',
    condicoes: {
      prazoAssinatura: 15,
      validadeProposta: 60,
      condicoesPagamento: '',
      observacoesContrato: ''
    },
    comunicacao: {
      notificarVencedores: true,
      notificarPerdedores: true,
      publicarResultado: true,
      mensagemVencedores: '',
      mensagemPerdedores: ''
    },
    documentos: {
      gerarAta: true,
      gerarContrato: true,
      gerarTermoAdjudicacao: true,
      anexarPropostas: true
    },
    aprovacoes: {},
    finalizado: false,
    ...data
  });

  // Carregar vencedores do comparativo
  useEffect(() => {
    if (wizardData?.comparativo?.propostas && formData.vencedores.length === 0) {
      const propostas = wizardData.comparativo.propostas;
      const vencedor = propostas.find((p: any) => p.rank === 1);
      
      if (vencedor) {
        setFormData(prev => ({
          ...prev,
          vencedores: [{
            id: vencedor.id,
            fornecedor: vencedor.fornecedor,
            cnpj: vencedor.cnpj,
            valorTotal: vencedor.valorTotal,
            scoreTotal: vencedor.scoreTotal,
            rank: vencedor.rank,
            itensAdjudicados: ['Todos os itens'],
            observacoes: ''
          }]
        }));
      }
    }
  }, [wizardData]);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const isValid = formData.vencedores.length > 0 &&
                   formData.justificativa.trim() &&
                   formData.condicoes.condicoesPagamento.trim();

    if (isValid) {
      onComplete({ ...formData, finalizado: true });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const economiaTotal = () => {
    if (!wizardData?.escopo?.orcamentoMax) return 0;
    const valorVencedores = formData.vencedores.reduce((sum, v) => sum + v.valorTotal, 0);
    return wizardData.escopo.orcamentoMax - valorVencedores;
  };

  const percentualEconomia = () => {
    if (!wizardData?.escopo?.orcamentoMax) return 0;
    const economia = economiaTotal();
    return (economia / wizardData.escopo.orcamentoMax) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Resumo da Premiação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Resultado da Premiação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(economiaTotal())}
              </div>
              <div className="text-sm text-muted-foreground">
                Economia Obtida
              </div>
              <div className="text-xs text-green-600">
                {percentualEconomia().toFixed(1)}% do orçamento
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formData.vencedores.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Fornecedores Premiados
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formData.vencedores.reduce((sum, v) => sum + v.itensAdjudicados.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Itens Adjudicados
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fornecedores Vencedores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Fornecedores Vencedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.vencedores.map((vencedor, index) => (
            <div key={vencedor.id} className="border rounded-lg p-4 mb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-yellow-500 text-white">
                      {vencedor.rank}º Lugar
                    </Badge>
                    <h3 className="text-lg font-semibold">{vencedor.fornecedor}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                    <div>
                      <span className="font-medium">CNPJ:</span> {vencedor.cnpj}
                    </div>
                    <div>
                      <span className="font-medium">Valor Total:</span> {formatCurrency(vencedor.valorTotal)}
                    </div>
                    <div>
                      <span className="font-medium">Score:</span> {vencedor.scoreTotal.toFixed(1)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Itens Adjudicados</Label>
                    <div className="flex flex-wrap gap-1">
                      {vencedor.itensAdjudicados.map((item, idx) => (
                        <Badge key={idx} variant="outline">{item}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <Label>Observações para este Fornecedor</Label>
                    <Textarea
                      value={vencedor.observacoes}
                      onChange={(e) => {
                        const novosVencedores = formData.vencedores.map(v =>
                          v.id === vencedor.id ? { ...v, observacoes: e.target.value } : v
                        );
                        setFormData(prev => ({ ...prev, vencedores: novosVencedores }));
                      }}
                      placeholder="Observações específicas para este fornecedor..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Justificativa da Decisão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Justificativa da Decisão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Justificativa Técnica e Comercial *</Label>
            <Textarea
              value={formData.justificativa}
              onChange={(e) => setFormData(prev => ({ ...prev, justificativa: e.target.value }))}
              placeholder="Descreva os motivos técnicos e comerciais que levaram à escolha dos fornecedores vencedores..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Condições de Contratação */}
      <Card>
        <CardHeader>
          <CardTitle>Condições de Contratação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prazo para Assinatura (dias)</Label>
              <Input
                type="number"
                value={formData.condicoes.prazoAssinatura}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  condicoes: { ...prev.condicoes, prazoAssinatura: Number(e.target.value) }
                }))}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Validade da Proposta (dias)</Label>
              <Input
                type="number"
                value={formData.condicoes.validadeProposta}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  condicoes: { ...prev.condicoes, validadeProposta: Number(e.target.value) }
                }))}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Condições de Pagamento *</Label>
            <Input
              value={formData.condicoes.condicoesPagamento}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                condicoes: { ...prev.condicoes, condicoesPagamento: e.target.value }
              }))}
              placeholder="Ex: 30 dias após entrega e aceite"
            />
          </div>

          <div className="space-y-2">
            <Label>Observações para o Contrato</Label>
            <Textarea
              value={formData.condicoes.observacoesContrato}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                condicoes: { ...prev.condicoes, observacoesContrato: e.target.value }
              }))}
              placeholder="Cláusulas especiais ou observações importantes para o contrato..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Comunicação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Comunicação dos Resultados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.comunicacao.notificarVencedores}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  comunicacao: { ...prev.comunicacao, notificarVencedores: !!checked }
                }))}
              />
              <Label>Notificar fornecedores vencedores</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.comunicacao.notificarPerdedores}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  comunicacao: { ...prev.comunicacao, notificarPerdedores: !!checked }
                }))}
              />
              <Label>Notificar fornecedores não vencedores</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.comunicacao.publicarResultado}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  comunicacao: { ...prev.comunicacao, publicarResultado: !!checked }
                }))}
              />
              <Label>Publicar resultado no portal</Label>
            </div>
          </div>

          {formData.comunicacao.notificarVencedores && (
            <div className="space-y-2">
              <Label>Mensagem para Vencedores</Label>
              <Textarea
                value={formData.comunicacao.mensagemVencedores}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  comunicacao: { ...prev.comunicacao, mensagemVencedores: e.target.value }
                }))}
                placeholder="Mensagem personalizada para os fornecedores vencedores..."
                rows={3}
              />
            </div>
          )}

          {formData.comunicacao.notificarPerdedores && (
            <div className="space-y-2">
              <Label>Mensagem para Não Vencedores</Label>
              <Textarea
                value={formData.comunicacao.mensagemPerdedores}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  comunicacao: { ...prev.comunicacao, mensagemPerdedores: e.target.value }
                }))}
                placeholder="Mensagem personalizada para os fornecedores não vencedores..."
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Documentos a Gerar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.documentos.gerarAta}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  documentos: { ...prev.documentos, gerarAta: !!checked }
                }))}
              />
              <Label>Ata de Julgamento das Propostas</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.documentos.gerarContrato}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  documentos: { ...prev.documentos, gerarContrato: !!checked }
                }))}
              />
              <Label>Minuta de Contrato</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.documentos.gerarTermoAdjudicacao}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  documentos: { ...prev.documentos, gerarTermoAdjudicacao: !!checked }
                }))}
              />
              <Label>Termo de Adjudicação</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.documentos.anexarPropostas}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  documentos: { ...prev.documentos, anexarPropostas: !!checked }
                }))}
              />
              <Label>Anexar Propostas Vencedoras</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Final */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-2 text-green-600">
              Processo de Sourcing Finalizado!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              O projeto foi concluído com sucesso. Os vencedores serão notificados e os documentos 
              serão gerados automaticamente.
            </p>
            
            <div className="flex justify-center gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Baixar Documentos
              </Button>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Enviar Notificações
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}