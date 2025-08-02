import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  FileText, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Upload, 
  Calendar,
  Briefcase,
  Building,
  FileSpreadsheet,
  Clock,
  AlertTriangle,
  Save,
  Send,
  Mic,
  MicOff,
  MessageSquare,
  ToggleLeft,
  ToggleRight,
  CircleCheck,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
  DrawerDescription 
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PreencherQuestionario } from "@/components/fornecedores/avaliacao/etapas/PreencherQuestionario";

// Expanded schema to include new fields
const formSchema = z.object({
  nome: z.string().min(5, {
    message: "Nome da requisição deve ter pelo menos 5 caracteres.",
  }),
  area: z.string({
    required_error: "Por favor selecione a área solicitante.",
  }),
  tipo: z.string({
    required_error: "Por favor selecione o tipo de requisição.",
  }),
  centroCusto: z.string({
    required_error: "Por favor selecione o centro de custo.",
  }),
  classificacao: z.string({
    required_error: "Por favor selecione a classificação.",
  }),
  contaContabil: z.string().optional(),
  prazo: z.string({
    required_error: "Por favor selecione o prazo desejado.",
  }),
  justificativa: z.string().min(10, {
    message: "Justificativa deve ter pelo menos 10 caracteres.",
  }),
  urgente: z.boolean().default(false),
  motivoUrgencia: z.string().optional(),
  projetoFilial: z.string().optional(),
  requisicaoModelo: z.boolean().default(false),
  requisicaoRecorrente: z.boolean().default(false),
});

// Tipo para itens da requisição com campos adicionais
type Item = {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  categoria: string;
  valorEstimado?: number;
  justificativaItem?: string;
  fornecedorSugerido?: string;
};

// Interface para sugestões da IA
interface SugestaoIA {
  categoria?: string;
  fornecedor?: string;
  mensagem: string;
  confianca: number;
}

