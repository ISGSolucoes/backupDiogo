
import React, { useState } from "react";
import { Clock, User, FileText, Filter, Download, Search, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatarData } from "@/utils/dateUtils";

interface AtividadeAuditavel {
  id: string;
  dataHora: string;
  responsavel: string;
  responsavelTipo: "usuario" | "sistema" | "ia";
  acao: string;
  modulo: string;
  descricao: string;
  detalhes?: any;
  impacto?: "baixo" | "medio" | "alto";
}

interface TrilhaAuditavelProps {
  fornecedorId: string;
  fornecedorNome: string;
  atividades?: AtividadeAuditavel[];
}

// Mock de atividades auditáveis
const mockAtividades: AtividadeAuditavel[] = [
  {
    id: "act-001",
    dataHora: "2023-06-19T14:30:00",
    responsavel: "Ana Lima",
    responsavelTipo: "usuario",
    acao: "upload_documento",
    modulo: "Documentos",
    descricao: "Upload de novo contrato de fornecimento",
    detalhes: { arquivo: "contrato-2023.pdf", tamanho: "2.4MB" },
    impacto: "medio"
  },
  {
    id: "act-002",
    dataHora: "2023-06-18T16:45:00",
    responsavel: "IA Rê (log: Carlos Souza)",
    responsavelTipo: "ia",
    acao: "alerta_vencimento",
    modulo: "Documentos",
    descricao: "Alerta automático de vencimento – ISO 9001 expira em 30 dias",
    detalhes: { documento: "ISO 9001", diasRestantes: 30 },
    impacto: "alto"
  },
  {
    id: "act-003",
    dataHora: "2023-06-17T10:15:00",
    responsavel: "Maria Santos",
    responsavelTipo: "usuario",
    acao: "qualificacao_aprovada",
    modulo: "Qualificação",
    descricao: "Qualificação técnica aprovada com score A-",
    detalhes: { area: "tecnica", score: "A-", pontuacao: 85 },
    impacto: "alto"
  },
  {
    id: "act-004",
    dataHora: "2023-06-15T11:20:00",
    responsavel: "Sistema",
    responsavelTipo: "sistema",
    acao: "participacao_evento",
    modulo: "Eventos",
    descricao: "Participação em cotação COT-2023-045",
    detalhes: { evento: "COT-2023-045", valor: 15000, resultado: "Vencedor" },
    impacto: "medio"
  },
  {
    id: "act-005",
    dataHora: "2023-06-12T09:30:00",
    responsavel: "Ana Lima",
    responsavelTipo: "usuario",
    acao: "atualizacao_cadastral",
    modulo: "Cadastro",
    descricao: "Atualização de dados cadastrais - Endereço e telefone",
    detalhes: { campos: ["endereco", "telefone"] },
    impacto: "baixo"
  },
  {
    id: "act-006",
    dataHora: "2023-06-10T13:45:00",
    responsavel: "IA Rê (log: Sistema)",
    responsavelTipo: "ia",
    acao: "analise_risco",
    modulo: "Análise",
    descricao: "Análise automática de risco - Status mantido como 'Baixo'",
    detalhes: { risco_anterior: "baixo", risco_atual: "baixo" },
    impacto: "baixo"
  }
];

