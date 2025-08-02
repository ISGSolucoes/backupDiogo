import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CabecalhoFornecedor } from "@/components/fornecedor-detalhes/CabecalhoFornecedor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcoesRapidas } from "@/components/fornecedor-detalhes/AcoesRapidas";
import { HierarquiaFornecedor } from "@/components/fornecedor-detalhes/HierarquiaFornecedor";
import { DocumentosFornecedor } from "@/components/fornecedor-detalhes/DocumentosFornecedor";
import { BibliotecaQuestionarios } from "@/components/fornecedor-detalhes/BibliotecaQuestionarios";
import { QualificacaoFornecedor } from "@/components/fornecedor-detalhes/QualificacaoFornecedor";
import { HistoricoFornecedor } from "@/components/fornecedor-detalhes/HistoricoFornecedor";
import { Fotografia360 } from "@/components/fornecedor-detalhes/Fotografia360";
import { AvaliacaoDesempenho } from "@/components/fornecedor-detalhes/AvaliacaoDesempenho";
import { IAResugestoes } from "@/components/fornecedor-detalhes/IAResugestoes";
import { AreaUtilizacao } from "@/components/fornecedor-detalhes/AreaUtilizacao";
import { AnaliseAvancada } from "@/components/fornecedor-detalhes/AnaliseAvancada";
import { RaioXFornecedor } from "@/components/fornecedor-detalhes/RaioXFornecedor";
import { FornecedorEmRegistro } from "@/components/fornecedor-detalhes/FornecedorEmRegistro";
import { FornecedorInativo } from "@/components/fornecedor-detalhes/FornecedorInativo";
import { TrilhaAuditavel } from "@/components/fornecedor-detalhes/TrilhaAuditavel";
import { BackButton } from "@/components/ui/back-button";
import { toast } from "sonner";
import { AlertaFornecedor, Fornecedor as FornecedorType, HistoricoFornecedor as HistoricoFornecedorType, HierarquiaItem, UtilizacaoArea } from "@/types/fornecedor";
import { Documento } from "@/types/documentos";
import { formatarData } from "@/utils/dateUtils";
import { Eye, FileText, Shield, BarChart3, HelpCircle, Brain, Search } from "lucide-react";

