
import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, FileText, Send, Save, X } from 'lucide-react';
import { ExpandedDialog } from '@/components/ui/expanded-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { 
  TipoFornecimento, 
  AreaSolicitante, 
  ModeloQuestionario,
  SecaoQuestionario,
  QuestionarioPreenchido,
  RespostaQuestionario
} from '@/types/questionario';
import { useFullscreenModal } from '@/hooks/useFullscreenModal';

// Componente para upload de documentos
const DocumentoUpload = ({ 
  label, 
  onChange 
}: { 
  label: string; 
  onChange: (file: File | null) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onChange(file);
  };

  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        {selectedFile && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Documento selecionado
          </Badge>
        )}
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Input
          id={`file-${label}`}
          type="file"
          className="cursor-pointer"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

interface QualificarFornecedorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorId: string;
  fornecedorNome: string;
  onQualificacaoRealizada: (areas: AreaSolicitante[]) => void;
}

export const QualificarFornecedor = ({
  open,
  onOpenChange,
  fornecedorId,
  fornecedorNome,
  onQualificacaoRealizada
}: QualificarFornecedorProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();
  // Estados para o processo de qualificação
  const [etapa, setEtapa] = useState<'selecao' | 'questionario' | 'revisao'>('selecao');
  const [tipoFornecimento, setTipoFornecimento] = useState<TipoFornecimento | ''>('');
  const [areasSelecionadas, setAreasSelecionadas] = useState<AreaSolicitante[]>([]);
  const [modeloQuestionario, setModeloQuestionario] = useState<ModeloQuestionario | null>(null);
  const [respostas, setRespostas] = useState<RespostaQuestionario[]>([]);
  const [secaoAtiva, setSecaoAtiva] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Lista de áreas disponíveis
  const areasDisponiveis: { value: AreaSolicitante; label: string }[] = [
    { value: 'engenharia', label: 'Engenharia' },
    { value: 'compras', label: 'Compras' },
    { value: 'suprimentos', label: 'Suprimentos' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'logistica', label: 'Logística' },
    { value: 'juridico', label: 'Jurídico' },
    { value: 'qualidade', label: 'Qualidade' },
    { value: 'outro', label: 'Outro' },
  ];

  // Carregar modelo de questionário quando tipo e áreas forem selecionados
  useEffect(() => {
    if (etapa === 'questionario' && tipoFornecimento && areasSelecionadas.length > 0) {
      carregarModeloQuestionario();
    }
  }, [etapa, tipoFornecimento, areasSelecionadas]);

  // Função para carregar o modelo de questionário (simulando API)
  const carregarModeloQuestionario = async () => {
    setIsLoading(true);
    try {
      // Simulando delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Gerar modelo baseado no tipo de fornecimento e áreas
      const modelo = gerarModeloQuestionario(tipoFornecimento as TipoFornecimento, areasSelecionadas);
      
      setModeloQuestionario(modelo);
      setSecaoAtiva(modelo.secoes[0].id);
      
      // Inicializar respostas vazias para todas as perguntas
      const respostasIniciais = modelo.secoes.flatMap(secao => 
        secao.perguntas.map(pergunta => ({
          perguntaId: pergunta.id,
          resposta: pergunta.tipo === 'boolean' ? false : pergunta.tipo === 'checkbox' ? [] : '',
        }))
      );
      
      setRespostas(respostasIniciais);
      
    } catch (error) {
      console.error('Erro ao carregar modelo:', error);
      toast.error('Não foi possível carregar o questionário');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para gerar modelo de questionário baseado no tipo e áreas (simulação)
  const gerarModeloQuestionario = (tipo: TipoFornecimento, areas: AreaSolicitante[]): ModeloQuestionario => {
    let secoes: SecaoQuestionario[] = [];
    
    // Seção 1: Informações Gerais (comum a todos os modelos)
    secoes.push({
      id: uuidv4(),
      titulo: 'Informações Gerais',
      descricao: 'Informações básicas de qualificação',
      perguntas: [
        {
          id: uuidv4(),
          texto: 'A empresa possui todas as licenças e autorizações necessárias para operação?',
          tipo: 'boolean',
          obrigatorio: true,
          permiteUpload: true,
          tipoDocumento: 'licenca',
          pontuacaoMaxima: 10
        },
        {
          id: uuidv4(),
          texto: 'Existem processos judiciais em andamento que podem afetar a operação?',
          tipo: 'boolean',
          obrigatorio: true,
          pontuacaoMaxima: 5
        },
        {
          id: uuidv4(),
          texto: 'Qual a cobertura geográfica de atendimento?',
          tipo: 'opcoes',
          obrigatorio: true,
          opcoes: ['Regional', 'Estadual', 'Nacional', 'Internacional'],
          pontuacaoMaxima: 5
        }
      ]
    });

    // Adicionar seções específicas baseadas no tipo de fornecimento
    if (tipo === 'produto') {
      secoes.push({
        id: uuidv4(),
        titulo: 'Qualidade do Produto',
        descricao: 'Informações sobre certificações e qualidade',
        perguntas: [
          {
            id: uuidv4(),
            texto: 'Quais certificações de qualidade o produto possui?',
            tipo: 'texto',
            obrigatorio: true,
            permiteUpload: true,
            tipoDocumento: 'certificado',
            pontuacaoMaxima: 10,
            sugestaoIA: 'ISO 9001, ISO 14001'
          },
          {
            id: uuidv4(),
            texto: 'Qual o prazo de garantia oferecido?',
            tipo: 'texto',
            obrigatorio: true,
            pontuacaoMaxima: 5
          },
          {
            id: uuidv4(),
            texto: 'O produto possui rastreabilidade?',
            tipo: 'boolean',
            obrigatorio: true,
            pontuacaoMaxima: 5
          },
          {
            id: uuidv4(),
            texto: 'Possui manual técnico atualizado?',
            tipo: 'boolean',
            obrigatorio: false,
            permiteUpload: true,
            tipoDocumento: 'manual',
            pontuacaoMaxima: 5
          }
        ]
      });
    }

    if (tipo === 'servico' || tipo === 'servico_recorrente') {
      secoes.push({
        id: uuidv4(),
        titulo: 'Qualidade do Serviço',
        descricao: 'Informações sobre SLA e capacidade técnica',
        perguntas: [
          {
            id: uuidv4(),
            texto: 'Qual o SLA padrão oferecido?',
            tipo: 'texto',
            obrigatorio: true,
            pontuacaoMaxima: 10
          },
          {
            id: uuidv4(),
            texto: 'Possui plano de contingência em caso de falhas?',
            tipo: 'boolean',
            obrigatorio: true,
            permiteUpload: true,
            tipoDocumento: 'plano',
            pontuacaoMaxima: 10
          },
          {
            id: uuidv4(),
            texto: 'Quais certificações técnicas a equipe possui?',
            tipo: 'texto',
            obrigatorio: false,
            permiteUpload: true,
            tipoDocumento: 'certificado',
            pontuacaoMaxima: 5
          }
        ]
      });
    }

    // Adicionar seções específicas baseadas nas áreas selecionadas
    if (areas.includes('engenharia')) {
      secoes.push({
        id: uuidv4(),
        titulo: 'Requisitos de Engenharia',
        perguntas: [
          {
            id: uuidv4(),
            texto: 'Possui capacidade para customização de projetos?',
            tipo: 'boolean',
            obrigatorio: true,
            pontuacaoMaxima: 10
          },
          {
            id: uuidv4(),
            texto: 'Disponibiliza documentação técnica completa?',
            tipo: 'boolean',
            obrigatorio: true,
            permiteUpload: true,
            tipoDocumento: 'documentacao',
            pontuacaoMaxima: 10
          }
        ]
      });
    }

    if (areas.includes('financeiro')) {
      secoes.push({
        id: uuidv4(),
        titulo: 'Requisitos Financeiros',
        perguntas: [
          {
            id: uuidv4(),
            texto: 'Qual o prazo médio de pagamento aceito?',
            tipo: 'opcoes',
            opcoes: ['À vista', '15 dias', '30 dias', '45 dias', '60 dias ou mais'],
            obrigatorio: true,
            pontuacaoMaxima: 5
          },
          {
            id: uuidv4(),
            texto: 'Apresenta boa saúde financeira nos últimos 3 anos?',
            tipo: 'boolean',
            obrigatorio: true,
            permiteUpload: true,
            tipoDocumento: 'balanco',
            pontuacaoMaxima: 10
          }
        ]
      });
    }

    if (areas.includes('juridico')) {
      secoes.push({
        id: uuidv4(),
        titulo: 'Requisitos Jurídicos',
        perguntas: [
          {
            id: uuidv4(),
            texto: 'Possui contrato padrão que atende às nossas cláusulas obrigatórias?',
            tipo: 'boolean',
            obrigatorio: true,
            permiteUpload: true,
            tipoDocumento: 'contrato',
            pontuacaoMaxima: 15
          },
          {
            id: uuidv4(),
            texto: 'Está em conformidade com a LGPD?',
            tipo: 'boolean',
            obrigatorio: true,
            pontuacaoMaxima: 10
          }
        ]
      });
    }

    // Seção final: Sustentabilidade e Compliance (comum a todos)
    secoes.push({
      id: uuidv4(),
      titulo: 'Sustentabilidade e Compliance',
      perguntas: [
        {
          id: uuidv4(),
          texto: 'A empresa possui política de sustentabilidade?',
          tipo: 'boolean',
          obrigatorio: false,
          permiteUpload: true,
          tipoDocumento: 'politica',
          pontuacaoMaxima: 5
        },
        {
          id: uuidv4(),
          texto: 'Quais certificações ambientais a empresa possui?',
          tipo: 'checkbox',
          obrigatorio: false,
          opcoes: ['ISO 14001', 'FSC', 'Selo Verde', 'Carbono Neutro', 'Outra'],
          pontuacaoMaxima: 10
        },
        {
          id: uuidv4(),
          texto: 'Possui política de compliance e código de conduta?',
          tipo: 'boolean',
          obrigatorio: true,
          permiteUpload: true,
          tipoDocumento: 'politica',
          pontuacaoMaxima: 10
        }
      ]
    });

    // Criar e retornar o modelo
    return {
      id: uuidv4(),
      nome: `Qualificação - ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`,
      tipoFornecimento: tipo,
      areas: areas,
      secoes,
      versao: 1,
      dataCriacao: new Date().toISOString(),
      personalizado: false,
      ativo: true,
      pontuacaoMinima: 70
    };
  };

  // Atualizar uma resposta
  const atualizarResposta = (perguntaId: string, valor: string | string[] | boolean) => {
    setRespostas(prev => 
      prev.map(resp => 
        resp.perguntaId === perguntaId ? { ...resp, resposta: valor } : resp
      )
    );
  };

  // Avançar para o questionário
  const avancarParaQuestionario = () => {
    if (!tipoFornecimento) {
      toast.error('Selecione o tipo de fornecimento');
      return;
    }

    if (areasSelecionadas.length === 0) {
      toast.error('Selecione pelo menos uma área solicitante');
      return;
    }

    setEtapa('questionario');
  };

  // Avançar para revisão
  const avancarParaRevisao = () => {
    // Verificar se todas as perguntas obrigatórias foram respondidas
    if (!modeloQuestionario) return;

    const perguntasObrigatorias = modeloQuestionario.secoes.flatMap(secao => 
      secao.perguntas.filter(p => p.obrigatorio)
    );

    const naoPreenchidasObrigatorias = perguntasObrigatorias.filter(pergunta => {
      const resposta = respostas.find(r => r.perguntaId === pergunta.id);
      if (!resposta) return true;
      
      if (typeof resposta.resposta === 'string' && resposta.resposta.trim() === '') return true;
      if (Array.isArray(resposta.resposta) && resposta.resposta.length === 0) return true;
      return false;
    });

    if (naoPreenchidasObrigatorias.length > 0) {
      toast.error(`Existem ${naoPreenchidasObrigatorias.length} pergunta(s) obrigatória(s) não respondidas`);
      return;
    }

    setEtapa('revisao');
  };

  // Voltar para etapa anterior
  const voltarEtapa = () => {
    if (etapa === 'questionario') {
      setEtapa('selecao');
    } else if (etapa === 'revisao') {
      setEtapa('questionario');
    }
  };

  // Finalizar qualificação
  const finalizarQualificacao = async () => {
    if (!modeloQuestionario) return;
    
    setIsLoading(true);
    
    try {
      // Simulando envio para API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Criar objeto de questionário preenchido
      const questionarioPreenchido: QuestionarioPreenchido = {
        id: uuidv4(),
        modeloId: modeloQuestionario.id,
        fornecedorId,
        tipoFornecimento: tipoFornecimento as TipoFornecimento,
        areas: areasSelecionadas,
        respostas,
        dataEnvio: new Date().toISOString(),
        status: 'analisado',
        analisadoPor: 'Admin', // Em produção, usar usuário logado
        dataAnalise: new Date().toISOString(),
        notaFinal: calcularNotaQualificacao(),
      };
      
      console.log('Questionário preenchido:', questionarioPreenchido);
      
      // Em produção, enviar para API
      // await api.post('/questionarios', questionarioPreenchido);
      
      // Notificar conclusão
      toast.success(`Qualificação do fornecedor ${fornecedorNome} realizada com sucesso!`);
      
      // Chamar callback com as áreas qualificadas
      onQualificacaoRealizada(areasSelecionadas);
      
      // Fechar modal
      onOpenChange(false);
      
    } catch (error) {
      console.error('Erro ao finalizar qualificação:', error);
      toast.error('Erro ao finalizar qualificação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular nota de qualificação (simplificado para demonstração)
  const calcularNotaQualificacao = (): number => {
    if (!modeloQuestionario) return 0;
    
    // Para demonstração, vamos simplificar e retornar uma nota entre 70 e 95
    return Math.floor(Math.random() * 26) + 70;
  };

  // Renderizar etapa de seleção inicial
  const renderEtapaSelecao = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Qual tipo de fornecimento?</Label>
          <RadioGroup 
            value={tipoFornecimento} 
            onValueChange={(valor) => setTipoFornecimento(valor as TipoFornecimento)}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="produto" id="produto" />
              <Label htmlFor="produto">Produto físico</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="servico" id="servico" />
              <Label htmlFor="servico">Serviço técnico</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="servico_recorrente" id="servico_recorrente" />
              <Label htmlFor="servico_recorrente">Serviço recorrente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="misto" id="misto" />
              <Label htmlFor="misto">Misto (produto + serviço)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-6">
          <Label className="text-base font-medium">Área(s) solicitante(s):</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {areasDisponiveis.map((area) => (
              <div key={area.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`area-${area.value}`}
                  checked={areasSelecionadas.includes(area.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setAreasSelecionadas([...areasSelecionadas, area.value]);
                    } else {
                      setAreasSelecionadas(
                        areasSelecionadas.filter((a) => a !== area.value)
                      );
                    }
                  }}
                />
                <Label htmlFor={`area-${area.value}`}>{area.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={avancarParaQuestionario} disabled={!tipoFornecimento || areasSelecionadas.length === 0}>
          Continuar
        </Button>
      </div>
    </div>
  );

  // Renderizar etapa do questionário
  const renderEtapaQuestionario = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!modeloQuestionario) return null;

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Questionário:</span> {modeloQuestionario.nome} •
            <span className="font-medium"> Tipo de Fornecimento:</span> {tipoFornecimento} •
            <span className="font-medium"> Áreas:</span> {areasSelecionadas.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}
          </p>
        </div>

        <Tabs value={secaoAtiva} onValueChange={setSecaoAtiva}>
          <TabsList className="mb-4 flex w-full overflow-x-auto">
            {modeloQuestionario.secoes.map((secao) => (
              <TabsTrigger key={secao.id} value={secao.id} className="flex-shrink-0">
                {secao.titulo}
              </TabsTrigger>
            ))}
          </TabsList>

          {modeloQuestionario.secoes.map((secao) => (
            <TabsContent key={secao.id} value={secao.id} className="space-y-6">
              {secao.descricao && (
                <div className="text-sm text-slate-500">{secao.descricao}</div>
              )}

              {secao.perguntas.map((pergunta, idx) => {
                const resposta = respostas.find(r => r.perguntaId === pergunta.id);
                
                return (
                  <div key={pergunta.id} className="border rounded-md p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <Label className={`${pergunta.obrigatorio ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}`}>
                          {idx + 1}. {pergunta.texto}
                        </Label>
                        {pergunta.sugestaoIA && (
                          <div className="mt-1 text-xs text-blue-600 italic">
                            Sugestão IA: {pergunta.sugestaoIA}
                          </div>
                        )}
                      </div>
                      {pergunta.pontuacaoMaxima && (
                        <Badge variant="outline" className="bg-slate-50">
                          Máx: {pergunta.pontuacaoMaxima} pts
                        </Badge>
                      )}
                    </div>

                    <div>
                      {pergunta.tipo === 'texto' && (
                        <Textarea
                          value={resposta?.resposta as string || ''}
                          onChange={(e) => atualizarResposta(pergunta.id, e.target.value)}
                          placeholder="Digite sua resposta aqui..."
                          className="min-h-[80px]"
                        />
                      )}

                      {pergunta.tipo === 'opcoes' && (
                        <RadioGroup
                          value={resposta?.resposta as string || ''}
                          onValueChange={(value) => atualizarResposta(pergunta.id, value)}
                          className="space-y-2 mt-2"
                        >
                          {pergunta.opcoes?.map((opcao) => (
                            <div key={opcao} className="flex items-center space-x-2">
                              <RadioGroupItem value={opcao} id={`${pergunta.id}-${opcao}`} />
                              <Label htmlFor={`${pergunta.id}-${opcao}`}>{opcao}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {pergunta.tipo === 'boolean' && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox
                            id={`checkbox-${pergunta.id}`}
                            checked={resposta?.resposta as boolean || false}
                            onCheckedChange={(checked) => 
                              atualizarResposta(pergunta.id, Boolean(checked))
                            }
                          />
                          <Label htmlFor={`checkbox-${pergunta.id}`}>Sim</Label>
                        </div>
                      )}

                      {pergunta.tipo === 'checkbox' && (
                        <div className="space-y-2 mt-2">
                          {pergunta.opcoes?.map((opcao) => (
                            <div key={opcao} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${pergunta.id}-${opcao}`}
                                checked={(resposta?.resposta as string[] || []).includes(opcao)}
                                onCheckedChange={(checked) => {
                                  const currentValues = resposta?.resposta as string[] || [];
                                  let newValues: string[];
                                  
                                  if (checked) {
                                    newValues = [...currentValues, opcao];
                                  } else {
                                    newValues = currentValues.filter(v => v !== opcao);
                                  }
                                  
                                  atualizarResposta(pergunta.id, newValues);
                                }}
                              />
                              <Label htmlFor={`${pergunta.id}-${opcao}`}>{opcao}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {pergunta.permiteUpload && (
                        <div className="mt-3">
                          <DocumentoUpload 
                            label={`Anexar ${pergunta.tipoDocumento || 'documento'}`}
                            onChange={(file) => {
                              // Em produção, aqui faria upload do arquivo e salvaria o documentoId
                              console.log('Arquivo selecionado:', file);
                            }}
                          />
                        </div>
                      )}

                      <div className="mt-3">
                        <Label htmlFor={`obs-${pergunta.id}`} className="text-sm text-slate-500">
                          Observações
                        </Label>
                        <Textarea
                          id={`obs-${pergunta.id}`}
                          placeholder="Observações adicionais (opcional)"
                          className="mt-1 min-h-[60px]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={voltarEtapa}>
            Voltar
          </Button>
          <Button onClick={avancarParaRevisao}>
            Revisar e Finalizar
          </Button>
        </div>
      </div>
    );
  };

  // Renderizar etapa de revisão
  const renderEtapaRevisao = () => {
    if (!modeloQuestionario) return null;
    
    const totalPerguntas = modeloQuestionario.secoes.flatMap(s => s.perguntas).length;
    const perguntasRespondidas = respostas.filter(r => {
      if (typeof r.resposta === 'string') return r.resposta.trim() !== '';
      if (Array.isArray(r.resposta)) return r.resposta.length > 0;
      return r.resposta !== null && r.resposta !== undefined;
    }).length;
    
    const percentualConclusao = Math.round((perguntasRespondidas / totalPerguntas) * 100);
    
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
          <h3 className="text-lg font-medium text-green-800">Revisão da Qualificação</h3>
          <p className="text-green-700 mt-1">
            Você preencheu {perguntasRespondidas} de {totalPerguntas} perguntas ({percentualConclusao}%)
          </p>
        </div>
        
        <div className="border rounded-md p-4 space-y-4">
          <h4 className="font-medium">Resumo da qualificação</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Fornecedor:</span> {fornecedorNome}
            </div>
            <div>
              <span className="text-slate-500">Tipo de Fornecimento:</span> {tipoFornecimento}
            </div>
            <div>
              <span className="text-slate-500">Áreas Solicitantes:</span> {areasSelecionadas.join(', ')}
            </div>
            <div>
              <span className="text-slate-500">Modelo de Questionário:</span> {modeloQuestionario.nome}
            </div>
            <div>
              <span className="text-slate-500">Data:</span> {new Date().toLocaleDateString()}
            </div>
            <div>
              <span className="text-slate-500">Realizado por:</span> Admin
            </div>
          </div>
          
          <div className="pt-2">
            <Label htmlFor="comentario-final">Comentário final da qualificação</Label>
            <Textarea
              id="comentario-final"
              placeholder="Adicione observações finais sobre essa qualificação..."
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="font-medium text-blue-800">Próximos passos após finalização</h4>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li className="flex items-center gap-1">
              <Check className="h-4 w-4" /> Status do fornecedor será atualizado para "Em qualificação"
            </li>
            <li className="flex items-center gap-1">
              <Check className="h-4 w-4" /> As áreas selecionadas receberão notificação da qualificação
            </li>
            <li className="flex items-center gap-1">
              <Check className="h-4 w-4" /> A qualificação será registrada no histórico do fornecedor
            </li>
          </ul>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={voltarEtapa}>
            Voltar ao questionário
          </Button>
          <Button onClick={finalizarQualificacao} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                Processando
              </span>
            ) : (
              <span className="flex items-center">
                <Check className="h-4 w-4 mr-2" /> Finalizar Qualificação
              </span>
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ExpandedDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Qualificação de Fornecedor - ${fornecedorNome}`}
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
    >
        
        <div className="mt-2 mb-6">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl flex items-center">
              <div className={`flex-1 flex flex-col items-center ${etapa === 'selecao' ? 'text-blue-600' : 'text-slate-800'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${etapa === 'selecao' ? 'bg-blue-100 border-2 border-blue-600' : 'bg-slate-100 border border-slate-300'}`}>
                  1
                </div>
                <span className="text-xs">Tipo/Áreas</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200"></div>
              <div className={`flex-1 flex flex-col items-center ${etapa === 'questionario' ? 'text-blue-600' : 'text-slate-800'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${etapa === 'questionario' ? 'bg-blue-100 border-2 border-blue-600' : 'bg-slate-100 border border-slate-300'}`}>
                  2
                </div>
                <span className="text-xs">Questionário</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200"></div>
              <div className={`flex-1 flex flex-col items-center ${etapa === 'revisao' ? 'text-blue-600' : 'text-slate-800'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${etapa === 'revisao' ? 'bg-blue-100 border-2 border-blue-600' : 'bg-slate-100 border border-slate-300'}`}>
                  3
                </div>
                <span className="text-xs">Finalizar</span>
              </div>
            </div>
          </div>
        </div>

        {etapa === 'selecao' && renderEtapaSelecao()}
        {etapa === 'questionario' && renderEtapaQuestionario()}
        {etapa === 'revisao' && renderEtapaRevisao()}
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" /> Cancelar
          </Button>
        </div>
    </ExpandedDialog>
  );
};