const CriarRequisicao = () => {
  const navigate = useNavigate();
  const [itens, setItens] = useState<Item[]>([]);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [prazoEhUrgente, setPrazoEhUrgente] = useState(false);
  const [iaAtiva, setIaAtiva] = useState(false);
  const [modoVoz, setModoVoz] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState<Item | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [showSourcingConfirmation, setShowSourcingConfirmation] = useState(false);
  const [questionarioRespostas, setQuestionarioRespostas] = useState<Record<string, any>>({});
  
  // Mock de sugestões da IA para demonstração
  const [sugestoesIA, setSugestoesIA] = useState<Record<string, SugestaoIA>>({});

  // Inicializa o formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      area: "",
      tipo: "",
      centroCusto: "",
      classificacao: "",
      contaContabil: "",
      prazo: "",
      justificativa: "",
      urgente: false,
      motivoUrgencia: "",
      projetoFilial: "",
      requisicaoModelo: false,
      requisicaoRecorrente: false,
    },
  });

  const watchUrgente = form.watch("urgente");
  
  // Função para gerar sugestão baseada no nome do item
  const gerarSugestao = (nomeItem: string): SugestaoIA => {
    // Simulação de IA analisando o nome do item
    if (nomeItem.toLowerCase().includes("monitor")) {
      return {
        categoria: "ti-hardware",
        fornecedor: "Dell Computadores",
        mensagem: "Com base em compras anteriores, sugerimos a categoria TI - Hardware e o fornecedor Dell Computadores que oferece bons preços para monitores.",
        confianca: 92
      };
    } else if (nomeItem.toLowerCase().includes("papel")) {
      return {
        categoria: "escritorio",
        fornecedor: "Kalunga",
        mensagem: "Materiais de escritório como este foram comprados anteriormente do fornecedor Kalunga.",
        confianca: 85
      };
    } else if (nomeItem.toLowerCase().includes("consultoria")) {
      return {
        categoria: "servicos",
        fornecedor: "Deloitte",
        mensagem: "Serviços de consultoria são tipicamente classificados na categoria Serviços.",
        confianca: 78
      };
    }
    return {
      categoria: "",
      fornecedor: "",
      mensagem: "Não tenho sugestões específicas para este item. Por favor classifique manualmente.",
      confianca: 50
    };
  };

  // Função para adicionar um novo item com modal
  const adicionarItem = () => {
    const novoItem: Item = {
      id: `item-${Date.now()}`,
      nome: "",
      quantidade: 1,
      unidade: "un",
      categoria: "",
      valorEstimado: undefined,
      justificativaItem: "",
      fornecedorSugerido: "",
    };
    setItemEmEdicao(novoItem);
  };

  // Função para salvar item após edição no modal
  const salvarItem = () => {
    if (itemEmEdicao) {
      if (!itemEmEdicao.nome) {
        toast.error("O nome do item é obrigatório");
        return;
      }

      // Se é um item novo, adiciona à lista
      if (!itens.some(item => item.id === itemEmEdicao.id)) {
        setItens([...itens, itemEmEdicao]);
      } else {
        // Se é edição, atualiza o item existente
        setItens(itens.map(item => 
          item.id === itemEmEdicao.id ? itemEmEdicao : item
        ));
      }
      
      setItemEmEdicao(null);
      toast.success("Item salvo com sucesso");
    }
  };

  // Função para editar um item existente
  const editarItem = (id: string) => {
    const item = itens.find(item => item.id === id);
    if (item) {
      setItemEmEdicao({...item});
    }
  };

  // Função para remover um item
  const removerItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

  // Função para atualizar campos do item em edição
  const atualizarItemEmEdicao = (campo: keyof Item, valor: any) => {
    if (itemEmEdicao) {
      const novoItem = {...itemEmEdicao, [campo]: valor};
      setItemEmEdicao(novoItem);
      
      // Se o campo for nome, gera sugestões da IA
      if (campo === 'nome' && valor && iaAtiva && valor.length > 3) {
        const sugestao = gerarSugestao(valor);
        setSugestoesIA({
          ...sugestoesIA,
          [novoItem.id]: sugestao
        });
        
        // Auto-preenche a categoria se estiver vazia
        if (!novoItem.categoria && sugestao.categoria) {
          setItemEmEdicao({
            ...novoItem,
            categoria: sugestao.categoria,
            fornecedorSugerido: sugestao.fornecedor || ""
          });
        }
      }
    }
  };

  // Manipulador de envio do formulário
  const onSubmit = (data: z.infer<typeof formSchema>, enviado: boolean = false) => {
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item à requisição");
      return;
    }
    
    const requisicao = {
      ...data,
      itens,
      questionario: questionarioRespostas,
      arquivos: arquivos.map(a => a.name),
      dataEnvio: enviado ? new Date() : null,
      status: enviado ? "pendente" : "rascunho"
    };
    
    console.log("Dados da requisição:", requisicao);
    
    if (enviado) {
      setEnviado(true);
      toast.success("Requisição enviada para aprovação!");
      // Redirecionar após 3 segundos
      setTimeout(() => navigate("/requisicoes"), 3000);
    } else {
      toast.success("Rascunho salvo com sucesso!");
    }
  };

  // Manipulador para solicitar cotação
  const handleSolicitarCotacao = () => {
    // Validar todos os dados necessários
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item à requisição antes de solicitar cotação");
      return;
    }

    if (!form.getValues("nome") || !form.getValues("area") || !form.getValues("tipo")) {
      toast.error("Preencha os dados básicos da requisição antes de solicitar cotação");
      return;
    }

    // Mostrar diálogo de confirmação
    setShowSourcingConfirmation(true);
  };

  // Função para enviar para o módulo de sourcing
  const enviarParaSourcing = () => {
    const dadosRequisicao = {
      ...form.getValues(),
      itens,
      questionario: questionarioRespostas
    };
    
    // Aqui seria feita a integração com o módulo de sourcing
    console.log("Enviando para módulo de sourcing:", dadosRequisicao);
    
    toast.success("Requisição enviada para o módulo de Sourcing!");
    setShowSourcingConfirmation(false);
    
    // Navega para o módulo de sourcing após breve delay
    setTimeout(() => navigate("/eventos"), 2000);
  };

  // Manipulador de upload de arquivo
  const handleUploadArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArquivos([...arquivos, file]);
      toast.success(`Arquivo ${file.name} adicionado`);
    }
  };

  // Remover arquivo
  const removerArquivo = (index: number) => {
    const novosArquivos = [...arquivos];
    novosArquivos.splice(index, 1);
    setArquivos(novosArquivos);
  };

  // Verificar se o prazo é urgente (menos de 5 dias)
  const verificarPrazoUrgente = (data: string) => {
    const prazoDate = new Date(data);
    const hoje = new Date();
    const diffTime = prazoDate.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setPrazoEhUrgente(diffDays < 5);
    
    // Atualiza o campo urgente se o prazo for menor que 5 dias
    if (diffDays < 5 && !form.getValues("urgente")) {
      form.setValue("urgente", true);
    }
  };

  // Toggle para assistente de IA
  const toggleIA = () => {
    const novoEstado = !iaAtiva;
    setIaAtiva(novoEstado);
    if (novoEstado) {
      toast.success("Assistente IA Rê ativado! Posso ajudar com sugestões e preenchimento automático.");
    } else {
      toast.info("Assistente IA Rê desativado.");
    }
  };

  // Toggle para modo voz
  const toggleVoz = () => {
    const novoEstado = !modoVoz;
    setModoVoz(novoEstado);
    if (novoEstado) {
      toast.success("Modo voz ativado. Agora você pode dar comandos por voz.");
    } else {
      toast.info("Modo voz desativado.");
    }
  };

  // Handler para atualizar respostas do questionário
  const handleQuestionarioRespostasChange = (respostas: Record<string, any>) => {
    setQuestionarioRespostas(respostas);
    console.log("Respostas do questionário atualizadas:", respostas);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/requisicoes")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-slate-800">Nova Requisição</h1>
          <p className="text-slate-500">
            Preencha os dados da requisição interna
          </p>
        </div>
        
        {/* Botões da IA - Nova Feature */}
        <div className="flex items-center gap-2">
          <Button
            variant={iaAtiva ? "default" : "outline"}
            size="sm"
            onClick={toggleIA}
            className={cn(
              "transition-colors",
              iaAtiva ? "bg-purple-600 hover:bg-purple-700" : "border-purple-300 text-purple-700"
            )}
          >
            {iaAtiva ? (
              <>
                <MessageSquare className="h-4 w-4 mr-1" /> IA Rê Ativa
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-1" /> Ativar IA Rê
              </>
            )}
          </Button>
          {iaAtiva && (
            <Button
              variant={modoVoz ? "default" : "outline"}
              size="sm"
              onClick={toggleVoz}
              className={modoVoz ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              {modoVoz ? (
                <Mic className="h-4 w-4" />
              ) : (
                <MicOff className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Feedback após envio - Nova Feature */}
      {enviado && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
          <CircleCheck className="h-6 w-6 text-green-500 mr-3" />
          <div>
            <h3 className="font-medium text-green-800">Requisição enviada com sucesso!</h3>
            <p className="text-green-700 text-sm">
              Sua requisição foi enviada para aprovação. Você será redirecionado para a lista de requisições.
            </p>
            <p className="text-green-700 text-sm mt-1">
              <strong>Próximo passo:</strong> Aguardando aprovação do gestor da área.
            </p>
          </div>
        </div>
      )}

      {/* Assistente IA ativo - Nova Feature */}
      {iaAtiva && !enviado && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <div className="bg-purple-100 rounded-full p-2 mr-3">
              <MessageSquare className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <h3 className="font-medium text-purple-800">Assistente IA Rê</h3>
              <p className="text-purple-700 text-sm mt-1">
                Estou pronta para ajudar! Posso sugerir categorias, fornecedores e preencher campos automaticamente com base no histórico da empresa.
              </p>
              {modoVoz && (
                <p className="text-purple-700 text-sm mt-1">
                  <strong>Modo voz ativado:</strong> Diga "adicionar item", "salvar rascunho" ou "enviar requisição" para executar ações.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => onSubmit(data, true))} className="space-y-6">
          {/* Dados básicos da requisição */}
          <Card className="overflow-hidden">
            <div className="bg-amber-50 p-4 border-b border-amber-100">
              <h2 className="flex items-center gap-2 font-semibold text-amber-800">
                <FileText className="h-5 w-5" /> 
                Informações Básicas
              </h2>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* Nome da requisição */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Requisição</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Compra de equipamentos para departamento de TI" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Nome claro e descritivo para identificação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Área/Departamento */}
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área/Departamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a área solicitante" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ti">Tecnologia da Informação</SelectItem>
                          <SelectItem value="rh">Recursos Humanos</SelectItem>
                          <SelectItem value="facilities">Facilities</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="financeiro">Financeiro</SelectItem>
                          <SelectItem value="operacoes">Operações</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Tipo de Requisição */}
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Requisição</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="produto">Produto</SelectItem>
                          <SelectItem value="servico">Serviço</SelectItem>
                          <SelectItem value="contratacao">Contratação</SelectItem>
                          <SelectItem value="recorrente">Recorrente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Centro de Custo */}
                <FormField
                  control={form.control}
                  name="centroCusto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Centro de Custo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cc001">CC001 - Administrativo</SelectItem>
                          <SelectItem value="cc002">CC002 - Comercial</SelectItem>
                          <SelectItem value="cc003">CC003 - Tecnologia</SelectItem>
                          <SelectItem value="cc004">CC004 - Operações</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Classificação */}
                <FormField
                  control={form.control}
                  name="classificacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classificação</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="capex">CAPEX</SelectItem>
                          <SelectItem value="opex">OPEX</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Conta Contábil */}
                <FormField
                  control={form.control}
                  name="contaContabil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conta Contábil</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 1.2.3.45.6" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Campo Projeto/Filial (Novo) */}
              <FormField
                control={form.control}
                name="projetoFilial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projeto ou Filial de Destino</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o projeto ou filial" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="matriz">Matriz - São Paulo</SelectItem>
                          <SelectItem value="filial01">Filial - Rio de Janeiro</SelectItem>
                          <SelectItem value="filial02">Filial - Belo Horizonte</SelectItem>
                          <SelectItem value="projeto01">Projeto - Expansão Norte</SelectItem>
                          <SelectItem value="projeto02">Projeto - Automação Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Destino dos itens ou serviços solicitados
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prazo Desejado */}
                <FormField
                  control={form.control}
                  name="prazo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo Desejado</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]} 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              verificarPrazoUrgente(e.target.value);
                            }}
                          />
                          {prazoEhUrgente && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-2">
                              <span className="flex items-center text-amber-500 text-xs font-medium">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Urgente
                              </span>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Data de Criação */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Data da Solicitação
                  </label>
                  <Input 
                    type="text" 
                    value={new Date().toLocaleDateString('pt-BR')}
                    disabled 
                  />
                  <p className="text-sm text-muted-foreground">Preenchido automaticamente</p>
                </div>
              </div>

              {/* Toggle Urgente com campo extra (Novo) */}
              <div className="space-y-4 border-t border-slate-200 pt-4">
                <FormField
                  control={form.control}
                  name="urgente"
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Marcar como Urgente?</FormLabel>
                        <FormDescription>
                          Requisições urgentes são priorizadas no fluxo de aprovação
                        </FormDescription>
                      </div>
                      <FormControl>
                        <div className="flex items-center">
                          {field.value ? (
                            <ToggleRight 
                              className="h-6 w-6 text-amber-500 cursor-pointer" 
                              onClick={() => form.setValue("urgente", false)} 
                            />
                          ) : (
                            <ToggleLeft 
                              className="h-6 w-6 text-slate-400 cursor-pointer" 
                              onClick={() => form.setValue("urgente", true)} 
                            />
                          )}
                        </div>
                      </FormControl>
                    </div>
                  )}
                />

                {/* Campo adicional que aparece quando urgente = true */}
                {watchUrgente && (
                  <FormField
                    control={form.control}
                    name="motivoUrgencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo da Urgência</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Explique porque esta requisição é urgente" 
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Uma justificativa clara ajuda na priorização da requisição
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Justificativa */}
              <FormField
                control={form.control}
                name="justificativa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Justificativa</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explique a necessidade desta requisição" 
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Inclua detalhes que justifiquem a necessidade da compra
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Opções adicionais - requisição modelo e recorrente (Novo) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                <FormField
                  control={form.control}
                  name="requisicaoModelo"
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Salvar como modelo?</FormLabel>
                        <FormDescription>
                          Poderá ser reutilizado em solicitações futuras
                        </FormDescription>
                      </div>
                      <FormControl>
                        <div className="flex items-center">
                          {field.value ? (
                            <ToggleRight 
                              className="h-6 w-6 text-blue-500 cursor-pointer" 
                              onClick={() => form.setValue("requisicaoModelo", false)} 
                            />
                          ) : (
                            <ToggleLeft 
                              className="h-6 w-6 text-slate-400 cursor-pointer" 
                              onClick={() => form.setValue("requisicaoModelo", true)} 
                            />
                          )}
                        </div>
                      </FormControl>
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requisicaoRecorrente"
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Requisição recorrente?</FormLabel>
                        <FormDescription>
                          Compra cíclica que se repetirá periodicamente
                        </FormDescription>
                      </div>
                      <FormControl>
                        <div className="flex items-center">
                          {field.value ? (
                            <ToggleRight 
                              className="h-6 w-6 text-blue-500 cursor-pointer" 
                              onClick={() => form.setValue("requisicaoRecorrente", false)} 
                            />
                          ) : (
                            <ToggleLeft 
                              className="h-6 w-6 text-slate-400 cursor-pointer" 
                              onClick={() => form.setValue("requisicaoRecorrente", true)} 
                            />
                          )}
                        </div>
                      </FormControl>
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Questionário - NOVO */}
          <Card className="overflow-hidden">
            <div className="bg-amber-50 p-4 border-b border-amber-100">
              <h2 className="flex items-center gap-2 font-semibold text-amber-800">
                <ShoppingBag className="h-5 w-5" /> 
                Detalhes do Produto/Serviço
              </h2>
            </div>
            <CardContent className="p-6">
              <PreencherQuestionario 
                onRespostasChange={handleQuestionarioRespostasChange}
                respostasAtuais={questionarioRespostas}
              />
            </CardContent>
          </Card>

          {/* Itens da requisição */}
          <Card className="overflow-hidden">
            <div className="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center">
              <h2 className="flex items-center gap-2 font-semibold text-amber-800">
                <FileSpreadsheet className="h-5 w-5" /> 
                Itens Adicionais da Requisição
              </h2>
              <Button
                type="button"
                onClick={adicionarItem}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Item
              </Button>
            </div>
            <CardContent className="p-6 space-y-6">
              {itens.length > 0 ? (
                itens.map((item, index) => (
                  <div key={item.id} className="border border-slate-200 rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Item {index + 1}: {item.nome}</h3>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => editarItem(item.id)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removerItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Quantidade:</span>
                        <p className="font-medium">{item.quantidade} {item.unidade}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Categoria:</span>
                        <p className="font-medium">
                          {item.categoria === 'ti-hardware' && 'TI - Hardware'}
                          {item.categoria === 'ti-software' && 'TI - Software'}
                          {item.categoria === 'escritorio' && 'Material de Escritório'}
                          {item.categoria === 'moveis' && 'Móveis e Equipamentos'}
                          {item.categoria === 'marketing' && 'Material de Marketing'}
                          {item.categoria === 'servicos' && 'Serviços Gerais'}
                          {item.categoria === 'consultoria' && 'Consultoria'}
                          {!item.categoria && 'Não especificada'}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Valor estimado:</span>
                        <p className="font-medium">{item.valorEstimado ? `R$ ${item.valorEstimado.toFixed(2).replace('.', ',')}` : 'Não informado'}</p>
                      </div>
                      {item.fornecedorSugerido && (
                        <div>
                          <span className="text-slate-500">Fornecedor sugerido:</span>
                          <p className="font-medium">{item.fornecedorSugerido}</p>
                        </div>
                      )}
                    </div>
                    
                    {item.justificativaItem && (
                      <div className="mt-2 text-sm">
                        <span className="text-slate-500">Justificativa do item:</span>
                        <p className="mt-1 text-slate-700">{item.justificativaItem}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border border-dashed border-slate-300 rounded-md">
                  <p className="text-slate-500">
                    Itens adicionais podem ser incluídos clicando em "Adicionar Item".
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload de documentos */}
          <Card className="overflow-hidden">
            <div className="bg-amber-50 p-4 border-b border-amber-100">
              <h2 className="flex items-center gap-2 font-semibold text-amber-800">
                <Upload className="h-5 w-5" /> 
                Documentos e Anexos
              </h2>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input 
                  type="file" 
                  id="fileUpload" 
                  className="hidden" 
                  onChange={handleUploadArquivo}
                />
                <label 
                  htmlFor="fileUpload" 
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-700">Clique para fazer upload</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Ou arraste e solte arquivos aqui
                    </p>
                  </div>
                </label>
              </div>
              
              {/* Lista de arquivos */}
              {arquivos.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h3 className="text-sm font-medium">Arquivos anexados:</h3>
                  <ul className="divide-y">
                    {arquivos.map((file, index) => (
                      <li key={index} className="py-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-slate-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removerArquivo(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botões de ação */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.handleSubmit((data) => onSubmit(data, false))()}
            >
              <Save className="h-4 w-4 mr-2" /> Salvar como Rascunho
            </Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              <Send className="h-4 w-4 mr-2" /> Enviar para Aprovação
            </Button>
            <Button 
              type="button" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSolicitarCotacao}
            >
              <ShoppingBag className="h-4 w-4 mr-2" /> Solicitar Cotação
            </Button>
          </div>
        </form>
      </Form>

      {/* Diálogo de confirmação para envio ao sourcing */}
      <Dialog open={showSourcingConfirmation} onOpenChange={setShowSourcingConfirmation}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enviar para módulo de Sourcing</DialogTitle>
            <DialogDescription>
              Isso enviará os dados da requisição para o módulo de Sourcing para solicitar cotações de fornecedores.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-700">
                <strong>Nota:</strong> Após o envio, o processo de cotação será iniciado automaticamente. 
                Você poderá acompanhar o andamento no módulo de Sourcing.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1">
                  <CircleCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Detalhes do produto/serviço</p>
                  <p className="text-xs text-slate-500">Todas as informações do produto/serviço serão enviadas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1">
                  <CircleCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Documentos anexados</p>
                  <p className="text-xs text-slate-500">Todos os documentos serão acessíveis aos fornecedores</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1">
                  <CircleCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Notificação automática</p>
                  <p className="text-xs text-slate-500">Você receberá notificações sobre o andamento do processo</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSourcingConfirmation(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={enviarParaSourcing}
            >
              <ShoppingBag className="h-4 w-4 mr-2" /> Confirmar Envio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Adicionar/Editar Item */}
      <Dialog open={!!itemEmEdicao} onOpenChange={() => itemEmEdicao && setItemEmEdicao(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{itemEmEdicao && itemEmEdicao.nome ? 'Editar Item' : 'Adicionar Novo Item'}</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do item para a requisição.
            </DialogDescription>
          </DialogHeader>

          {itemEmEdicao && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Item ou Serviço *</label>
                  <Input
                    placeholder="Ex: Monitor Dell 24 polegadas"
                    value={itemEmEdicao.nome}
                    onChange={(e) => atualizarItemEmEdicao('nome', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantidade *</label>
                  <Input
                    type="number"
                    min={1}
                    value={itemEmEdicao.quantidade}
                    onChange={(e) => atualizarItemEmEdicao('quantidade', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unidade *</label>
                  <Select
                    value={itemEmEdicao.unidade}
                    onValueChange={(value) => atualizarItemEmEdicao('unidade', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="un">Unidade</SelectItem>
                      <SelectItem value="cx">Caixa</SelectItem>
                      <SelectItem value="kg">Quilograma</SelectItem>
                      <SelectItem value="l">Litro</SelectItem>
                      <SelectItem value="m">Metro</SelectItem>
                      <SelectItem value="m2">Metro quadrado</SelectItem>
                      <SelectItem value="h">Hora</SelectItem>
                      <SelectItem value="srv">Serviço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sugestões da IA - se existirem */}
              {iaAtiva && itemEmEdicao.nome && itemEmEdicao.nome.length > 3 && sugestoesIA[itemEmEdicao.id] && (
                <div className="bg-purple-50 border border-purple-200 rounded-md p-3 mt-2">
                  <div className="flex items-start">
                    <MessageSquare className="h-4 w-4 text-purple-700 mt-1 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-purple-800">Sugestão da IA Rê</h4>
                      <p className="text-xs text-purple-700 mt-1">
                        {sugestoesIA[itemEmEdicao.id].mensagem}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-purple-600">Confiança: {sugestoesIA[itemEmEdicao.id].confianca}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria *</label>
                  <Select
                    value={itemEmEdicao.categoria}
                    onValueChange={(value) => atualizarItemEmEdicao('categoria', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ti-hardware">TI - Hardware</SelectItem>
                      <SelectItem value="ti-software">TI - Software</SelectItem>
                      <SelectItem value="escritorio">Material de Escritório</SelectItem>
                      <SelectItem value="moveis">Móveis e Equipamentos</SelectItem>
                      <SelectItem value="marketing">Material de Marketing</SelectItem>
                      <SelectItem value="servicos">Serviços Gerais</SelectItem>
                      <SelectItem value="consultoria">Consultoria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor Estimado (R$)</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="R$ 0,00"
                    value={itemEmEdicao.valorEstimado || ''}
                    onChange={(e) => atualizarItemEmEdicao('valorEstimado', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fornecedor Sugerido</label>
                <Input
                  placeholder="Ex: Dell, Staples, etc"
                  value={itemEmEdicao.fornecedorSugerido || ''}
                  onChange={(e) => atualizarItemEmEdicao('fornecedorSugerido', e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Preencha se você tiver um fornecedor preferido (opcional)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Justificativa do Item</label>
                <Textarea 
                  placeholder="Por que este item específico é necessário?"
                  value={itemEmEdicao.justificativaItem || ''}
                  onChange={(e) => atualizarItemEmEdicao('justificativaItem', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setItemEmEdicao(null)}>
              Cancelar
            </Button>
            <Button
              onClick={salvarItem}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {itemEmEdicao && itens.some(item => item.id === itemEmEdicao.id) ? 'Atualizar Item' : 'Adicionar Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CriarRequisicao;