// Mock data baseado nos fornecedores da lista principal
const getFornecedorMockData = (id: string): FornecedorType & { dataConvite?: string; diasSemResposta?: number } => {
  switch (id) {
    case "1": // Tech Solutions Ltda - ATIVO
      return {
        id: "1",
        nome: "Tech Solutions Ltda",
        cnpj: "12.345.678/0001-90",
        categoria: "Tecnologia",
        status: "ativo",
        tipoFornecedor: "servico",
        ultimaParticipacao: "10/05/2023",
        uf: "SP",
        cidade: "São Paulo",
        porte: "medio",
        tipoEmpresa: "ltda",
        qualificado: true,
        preferido: true,
        dataCadastro: "2023-05-01",
        ultimaAtualizacao: "10/05/2023",
        completo: 95,
        cnpjRaiz: "12.345.678",
        funcionarios: 127,
        faturamento: "8.500.000",
      };
    case "2": // ABC Materiais de Escritório - ATIVO
      return {
        id: "2",
        nome: "ABC Materiais de Escritório",
        cnpj: "98.765.432/0001-10",
        categoria: "Materiais",
        status: "ativo",
        tipoFornecedor: "servico",
        ultimaParticipacao: "22/04/2023",
        uf: "RJ",
        cidade: "Rio de Janeiro",
        porte: "pequeno",
        tipoEmpresa: "mei",
        qualificado: true,
        preferido: false,
        dataCadastro: "2023-04-15",
        ultimaAtualizacao: "22/04/2023",
        completo: 85,
        cnpjRaiz: "98.765.432",
        funcionarios: 25,
        faturamento: "1.200.000",
      };
    case "3": // Transportes Rápidos SA - INATIVO
      return {
        id: "3",
        nome: "Transportes Rápidos SA",
        cnpj: "45.678.912/0001-34",
        categoria: "Transporte",
        status: "inativo",
        tipoFornecedor: "servico",
        ultimaParticipacao: "15/01/2023",
        uf: "MG",
        cidade: "Belo Horizonte",
        porte: "grande",
        tipoEmpresa: "sa",
        qualificado: false,
        preferido: false,
        dataCadastro: "2022-10-20",
        ultimaAtualizacao: "15/01/2023",
        completo: 70,
        cnpjRaiz: "45.678.912",
        funcionarios: 450,
        faturamento: "15.000.000",
        motivoInativacao: "inatividade_automatica",
        dataInativacao: "2023-04-15",
        usuarioInativacao: "Sistema",
        observacaoInativacao: "Sem participação em eventos há mais de 180 dias",
      };
    case "4": // Consultoria Financeira ME - EM REGISTRO (único)
      return {
        id: "4",
        nome: "Consultoria Financeira ME",
        cnpj: "23.456.789/0001-21",
        categoria: "Serviços",
        status: "em_registro",
        tipoFornecedor: "servico",
        ultimaParticipacao: "N/A",
        uf: "RS",
        cidade: "Porto Alegre",
        porte: "pequeno",
        tipoEmpresa: "mei",
        qualificado: false,
        preferido: false,
        dataCadastro: "10/06/2025",
        ultimaAtualizacao: "10/06/2025",
        completo: 0,
        cnpjRaiz: "23.456.789",
        funcionarios: 1,
        faturamento: "N/A",
        dataConvite: "10/06/2025",
        diasSemResposta: 7
      };
    case "5": // Equipamentos Industriais LTDA - ATIVO
      return {
        id: "5",
        nome: "Equipamentos Industriais LTDA",
        cnpj: "34.567.890/0001-12",
        categoria: "Industrial",
        status: "ativo",
        tipoFornecedor: "industria",
        ultimaParticipacao: "03/05/2023",
        uf: "PR",
        cidade: "Curitiba",
        porte: "grande",
        tipoEmpresa: "ltda",
        qualificado: true,
        preferido: true,
        dataCadastro: "2023-01-15",
        ultimaAtualizacao: "03/05/2023",
        completo: 92,
        cnpjRaiz: "34.567.890",
        funcionarios: 320,
        faturamento: "12.800.000",
      };
    case "6": // Suprimentos Médicos SA - ATIVO
      return {
        id: "6",
        nome: "Suprimentos Médicos SA",
        cnpj: "67.890.123/0001-45",
        categoria: "Saúde",
        status: "ativo",
        tipoFornecedor: "servico",
        ultimaParticipacao: "28/04/2023",
        uf: "SC",
        cidade: "Florianópolis",
        porte: "medio",
        tipoEmpresa: "sa",
        qualificado: false,
        preferido: false,
        dataCadastro: "2023-05-06",
        ultimaAtualizacao: "28/04/2023",
        completo: 65,
        cnpjRaiz: "67.890.123",
        funcionarios: 180,
        faturamento: "5.600.000",
      };
    default:
      // Fornecedor padrão para IDs não encontrados
      return {
        id: id || "unknown",
        nome: "Fornecedor Exemplo",
        cnpj: "00.000.000/0001-00",
        categoria: "Geral",
        status: "ativo",
        tipoFornecedor: "servico",
        ultimaParticipacao: "01/01/2023",
        uf: "SP",
        cidade: "São Paulo",
        porte: "medio",
        tipoEmpresa: "ltda",
        qualificado: false,
        preferido: false,
        dataCadastro: "2023-01-01",
        ultimaAtualizacao: "01/01/2023",
        completo: 50,
        cnpjRaiz: "00.000.000",
        funcionarios: 50,
        faturamento: "1.000.000",
      };
  }
};

// Mock hierarquia items for dialog
const hierarquiaItems: HierarquiaItem[] = [
  {
    id: "1",
    nome: "TechSupply Solutions",
    cnpj: "12.345.678/0001-90",
    tipoUnidade: "Matriz",
    status: "Ativo",
    cidade: "São Paulo",
    uf: "SP",
    ultimaParticipacao: "15/05/2023",
    dataCadastro: "20/01/2022"
  },
  {
    id: "2",
    nome: "TechSupply Rio",
    cnpj: "12.345.678/0002-70",
    tipoUnidade: "Filial",
    status: "Ativo",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    ultimaParticipacao: "10/04/2023",
  }
];

