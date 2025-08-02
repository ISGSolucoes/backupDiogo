import React, { useState } from "react";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { BuscaInteligente } from "@/components/fornecedores/BuscaInteligente";
import { TabelaFornecedores } from "@/components/fornecedores/TabelaFornecedores";
import { Fornecedor } from "@/types/fornecedor";
import { ResultadosBuscaExterna } from "@/components/fornecedores/busca-externa/ResultadosBuscaExterna"; 
import { CardsDeStatusFornecedor } from "@/components/fornecedores/CardsDeStatusFornecedor";
import { AcoesRapidasReorganizadas } from "@/components/fornecedores/AcoesRapidasReorganizadas";
import { StatusCicloVidaActions } from "@/components/fornecedores/StatusCicloVidaActions";
import { AvaliarDesempenho } from "@/components/fornecedores/AvaliarDesempenho";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ExportarFornecedoresModal } from "@/components/fornecedores/acoes-lote/ExportarFornecedoresModal";
import { ImportarListaModal } from "@/components/fornecedores/acoes-lote/ImportarListaModal";
import { AcoesLoteModal } from "@/components/fornecedores/acoes-lote/AcoesLoteModal";
import { MonitoramentoAcoesModal } from "@/components/fornecedores/acoes-lote/MonitoramentoAcoesModal";
import { RepositorioTemplatesModal } from "@/components/fornecedores/acoes-lote/RepositorioTemplatesModal";
import { SelecionarTemplateModal } from '@/components/fornecedores/acoes-lote/SelecionarTemplateModal';
import { SolicitarRegistro } from '@/components/fornecedores/SolicitarRegistro';
import type { FornecedorValidado, ConfiguracaoAcao } from '@/types/acoes-lote';

