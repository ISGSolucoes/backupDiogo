import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusFornecedor, PorteFornecedor, TipoEmpresa, AcaoPendente, MotivoInativacao, ConfiguracaoColuna, Fornecedor } from "@/types/fornecedor";
import { 
  ChevronRight, 
  MoreVertical,
  Eye, 
  PenLine, 
  MessageSquare, 
  FilePlus, 
  Heart,
  HeartOff,
  Check, 
  Trash2,
  Play,
  Download,
  ChevronDown,
  Settings2,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { StatusBadgeWithContext } from "./StatusBadgeWithContext";
import { useColunasPersonalizadas } from "@/hooks/useColunasPersonalizadas";
import { PersonalizarColunasModal } from "./PersonalizarColunasModal";
import { removerFormatacaoCnpj } from "@/utils/cnpjUtils";
import { formatarTelefone, formatarEndereco } from "@/utils/formatUtils";

interface TabelaFornecedoresProps {
  fornecedores: Fornecedor[];
  isLoading: boolean;
  linkToDetails?: boolean;
  onPreferidoChange?: (fornecedorId: string, preferido: boolean) => void;
  isAdmin?: boolean;
  onSelectionChange?: (selected: string[]) => void;
}

export const TabelaFornecedores = ({ 
  fornecedores, 
  isLoading,
  linkToDetails = true,
  onPreferidoChange,
  isAdmin = true,
  onSelectionChange
}: TabelaFornecedoresProps) => {
  const [selectedFornecedores, setSelectedFornecedores] = useState<string[]>([]);
  const [acoesPendentesDialog, setAcoesPendentesDialog] = React.useState<{
    open: boolean;
    fornecedor?: Fornecedor;
  }>({ open: false });
  const [personalizarModalOpen, setPersonalizarModalOpen] = useState(false);
  const [exportandoLista, setExportandoLista] = useState(false);
  const [exportandoSelecionados, setExportandoSelecionados] = useState(false);
  const [exportandoCompleto, setExportandoCompleto] = useState(false);

  const { configuracao, colunasVisiveis, salvarConfiguracao } = useColunasPersonalizadas();
  
  // Notificar mudanças de seleção para o componente pai
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedFornecedores);
    }
  }, [selectedFornecedores, onSelectionChange]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = fornecedores.map(f => f.id);
      setSelectedFornecedores(allIds);
    } else {
      setSelectedFornecedores([]);
    }
  };

  const handleSelectFornecedor = (fornecedorId: string, checked: boolean) => {
    if (checked) {
      setSelectedFornecedores(prev => [...prev, fornecedorId]);
    } else {
      setSelectedFornecedores(prev => prev.filter(id => id !== fornecedorId));
    }
  };

  const isAllSelected = fornecedores.length > 0 && selectedFornecedores.length === fornecedores.length;
  const isPartiallySelected = selectedFornecedores.length > 0 && selectedFornecedores.length < fornecedores.length;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Registrado</Badge>;
      case 'inativo':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inativo</Badge>;
      case 'em_registro':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Em Registro</Badge>;
      case 'pendente':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Pendente</Badge>;
      case 'qualificado':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Qualificado</Badge>;
      case 'preferido':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Preferido</Badge>;
      default:
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Desconhecido</Badge>;
    }
  };
  
  const getEmpresaTipo = (tipo: string) => {
    switch (tipo) {
      case 'mei':
        return 'MEI';
      case 'ltda':
        return 'LTDA';
      case 'sa':
        return 'S.A.';
      default:
        return tipo.toUpperCase();
    }
  };
  
  const getPorteText = (porte: string) => {
    switch (porte) {
      case 'pequeno':
        return 'Pequeno';
      case 'medio':
        return 'Médio';
      case 'grande':
        return 'Grande';
      default:
        return 'Não informado';
    }
  };

  // Função utilitária para criar e baixar CSV com tratamento robusto
  const criarEBaixarCSV = async (csvData: any[], nomeArquivo: string, setLoading: (loading: boolean) => void) => {
    try {
      setLoading(true);

      // Validação: verificar se há dados
      if (!csvData || csvData.length === 0) {
        toast.error("Nenhum dado disponível para exportação");
        return;
      }

      // Criar cabeçalhos e linhas do CSV
      const headers = Object.keys(csvData[0]).join(',');
      const rows = csvData.map(row => 
        Object.values(row).map(value => {
          // Tratar valores especiais para CSV
          if (value === null || value === undefined) return '';
          const strValue = String(value);
          // Escapar aspas duplas e adicionar aspas se contiver vírgula ou quebra de linha
          if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
            return `"${strValue.replace(/"/g, '""')}"`;
          }
          return strValue;
        }).join(',')
      );

      // Criar conteúdo CSV com BOM para UTF-8
      const csvContent = '\uFEFF' + [headers, ...rows].join('\n');

      // Criar blob com encoding UTF-8
      const blob = new Blob([csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });

      // Verificar se o browser suporta download
      if (!window.URL || !window.URL.createObjectURL) {
        throw new Error('Browser não suporta download de arquivos');
      }

      const url = URL.createObjectURL(blob);
      
      // Criar link temporário para download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', nomeArquivo);
      link.style.visibility = 'hidden';
      
      // Adicionar ao DOM e clicar
      document.body.appendChild(link);
      link.click();
      
      // Limpeza
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Arquivo ${nomeArquivo} baixado com sucesso!`);

    } catch (error) {
      console.error('Erro na exportação:', error);
      
      // Fallback: mostrar dados em nova aba se download falhar
      try {
        const csvContent = '\uFEFF' + [
          Object.keys(csvData[0]).join(','),
          ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');
        
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`<pre>${csvContent}</pre>`);
          newWindow.document.title = nomeArquivo;
          toast.info("Download automático falhou. Dados exibidos em nova aba - copie e salve manualmente.");
        } else {
          toast.error("Não foi possível exportar. Verifique se pop-ups estão bloqueados.");
        }
      } catch (fallbackError) {
        toast.error("Erro na exportação. Tente novamente ou contate o suporte.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportarLista = async () => {
    const csvData = fornecedores.map(f => ({
      Nome: f.nome || '',
      CNPJ: f.cnpj || '',
      Status: f.status || '',
      Categoria: f.categoria || '',
      Cidade: f.cidade || '',
      UF: f.uf || '',
      Porte: f.porte || '',
      Email: f.email || '',
      Telefone: f.telefone || '',
      Endereco: f.endereco || '',
      Pais: f.pais || 'Brasil',
      Estado: f.estado || f.uf || ''
    }));
    
    const nomeArquivo = `fornecedores_lista_${new Date().toISOString().split('T')[0]}.csv`;
    await criarEBaixarCSV(csvData, nomeArquivo, setExportandoLista);
  };

  const handleExportarSelecionados = async () => {
    const fornecedoresSelecionados = fornecedores.filter(f => selectedFornecedores.includes(f.id));
    
    if (fornecedoresSelecionados.length === 0) {
      toast.error("Nenhum fornecedor selecionado para exportação");
      return;
    }
    
    const csvData = fornecedoresSelecionados.map(f => ({
      Nome: f.nome || '',
      CNPJ: f.cnpj || '',
      Status: f.status || '',
      Categoria: f.categoria || '',
      Cidade: f.cidade || '',
      UF: f.uf || '',
      Porte: f.porte || '',
      Email: f.email || '',
      Telefone: f.telefone || '',
      Endereco: f.endereco || '',
      Pais: f.pais || 'Brasil',
      Estado: f.estado || f.uf || ''
    }));
    
    const nomeArquivo = `fornecedores_selecionados_${new Date().toISOString().split('T')[0]}.csv`;
    await criarEBaixarCSV(csvData, nomeArquivo, setExportandoSelecionados);
  };

  const handleExportarCompleto = async () => {
    const csvData = fornecedores.map(f => ({
      Nome: f.nome || '',
      CNPJ: f.cnpj || '',
      Status: f.status || '',
      Categoria: f.categoria || '',
      Cidade: f.cidade || '',
      UF: f.uf || '',
      Porte: f.porte || '',
      TipoEmpresa: f.tipoEmpresa || '',
      Qualificado: f.qualificado ? 'Sim' : 'Não',
      Preferido: f.preferido ? 'Sim' : 'Não',
      DataCadastro: f.dataCadastro || '',
      UltimaParticipacao: f.ultimaParticipacao || '',
      AcoesPendentes: f.acoesPendentes?.length || 0,
      Email: f.email || '',
      Telefone: f.telefone || '',
      Endereco: f.endereco || '',
      Pais: f.pais || 'Brasil',
      Estado: f.estado || f.uf || '',
      Classificacao: f.classificacao || '',
      Financeiro: f.financeiro || '',
      Segmento: f.segmento || '',
      Descricao: f.descricao || '',
      Avaliacao: f.avaliacao || '',
      Score: f.score || '',
      Transacional: f.transacional || '',
      Criticidade: f.criticidade || '',
      CNPJRaiz: f.cnpjRaiz || '',
      QuantidadeFiliais: f.quantidadeFiliais || 0
    }));
    
    const nomeArquivo = `fornecedores_relatorio_completo_${new Date().toISOString().split('T')[0]}.csv`;
    await criarEBaixarCSV(csvData, nomeArquivo, setExportandoCompleto);
  };

  const handleTogglePreferido = (fornecedor: Fornecedor) => {
    if (onPreferidoChange) {
      onPreferidoChange(fornecedor.id, !fornecedor.preferido);
    }
    
    toast.success(
      !fornecedor.preferido 
        ? `${fornecedor.nome} marcado como fornecedor preferido` 
        : `${fornecedor.nome} removido dos fornecedores preferidos`
    );
  };
  
  const handleAcoesPendentes = (fornecedor: Fornecedor) => {
    setAcoesPendentesDialog({
      open: true,
      fornecedor
    });
  };

  const handleExecutarAcao = (acaoId: string, tipo: string) => {
    toast.success(`Ação "${tipo}" executada com sucesso`);
    setAcoesPendentesDialog(prev => ({ ...prev, open: false }));
    
    const infoLog = {
      usuario: "Admin",
      data: new Date().toISOString(),
      ip: "192.168.0.1",
      descricao: `Ação "${tipo}" executada`,
      antes: "Pendente",
      depois: "Resolvido"
    };
    
    console.log("Log de ação:", infoLog);
  };
  
  const handleEnviarMensagem = (fornecedor: Fornecedor) => {
    toast.info(`Enviando mensagem para ${fornecedor.nome}`);
  };
  
  const handleAdicionarDocumento = (fornecedor: Fornecedor) => {
    toast.info(`Adicionando documento para ${fornecedor.nome}`);
  };
  
  const handleEditarFornecedor = (fornecedor: Fornecedor) => {
    toast.info(`Editando fornecedor ${fornecedor.nome}`);
  };
  
  const handleToggleAtivo = (fornecedor: Fornecedor) => {
    const novoStatus = fornecedor.status === 'ativo' ? 'inativo' : 'ativo';
    
    toast.success(
      fornecedor.status === 'ativo' 
        ? `${fornecedor.nome} foi inativado com sucesso` 
        : `${fornecedor.nome} foi reativado com sucesso`
    );
    
    const infoLog = {
      usuario: "Admin",
      data: new Date().toISOString(),
      ip: "192.168.0.1",
      descricao: `Status alterado de ${fornecedor.status} para ${novoStatus}`,
      antes: fornecedor.status,
      depois: novoStatus
    };
    
    console.log("Log de alteração de status:", infoLog);
  };

  const temAcoesPendentes = (fornecedor: Fornecedor) => {
    return fornecedor.acoesPendentes && fornecedor.acoesPendentes.length > 0;
  };

  const getTooltipAcao = (tipo: string) => {
    switch(tipo) {
      case 'documento':
        return "Solicita atualização de documento vencido ou prestes a vencer";
      case 'qualificacao':
        return "Envia questionário de qualificação ou requalificação";
      case 'participacao':
        return "Reavalia participação do fornecedor em eventos";
      default:
        return "Executa a ação sugerida pela IA para resolver a pendência";
    }
  };

  const renderCellContent = (fornecedor: Fornecedor, coluna: ConfiguracaoColuna) => {
    switch (coluna.key) {
      case 'nome':
        return (
          <div>
            <div className="font-medium">{fornecedor.nome}</div>
            <div className="text-xs text-slate-500 mt-1">{removerFormatacaoCnpj(fornecedor.cnpj)}</div>
            <div className="md:hidden mt-1">
              <StatusBadgeWithContext 
                status={fornecedor.status}
                motivoInativacao={fornecedor.motivoInativacao}
                dataInativacao={fornecedor.dataInativacao}
                usuarioInativacao={fornecedor.usuarioInativacao}
                observacaoInativacao={fornecedor.observacaoInativacao}
              />
            </div>
          </div>
        );
      case 'cnpj':
        return removerFormatacaoCnpj(fornecedor.cnpj);
      case 'cnpjRaiz':
        return fornecedor.cnpjRaiz || '-';
      case 'quantidadeFiliais':
        return fornecedor.quantidadeFiliais !== undefined ? (
          <div className="flex items-center gap-2">
            <span className="font-medium">{fornecedor.quantidadeFiliais}</span>
            {fornecedor.quantidadeFiliais > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                {fornecedor.quantidadeFiliais === 1 ? 'filial' : 'filiais'}
              </Badge>
            )}
          </div>
        ) : '-';
      case 'email':
        return fornecedor.email ? (
          <div className="max-w-xs truncate" title={fornecedor.email}>
            {fornecedor.email}
          </div>
        ) : '-';
      case 'telefone':
        return fornecedor.telefone ? formatarTelefone(fornecedor.telefone) : '-';
      case 'endereco':
        return fornecedor.endereco ? (
          <div className="max-w-xs truncate" title={fornecedor.endereco}>
            {formatarEndereco(fornecedor.endereco)}
          </div>
        ) : '-';
      case 'pais':
        return fornecedor.pais || 'Brasil';
      case 'estado':
        return fornecedor.estado || fornecedor.uf || '-';
      case 'dataCadastro':
        return fornecedor.dataCadastro;
      case 'ultimaParticipacao':
        return fornecedor.ultimaParticipacao;
      case 'status':
        return (
          <StatusBadgeWithContext 
            status={fornecedor.status}
            motivoInativacao={fornecedor.motivoInativacao}
            dataInativacao={fornecedor.dataInativacao}
            usuarioInativacao={fornecedor.usuarioInativacao}
            observacaoInativacao={fornecedor.observacaoInativacao}
          />
        );
      case 'tipoFornecedor':
        return fornecedor.tipoFornecedor === 'industria' ? 'Indústria' : 
               fornecedor.tipoFornecedor === 'servico' ? 'Serviço' : 
               fornecedor.tipoFornecedor === 'mista' ? 'Mista' : '-';
      case 'classificacao':
        return fornecedor.classificacao ? (
          <Badge variant="outline" className={
            fornecedor.classificacao === 'direto' 
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-purple-50 text-purple-700 border-purple-200'
          }>
            {fornecedor.classificacao === 'direto' ? 'Direto' : 'Indireto'}
          </Badge>
        ) : '-';
      case 'categoria':
        return fornecedor.categoria;
      case 'financeiro':
        return fornecedor.financeiro ? (
          <Badge variant="outline" className={
            fornecedor.financeiro === 'OPEX' 
              ? 'bg-orange-50 text-orange-700 border-orange-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }>
            {fornecedor.financeiro}
          </Badge>
        ) : '-';
      case 'segmento':
        return fornecedor.segmento || '-';
      case 'descricao':
        return (
          <div className="max-w-xs truncate" title={fornecedor.descricao}>
            {fornecedor.descricao || '-'}
          </div>
        );
      case 'porte':
        return (
          <div>
            <div>{getPorteText(fornecedor.porte)}</div>
            <div className="text-xs text-slate-500 mt-1">{getEmpresaTipo(fornecedor.tipoEmpresa)}</div>
          </div>
        );
      case 'avaliacao':
        return fornecedor.avaliacao ? (
          <Badge variant="outline" className={
            fornecedor.avaliacao === 'avaliado' 
              ? 'bg-green-50 text-green-700 border-green-200'
              : fornecedor.avaliacao === 'parcial'
              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
              : 'bg-gray-50 text-gray-700 border-gray-200'
          }>
            {fornecedor.avaliacao === 'avaliado' ? 'Avaliado' : 
             fornecedor.avaliacao === 'parcial' ? 'Parcial' : 'Não Avaliado'}
          </Badge>
        ) : '-';
      case 'score':
        return fornecedor.score ? (
          <div className="flex items-center gap-2">
            <span className="font-medium">{fornecedor.score}</span>
            <div className={`w-2 h-2 rounded-full ${
              fornecedor.score >= 8 ? 'bg-green-500' :
              fornecedor.score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          </div>
        ) : '-';
      case 'transacional':
        return fornecedor.transacional ? (
          <Badge variant="outline" className={
            fornecedor.transacional === 'ativo' 
              ? 'bg-green-50 text-green-700 border-green-200'
              : fornecedor.transacional === 'somente_cotado'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-gray-50 text-gray-700 border-gray-200'
          }>
            {fornecedor.transacional === 'ativo' ? 'Ativo' : 
             fornecedor.transacional === 'somente_cotado' ? 'Somente Cotado' : 'Sem Histórico'}
          </Badge>
        ) : '-';
      case 'criticidade':
        return fornecedor.criticidade ? (
          <Badge variant="outline" className={
            fornecedor.criticidade === 'alta' 
              ? 'bg-red-50 text-red-700 border-red-200'
              : fornecedor.criticidade === 'media'
              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
              : 'bg-green-50 text-green-700 border-green-200'
          }>
            {fornecedor.criticidade === 'alta' ? 'Alta' : 
             fornecedor.criticidade === 'media' ? 'Média' : 'Baixa'}
          </Badge>
        ) : '-';
      case 'cidade':
        return `${fornecedor.cidade} - ${fornecedor.uf}`;
      case 'uf':
        return fornecedor.uf;
      case 'qualificado':
        return fornecedor.qualificado ? (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sim</Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Não</Badge>
        );
      case 'preferido':
        return fornecedor.preferido ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Sim</Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Não</Badge>
        );
      case 'acoes':
        return (
          <div className="flex justify-end items-center">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link to={`/fornecedores/${fornecedor.id}`}>
                Ver detalhes <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                  <Link to={`/fornecedores/${fornecedor.id}`} className="w-full flex items-center">
                    <Eye className="h-4 w-4 mr-2" /> Ver ficha completa
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleEditarFornecedor(fornecedor)}>
                  <PenLine className="h-4 w-4 mr-2" /> Editar fornecedor
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleEnviarMensagem(fornecedor)}>
                  <MessageSquare className="h-4 w-4 mr-2" /> Enviar mensagem
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleAdicionarDocumento(fornecedor)}>
                  <FilePlus className="h-4 w-4 mr-2" /> Adicionar documento
                </DropdownMenuItem>
                
                {temAcoesPendentes(fornecedor) && (
                  <DropdownMenuItem 
                    onClick={() => handleAcoesPendentes(fornecedor)}
                    className="text-amber-600 font-medium"
                  >
                    <Play className="h-4 w-4 mr-2" /> 
                    Executar ação
                    {fornecedor.acoesPendentes && (
                      <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-600 border-amber-200">
                        {fornecedor.acoesPendentes.length}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {fornecedor.preferido ? (
                  <DropdownMenuItem 
                    onClick={() => handleTogglePreferido(fornecedor)}
                  >
                    <HeartOff className="h-4 w-4 mr-2" />
                    Remover dos preferidos
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    onClick={() => handleTogglePreferido(fornecedor)}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Tornar preferido
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {fornecedor.status === 'ativo' ? (
                  <DropdownMenuItem 
                    onClick={() => handleToggleAtivo(fornecedor)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Inativar fornecedor
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    onClick={() => handleToggleAtivo(fornecedor)}
                  >
                    <Check className="h-4 w-4 mr-2" /> Ativar fornecedor
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      default:
        return '-';
    }
  };

  // Barra de ferramentas acima da tabela
  const ToolbarSection = () => (
    <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600 font-medium">
          {isLoading ? (
            "Carregando..."
          ) : (
            `${fornecedores.length} fornecedor${fornecedores.length !== 1 ? 'es' : ''} encontrado${fornecedores.length !== 1 ? 's' : ''}`
          )}
        </span>
        {selectedFornecedores.length > 0 && (
          <span className="text-sm text-blue-600 font-medium">
            ({selectedFornecedores.length} selecionado{selectedFornecedores.length !== 1 ? 's' : ''})
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPersonalizarModalOpen(true)}
          className="border-slate-300 hover:bg-slate-100"
        >
          <Settings2 className="h-4 w-4 mr-2" />
          Personalizar
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-2 border-sourcexpress-purple bg-sourcexpress-purple/10 hover:bg-sourcexpress-purple hover:text-white transition-all duration-200 group"
              disabled={exportandoLista || exportandoSelecionados || exportandoCompleto}
            >
              {(exportandoLista || exportandoSelecionados || exportandoCompleto) ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2 text-sourcexpress-purple group-hover:text-white" />
              )}
              <span className="font-semibold text-sourcexpress-purple group-hover:text-white">
                {(exportandoLista || exportandoSelecionados || exportandoCompleto) ? 'Exportando...' : 'Exportar'}
              </span>
              <ChevronDown className="h-4 w-4 ml-2 text-sourcexpress-purple group-hover:text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>📊 Exportações Básicas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleExportarLista}
              disabled={exportandoLista || fornecedores.length === 0}
            >
              {exportandoLista ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Lista de Fornecedores (CSV/Excel)
              <div className="text-xs text-gray-500 mt-1">
                Dados visíveis na tabela ({fornecedores.length} itens)
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleExportarSelecionados}
              disabled={exportandoSelecionados || selectedFornecedores.length === 0}
            >
              {exportandoSelecionados ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Fornecedores Selecionados
              <div className="text-xs text-gray-500 mt-1">
                Apenas os marcados ({selectedFornecedores.length} selecionados)
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleExportarCompleto}
              disabled={exportandoCompleto || fornecedores.length === 0}
            >
              {exportandoCompleto ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Relatório Completo
              <div className="text-xs text-gray-500 mt-1">
                Incluindo dados detalhados não visíveis
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="rounded-md border">
      {/* Nova barra de ferramentas sempre visível */}
      <ToolbarSection />

      {/* Indicador de seleção */}
      {selectedFornecedores.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">
              {selectedFornecedores.length} fornecedor(es) selecionado(s)
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedFornecedores([])}
              className="text-blue-600 hover:text-blue-800"
            >
              Limpar seleção
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) {
                      const input = el.querySelector('input');
                      if (input) input.indeterminate = isPartiallySelected;
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos os fornecedores"
                />
              </TableHead>
              {colunasVisiveis.map((coluna) => (
                <TableHead 
                  key={coluna.key} 
                  className={coluna.key === 'acoes' ? 'text-right' : ''}
                  style={{ width: coluna.width }}
                >
                  {coluna.key === 'acoes' ? 'Ação' : coluna.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={colunasVisiveis.length + 1} className="text-center py-8">
                  <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : fornecedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colunasVisiveis.length + 1} className="text-center py-8 text-slate-500">
                  Nenhum fornecedor encontrado
                </TableCell>
              </TableRow>
            ) : (
              fornecedores.map((fornecedor) => (
                <TableRow 
                  key={fornecedor.id}
                  className={selectedFornecedores.includes(fornecedor.id) ? "bg-blue-50" : ""}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedFornecedores.includes(fornecedor.id)}
                      onCheckedChange={(checked) => handleSelectFornecedor(fornecedor.id, !!checked)}
                      aria-label={`Selecionar ${fornecedor.nome}`}
                    />
                  </TableCell>
                  {colunasVisiveis.map((coluna) => (
                    <TableCell 
                      key={coluna.key} 
                      className={coluna.key === 'acoes' ? 'text-right' : ''}
                    >
                      {renderCellContent(fornecedor, coluna)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={acoesPendentesDialog.open} onOpenChange={(open) => setAcoesPendentesDialog({ open, fornecedor: acoesPendentesDialog.fornecedor })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Play className="h-5 w-5 mr-2 text-amber-500" /> 
              Ações Pendentes
            </DialogTitle>
            <DialogDescription>
              Resolva pendências identificadas para este fornecedor.
              Cada ação será registrada no histórico.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {acoesPendentesDialog.fornecedor?.acoesPendentes?.length ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  O fornecedor <span className="font-medium">{acoesPendentesDialog.fornecedor.nome}</span> possui as seguintes ações pendentes:
                </p>
                
                <div className="space-y-3">
                  {acoesPendentesDialog.fornecedor.acoesPendentes.map((acao) => (
                    <div key={acao.id} className="bg-slate-50 border border-slate-200 rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-slate-900">{acao.descricao}</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Ação sugerida: {acao.acaoSugerida}
                          </p>
                          <div className="mt-1 flex items-center">
                            <Badge variant="outline" className={`
                              ${acao.prioridade === 'alta' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                              ${acao.prioridade === 'media' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                              ${acao.prioridade === 'baixa' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                            `}>
                              Prioridade {acao.prioridade === 'alta' ? 'Alta' : acao.prioridade === 'media' ? 'Média' : 'Baixa'}
                            </Badge>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleExecutarAcao(acao.id, acao.acaoSugerida)}
                              >
                                Executar
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{getTooltipAcao(acao.tipo)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-600">Nenhuma ação pendente para este fornecedor.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAcoesPendentesDialog({ open: false })}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PersonalizarColunasModal
        open={personalizarModalOpen}
        onOpenChange={setPersonalizarModalOpen}
        colunas={configuracao}
        onSalvarConfiguracao={salvarConfiguracao}
      />
    </div>
  );
};