const getIconeModulo = (modulo: string) => {
  switch (modulo) {
    case "Documentos": return <FileText className="h-4 w-4" />;
    case "Qualificação": return <User className="h-4 w-4" />;
    case "Eventos": return <Calendar className="h-4 w-4" />;
    case "Cadastro": return <User className="h-4 w-4" />;
    case "Análise": return <Clock className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getCorImpacto = (impacto?: string) => {
  switch (impacto) {
    case "alto": return "bg-red-100 text-red-700 border-red-200";
    case "medio": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "baixo": return "bg-green-100 text-green-700 border-green-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const getCorResponsavel = (tipo: string) => {
  switch (tipo) {
    case "ia": return "bg-purple-100 text-purple-700 border-purple-200";
    case "sistema": return "bg-blue-100 text-blue-700 border-blue-200";
    case "usuario": return "bg-green-100 text-green-700 border-green-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export const TrilhaAuditavel = ({ fornecedorId, fornecedorNome, atividades = mockAtividades }: TrilhaAuditavelProps) => {
  const [filtroModulo, setFiltroModulo] = useState<string>("todos");
  const [filtroResponsavel, setFiltroResponsavel] = useState<string>("todos");
  const [termoBusca, setTermoBusca] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);

  // Filtros
  const atividadesFiltradas = atividades.filter(atividade => {
    const matchModulo = filtroModulo === "todos" || atividade.modulo === filtroModulo;
    const matchResponsavel = filtroResponsavel === "todos" || atividade.responsavelTipo === filtroResponsavel;
    const matchBusca = termoBusca === "" || 
      atividade.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      atividade.responsavel.toLowerCase().includes(termoBusca.toLowerCase());
    
    return matchModulo && matchResponsavel && matchBusca;
  });

  // Dados para resumo
  const totalAtividades = atividades.length;
  const ultimaAtividade = atividades.length > 0 ? atividades[0] : null;
  const modulosUnicos = [...new Set(atividades.map(a => a.modulo))];

  const handleExportarTrilha = () => {
    toast.info(`Exportando trilha de atividades de ${fornecedorNome}...`);
    // Em produção, geraria arquivo CSV/PDF
  };

  const limparFiltros = () => {
    setFiltroModulo("todos");
    setFiltroResponsavel("todos");
    setTermoBusca("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Trilha Auditável de Atividades
        </CardTitle>
        <CardDescription>
          Registro cronológico completo de todas as ações realizadas com este fornecedor
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Resumo compacto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-50 p-3 rounded-lg border">
            <p className="text-sm font-medium">Total de Atividades</p>
            <p className="text-2xl font-bold text-slate-700">{totalAtividades}</p>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg border">
            <p className="text-sm font-medium">Última Atividade</p>
            <p className="text-sm text-slate-600">
              {ultimaAtividade ? formatarData(ultimaAtividade.dataHora) : "Nenhuma"}
            </p>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg border">
            <p className="text-sm font-medium">Módulos Ativos</p>
            <p className="text-sm text-slate-600">{modulosUnicos.length} diferentes</p>
          </div>
        </div>

        {/* Últimas atividades (resumo) */}
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-sm text-slate-700">Últimas 3 Atividades:</h4>
          {atividades.slice(0, 3).map((atividade) => (
            <div key={atividade.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border text-sm">
              <div className="flex items-center gap-2">
                {getIconeModulo(atividade.modulo)}
                <span className="font-medium">{atividade.acao.replace('_', ' ').toUpperCase()}</span>
                <Badge variant="outline" className={getCorResponsavel(atividade.responsavelTipo)}>
                  {atividade.responsavelTipo === "ia" ? "IA" : 
                   atividade.responsavelTipo === "sistema" ? "SYS" : "USR"}
                </Badge>
              </div>
              <span className="text-slate-500">{formatarData(atividade.dataHora)}</span>
            </div>
          ))}
        </div>

        {/* Botão para abrir trilha completa */}
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button className="w-full flex items-center gap-2">
              <FileText className="h-4 w-4" />
              📂 Ver Trilha Completa ({totalAtividades} registros)
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                📜 Trilha de Atividades - {fornecedorNome}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 overflow-y-auto max-h-[75vh]">
              {/* Filtros */}
              <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-lg border">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="🔍 Buscar na trilha..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <Select value={filtroModulo} onValueChange={setFiltroModulo}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Módulos</SelectItem>
                    {modulosUnicos.map(modulo => (
                      <SelectItem key={modulo} value={modulo}>{modulo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filtroResponsavel} onValueChange={setFiltroResponsavel}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="usuario">Usuários</SelectItem>
                    <SelectItem value="sistema">Sistema</SelectItem>
                    <SelectItem value="ia">IA Rê</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={limparFiltros} size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Limpar
                </Button>

                <Button variant="outline" onClick={handleExportarTrilha} size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
              </div>

              <Separator />

              {/* Tabela de atividades */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>📅 Data/Hora</TableHead>
                      <TableHead>👤 Responsável</TableHead>
                      <TableHead>📂 Módulo</TableHead>
                      <TableHead>⚡ Ação</TableHead>
                      <TableHead>📝 Descrição</TableHead>
                      <TableHead>🎯 Impacto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atividadesFiltradas.length > 0 ? (
                      atividadesFiltradas.map((atividade) => (
                        <TableRow key={atividade.id}>
                          <TableCell className="font-mono text-sm">
                            {formatarData(atividade.dataHora)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getCorResponsavel(atividade.responsavelTipo)}>
                              {atividade.responsavel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getIconeModulo(atividade.modulo)}
                              <span className="text-sm">{atividade.modulo}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                              {atividade.acao}
                            </code>
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            <p className="text-sm">{atividade.descricao}</p>
                            {atividade.detalhes && (
                              <details className="mt-1">
                                <summary className="text-xs text-slate-500 cursor-pointer">Ver detalhes</summary>
                                <pre className="text-xs bg-slate-50 p-2 mt-1 rounded overflow-x-auto">
                                  {JSON.stringify(atividade.detalhes, null, 2)}
                                </pre>
                              </details>
                            )}
                          </TableCell>
                          <TableCell>
                            {atividade.impacto && (
                              <Badge variant="outline" className={getCorImpacto(atividade.impacto)}>
                                {atividade.impacto.toUpperCase()}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          Nenhuma atividade encontrada com os filtros aplicados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Resumo dos resultados */}
              <div className="text-sm text-slate-600 text-center p-2 bg-slate-50 rounded">
                Exibindo {atividadesFiltradas.length} de {totalAtividades} atividades
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
