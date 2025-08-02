
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Plus, Eye, Star, AlertTriangle } from "lucide-react";
import { FornecedorCategoria } from "@/types/categoria";

interface FornecedoresCategoriaProps {
  categoriaId: string;
}

export const FornecedoresCategoria = ({ categoriaId }: FornecedoresCategoriaProps) => {
  const [busca, setBusca] = useState("");

  // Mock data - em produção viria da API
  const fornecedores: FornecedorCategoria[] = [
    {
      id: "1",
      category_id: categoriaId,
      fornecedor_id: "f1",
      fornecedor_nome: "ElectroMax Ltda",
      fornecedor_cnpj: "12.345.678/0001-90",
      nivel_de_adesao: 95,
      data_ultimo_pedido: "2024-01-15",
      status_homologado: true,
      documentos_exigidos: ["ISO 9001", "Certificado Inmetro"],
      score_qualificacao: 8.5,
      sla_medio: 98,
      valor_comprado: 125000
    },
    {
      id: "2",
      category_id: categoriaId,
      fornecedor_id: "f2",
      fornecedor_nome: "TechCables S.A.",
      fornecedor_cnpj: "98.765.432/0001-10",
      nivel_de_adesao: 87,
      data_ultimo_pedido: "2024-01-20",
      status_homologado: true,
      documentos_exigidos: ["ISO 9001", "Certificado Inmetro", "NBR 5410"],
      score_qualificacao: 7.8,
      sla_medio: 92,
      valor_comprado: 98000
    },
    {
      id: "3",
      category_id: categoriaId,
      fornecedor_id: "f3",
      fornecedor_nome: "PowerLine Solutions",
      fornecedor_cnpj: "11.222.333/0001-44",
      nivel_de_adesao: 72,
      data_ultimo_pedido: "2023-12-10",
      status_homologado: false,
      documentos_exigidos: ["ISO 9001"],
      score_qualificacao: 6.5,
      sla_medio: 85,
      valor_comprado: 67000
    },
    {
      id: "4",
      category_id: categoriaId,
      fornecedor_id: "f4",
      fornecedor_nome: "Industrial Cables Co.",
      fornecedor_cnpj: "55.666.777/0001-88",
      nivel_de_adesao: 91,
      data_ultimo_pedido: "2024-01-18",
      status_homologado: true,
      documentos_exigidos: ["ISO 9001", "Certificado Inmetro"],
      score_qualificacao: 8.2,
      sla_medio: 96,
      valor_comprado: 89000
    }
  ];

  const fornecedoresFiltrados = fornecedores.filter(f =>
    f.fornecedor_nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.fornecedor_cnpj.includes(busca)
  );

  const getStatusBadge = (homologado: boolean) => {
    return homologado ? (
      <Badge className="bg-green-100 text-green-700">Homologado</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 7) return "text-yellow-600";
    return "text-red-600";
  };

  const getSlaColor = (sla: number) => {
    if (sla >= 95) return "text-green-600";
    if (sla >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const calcularEstrelas = (score: number) => {
    return Math.round(score / 2); // Converter score 0-10 para 0-5 estrelas
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Fornecedores da Categoria</h3>
          <p className="text-slate-600 text-sm">
            {fornecedoresFiltrados.length} fornecedores encontrados
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Fornecedor
        </Button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por nome ou CNPJ..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total</p>
                <p className="text-xl font-bold text-slate-900">{fornecedores.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Homologados</p>
                <p className="text-xl font-bold text-green-600">
                  {fornecedores.filter(f => f.status_homologado).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Pendentes</p>
                <p className="text-xl font-bold text-yellow-600">
                  {fornecedores.filter(f => !f.status_homologado).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Score Médio</p>
                <p className="text-xl font-bold text-purple-600">
                  {(fornecedores.reduce((acc, f) => acc + f.score_qualificacao, 0) / fornecedores.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Último Pedido</TableHead>
                <TableHead>Valor Comprado</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedoresFiltrados.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {fornecedor.fornecedor_nome.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{fornecedor.fornecedor_nome}</p>
                        <p className="text-sm text-slate-500">{fornecedor.fornecedor_cnpj}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(fornecedor.status_homologado)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getScoreColor(fornecedor.score_qualificacao)}`}>
                        {fornecedor.score_qualificacao}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < calcularEstrelas(fornecedor.score_qualificacao)
                                ? "text-yellow-400 fill-current"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getSlaColor(fornecedor.sla_medio)}`}>
                      {fornecedor.sla_medio}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(fornecedor.data_ultimo_pedido).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-slate-900">
                      {formatarMoeda(fornecedor.valor_comprado)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
