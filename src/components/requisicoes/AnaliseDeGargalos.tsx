import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Download, Filter, Info } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Tipo para os gargalos de requisição
interface GargaloRequisicao {
  id: string;
  nome: string;
  etapa: string;
  tempoParado: number; // em dias
  responsavel: string;
  ultimaAcao: string;
  dataUltimaAcao: string;
  criticidade: "baixa" | "media" | "alta";
}

// Tipo para as estatísticas de gargalos
interface EstatisticasGargalo {
  etapa: string;
  quantidade: number;
  tempoMedio: number;
}

// Props para o componente
interface AnaliseDeGargalosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Dados de exemplo
const gargalosMock: GargaloRequisicao[] = [
  {
    id: "REQ-2023-001",
    nome: "Compra de equipamentos de TI",
    etapa: "Aprovação Financeira",
    tempoParado: 7,
    responsavel: "Ricardo Ferreira",
    ultimaAcao: "Enviado para aprovação",
    dataUltimaAcao: "2023-05-03",
    criticidade: "alta"
  },
  {
    id: "REQ-2023-002",
    nome: "Materiais de escritório",
    etapa: "Aprovação Gestor",
    tempoParado: 3,
    responsavel: "Maria Silva",
    ultimaAcao: "Enviado para aprovação",
    dataUltimaAcao: "2023-05-07",
    criticidade: "media"
  },
  {
    id: "REQ-2023-003",
    nome: "Contratação de serviços de consultoria",
    etapa: "Aguardando Cotação",
    tempoParado: 5,
    responsavel: "Ana Costa",
    ultimaAcao: "Aprovado, aguardando comprador",
    dataUltimaAcao: "2023-05-05",
    criticidade: "alta"
  },
  {
    id: "REQ-2023-005",
    nome: "Material gráfico para campanha",
    etapa: "Aprovação Financeira",
    tempoParado: 15,
    responsavel: "Ricardo Ferreira",
    ultimaAcao: "Enviado para aprovação financeira",
    dataUltimaAcao: "2023-04-25",
    criticidade: "alta"
  },
  {
    id: "REQ-2023-008",
    nome: "Manutenção de ar-condicionado",
    etapa: "Aguardando Cotação",
    tempoParado: 8,
    responsavel: "Paulo Santos",
    ultimaAcao: "Aprovado, aguardando cotação",
    dataUltimaAcao: "2023-05-02",
    criticidade: "media"
  },
];

// Dados estatísticos para o gráfico
const estatisticasPorEtapa: EstatisticasGargalo[] = [
  { etapa: "Aprovação Gestor", quantidade: 6, tempoMedio: 2.5 },
  { etapa: "Aprovação Financeira", quantidade: 12, tempoMedio: 6.3 },
  { etapa: "Aguardando Cotação", quantidade: 8, tempoMedio: 4.7 },
  { etapa: "Análise Técnica", quantidade: 3, tempoMedio: 3.2 },
  { etapa: "Pendência do Requisitante", quantidade: 5, tempoMedio: 3.8 },
];

// Dados estatísticos por área
const estatisticasPorArea = [
  { area: "TI", requisicoes: 8, tempoMedio: 5.2 },
  { area: "Financeiro", requisicoes: 3, tempoMedio: 2.3 },
  { area: "Marketing", requisicoes: 6, tempoMedio: 7.1 },
  { area: "RH", requisicoes: 4, tempoMedio: 3.5 },
  { area: "Facilities", requisicoes: 7, tempoMedio: 6.8 },
];

