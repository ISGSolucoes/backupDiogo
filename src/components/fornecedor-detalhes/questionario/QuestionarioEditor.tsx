import React, { useState, useEffect } from 'react';
import { Plus, Minus, MoveUp, MoveDown, Save, Copy, FilePlus, Send } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ExpandedDialog } from '@/components/ui/expanded-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useFullscreenModal } from '@/hooks/useFullscreenModal';

import {
  TipoFornecimento,
  AreaSolicitante,
  PerguntaQuestionario,
  SecaoQuestionario,
  ModeloQuestionario,
} from '@/types/questionario';

interface QuestionarioEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorId: string;
  fornecedorNome: string;
}

export const QuestionarioEditor = ({
  open,
  onOpenChange,
  fornecedorId,
  fornecedorNome,
}: QuestionarioEditorProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();
  const [tipoFornecimento, setTipoFornecimento] = useState<TipoFornecimento>('produto');
  const [areaSolicitante, setAreaSolicitante] = useState<AreaSolicitante>('engenharia');
  const [modeloCarregado, setModeloCarregado] = useState(false);
  const [activeTabId, setActiveTabId] = useState('');
  
  // Estado para o modelo de questionário sendo editado
  const [questionario, setQuestionario] = useState<ModeloQuestionario | null>(null);

  // Estado para as respostas do questionário preview
  const [respostasPreview, setRespostasPreview] = useState<Record<string, any>>({});

  useEffect(() => {
    if (open && !modeloCarregado) {
      carregarModeloQuestionario();
    }
  }, [open, tipoFornecimento, areaSolicitante]);

  // Função para carregar o modelo de questionário
  const carregarModeloQuestionario = async () => {
    try {
      // Simulando carregamento de dados do backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Modelo de exemplo
      const modeloBase: ModeloQuestionario = {
        id: uuidv4(),
        nome: `${areaSolicitante.charAt(0).toUpperCase() + areaSolicitante.slice(1)} - ${tipoFornecimento.charAt(0).toUpperCase() + tipoFornecimento.slice(1)} - ${fornecedorNome}`,
        tipoFornecimento,
        areas: [areaSolicitante],
        secoes: [
          {
            id: uuidv4(),
            titulo: 'Informações Gerais',
            descricao: 'Dados básicos sobre a empresa e capacidade produtiva',
            perguntas: [
              {
                id: uuidv4(),
                texto: 'Qual a capacidade produtiva mensal da sua empresa?',
                tipo: 'texto',
                obrigatorio: true,
              },
              {
                id: uuidv4(),
                texto: 'Possui certificações de qualidade? Quais?',
                tipo: 'texto',
                obrigatorio: true,
                permiteUpload: true,
                tipoDocumento: 'certificado',
              },
              {
                id: uuidv4(),
                texto: 'A empresa possui sistema de gestão da qualidade implementado?',
                tipo: 'boolean',
                obrigatorio: true,
              },
            ],
          },
          {
            id: uuidv4(),
            titulo: 'Qualidade do Produto',
            descricao: 'Informações sobre controle de qualidade e processos produtivos',
            perguntas: [
              {
                id: uuidv4(),
                texto: 'A empresa realiza testes de qualidade em 100% dos produtos?',
                tipo: 'boolean',
                obrigatorio: true,
              },
              {
                id: uuidv4(),
                texto: 'Possui laboratório próprio para testes de qualidade?',
                tipo: 'boolean',
                obrigatorio: true,
              },
              {
                id: uuidv4(),
                texto: 'Descreva os principais processos de controle de qualidade',
                tipo: 'texto',
                obrigatorio: false,
              },
            ],
          },
          {
            id: uuidv4(),
            titulo: 'Sustentabilidade e Compliance',
            descricao: 'Informações sobre práticas de conformidade e sustentabilidade',
            perguntas: [
              {
                id: uuidv4(),
                texto: 'A empresa possui política de compliance formalizada?',
                tipo: 'boolean',
                obrigatorio: true,
                permiteUpload: true,
                tipoDocumento: 'politica',
              },
              {
                id: uuidv4(),
                texto: 'A empresa possui política de sustentabilidade implementada?',
                tipo: 'boolean',
                obrigatorio: true,
              },
              {
                id: uuidv4(),
                texto: 'Quais ações de sustentabilidade são praticadas pela empresa?',
                tipo: 'texto',
                obrigatorio: false,
              },
            ],
          },
        ],
        versao: 1,
        dataCriacao: new Date().toISOString(),
        personalizado: false,
        fornecedorId,
        ativo: true,
      };
      
      setQuestionario(modeloBase);
      setActiveTabId(modeloBase.secoes[0].id);
      setModeloCarregado(true);
      
    } catch (error) {
      console.error('Erro ao carregar modelo de questionário:', error);
      toast.error('Erro ao carregar modelo de questionário');
    }
  };
  
  const adicionarSecao = () => {
    if (!questionario) return;
    
    const novaSecao: SecaoQuestionario = {
      id: uuidv4(),
      titulo: 'Nova Seção',
      perguntas: [],
    };
    
    setQuestionario({
      ...questionario,
      secoes: [...questionario.secoes, novaSecao],
    });
    
    setActiveTabId(novaSecao.id);
  };
  
  const removerSecao = (secaoId: string) => {
    if (!questionario) return;
    
    if (questionario.secoes.length <= 1) {
      toast.warning('O questionário deve ter pelo menos uma seção');
      return;
    }
    
    const secoes = questionario.secoes.filter(s => s.id !== secaoId);
    setQuestionario({ ...questionario, secoes });
    
    // Se a seção ativa foi removida, ativar a primeira seção
    if (activeTabId === secaoId) {
      setActiveTabId(secoes[0].id);
    }
  };
  
  const atualizarSecao = (secaoId: string, campo: string, valor: string) => {
    if (!questionario) return;
    
    const secoes = questionario.secoes.map(secao => {
      if (secao.id === secaoId) {
        return { ...secao, [campo]: valor };
      }
      return secao;
    });
    
    setQuestionario({ ...questionario, secoes });
  };
  
  const adicionarPergunta = (secaoId: string) => {
    if (!questionario) return;
    
    const novaPergunta: PerguntaQuestionario = {
      id: uuidv4(),
      texto: 'Nova pergunta',
      tipo: 'texto',
      obrigatorio: false,
    };
    
    const secoes = questionario.secoes.map(secao => {
      if (secao.id === secaoId) {
        return {
          ...secao,
          perguntas: [...secao.perguntas, novaPergunta],
        };
      }
      return secao;
    });
    
    setQuestionario({ ...questionario, secoes });
  };
  
  const removerPergunta = (secaoId: string, perguntaId: string) => {
    if (!questionario) return;
    
    const secoes = questionario.secoes.map(secao => {
      if (secao.id === secaoId) {
        return {
          ...secao,
          perguntas: secao.perguntas.filter(p => p.id !== perguntaId),
        };
      }
      return secao;
    });
    
    setQuestionario({ ...questionario, secoes });
  };
  
  const atualizarPergunta = (
    secaoId: string,
    perguntaId: string,
    campo: string,
    valor: any
  ) => {
    if (!questionario) return;
    
    const secoes = questionario.secoes.map(secao => {
      if (secao.id === secaoId) {
        const perguntas = secao.perguntas.map(pergunta => {
          if (pergunta.id === perguntaId) {
            return { ...pergunta, [campo]: valor };
          }
          return pergunta;
        });
        
        return { ...secao, perguntas };
      }
      return secao;
    });
    
    setQuestionario({ ...questionario, secoes });
  };
  
  const moverPergunta = (secaoId: string, perguntaId: string, direcao: 'cima' | 'baixo') => {
    if (!questionario) return;
    
    const secaoIndex = questionario.secoes.findIndex(s => s.id === secaoId);
    if (secaoIndex === -1) return;
    
    const perguntaIndex = questionario.secoes[secaoIndex].perguntas.findIndex(p => p.id === perguntaId);
    if (perguntaIndex === -1) return;
    
    // Verificar limites
    if (
      (direcao === 'cima' && perguntaIndex === 0) ||
      (direcao === 'baixo' && perguntaIndex === questionario.secoes[secaoIndex].perguntas.length - 1)
    ) {
      return;
    }
    
    // Criar cópia das perguntas
    const perguntas = [...questionario.secoes[secaoIndex].perguntas];
    
    // Obter pergunta a ser movida
    const pergunta = perguntas[perguntaIndex];
    
    // Remover pergunta da posição atual
    perguntas.splice(perguntaIndex, 1);
    
    // Inserir na nova posição
    const novaPosicao = direcao === 'cima' ? perguntaIndex - 1 : perguntaIndex + 1;
    perguntas.splice(novaPosicao, 0, pergunta);
    
    // Atualizar estado
    const secoes = [...questionario.secoes];
    secoes[secaoIndex] = {
      ...secoes[secaoIndex],
      perguntas,
    };
    
    setQuestionario({ ...questionario, secoes });
  };
  
  const salvarQuestionario = async () => {
    if (!questionario) return;
    
    try {
      // Em produção, aqui seria feita uma chamada à API para salvar o questionário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const modeloSalvo: ModeloQuestionario = {
        ...questionario,
        personalizado: true,
        versao: questionario.versao + 1,
      };
      
      setQuestionario(modeloSalvo);
      toast.success('Questionário personalizado salvo com sucesso!');
      
    } catch (error) {
      console.error('Erro ao salvar questionário:', error);
      toast.error('Erro ao salvar questionário');
    }
  };
  
  const enviarQuestionario = () => {
    if (!questionario) return;
    toast.success(`Questionário enviado para o fornecedor ${fornecedorNome}`);
    // Em produção, aqui seria feita uma chamada à API
    onOpenChange(false);
  };
  
  const baixarVersaoEditavel = () => {
    if (!questionario) return;
    
    toast.success('Baixando versão editável do questionário...');
    // Em produção, aqui seria feita uma chamada à API para gerar e baixar o documento
  };
  
  const duplicarModelo = () => {
    if (!questionario) return;
    
    const novoModelo: ModeloQuestionario = {
      ...questionario,
      id: uuidv4(),
      nome: `${questionario.nome} (Cópia)`,
      versao: 1,
      dataCriacao: new Date().toISOString(),
    };
    
    setQuestionario(novoModelo);
    toast.info('Modelo duplicado. Você está editando uma nova cópia.');
  };

  // Função para renderizar preview da pergunta
  const renderPreviewPergunta = (pergunta: PerguntaQuestionario) => {
    const perguntaId = pergunta.id;
    
    switch (pergunta.tipo) {
      case 'boolean':
        return (
          <RadioGroup
            value={respostasPreview[perguntaId] === true ? "sim" : respostasPreview[perguntaId] === false ? "nao" : ""}
            onValueChange={(value) => {
              setRespostasPreview(prev => ({
                ...prev,
                [perguntaId]: value === "sim"
              }));
            }}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id={`${perguntaId}-sim`} />
              <Label htmlFor={`${perguntaId}-sim`}>Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id={`${perguntaId}-nao`} />
              <Label htmlFor={`${perguntaId}-nao`}>Não</Label>
            </div>
          </RadioGroup>
        );
      case 'texto':
        return (
          <Textarea
            placeholder="Digite sua resposta aqui..."
            value={respostasPreview[perguntaId] || ""}
            onChange={(e) => {
              setRespostasPreview(prev => ({
                ...prev,
                [perguntaId]: e.target.value
              }));
            }}
          />
        );
      case 'numero':
        return (
          <Input
            type="number"
            placeholder="Digite um número..."
            value={respostasPreview[perguntaId] || ""}
            onChange={(e) => {
              setRespostasPreview(prev => ({
                ...prev,
                [perguntaId]: e.target.value
              }));
            }}
          />
        );
      case 'data':
        return (
          <Input
            type="date"
            value={respostasPreview[perguntaId] || ""}
            onChange={(e) => {
              setRespostasPreview(prev => ({
                ...prev,
                [perguntaId]: e.target.value
              }));
            }}
          />
        );
      case 'upload':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Clique para fazer upload do arquivo</p>
          </div>
        );
      default:
        return <p className="text-sm text-gray-500">Tipo de pergunta não suportado</p>;
    }
  };

  // Renderiza o conteúdo principal do editor
  const renderEditorContent = () => {
    if (!questionario) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Cabeçalho do questionário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome-questionario">Nome do questionário</Label>
            <Input
              id="nome-questionario"
              value={questionario.nome}
              onChange={e => setQuestionario({ ...questionario, nome: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Fornecimento</Label>
              <Select
                value={tipoFornecimento}
                onValueChange={(value: TipoFornecimento) => setTipoFornecimento(value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="servico">Serviço</SelectItem>
                  <SelectItem value="misto">Misto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Área Solicitante</Label>
              <Select
                value={areaSolicitante}
                onValueChange={(value: AreaSolicitante) => setAreaSolicitante(value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compras">Compras</SelectItem>
                  <SelectItem value="engenharia">Engenharia</SelectItem>
                  <SelectItem value="logistica">Logística</SelectItem>
                  <SelectItem value="qualidade">Qualidade</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Tabs para as seções */}
        <Tabs value={activeTabId} onValueChange={setActiveTabId}>
          <div className="flex items-center justify-between">
            <div className="overflow-x-auto pb-1">
              <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500 relative">
                {questionario.secoes.map(secao => (
                  <TabsTrigger key={secao.id} value={secao.id}>
                    {secao.titulo}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <Button variant="outline" size="sm" onClick={adicionarSecao}>
              <Plus className="h-4 w-4 mr-1" /> Seção
            </Button>
          </div>
          
          {questionario.secoes.map(secao => (
            <TabsContent key={secao.id} value={secao.id}>
              <div className="border rounded-lg p-4 space-y-4">
                {/* Cabeçalho da seção */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-grow space-y-2">
                    <div>
                      <Label htmlFor={`secao-titulo-${secao.id}`}>Título da seção</Label>
                      <Input
                        id={`secao-titulo-${secao.id}`}
                        value={secao.titulo}
                        onChange={e => atualizarSecao(secao.id, 'titulo', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`secao-desc-${secao.id}`}>Descrição</Label>
                      <Textarea
                        id={`secao-desc-${secao.id}`}
                        value={secao.descricao || ''}
                        onChange={e => atualizarSecao(secao.id, 'descricao', e.target.value)}
                        placeholder="Descrição opcional da seção..."
                      />
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removerSecao(secao.id)}
                  >
                    <Minus className="h-4 w-4 mr-1" /> Remover Seção
                  </Button>
                </div>
                
                {/* Lista de perguntas */}
                <div className="space-y-6 my-4">
                  {secao.perguntas.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 border border-dashed rounded-md">
                      Nenhuma pergunta nesta seção.
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adicionarPergunta(secao.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Adicionar pergunta
                        </Button>
                      </div>
                    </div>
                  ) : (
                    secao.perguntas.map((pergunta, index) => (
                      <div
                        key={pergunta.id}
                        className="border rounded-lg p-4 space-y-3 bg-slate-50"
                      >
                        {/* Texto da pergunta */}
                        <div>
                          <Label htmlFor={`pergunta-${pergunta.id}`}>Pergunta #{index + 1}</Label>
                          <Textarea
                            id={`pergunta-${pergunta.id}`}
                            value={pergunta.texto}
                            onChange={e =>
                              atualizarPergunta(secao.id, pergunta.id, 'texto', e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Tipo de pergunta */}
                          <div>
                            <Label htmlFor={`tipo-${pergunta.id}`}>Tipo de resposta</Label>
                            <Select
                              value={pergunta.tipo}
                              onValueChange={valor =>
                                atualizarPergunta(secao.id, pergunta.id, 'tipo', valor)
                              }
                            >
                              <SelectTrigger className="mt-1" id={`tipo-${pergunta.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="texto">Texto</SelectItem>
                                <SelectItem value="opcoes">Múltipla escolha</SelectItem>
                                <SelectItem value="numero">Número</SelectItem>
                                <SelectItem value="data">Data</SelectItem>
                                <SelectItem value="boolean">Sim/Não</SelectItem>
                                <SelectItem value="upload">Upload de arquivo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* Obrigatório */}
                          <div className="flex items-center space-x-2 mt-6">
                            <Switch
                              id={`obrigatorio-${pergunta.id}`}
                              checked={pergunta.obrigatorio}
                              onCheckedChange={checked =>
                                atualizarPergunta(secao.id, pergunta.id, 'obrigatorio', checked)
                              }
                            />
                            <Label htmlFor={`obrigatorio-${pergunta.id}`}>Obrigatório</Label>
                          </div>
                          
                          {/* Permite upload */}
                          <div className="flex items-center space-x-2 mt-6">
                            <Switch
                              id={`upload-${pergunta.id}`}
                              checked={pergunta.permiteUpload || false}
                              onCheckedChange={checked =>
                                atualizarPergunta(secao.id, pergunta.id, 'permiteUpload', checked)
                              }
                            />
                            <Label htmlFor={`upload-${pergunta.id}`}>Permitir anexar documento</Label>
                          </div>
                        </div>

                        {/* Preview da pergunta */}
                        <div className="mt-4 p-3 bg-white border rounded-md">
                          <Label className="text-sm font-medium text-gray-700">Preview:</Label>
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-2">{pergunta.texto}</p>
                            {renderPreviewPergunta(pergunta)}
                          </div>
                        </div>
                        
                        {/* Botões de ação da pergunta */}
                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moverPergunta(secao.id, pergunta.id, 'cima')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moverPergunta(secao.id, pergunta.id, 'baixo')}
                            disabled={index === secao.perguntas.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removerPergunta(secao.id, pergunta.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Minus className="h-4 w-4 mr-1" /> Remover
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Botão para adicionar nova pergunta */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => adicionarPergunta(secao.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar Pergunta
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };

  return (
    <ExpandedDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Questionário de Qualificação"
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
    >
        
        {renderEditorContent()}
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={duplicarModelo}>
              <Copy className="h-4 w-4 mr-1" /> Duplicar
            </Button>
            <Button variant="outline" onClick={baixarVersaoEditavel}>
              <FilePlus className="h-4 w-4 mr-1" /> Baixar versão editável
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarQuestionario}>
              <Save className="h-4 w-4 mr-1" /> Salvar
            </Button>
            <Button onClick={enviarQuestionario}>
              <Send className="h-4 w-4 mr-1" /> Enviar ao Fornecedor
            </Button>
          </div>
        </div>
    </ExpandedDialog>
  );
};
