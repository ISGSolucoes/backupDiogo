import React, { useState } from "react";
import { Paperclip, Search, AlertTriangle, FileX, Send, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock data para fornecedores com pendências documentais
const fornecedoresPendencias = [
  {
    id: "1",
    nome: "Construtech Engenharia",
    cnpj: "15.678.432/0001-20",
    email: "docs@construtech.com.br",
    pendencias: [
      { tipo: "CNPJ", status: "vencido", dataVencimento: "2023-12-15", prioridade: "alta" },
      { tipo: "Certidão Negativa", status: "ausente", dataVencimento: null, prioridade: "alta" }
    ],
    dataUltimaSolicitacao: "2024-01-05",
    responsavel: "João Silva"
  },
  {
    id: "2", 
    nome: "Digital Marketing Pro",
    cnpj: "22.333.444/0001-55",
    email: "contrato@digitalpro.com.br",
    pendencias: [
      { tipo: "Contrato Social", status: "vencido", dataVencimento: "2023-11-30", prioridade: "media" },
      { tipo: "Certidão Municipal", status: "vencendo", dataVencimento: "2024-01-25", prioridade: "media" }
    ],
    dataUltimaSolicitacao: "2024-01-10",
    responsavel: "Maria Santos"
  }
];

export default function FornecedoresPendenciasDocumentais() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFornecedores, setFilteredFornecedores] = useState(fornecedoresPendencias);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = fornecedoresPendencias.filter(f => 
      f.nome.toLowerCase().includes(term.toLowerCase()) ||
      f.cnpj.includes(term) ||
      f.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredFornecedores(filtered);
  };

  const handleSolicitarAtualizacao = (fornecedor: any) => {
    toast.success(`Solicitação de atualização enviada para ${fornecedor.nome}`);
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baixa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vencido":
        return "bg-red-100 text-red-800";
      case "vencendo":
        return "bg-orange-100 text-orange-800";
      case "ausente":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vencido":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "vencendo":
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case "ausente":
        return <FileX className="h-4 w-4 text-gray-500" />;
      default:
        return <Paperclip className="h-4 w-4 text-blue-500" />;
    }
  };

  const totalPendenciasAlta = fornecedoresPendencias.reduce((acc, f) => 
    acc + f.pendencias.filter(p => p.prioridade === "alta").length, 0
  );

  const totalPendenciasMedia = fornecedoresPendencias.reduce((acc, f) => 
    acc + f.pendencias.filter(p => p.prioridade === "media").length, 0
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Paperclip className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pendências Documentais
            </h1>
            <p className="text-gray-600">
              Fornecedores com documentos vencidos, ausentes ou prestes a vencer
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate("/fornecedores")}
          className="gap-2"
        >
          Voltar para Fornecedores
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Prioridade Alta</p>
                <p className="text-xl font-semibold text-red-600">{totalPendenciasAlta}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Prioridade Média</p>
                <p className="text-xl font-semibold text-orange-600">{totalPendenciasMedia}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileX className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Documentos Ausentes</p>
                <p className="text-xl font-semibold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Paperclip className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Fornecedores</p>
                <p className="text-xl font-semibold">{fornecedoresPendencias.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome, CNPJ ou email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Fornecedores */}
      <div className="space-y-4">
        {filteredFornecedores.map((fornecedor) => (
          <Card key={fornecedor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {fornecedor.nome}
                    </h3>
                    <Badge variant="destructive">
                      {fornecedor.pendencias.length} pendência{fornecedor.pendencias.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <p><strong>CNPJ:</strong> {fornecedor.cnpj}</p>
                      <p><strong>Email:</strong> {fornecedor.email}</p>
                    </div>
                    <div>
                      <p><strong>Última solicitação:</strong> {new Date(fornecedor.dataUltimaSolicitacao).toLocaleDateString()}</p>
                      <p><strong>Responsável:</strong> {fornecedor.responsavel}</p>
                    </div>
                  </div>

                  {/* Lista de Pendências */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Documentos Pendentes:</h4>
                    {fornecedor.pendencias.map((pendencia, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {getStatusIcon(pendencia.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{pendencia.tipo}</span>
                            <Badge className={getStatusColor(pendencia.status)}>
                              {pendencia.status}
                            </Badge>
                            <Badge className={getPrioridadeColor(pendencia.prioridade)}>
                              {pendencia.prioridade}
                            </Badge>
                          </div>
                          {pendencia.dataVencimento && (
                            <p className="text-xs text-gray-600 mt-1">
                              Vencimento: {new Date(pendencia.dataVencimento).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleSolicitarAtualizacao(fornecedor)}
                  >
                    <Send className="h-4 w-4" />
                    Solicitar Atualização
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/fornecedores/${fornecedor.id}`)}
                  >
                    Ver Documentos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredFornecedores.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Paperclip className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum fornecedor encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm ? "Tente ajustar os filtros de busca" : "Todos os documentos estão em dia"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}