// Dados mock para demonstração - com novos campos expandidos
const fornecedoresMock: Fornecedor[] = [
  {
    id: "1",
    nome: "Aço & Plásticos Ind. Ltda",
    cnpj: "12.345.678/0001-01",
    cnpjRaiz: "12345678",
    status: "qualificado",
    categoria: "Matérias-Primas Principais",
    tipoFornecedor: "industria",
    ultimaParticipacao: "10/05/2023",
    uf: "SP",
    cidade: "São Paulo",
    porte: "medio",
    tipoEmpresa: "ltda",
    qualificado: true,
    preferido: false,
    dataCadastro: "05/03/2023",
    classificacao: "direto",
    financeiro: "OPEX",
    segmento: "Industrial",
    descricao: "Aço, plástico, componentes eletrônicos",
    avaliacao: "avaliado",
    score: 8.2,
    transacional: "ativo",
    criticidade: "alta",
    acoesPendentes: [
      {
        id: "a1",
        tipo: "documento",
        descricao: "Certidão de FGTS vence em 7 dias",
        prioridade: "media",
        dataIdentificacao: "2023-05-10",
        acaoSugerida: "Solicitar atualização de documento"
      },
      {
        id: "a2",
        tipo: "qualificacao",
        descricao: "Questionário não atualizado há mais de 6 meses",
        prioridade: "baixa",
        dataIdentificacao: "2023-05-09",
        acaoSugerida: "Enviar novo questionário de qualificação"
      }
    ]
  },
  {
    id: "2",
    nome: "Usinagem Express ME",
    cnpj: "98.765.432/0001-02",
    cnpjRaiz: "98765432",
    status: "qualificado",
    categoria: "Serviços de Produção",
    tipoFornecedor: "servico",
    ultimaParticipacao: "08/05/2023",
    uf: "RJ",
    cidade: "Rio de Janeiro",
    porte: "pequeno",
    tipoEmpresa: "mei",
    qualificado: true,
    preferido: false,
    dataCadastro: "10/03/2023",
    classificacao: "direto",
    financeiro: "OPEX",
    segmento: "Industrial",
    descricao: "Usinagem terceirizada, montagem",
    avaliacao: "avaliado",
    score: 7.5,
    transacional: "ativo",
    criticidade: "media"
  },
  {
    id: "3",
    nome: "CNC Power Brasil Ltda",
    cnpj: "87.654.321/0001-03",
    cnpjRaiz: "87654321",
    status: "em_qualificacao",
    categoria: "Equipamentos de Produção",
    tipoFornecedor: "mista",
    ultimaParticipacao: "22/04/2023",
    uf: "MG",
    cidade: "Belo Horizonte",
    porte: "grande",
    tipoEmpresa: "ltda",
    qualificado: false,
    preferido: false,
    dataCadastro: "22/02/2023",
    classificacao: "direto",
    financeiro: "CAPEX",
    segmento: "Industrial",
    descricao: "Máquinas CNC com manutenção",
    avaliacao: "parcial",
    score: 6.2,
    transacional: "somente_cotado",
    criticidade: "alta"
  },
  {
    id: "4",
    nome: "Supra Ferramentas Ltda",
    cnpj: "45.678.912/0001-04",
    cnpjRaiz: "45678912",
    status: "inativo",
    categoria: "MRO",
    tipoFornecedor: "industria",
    ultimaParticipacao: "15/01/2023",
    uf: "RS",
    cidade: "Porto Alegre",
    porte: "medio",
    tipoEmpresa: "ltda",
    qualificado: false,
    preferido: false,
    dataCadastro: "15/01/2023",
    classificacao: "indireto",
    financeiro: "OPEX",
    segmento: "Geral",
    descricao: "Peças de reposição, ferramentas, lubrificantes",
    avaliacao: "nao_avaliado",
    transacional: "sem_historico",
    criticidade: "media",
    motivoInativacao: "inatividade_automatica",
    dataInativacao: "2023-04-15",
    usuarioInativacao: "Sistema",
    observacaoInativacao: "Sem participação em eventos há mais de 180 dias"
  },
  {
    id: "5",
    nome: "Manutech Serviços",
    cnpj: "23.456.789/0001-05",
    cnpjRaiz: "23456789",
    status: "qualificado",
    categoria: "Manutenção",
    tipoFornecedor: "servico",
    ultimaParticipacao: "03/05/2023",
    uf: "PR",
    cidade: "Curitiba",
    porte: "pequeno",
    tipoEmpresa: "ltda",
    qualificado: true,
    preferido: false,
    dataCadastro: "01/04/2023",
    classificacao: "indireto",
    financeiro: "OPEX",
    segmento: "Geral",
    descricao: "Preventiva, corretiva, preditiva",
    avaliacao: "avaliado",
    score: 7.0,
    transacional: "ativo",
    criticidade: "baixa"
  },
  {
    id: "6",
    nome: "MedEquip Hospitalar Ltda",
    cnpj: "67.890.123/0001-06",
    cnpjRaiz: "67890123",
    status: "preferido",
    categoria: "Equipamentos Médicos",
    tipoFornecedor: "mista",
    ultimaParticipacao: "28/04/2023",
    uf: "SC",
    cidade: "Florianópolis",
    porte: "grande",
    tipoEmpresa: "ltda",
    qualificado: true,
    preferido: true,
    dataCadastro: "20/02/2023",
    classificacao: "indireto",
    financeiro: "CAPEX",
    segmento: "Saúde",
    descricao: "Ressonância magnética com manutenção",
    avaliacao: "avaliado",
    score: 8.7,
    transacional: "ativo",
    criticidade: "alta"
  }
];