// Mock utilizacoes
const utilizacoes: UtilizacaoArea[] = [
  {
    area: "Compras",
    participacoes: 12,
    notaMedia: 4.2,
    ultimaParticipacao: "12/05/2023"
  },
  {
    area: "TI",
    participacoes: 8,
    notaMedia: 4.5,
    ultimaParticipacao: "05/04/2023"
  },
  {
    area: "Financeiro",
    participacoes: 4,
    notaMedia: 4.0,
    ultimaParticipacao: "22/03/2023"
  }
];

// Mock alertas
const alertas: AlertaFornecedor[] = [
  {
    id: "alerta-001",
    fornecedor_id: "forn-001",
    tipo: "documento",
    mensagem: "Certidão Negativa vencendo em 15 dias",
    acaoSugerida: "Solicitar renovação",
    prioridade: "alta",
    data: "2023-05-01T10:30:00.000Z"
  },
  {
    id: "alerta-002",
    fornecedor_id: "forn-001",
    tipo: "participacao",
    mensagem: "Período inativo superior a 60 dias",
    acaoSugerida: "Convidar para próximo evento",
    prioridade: "media",
    data: "2023-04-28T14:15:00.000Z"
  }
];

// Histórico de compras
const historico: HistoricoFornecedorType[] = [
  {
    id: "oc-2023-001",
    fornecedor_id: "forn-001",
    data: "12/05/2023",
    tipoEvento: "participacao",
    descricao: "Ordem de Compra - R$ 15.000,00",
    usuario: "Ana Lima",
    detalhes: { valor: 15000, status: "Finalizada" }
  },
  {
    id: "oc-2023-002",
    fornecedor_id: "forn-001",
    data: "25/04/2023",
    tipoEvento: "participacao",
    descricao: "Ordem de Compra - R$ 8.500,00",
    usuario: "Carlos Souza",
    detalhes: { valor: 8500, status: "Finalizada" }
  },
  {
    id: "cot-2023-005",
    fornecedor_id: "forn-001",
    data: "10/04/2023",
    tipoEvento: "participacao",
    descricao: "Cotação - R$ 12.800,00",
    usuario: "Ana Lima",
    detalhes: { valor: 12800, status: "Finalizada" }
  },
  {
    id: "oc-2023-003",
    fornecedor_id: "forn-001",
    data: "28/03/2023",
    tipoEvento: "participacao",
    descricao: "Ordem de Compra - R$ 5.200,00",
    usuario: "Carlos Souza",
    detalhes: { valor: 5200, status: "Finalizada" }
  },
  {
    id: "cot-2023-002",
    fornecedor_id: "forn-001",
    data: "15/03/2023",
    tipoEvento: "participacao",
    descricao: "Cotação - R$ 18.500,00",
    usuario: "Ana Lima",
    detalhes: { valor: 18500, status: "Finalizada" }
  },
];

// Documentos
const documentos: Documento[] = [
  {
    id: "doc-001",
    fornecedor_id: "forn-001",
    tipo: "contrato",
    nome: "Contrato de Fornecimento",
    dataUpload: "15/04/2023",
    validade: "15/04/2024",
    status: "valido",
    versao: "1.0",
    upload_por: "Admin",
    upload_data: "15/04/2023",
    tamanho: 2.4,
    formato: "pdf",
    arquivo_url: "",
    ativo: true
  },
  {
    id: "doc-002",
    fornecedor_id: "forn-001",
    tipo: "certidao",
    nome: "Certidão Negativa de Débitos",
    dataUpload: "10/05/2023",
    validade: "10/08/2023",
    status: "vencido",
    versao: "1.0",
    upload_por: "Admin",
    upload_data: "10/05/2023",
    tamanho: 1.2,
    formato: "pdf",
    arquivo_url: "",
    ativo: true
  },
  {
    id: "doc-003",
    fornecedor_id: "forn-001",
    tipo: "outro",
    nome: "Certificado ISO 9001",
    dataUpload: "28/03/2023",
    validade: "28/03/2025",
    status: "valido",
    versao: "1.0",
    upload_por: "Admin",
    upload_data: "28/03/2023",
    tamanho: 3.1,
    formato: "pdf",
    arquivo_url: "",
    ativo: true
  },
  {
    id: "doc-004",
    fornecedor_id: "forn-001",
    tipo: "outro",
    nome: "Licença Operacional",
    dataUpload: "05/01/2023",
    validade: "05/01/2024",
    status: "valido",
    versao: "1.0",
    upload_por: "Admin",
    upload_data: "05/01/2023",
    tamanho: 1.8,
    formato: "pdf",
    arquivo_url: "",
    ativo: true
  },
];

