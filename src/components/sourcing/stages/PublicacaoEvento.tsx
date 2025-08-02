import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertTriangle, Calendar, Send, FileText, Settings } from 'lucide-react';

interface ChecklistItem {
  id: string;
  titulo: string;
  descricao: string;
  obrigatorio: boolean;
  concluido: boolean;
  categoria: 'escopo' | 'itens' | 'criterios' | 'fornecedores' | 'legal';
}

interface PublicacaoEventoData {
  checklist: ChecklistItem[];
  configuracoes: {
    dataPublicacao: string;
    horaPublicacao: string;
    notificarFornecedores: boolean;
    publicarPortal: boolean;
    enviarEmail: boolean;
  };
  observacoeFinais: string;
  aprovacoes: {
    aprovadorId?: string;
    aprovadorNome?: string;
    dataAprovacao?: string;
    observacoes?: string;
  };
  pronto: boolean;
}

interface PublicacaoEventoProps {
  data: Partial<PublicacaoEventoData>;
  onComplete: (data: PublicacaoEventoData) => void;
  wizardData: any;
}

export function PublicacaoEvento({ data, onComplete, wizardData }: PublicacaoEventoProps) {
  const [formData, setFormData] = useState<PublicacaoEventoData>({
    checklist: [],
    configuracoes: {
      dataPublicacao: '',
      horaPublicacao: '09:00',
      notificarFornecedores: true,
      publicarPortal: true,
      enviarEmail: true
    },
    observacoeFinais: '',
    aprovacoes: {},
    pronto: false,
    ...data
  });

  useEffect(() => {
    generateChecklist();
  }, [wizardData]);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const generateChecklist = () => {
    const checklistItems: ChecklistItem[] = [
      // Escopo
      {
        id: 'escopo_nome',
        titulo: 'Nome do projeto definido',
        descricao: 'Projeto possui nome claro e descritivo',
        obrigatorio: true,
        concluido: !!wizardData?.escopo?.nome,
        categoria: 'escopo'
      },
      {
        id: 'escopo_descricao',
        titulo: 'Descrição completa',
        descricao: 'Projeto possui descrição detalhada do escopo',
        obrigatorio: true,
        concluido: !!wizardData?.escopo?.descricao,
        categoria: 'escopo'
      },
      {
        id: 'escopo_orcamento',
        titulo: 'Orçamento definido',
        descricao: 'Valores orçamentários foram estabelecidos',
        obrigatorio: true,
        concluido: !!wizardData?.escopo?.orcamentoMax && wizardData.escopo.orcamentoMax > 0,
        categoria: 'escopo'
      },

      // Itens
      {
        id: 'itens_lista',
        titulo: 'Lista de itens completa',
        descricao: 'Todos os itens foram adicionados com especificações',
        obrigatorio: true,
        concluido: !!wizardData?.itens?.itens?.length && wizardData.itens.itens.length > 0,
        categoria: 'itens'
      },
      {
        id: 'itens_condicoes',
        titulo: 'Condições de entrega definidas',
        descricao: 'Local e prazo de entrega foram especificados',
        obrigatorio: true,
        concluido: !!wizardData?.itens?.condicoes?.localEntrega,
        categoria: 'itens'
      },

      // Critérios
      {
        id: 'criterios_avaliacao',
        titulo: 'Critérios de avaliação configurados',
        descricao: 'Matriz de avaliação com pesos definidos',
        obrigatorio: true,
        concluido: !!wizardData?.matriz?.criterios?.length && wizardData.matriz.criterios.length > 0,
        categoria: 'criterios'
      },

      // Fornecedores
      {
        id: 'fornecedores_selecionados',
        titulo: 'Fornecedores selecionados',
        descricao: 'Pelo menos 3 fornecedores foram selecionados',
        obrigatorio: true,
        concluido: !!wizardData?.fornecedores?.fornecedoresSelecionados?.length && 
                   wizardData.fornecedores.fornecedoresSelecionados.length >= 3,
        categoria: 'fornecedores'
      },
      {
        id: 'convite_configurado',
        titulo: 'Convite configurado',
        descricao: 'Mensagem e condições do convite foram definidas',
        obrigatorio: true,
        concluido: !!wizardData?.fornecedores?.convite?.assunto && 
                   !!wizardData?.fornecedores?.convite?.mensagem,
        categoria: 'fornecedores'
      },

      // Legal/Compliance
      {
        id: 'documentos_obrigatorios',
        titulo: 'Documentos obrigatórios definidos',
        descricao: 'Lista de documentos exigidos dos fornecedores',
        obrigatorio: false,
        concluido: !!wizardData?.fornecedores?.convite?.documentosObrigatorios?.length,
        categoria: 'legal'
      },
      {
        id: 'aprovacao_interna',
        titulo: 'Aprovação interna obtida',
        descricao: 'Projeto foi aprovado internamente para publicação',
        obrigatorio: true,
        concluido: false,
        categoria: 'legal'
      }
    ];

    setFormData(prev => ({
      ...prev,
      checklist: checklistItems
    }));
  };

  const validateForm = () => {
    const itensObrigatorios = formData.checklist.filter(item => item.obrigatorio);
    const itensConcluidos = itensObrigatorios.filter(item => item.concluido);
    
    const checklistCompleto = itensObrigatorios.length === itensConcluidos.length;
    const dataPublicacao = !!formData.configuracoes.dataPublicacao;
    
    const isValid = checklistCompleto && dataPublicacao;
    
    const updatedData = { ...formData, pronto: isValid };
    setFormData(updatedData);
    
    if (isValid) {
      onComplete(updatedData);
    }
  };

  const toggleChecklistItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, concluido: !item.concluido } : item
      )
    }));
  };

  const categoriasChecklist = {
    escopo: 'Escopo Estratégico',
    itens: 'Itens e Condições',
    criterios: 'Critérios de Avaliação',
    fornecedores: 'Fornecedores',
    legal: 'Legal e Compliance'
  };

  const getProgressoPorCategoria = (categoria: string) => {
    const itens = formData.checklist.filter(item => item.categoria === categoria);
    const concluidos = itens.filter(item => item.concluido);
    return { total: itens.length, concluidos: concluidos.length };
  };

  const progressoTotal = () => {
    const obrigatorios = formData.checklist.filter(item => item.obrigatorio);
    const concluidos = obrigatorios.filter(item => item.concluido);
    return { total: obrigatorios.length, concluidos: concluidos.length };
  };

  const progresso = progressoTotal();
  const podePublicar = progresso.concluidos === progresso.total && formData.configuracoes.dataPublicacao;

  return (
    <div className="space-y-6">
      {/* Resumo do Progresso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Resumo de Preparação
            <Badge variant={podePublicar ? "default" : "secondary"}>
              {progresso.concluidos}/{progresso.total} itens obrigatórios
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(categoriasChecklist).map(([categoria, nome]) => {
              const prog = getProgressoPorCategoria(categoria);
              const completo = prog.concluidos === prog.total;
              
              return (
                <div key={categoria} className="text-center">
                  <div className="mb-2">
                    {completo ? (
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto" />
                    )}
                  </div>
                  <div className="text-sm font-medium">{nome}</div>
                  <div className="text-xs text-muted-foreground">
                    {prog.concluidos}/{prog.total}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Detalhado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Checklist de Publicação
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(categoriasChecklist).map(([categoria, nome]) => {
            const itensCategoria = formData.checklist.filter(item => item.categoria === categoria);
            
            return (
              <div key={categoria} className="mb-6">
                <h4 className="font-medium mb-3 text-lg">{nome}</h4>
                <div className="space-y-2">
                  {itensCategoria.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 border rounded-lg ${
                        item.concluido ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <Checkbox
                        checked={item.concluido}
                        onCheckedChange={() => toggleChecklistItem(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${item.concluido ? 'line-through text-gray-500' : ''}`}>
                            {item.titulo}
                          </span>
                          {item.obrigatorio && (
                            <Badge variant="destructive">Obrigatório</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.descricao}
                        </p>
                      </div>
                      {item.concluido && (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Configurações de Publicação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Publicação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Publicação *</Label>
              <Input
                type="date"
                value={formData.configuracoes.dataPublicacao}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  configuracoes: { ...prev.configuracoes, dataPublicacao: e.target.value }
                }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>Horário de Publicação</Label>
              <Input
                type="time"
                value={formData.configuracoes.horaPublicacao}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  configuracoes: { ...prev.configuracoes, horaPublicacao: e.target.value }
                }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.configuracoes.notificarFornecedores}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  configuracoes: { ...prev.configuracoes, notificarFornecedores: !!checked }
                }))}
              />
              <Label>Notificar fornecedores automaticamente</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.configuracoes.publicarPortal}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  configuracoes: { ...prev.configuracoes, publicarPortal: !!checked }
                }))}
              />
              <Label>Publicar no portal de fornecedores</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.configuracoes.enviarEmail}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  configuracoes: { ...prev.configuracoes, enviarEmail: !!checked }
                }))}
              />
              <Label>Enviar convites por e-mail</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações Finais</Label>
            <Textarea
              value={formData.observacoeFinais}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoeFinais: e.target.value }))}
              placeholder="Observações ou instruções adicionais para a publicação..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Final */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            {podePublicar ? (
              <div className="text-green-600">
                <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Projeto Pronto para Publicação!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Todos os requisitos obrigatórios foram atendidos. 
                  O projeto será publicado em {new Date(formData.configuracoes.dataPublicacao).toLocaleDateString('pt-BR')} 
                  às {formData.configuracoes.horaPublicacao}.
                </p>
              </div>
            ) : (
              <div className="text-yellow-600">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Projeto em Preparação
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete todos os itens obrigatórios e defina a data de publicação 
                  para finalizar a preparação.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}