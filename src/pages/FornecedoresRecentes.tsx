
import React from "react";
import { CalendarDays, ArrowLeft, RefreshCw, Clock, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Dados mock para fornecedores recentes
const fornecedoresRecentes = [
  {
    id: "1",
    nome: "Nova Tech Solutions Ltda",
    cnpj: "12.345.678/0001-01",
    categoria: "Tecnologia",
    dataCadastro: "2024-01-22",
    diasCadastrado: 1,
    status: "registrado",
    origem: "Indicação",
    responsavelCadastro: "João Silva"
  },
  {
    id: "2",
    nome: "Fresh Materials SA",
    cnpj: "98.765.432/0001-02",
    categoria: "Materiais",
    dataCadastro: "2024-01-20",
    diasCadastrado: 3,
    status: "em_qualificacao",
    origem: "Busca Externa",
    responsavelCadastro: "Maria Santos"
  },
  {
    id: "3",
    nome: "Startup Serviços ME",
    cnpj: "11.222.333/0001-03",
    categoria: "Serviços",
    dataCadastro: "2024-01-18",
    diasCadastrado: 5,
    status: "registrado",
    origem: "Autocadastro",
    responsavelCadastro: "Sistema"
  },
  {
    id: "4",
    nome: "Inovação Digital Ltda",
    cnpj: "22.333.444/0001-04",
    categoria: "Tecnologia",
    dataCadastro: "2024-01-15",
    diasCadastrado: 8,
    status: "em_registro",
    origem: "Convite",
    responsavelCadastro: "Ana Costa"
  }
];

const FornecedoresRecentes = () => {
  const handleVerDetalhes = (fornecedor: any) => {
    toast.info(`Visualizando detalhes de ${fornecedor.nome}`);
  };

  const handleAcompanhar = (fornecedor: any) => {
    toast.success(`Acompanhando progresso de ${fornecedor.nome}`);
  };

  const handleIniciarQualificacao = (fornecedor: any) => {
    toast.info(`Iniciando qualificação para ${fornecedor.nome}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registrado":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Registrado</Badge>;
      case "em_qualificacao":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Em Qualificação</Badge>;
      case "em_registro":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Em Registro</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getOrigemBadge = (origem: string) => {
    switch (origem) {
      case "Indicação":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Indicação</Badge>;
      case "Busca Externa":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Busca Externa</Badge>;
      case "Autocadastro":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Autocadastro</Badge>;
      case "Convite":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">Convite</Badge>;
      default:
        return <Badge variant="outline">Não informado</Badge>;
    }
  };

  const getDiasColor = (dias: number) => {
    if (dias <= 3) return "text-green-600";
    if (dias <= 7) return "text-blue-600";
    return "text-orange-600";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/fornecedores">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <CalendarDays className="h-6 w-6 text-blue-600" />
                Fornecedores Recentes
              </h1>
              <p className="text-slate-500 mt-1">
                Fornecedores adicionados nos últimos 30 dias
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Lista
            </Button>
          </div>
        </div>

        {/* Estatísticas Resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Recentes</p>
                  <p className="text-2xl font-bold">{fornecedoresRecentes.length}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Últimos 3 dias</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fornecedoresRecentes.filter(f => f.diasCadastrado <= 3).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Autocadastros</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {fornecedoresRecentes.filter(f => f.origem === 'Autocadastro').length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Em Progresso</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {fornecedoresRecentes.filter(f => f.status !== 'registrado').length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fornecedores Recentes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lista de Fornecedores</h2>
          
          {fornecedoresRecentes.map((fornecedor) => (
            <Card key={fornecedor.id} className="transition-all hover:shadow-md border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {fornecedor.nome}
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                      </CardTitle>
                      <p className="text-sm text-slate-600">{fornecedor.cnpj}</p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(fornecedor.status)}
                      {getOrigemBadge(fornecedor.origem)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleVerDetalhes(fornecedor)}
                    >
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAcompanhar(fornecedor)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Acompanhar
                    </Button>
                    {fornecedor.status === 'registrado' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleIniciarQualificacao(fornecedor)}
                        className="text-green-600 hover:text-green-700"
                      >
                        Qualificar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Categoria:</span>
                      <span className="text-slate-600">{fornecedor.categoria}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Data Cadastro:</span>
                      <span className="text-slate-600">{fornecedor.dataCadastro}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Responsável:</span>
                      <span className="text-slate-600">{fornecedor.responsavelCadastro}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Cadastrado há:</span>
                      <span className={`font-bold ${getDiasColor(fornecedor.diasCadastrado)}`}>
                        {fornecedor.diasCadastrado} {fornecedor.diasCadastrado === 1 ? 'dia' : 'dias'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Origem:</span>
                      <span className="text-slate-600">{fornecedor.origem}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Status Atual:</span>
                      {getStatusBadge(fornecedor.status)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FornecedoresRecentes;
