
import React from "react";
import { Mail, ArrowLeft, RefreshCw, Clock, User, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Dados mock para fornecedores convidados (progresso = 0% - não iniciaram o cadastro)
const fornecedoresConvidados = [
  {
    id: "1",
    nome: "Tech Solutions Ltda",
    cnpj: "12.345.678/0001-01",
    email: "contato@techsolutions.com",
    dataConvite: "2024-01-15",
    diasSemResposta: 5,
    categoria: "Tecnologia",
    status: "enviado",
    tentativas: 1,
    progresso: 0
  },
  {
    id: "2",
    nome: "Logística Express SA",
    cnpj: "44.555.666/0001-06",
    email: "comercial@logisticaexpress.com",
    dataConvite: "2024-01-13",
    diasSemResposta: 7,
    categoria: "Logística",
    status: "visualizado",
    tentativas: 2,
    progresso: 0
  },
  {
    id: "3",
    nome: "Consultoria Financeira Plus",
    cnpj: "55.666.777/0001-07",
    email: "info@consultoriafinanceiraplus.com",
    dataConvite: "2024-01-11",
    diasSemResposta: 9,
    categoria: "Consultoria",
    status: "enviado",
    tentativas: 3,
    progresso: 0
  },
  {
    id: "4",
    nome: "Segurança Total Ltda",
    cnpj: "66.777.888/0001-08",
    email: "contato@segurancatotal.com",
    dataConvite: "2024-01-16",
    diasSemResposta: 4,
    categoria: "Segurança",
    status: "enviado",
    tentativas: 1,
    progresso: 0
  }
];

const FornecedoresConvidados = () => {
  const handleReenviarConvite = (fornecedor: any) => {
    toast.success(`Convite reenviado para ${fornecedor.nome}`);
  };

  const handleCancelarConvite = (fornecedor: any) => {
    toast.warning(`Convite cancelado para ${fornecedor.nome}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enviado":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Enviado</Badge>;
      case "visualizado":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Visualizado</Badge>;
      case "respondido":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Respondido</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
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
                <Mail className="h-6 w-6 text-purple-600" />
                Fornecedores Convidados
              </h1>
              <p className="text-slate-500 mt-1">
                Fornecedores que receberam convites para se cadastrar na plataforma
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
                  <p className="text-sm text-slate-600">Total Convidados</p>
                  <p className="text-2xl font-bold">{fornecedoresConvidados.length}</p>
                </div>
                <Mail className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Enviados</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {fornecedoresConvidados.filter(f => f.status === 'enviado').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Visualizados</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {fornecedoresConvidados.filter(f => f.status === 'visualizado').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Respondidos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fornecedoresConvidados.filter(f => f.status === 'respondido').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fornecedores Convidados */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lista de Convidados</h2>
          
          {fornecedoresConvidados.map((fornecedor) => (
            <Card key={fornecedor.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                      <p className="text-sm text-slate-600">{fornecedor.email}</p>
                    </div>
                    {getStatusBadge(fornecedor.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReenviarConvite(fornecedor)}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Reenviar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelarConvite(fornecedor)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancelar
                    </Button>
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
                      <span className="font-medium">Convite enviado:</span>
                      <span className="text-slate-600">{fornecedor.dataConvite}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Tentativas:</span>
                      <span className="text-slate-600">{fornecedor.tentativas}x</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Sem resposta há:</span>
                      <span className={`font-medium ${fornecedor.diasSemResposta > 7 ? 'text-red-600' : fornecedor.diasSemResposta > 3 ? 'text-amber-600' : 'text-slate-600'}`}>
                        {fornecedor.diasSemResposta} dias
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Status:</span>
                      <span className="text-slate-600 capitalize">{fornecedor.status}</span>
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

export default FornecedoresConvidados;