const FornecedorDetalhes = () => {
  const { id } = useParams();
  const [aba, setAba] = useState("visaoGeral");
  const [hierarquiaAberta, setHierarquiaAberta] = useState(false);
  const [bibliotecaAberta, setBibliotecaAberta] = useState(false);
  
  // Buscar dados do fornecedor baseado no ID
  const fornecedor = getFornecedorMockData(id || "");
  const [fornecedorPreferido, setFornecedorPreferido] = useState(fornecedor.preferido);
  
  console.log(`[DEBUG] ID da URL: ${id}`);
  console.log(`[DEBUG] Fornecedor carregado:`, fornecedor);
  console.log(`[DEBUG] Status do fornecedor: ${fornecedor.status}`);

  // Dados com datas formatadas corretamente
  const [dados360, setDados360] = useState({
    totalCompras: "152.500", // String para formato monetário
    ultimaCompra: formatarData("12/05/2023"),
    mediaEntrega: 5.2, // Mantido como número pois é uma média
    participacaoCategorias: ["Tecnologia", "Infraestrutura", "Segurança"],
    colaboradores: 127,
    faturamentoAnual: "8.500.000", // String para formato monetário
    inicioRelacionamento: "Jan/2021",
    ultimaAtualizacao: formatarData("15/05/2023"),
    ultimaQualificacao: "Aprovado (A)",
    npsInterno: 8.5,
    ultimos12Meses: "87.300", // String para formato monetário
  });

  const [dadosQualificacao, setDadosQualificacao] = useState({
    financeira: {
      status: "Aprovado",
      score: "A",
      dataUltima: formatarData("15/03/2023"),
      validade: formatarData("15/03/2024"),
      responsavel: "Depto. Financeiro",
    },
    tecnica: {
      status: "Aprovado com Ressalvas",
      score: "B+",
      dataUltima: formatarData("10/04/2023"),
      validade: formatarData("10/04/2024"),
      responsavel: "Engenharia",
    },
    comercial: {
      status: "Aprovado",
      score: "A-",
      dataUltima: formatarData("05/05/2023"),
      validade: formatarData("05/05/2024"),
      responsavel: "Comercial",
    },
    legal: {
      status: "Aprovado",
      score: "A",
      dataUltima: formatarData("20/04/2023"),
      validade: formatarData("20/04/2024"),
      responsavel: "Jurídico",
    }
  });

  const [dadosFotografia, setDadosFotografia] = useState({
    tipoEmpresa: "Médio Porte", 
    mercadoAtuacao: "Nacional e LATAM", 
    principaisProdutos: ["Servidores", "Storage", "Equipamentos de rede"],
    certificacoes: ["ISO 9001", "ISO 27001"], 
    principaisClientes: ["Empresa X", "Empresa Y", "Empresa Z"], 
    concorrentes: ["Concorrente A", "Concorrente B"],
    ultimaParticipacao: formatarData("10/05/2023"), 
    status: "Qualificado", 
    slaMedio: "4.5 dias", 
    npsInterno: 8.7,
    ultimoDocumento: formatarData("15/10/2023"), 
    ultimoContato: formatarData("01/11/2023"), 
    participacaoAreas: ["Compras", "Logística", "Suprimentos", "Engenharia"],
    eventosEmAndamento: 3
  });

  // Handle preferido change
  const handlePreferidoChange = (preferido: boolean) => {
    setFornecedorPreferido(preferido);
  };

  // Handle alerts
  const handleExecutarAcao = (alerta: AlertaFornecedor, acao: string) => {
    toast.success(`Executando ação: ${acao} para o alerta: ${alerta.mensagem}`);
  };

  // Handle document actions
  const handleVisualizarDoc = (doc: Documento) => {
    toast.info(`Visualizando documento: ${doc.nome}`);
  };

  const handleSubstituirDoc = (doc: Documento) => {
    toast.info(`Substituindo documento: ${doc.nome}`);
  };

  const handleExcluirDoc = (doc: Documento) => {
    toast.warning(`Excluindo documento: ${doc.nome}`);
  };

  const handleNovoDoc = () => {
    toast.success(`Iniciando upload de novo documento`);
  };

  const fornecedorAtualizado = {
    ...fornecedor, 
    preferido: fornecedorPreferido,
  };

  // Reformatação das datas no histórico
  const historicoFormatado = historico.map(item => ({
    ...item,
    data: formatarData(item.data)
  }));

  // APENAS fornecedores com status "em_registro" mostram a versão simplificada
  if (fornecedor.status === "em_registro") {
    console.log(`[DEBUG] Exibindo versão simplificada para fornecedor em registro`);
    return (
      <div className="container mx-auto px-4 py-6">
        <FornecedorEmRegistro fornecedor={fornecedorAtualizado} />
      </div>
    );
  }

  // APENAS fornecedores com status "inativo" mostram a versão especializada
  if (fornecedor.status === "inativo") {
    console.log(`[DEBUG] Exibindo versão especializada para fornecedor inativo`);
    return (
      <FornecedorInativo 
        fornecedor={fornecedorAtualizado}
        historico={historicoFormatado}
        documentos={documentos}
      />
    );
  }

  // Todos os outros fornecedores (ativo, qualificado, preferido, etc.) mostram a versão completa
  console.log(`[DEBUG] Exibindo versão completa para fornecedor ${fornecedor.status}`);
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Botão Voltar */}
      <div className="mb-4">
        <BackButton to="/fornecedores" label="Voltar para Fornecedores" />
      </div>
      
      {/* Cards informativos movidos para o topo */}
      <div className="mb-6">
        <Fotografia360 dados={dadosFotografia} />
      </div>

      {/* Cabeçalho e IA Rê - Sugestões lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CabecalhoFornecedor 
            fornecedor={fornecedorAtualizado} 
            onPreferidoChange={handlePreferidoChange}
          />
        </div>
        <div className="lg:col-span-1">
          <IAResugestoes 
            alertas={alertas}
            onExecutarAcao={handleExecutarAcao}
          />
        </div>
      </div>
      
      <div className="mt-4">
        {/* AçõesRapidas próximo ao botão "ver contatos" e em formato horizontal */}
        <AcoesRapidas fornecedor={fornecedorAtualizado} />
        
        {/* HierarquiaFornecedor */}
        <div className="mt-2">
          <HierarquiaFornecedor 
            open={hierarquiaAberta}
            onOpenChange={setHierarquiaAberta}
            raizCnpj={fornecedorAtualizado.cnpjRaiz || ""}
            nomeGrupo={fornecedorAtualizado.nome}
            hierarquia={hierarquiaItems}
          />
        </div>
      </div>
      
      {/* Conteúdo principal reorganizado */}
      <div className="mt-6">
        <Tabs value={aba} onValueChange={setAba} className="w-full">
          <TabsList className="mb-6 bg-gradient-to-r from-background to-muted/50 p-1 rounded-lg border-4 border-transparent bg-clip-padding relative
            before:absolute before:-inset-[4px] before:rounded-xl before:p-[4px] before:bg-gradient-to-r 
            before:from-blue-500 before:via-green-500 before:via-purple-500 before:via-orange-500 before:via-cyan-500 before:via-indigo-500 before:to-pink-500
            before:animate-pulse before:-z-10
            shadow-[0_0_20px_rgba(59,130,246,0.3),0_0_40px_rgba(168,85,247,0.2),0_0_60px_rgba(34,197,94,0.1)]
            hover:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_50px_rgba(168,85,247,0.3),0_0_80px_rgba(34,197,94,0.2)]
            transition-all duration-300">
            <TabsTrigger 
              value="visaoGeral" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Eye className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="documentos"
              className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <FileText className="h-4 w-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger 
              value="qualificacao"
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Shield className="h-4 w-4" />
              Qualificação
            </TabsTrigger>
            <TabsTrigger 
              value="performance"
              className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <BarChart3 className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="questionarios"
              className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <HelpCircle className="h-4 w-4" />
              Questionários
            </TabsTrigger>
            <TabsTrigger 
              value="avancado"
              className="flex items-center gap-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Brain className="h-4 w-4" />
              Análise Avançada
            </TabsTrigger>
            <TabsTrigger 
              value="raio-x"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Search className="h-4 w-4" />
              Raio-X
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visaoGeral" className="space-y-6">
            {/* Qualificação do Fornecedor (movido para cima) */}
            <QualificacaoFornecedor fornecedor={fornecedorAtualizado} />
            
            {/* Documentos (abaixo de Qualificação) */}
            <DocumentosFornecedor 
              fornecedorId={fornecedorAtualizado.id}
              documentos={documentos}
              onVisualizarClick={handleVisualizarDoc}
              onSubstituirClick={handleSubstituirDoc}
              onExcluirClick={handleExcluirDoc}
              onNovoClick={handleNovoDoc}
            />
            
            {/* Análise Avançada (abaixo de Documentos) */}
            <AnaliseAvancada 
              risco={{
                legal: "baixo",
                financeiro: "medio",
                operacional: "baixo",
                ambiental: "baixo"
              }}
              scoreOperacional={85}
              fornecedorNome={fornecedorAtualizado.nome}
            />
            
            {/* Histórico Completo (abaixo de Análise Avançada) */}
            <HistoricoFornecedor historico={historicoFormatado} />
            
            {/* Área de Utilização (abaixo de Histórico Completo) */}
            <AreaUtilizacao utilizacoes={utilizacoes} />
            
            {/* Trilha Auditável de Atividades (NOVA SEÇÃO - após Área de Utilização) */}
            <TrilhaAuditavel 
              fornecedorId={fornecedorAtualizado.id}
              fornecedorNome={fornecedorAtualizado.nome}
            />
          </TabsContent>
          
          <TabsContent value="documentos">
            <DocumentosFornecedor 
              fornecedorId={fornecedorAtualizado.id}
              documentos={documentos}
              onVisualizarClick={handleVisualizarDoc}
              onSubstituirClick={handleSubstituirDoc}
              onExcluirClick={handleExcluirDoc}
              onNovoClick={handleNovoDoc}
            />
          </TabsContent>
          
          <TabsContent value="qualificacao">
            <QualificacaoFornecedor fornecedor={fornecedorAtualizado} />
          </TabsContent>
          
          <TabsContent value="performance">
            <AvaliacaoDesempenho
              fornecedorId={fornecedor.id}
              fornecedorNome={fornecedor.nome}
            />
          </TabsContent>
          
          <TabsContent value="questionarios">
            <BibliotecaQuestionarios 
              open={bibliotecaAberta}
              onOpenChange={setBibliotecaAberta}
              fornecedorId={fornecedorAtualizado.id}
              fornecedorNome={fornecedorAtualizado.nome}
            />
          </TabsContent>
          
          <TabsContent value="avancado">
            <AnaliseAvancada 
              risco={{
                legal: "baixo",
                financeiro: "medio",
                operacional: "baixo",
                ambiental: "baixo"
              }}
              scoreOperacional={85}
              fornecedorNome={fornecedorAtualizado.nome}
            />
          </TabsContent>

          <TabsContent value="raio-x">
            <RaioXFornecedor fornecedor={fornecedorAtualizado} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FornecedorDetalhes;