const Fornecedores = () => {
  console.log("📊 Fornecedores page starting...");
  
  // Estados de debug
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log("📊 Fornecedores component states:", { pageLoading, error });
  
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(fornecedoresMock);
  const [filtroStatusAtivo, setFiltroStatusAtivo] = useState<string>("todos");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [fornecedoresExternosCount, setFornecedoresExternosCount] = useState<number>(0);
  const [resultadosExternosReais, setResultadosExternosReais] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  // Estados para modais de ações em lote
  const [showExportarModal, setShowExportarModal] = useState(false);
  const [showImportarModal, setShowImportarModal] = useState(false);
  const [showAcoesLoteModal, setShowAcoesLoteModal] = useState(false);
  const [showMonitoramentoModal, setShowMonitoramentoModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [modalInteligenteOpen, setModalInteligenteOpen] = useState(false);
  const [fornecedoresSelecionadosLote, setFornecedoresSelecionadosLote] = useState<{id: string; nome: string; cnpj: string; email: string; categoria?: string}[]>([]);

  // Efeito para simular carregamento inicial e detectar erros
  React.useEffect(() => {
    console.log("📊 Fornecedores useEffect starting...");
    try {
      // Simular carregamento inicial
      const timer = setTimeout(() => {
        console.log("📊 Fornecedores page loaded successfully");
        setPageLoading(false);
      }, 100);
      
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("📊 Error in Fornecedores useEffect:", err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setPageLoading(false);
    }
  }, []);

  // Se houver erro, mostrar tela de erro
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Erro ao carregar Fornecedores
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Recarregar Página
          </Button>
        </div>
      </div>
    );
  }

  // Se ainda estiver carregando, mostrar loading
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando Fornecedores...</p>
        </div>
      </div>
    );
  }

  console.log("📊 Fornecedores rendering main content...");

  // Calcular data de 7 dias atrás para filtro de recentes
  const getDataUltimosSeteDias = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  };

  // Estatísticas atualizadas seguindo a jornada de qualificação
  const stats = {
    total: fornecedoresMock.length,
    convidados: fornecedoresMock.filter(f => f.status === "convidado").length,
    registrados: fornecedoresMock.filter(f => f.status === "registrado").length,
    emRegistro: fornecedoresMock.filter(f => f.status === "em_registro").length, 
    emQualificacao: fornecedoresMock.filter(f => f.status === "em_qualificacao").length,
    pendentesAprovacao: 2, // Mock data - status "pendente_aprovacao"
    qualificados: fornecedoresMock.filter(f => f.status === "qualificado").length,
    preferidos: fornecedoresMock.filter(f => f.preferido).length,
    inativos: fornecedoresMock.filter(f => f.status === "inativo").length,
    recentes: fornecedoresMock.filter(f => {
      const dataCadastro = new Date(f.dataCadastro);
      return dataCadastro >= getDataUltimosSeteDias();
    }).length,
    aguardandoAcaoFornecedor: 3, // Mock data - fornecedores inativos há mais de X dias
    comPendenciasDocumentais: 1, // Mock data - fornecedores com documentos pendentes
  };

  const handleSearch = (params: any) => {
    // Verificar se é um reset
    if (params.tipoConsulta === 'reset') {
      setFornecedores(fornecedoresMock);
      setSearchParams(null);
      setFornecedoresExternosCount(0);
      setResultadosExternosReais([]);
      setFiltroStatusAtivo("todos");
      return;
    }

    setIsLoading(true);
    setSearchParams(params);
    
    // Se a busca for externa, lidamos de forma diferente
    if (params.tipoConsulta === 'externa') {
      if (params.resultadosReais && params.resultadosReais.length > 0) {
        // Dados reais das APIs
        setResultadosExternosReais(params.resultadosReais);
        setFornecedoresExternosCount(params.resultadosReais.length);
        setIsLoading(false);
        
        const fontes = params.resultadosReais.map((r: any) => r.fonte);
        const fontesUnicas = [...new Set(fontes)];
        
        toast.success(`Busca externa concluída: ${params.resultadosReais.length} fornecedores encontrados via ${fontesUnicas.join(', ')}`);
      } else if (params.externalResults) {
        // Fallback para dados mock
        setFornecedoresExternosCount(params.externalResults);
        setResultadosExternosReais([]);
        setIsLoading(false);
        
        toast.info(`Busca externa concluída: ${params.externalResults} fornecedores simulados`);
      } else {
        // Simulando uma busca com delay para demonstração
        setTimeout(() => {
          const randomCount = Math.floor(Math.random() * 8) + 2;
          setFornecedoresExternosCount(randomCount);
          setResultadosExternosReais([]);
          setIsLoading(false);
          
          toast.info(`Busca externa concluída: ${randomCount} fornecedores simulados`);
        }, 2000);
      }
      return;
    }
    
    // Busca interna - código atualizado removendo categoria e porte
    setTimeout(() => {
      let resultados = [...fornecedoresMock];
      
      // Filtrar por termo de busca
      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        resultados = resultados.filter(
          (f) =>
            f.nome.toLowerCase().includes(searchLower) ||
            f.cnpj.toLowerCase().includes(searchLower) ||
            f.categoria.toLowerCase().includes(searchLower)
        );
      }

      // Aplicar filtros adicionais - removidos categoria, porte e tipoEmpresa
      if (params.filters) {
        if (params.filters.compliance?.status) {
          resultados = resultados.filter((f) => f.status === params.filters.compliance.status);
        }
        
        // Filtro de UF (estado) usando texto livre - pesquisa parcial case-insensitive
        if (params.filters.localizacao?.estado) {
          const ufLower = params.filters.localizacao.estado.toLowerCase();
          resultados = resultados.filter((f) => 
            f.uf.toLowerCase().includes(ufLower)
          );
        }
        
        // Filtro de cidade usando texto livre - pesquisa parcial case-insensitive
        if (params.filters.localizacao?.cidade) {
          const cidadeLower = params.filters.localizacao.cidade.toLowerCase();
          resultados = resultados.filter((f) => 
            f.cidade.toLowerCase().includes(cidadeLower)
          );
        }
      }

      setFornecedores(resultados);
      setFornecedoresExternosCount(0);
      setResultadosExternosReais([]);
      setIsLoading(false);
      
      if (params.tipoConsulta === "interna") {
        toast.success(`Busca concluída: ${resultados.length} fornecedores encontrados`);
      }
    }, 800);
  };

  const handleStatusFiltro = (filtro: string) => {
    setFiltroStatusAtivo(filtro);
    
    // Resetar resultados externos quando filtrar por status
    setFornecedoresExternosCount(0);
    setSearchParams(null);
    
    // Aplicar o filtro selecionado
    let fornecedoresFiltrados = [...fornecedoresMock];
    
    switch(filtro) {
      case "todos":
        // Mostrar todos os fornecedores
        break;
      case "registrado":
        fornecedoresFiltrados = fornecedoresMock.filter(f => f.status === "registrado");
        break;
      case "em_registro":
        fornecedoresFiltrados = fornecedoresMock.filter(f => f.status === "em_registro");
        break;
      case "em_qualificacao":
        fornecedoresFiltrados = fornecedoresMock.filter(f => f.status === "em_qualificacao");
        break;
      case "qualificado":
        fornecedoresFiltrados = fornecedoresMock.filter(f => f.status === "qualificado");
        break;
      case "preferido":
        fornecedoresFiltrados = fornecedoresMock.filter(f => f.preferido);
        break;
      case "inativo":
        fornecedoresFiltrados = fornecedoresMock.filter(f => f.status === "inativo");
        break;
      case "recente":
        fornecedoresFiltrados = fornecedoresMock.filter(f => {
          const dataCadastro = new Date(f.dataCadastro);
          return dataCadastro >= getDataUltimosSeteDias();
        });
        break;
    }
    
    setFornecedores(fornecedoresFiltrados);
    
    if (filtro !== "todos") {
      toast.info(`Filtro aplicado: ${fornecedoresFiltrados.length} fornecedores encontrados`);
    }
  };

  const handleNovoFornecedor = () => {
    toast.info("Funcionalidade de Novo Fornecedor em desenvolvimento");
  };
  
  const handleImportarFornecedor = (fornecedorExterno: any) => {
    // Verificar se o CNPJ já existe na base antes de importar
    const existingFornecedor = fornecedoresMock.find(f => f.cnpj === fornecedorExterno.cnpj);
    
    if (existingFornecedor) {
      toast.info(`O fornecedor ${fornecedorExterno.nome} já existe na sua base com status ${existingFornecedor.status}`);
      return;
    }
    
    // Converter fornecedor externo para formato interno
    const novoFornecedor: Fornecedor = {
      id: `imp-${Date.now()}`,
      nome: fornecedorExterno.nome,
      cnpj: fornecedorExterno.cnpj,
      status: "em_registro",
      categoria: fornecedorExterno.tipo,
      tipoFornecedor: "servico",
      ultimaParticipacao: "N/A",
      uf: fornecedorExterno.uf,
      cidade: fornecedorExterno.cidade,
      porte: "medio",
      tipoEmpresa: fornecedorExterno.tipo.includes("Indústria") ? "sa" : "ltda",
      qualificado: false,
      preferido: false,
      dataCadastro: new Date().toISOString().split('T')[0]
    };
    
    // Adicionar à base e atualizar estatísticas
    const novosFornecedores = [...fornecedoresMock, novoFornecedor];
    setFornecedores(novosFornecedores);
    
    // Redirecionar para busca interna
    setSearchParams({...searchParams, tipoConsulta: 'interna'});
    setFornecedoresExternosCount(0);
    setResultadosExternosReais([]);
    
    // Incluir informação sobre a fonte na mensagem de sucesso
    const fonte = (fornecedorExterno as any).fonte;
    let mensagemCompleta = `Fornecedor ${fornecedorExterno.nome} importado para sua base`;
    
    if (fonte) {
      const fonteNomes = {
        'brasilapi': 'via BrasilAPI',
        'receitaws': 'via ReceitaWS',
        'llm': 'enriquecido por IA',
        'mock': 'simulado'
      };
      mensagemCompleta += ` (${fonteNomes[fonte as keyof typeof fonteNomes] || fonte})`;
    }
    
    toast.success(mensagemCompleta);
  };

  // Handler para marcar/desmarcar fornecedor como preferido
  const handlePreferidoChange = (fornecedorId: string, preferido: boolean) => {
    // Atualizar o fornecedor na lista
    const fornecedoresAtualizados = fornecedores.map(fornecedor =>
      fornecedor.id === fornecedorId
        ? { ...fornecedor, preferido }
        : fornecedor
    );
    
    setFornecedores(fornecedoresAtualizados);
    
    // Em produção, aqui seria feita uma chamada à API para persistir a alteração
    console.log(`Fornecedor ${fornecedorId} atualizado: preferido = ${preferido}`);
  };

  // Novos handlers para inativar/reativar
  const handleInativarFornecedores = (fornecedorIds: string[]) => {
    // Simular inativação - em produção seria uma chamada à API
    const fornecedoresAtualizados = fornecedores.map(fornecedor => 
      fornecedorIds.includes(fornecedor.id) 
        ? { ...fornecedor, status: 'inativo' as const }
        : fornecedor
    );
    
    setFornecedores(fornecedoresAtualizados);
    
    // Limpar seleção após ação
    setSelectedSuppliers([]);
    
    // Log da ação
    console.log("Fornecedores inativados:", fornecedorIds);
  };

  const handleReativarFornecedores = (fornecedorIds: string[]) => {
    // Simular reativação - em produção seria uma chamada à API
    const fornecedoresAtualizados = fornecedores.map(fornecedor => 
      fornecedorIds.includes(fornecedor.id) 
        ? { ...fornecedor, status: 'registrado' as const }
        : fornecedor
    );
    
    setFornecedores(fornecedoresAtualizados);
    
    // Limpar seleção após ação
    setSelectedSuppliers([]);
    
    // Log da ação
    console.log("Fornecedores reativados:", fornecedorIds);
  };

  // Handlers para ações em lote
  const handleFornecedoresSelecionados = (fornecedoresSelecionados: FornecedorValidado[]) => {
    // Converter FornecedorValidado para formato esperado pelo modal
    const fornecedoresConvertidos = fornecedoresSelecionados.map(f => ({
      id: f.fornecedor_id,
      nome: f.razao_social,
      cnpj: f.cnpj,
      email: f.email_principal || '',
      categoria: f.categoria
    }));
    setFornecedoresSelecionadosLote(fornecedoresConvertidos);
    setShowAcoesLoteModal(true);
  };

  const handleExecutarAcao = async (acao: any, fornecedores: any[]) => {
    // Simular execução da ação - em produção seria uma chamada à API
    console.log('Executando ação:', acao.tipo, 'para', fornecedores.length, 'fornecedores');
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return Promise.resolve();
  };

  // Construir lista de fornecedores selecionados com informações
  const fornecedoresSelecionados = fornecedores
    .filter(f => selectedSuppliers.includes(f.id))
    .map(f => ({
      id: f.id,
      nome: f.nome,
      status: f.status
    }));

  const hasActiveSearch = searchParams !== null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" /> Gestão de Fornecedores
            </h1>
            <p className="text-slate-500 mt-1">
              Gerencie o cadastro, documentação e qualificação dos seus fornecedores.
            </p>
          </div>
        </div>

        {/* Cards de Status - Reorganizados por Jornada */}
        <CardsDeStatusFornecedor 
          onFiltroClick={handleStatusFiltro}
          filtroAtivo={filtroStatusAtivo}
          stats={stats}
        />

        {/* Ações Rápidas Reorganizadas - SEM Status e Ciclo de Vida */}
        <AcoesRapidasReorganizadas 
          onNovoFornecedorClick={handleNovoFornecedor}
          onImportarClick={() => toast.info("Funcionalidade de importação em desenvolvimento")}
          onAvaliarClick={() => toast.info("Modal de avaliação de fornecedor")}
          onControleDocumentalClick={() => toast.info("Funcionalidade de controle documental em desenvolvimento")}
          onExportarClick={() => setShowExportarModal(true)}
          onAtualizarClick={() => toast.info("Funcionalidade de atualização em desenvolvimento")}
          onConvidarClick={() => toast.info("Funcionalidade de convite em desenvolvimento")}
          onRequalificarClick={() => toast.info("Funcionalidade de requalificação em desenvolvimento")}
          hasSelectedSuppliers={selectedSuppliers.length > 0}
          pendingActionsCount={4}
        />


        {/* NOVA SEÇÃO: Ações em Lote */}
        <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-blue-900 mb-1">Ações em Lote</h3>
            <p className="text-sm text-blue-700">Exporte, importe e execute ações para múltiplos fornecedores</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportarModal(true)}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              📤 Exportar CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportarModal(true)}
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              📁 Selecionar por Lista
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalInteligenteOpen(true)}
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-100"
            >
              🎯 Template e Envio
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMonitoramentoModal(true)}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              📊 Monitoramento
            </Button>
          </div>
        </div>

        {/* Busca Inteligente */}
        <BuscaInteligente 
          onSearch={handleSearch} 
          hasActiveSearch={hasActiveSearch}
        />

        {/* Resultados de Busca Externa ou Tabela de Fornecedores */}
        {searchParams?.tipoConsulta === "externa" && fornecedoresExternosCount > 0 ? (
          <ResultadosBuscaExterna 
            quantidade={fornecedoresExternosCount} 
            termo={searchParams.searchTerm || "fornecedores"}
            onImportarClick={handleImportarFornecedor}
            resultadosReais={resultadosExternosReais.length > 0 ? resultadosExternosReais : undefined}
          />
        ) : (
          <TabelaFornecedores 
            fornecedores={fornecedores} 
            isLoading={isLoading}
            linkToDetails={true}
            onPreferidoChange={handlePreferidoChange}
            isAdmin={isAdmin}
            onSelectionChange={setSelectedSuppliers}
          />
        )}

        {/* NOVA SEÇÃO: Status e Ciclo de Vida - Aparece APÓS a tabela */}
        <StatusCicloVidaActions
          onInativarClick={handleInativarFornecedores}
          onReativarClick={handleReativarFornecedores}
          selectedFornecedores={selectedSuppliers}
          fornecedoresSelecionados={fornecedoresSelecionados}
          hasSelectedSuppliers={selectedSuppliers.length > 0}
        />
      </div>

      {/* Modais de Ações em Lote */}
      <ExportarFornecedoresModal
        open={showExportarModal}
        onOpenChange={setShowExportarModal}
        fornecedores={fornecedores}
      />

      <ImportarListaModal
        open={showImportarModal}
        onOpenChange={setShowImportarModal}
        fornecedores={fornecedoresMock}
        onFornecedoresSelecionados={handleFornecedoresSelecionados}
      />

      <AcoesLoteModal
        open={showAcoesLoteModal}
        onOpenChange={setShowAcoesLoteModal}
        fornecedoresSelecionados={fornecedoresSelecionadosLote}
        onExecutarAcao={handleExecutarAcao}
      />

      <MonitoramentoAcoesModal
        open={showMonitoramentoModal}
        onOpenChange={setShowMonitoramentoModal}
      />

      <RepositorioTemplatesModal
        open={showTemplatesModal}
        onOpenChange={setShowTemplatesModal}
      />

      {/* Modal Inteligente para Seleção de Template */}
      <SelecionarTemplateModal
        open={modalInteligenteOpen}
        onOpenChange={setModalInteligenteOpen}
        onEnviarParaFornecedores={async (template, disparo) => {
          try {
            // Simular seleção de fornecedores para mala direta
            const fornecedoresParaTeste = fornecedores.slice(0, 5).map(f => ({
              id: f.id,
              nome: f.nome,
              cnpj: f.cnpj,
              email: `contato@${f.nome.toLowerCase().replace(/\s+/g, '')}.com.br`,
              categoria: f.categoria
            }));
            
            if (disparo) {
              // Atualizar o disparo com dados completos de auditoria
              await supabase
                .from('disparo_acao_lote')
                .update({ 
                  total_fornecedores: fornecedoresParaTeste.length,
                  status: 'enviando',
                  disparado_por: 'user_system', // TODO: Implementar auth real
                  configuracoes: {
                    ...disparo.configuracoes,
                    template_completo: template,
                    conteudo_enviado: template.conteudo_texto,
                    usuario_dados: {
                      nome: 'Usuário Atual',
                      cargo: 'Gestor de Compras',
                      email: 'usuario@empresa.com'
                    },
                    data_envio_formatada: new Date().toLocaleString('pt-BR'),
                    fornecedores_atingidos: fornecedoresParaTeste.length
                  }
                })
                .eq('id', disparo.id);

              // Criar registros detalhados para cada fornecedor
              const registrosFornecedores = fornecedoresParaTeste.map(fornecedor => ({
                disparo_id: disparo.id,
                fornecedor_id: fornecedor.id,
                fornecedor_nome: fornecedor.nome,
                fornecedor_cnpj: fornecedor.cnpj,
                fornecedor_email: fornecedor.email,
                status_envio: 'enviado',
                data_envio: new Date().toISOString(),
                token_rastreio: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              }));

              await supabase
                .from('disparo_fornecedor')
                .insert(registrosFornecedores);

              // Registrar no histórico COM AUDITORIA COMPLETA
              await supabase
                .from('historico_acao_fornecedor')
                .insert(
                  fornecedoresParaTeste.map(fornecedor => ({
                    disparo_id: disparo.id,
                    fornecedor_id: fornecedor.id,
                    fornecedor_nome: fornecedor.nome,
                    tipo_acao: template.tipo_acao,
                    template_nome: template.nome,
                    status_final: 'enviado',
                    detalhes: {
                      template_id: template.id,
                      conteudo_enviado: template.conteudo_texto || 'Sem conteúdo texto',
                      finalidade: template.finalidade || 'Não especificado',
                      validade_dias: template.validade_dias,
                      permite_anonimato: template.permite_anonimato,
                      fornecedor_dados: {
                        id: fornecedor.id,
                        nome: fornecedor.nome,
                        cnpj: fornecedor.cnpj,
                        email: fornecedor.email,
                        categoria: fornecedor.categoria
                      },
                      timestamp_envio: new Date().toISOString(),
                      ip_origem: window.location.origin,
                      usuario_nome: 'Usuário Atual',
                      usuario_cargo: 'Gestor de Compras',
                      navegador: navigator.userAgent
                    },
                    executado_por: 'user_system',
                    executado_em: new Date().toISOString()
                  }))
                );

              // Finalizar o disparo
              await supabase
                .from('disparo_acao_lote')
                .update({ 
                  status: 'concluido',
                  enviados: fornecedoresParaTeste.length,
                  abertos: 0,
                  respondidos: 0,
                  falhas: 0,
                  concluido_em: new Date().toISOString()
                })
                .eq('id', disparo.id);

              toast.success(`✅ Mala direta enviada! ${fornecedoresParaTeste.length} fornecedores atingidos. Logs registrados para auditoria.`);
            }
            
            setFornecedoresSelecionadosLote(fornecedoresParaTeste);
            setModalInteligenteOpen(false);
          } catch (error) {
            console.error('Erro no disparo:', error);
            toast.error('Erro ao processar mala direta');
          }
        }}
        onSelecionarTemplate={(template) => {
          console.log('Template selecionado:', template);
          setModalInteligenteOpen(false);
          toast.success(`Template "${template.nome}" selecionado!`);
        }}
      />
    </div>
  );
};

export default Fornecedores;