export function AnaliseDeGargalos({ open, onOpenChange }: AnaliseDeGargalosProps) {
  const [filtroEtapa, setFiltroEtapa] = useState<string>("todas");
  const [filtroCriticidade, setFiltroCriticidade] = useState<string>("todas");
  const [abaAtiva, setAbaAtiva] = useState("tabela");

  // Filtra os gargalos com base nos filtros selecionados
  const gargalosFiltrados = gargalosMock.filter((gargalo) => {
    const passaFiltroEtapa = filtroEtapa === "todas" || gargalo.etapa === filtroEtapa;
    const passaFiltroCriticidade = filtroCriticidade === "todas" || gargalo.criticidade === filtroCriticidade;
    return passaFiltroEtapa && passaFiltroCriticidade;
  });

  // Gera as sugestões da IA com base nos dados analisados
  const gerarSugestoes = () => {
    const sugestoes = [
      "Você tem 2 requisições paradas há mais de 7 dias aguardando aprovação do Financeiro.",
      "3 requisições aprovadas ainda não foram convertidas em cotação.",
      "A média de tempo para aprovar requisições da área de TI é o dobro das demais.",
      "Considere criar uma regra de escalação automática para aprovações financeiras que demoram mais de 3 dias.",
      "O aprovador Ricardo Ferreira tem 2 requisições pendentes há mais de uma semana."
    ];
    return sugestoes;
  };

  // Função para obter a classe de estilo com base na criticidade
  const getCriticidadeStyle = (criticidade: string) => {
    switch (criticidade) {
      case "baixa":
        return "bg-blue-100 text-blue-800";
      case "media":
        return "bg-amber-100 text-amber-800";
      case "alta":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Clock className="h-6 w-6 text-amber-600" />
            Análise de Gargalos - Requisições
          </DialogTitle>
          <DialogDescription>
            Identifique onde o fluxo das requisições está travando e obtenha sugestões para otimizar o processo.
          </DialogDescription>
        </DialogHeader>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 p-3 bg-muted/20 rounded-md">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 w-full">
            <Select value={filtroEtapa} onValueChange={setFiltroEtapa}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as etapas</SelectItem>
                <SelectItem value="Aprovação Gestor">Aprovação Gestor</SelectItem>
                <SelectItem value="Aprovação Financeira">Aprovação Financeira</SelectItem>
                <SelectItem value="Aguardando Cotação">Aguardando Cotação</SelectItem>
                <SelectItem value="Análise Técnica">Análise Técnica</SelectItem>
                <SelectItem value="Pendência do Requisitante">Pendência do Requisitante</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroCriticidade} onValueChange={setFiltroCriticidade}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Criticidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="Centro de Custo" className="w-full" />
            
            <Button variant="secondary" className="w-full">
              <Filter className="h-4 w-4 mr-2" /> Aplicar
            </Button>
          </div>
        </div>

        {/* Sugestões da IA */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-md border border-amber-100">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-amber-900 mb-2">Análise da IA Rê</h3>
              <ul className="space-y-2">
                {gerarSugestoes().map((sugestao, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-2 text-sm text-amber-800"
                  >
                    <span className="mt-1 shrink-0">•</span>
                    <span>{sugestao}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="tabela">Tabela de Gargalos</TabsTrigger>
            <TabsTrigger value="grafico">Gráfico por Etapa</TabsTrigger>
            <TabsTrigger value="area">Análise por Área</TabsTrigger>
          </TabsList>

          {/* Aba de Tabela */}
          <TabsContent value="tabela" className="space-y-4">
            <Card className="border-none shadow-none">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-lg">Requisições com gargalos identificados</CardTitle>
                <CardDescription>
                  {gargalosFiltrados.length} requisições estão travadas no processo
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requisição</TableHead>
                      <TableHead>Etapa Atual</TableHead>
                      <TableHead>Tempo Parado</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Última Ação</TableHead>
                      <TableHead>Criticidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gargalosFiltrados.map((gargalo) => (
                      <TableRow key={gargalo.id}>
                        <TableCell className="font-medium">
                          <div>{gargalo.id}</div>
                          <div className="text-xs text-muted-foreground">{gargalo.nome}</div>
                        </TableCell>
                        <TableCell>{gargalo.etapa}</TableCell>
                        <TableCell>
                          <span className="font-medium">{gargalo.tempoParado} dias</span>
                        </TableCell>
                        <TableCell>{gargalo.responsavel}</TableCell>
                        <TableCell>
                          <div>{gargalo.ultimaAcao}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(gargalo.dataUltimaAcao).toLocaleDateString('pt-BR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCriticidadeStyle(gargalo.criticidade)}>
                            {gargalo.criticidade === "baixa" ? "Baixa" : 
                            gargalo.criticidade === "media" ? "Média" : "Alta"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Gráfico */}
          <TabsContent value="grafico">
            <Card className="border-none shadow-none">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-lg">Análise por Etapa do Processo</CardTitle>
                <CardDescription>
                  Média de tempo e quantidade de requisições por etapa
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={estatisticasPorEtapa}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="etapa" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="quantidade" name="Quantidade" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="tempoMedio" name="Tempo Médio (dias)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="p-0 pt-3 flex justify-between">
                <Alert className="w-full">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Insights</AlertTitle>
                  <AlertDescription className="text-sm">
                    A etapa de "Aprovação Financeira" apresenta o maior tempo médio (6.3 dias) 
                    e a maior quantidade de requisições (12).
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Aba por Área */}
          <TabsContent value="area">
            <Card className="border-none shadow-none">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-lg">Análise por Área Solicitante</CardTitle>
                <CardDescription>
                  Distribuição de gargalos por departamento
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={estatisticasPorArea}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="area" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tempoMedio" name="Tempo Médio (dias)" fill="#fa8231" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Área</TableHead>
                        <TableHead>Requisições</TableHead>
                        <TableHead>Tempo Médio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {estatisticasPorArea.map((item) => (
                        <TableRow key={item.area}>
                          <TableCell className="font-medium">{item.area}</TableCell>
                          <TableCell>{item.requisicoes}</TableCell>
                          <TableCell>{item.tempoMedio} dias</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rodapé do Modal */}
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <div className="flex items-center text-xs text-muted-foreground">
            <Info className="h-4 w-4 mr-1" />
            Dados atualizados em {new Date().toLocaleDateString('pt-BR')}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" /> Exportar Análise
            </Button>
            <Button onClick={() => onOpenChange(false)}>Fechar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
