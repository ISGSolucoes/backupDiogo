import React, { useState } from "react";
import { Timer, Search, RefreshCw, Mail, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock data para fornecedores aguardando ação
const fornecedoresAguardandoAcao = [
  {
    id: "1",
    nome: "TechSolutions Ltda",
    cnpj: "12.345.678/0001-90",
    email: "contato@techsolutions.com.br",
    status: "convidado",
    dataUltimaAcao: "2024-01-10",
    diasParado: 5,
    tipoAcao: "Convite não acessado",
    etapa: "Convite enviado"
  },
  {
    id: "2", 
    nome: "Inovação & Cia",
    cnpj: "98.765.432/0001-10",
    email: "admin@inovacaoecia.com.br",
    status: "em_registro",
    dataUltimaAcao: "2024-01-08",
    diasParado: 7,
    tipoAcao: "Cadastro incompleto",
    etapa: "Dados básicos - 60% preenchido"
  },
  {
    id: "3",
    nome: "Sistemas Avançados S.A.",
    cnpj: "11.222.333/0001-44",
    email: "sistemas@avancados.com.br", 
    status: "em_registro",
    dataUltimaAcao: "2024-01-12",
    diasParado: 3,
    tipoAcao: "Documentos pendentes",
    etapa: "Documentação - 30% enviada"
  }
];

export default function FornecedoresAguardandoAcao() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFornecedores, setFilteredFornecedores] = useState(fornecedoresAguardandoAcao);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = fornecedoresAguardandoAcao.filter(f => 
      f.nome.toLowerCase().includes(term.toLowerCase()) ||
      f.cnpj.includes(term) ||
      f.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredFornecedores(filtered);
  };

  const handleReenviarLembrete = (fornecedor: any) => {
    toast.success(`Lembrete reenviado para ${fornecedor.nome}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "convidado":
        return "bg-purple-100 text-purple-800";
      case "em_registro":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDiasParadoColor = (dias: number) => {
    if (dias >= 7) return "text-red-600";
    if (dias >= 5) return "text-orange-600";
    return "text-amber-600";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Timer className="h-8 w-8 text-amber-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Aguardando Ação do Fornecedor
            </h1>
            <p className="text-gray-600">
              Fornecedores inativos há mais de 3 dias que precisam de acompanhamento
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Convites não acessados</p>
                <p className="text-xl font-semibold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Cadastros incompletos</p>
                <p className="text-xl font-semibold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-gray-600">Média de dias parado</p>
                <p className="text-xl font-semibold">5.0</p>
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
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {fornecedor.nome}
                    </h3>
                    <Badge className={getStatusColor(fornecedor.status)}>
                      {fornecedor.status === "convidado" ? "Convidado" : "Em Registro"}
                    </Badge>
                    <Badge variant="outline" className={getDiasParadoColor(fornecedor.diasParado)}>
                      {fornecedor.diasParado} dias parado
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>CNPJ:</strong> {fornecedor.cnpj}</p>
                      <p><strong>Email:</strong> {fornecedor.email}</p>
                    </div>
                    <div>
                      <p><strong>Última ação:</strong> {new Date(fornecedor.dataUltimaAcao).toLocaleDateString()}</p>
                      <p><strong>Tipo:</strong> {fornecedor.tipoAcao}</p>
                      <p><strong>Etapa:</strong> {fornecedor.etapa}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleReenviarLembrete(fornecedor)}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reenviar Lembrete
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/fornecedores/${fornecedor.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredFornecedores.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Timer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum fornecedor encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm ? "Tente ajustar os filtros de busca" : "Todos os fornecedores estão ativos"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}