
import React from "react";
import { Clock, Mail, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Dados mock para fornecedores em registro (apenas com progresso >= 1%)
const fornecedoresEmRegistro = [
  {
    id: "2", 
    nome: "Materiais Industriais ME",
    cnpj: "98.765.432/0001-02",
    email: "admin@materiaisindustriais.com",
    dataConvite: "2024-01-10",
    diasSemResposta: 10,
    progresso: 25,
    categoria: "Materiais",
    ultimoContato: "2024-01-12",
    tentativasEnvio: 2
  },
  {
    id: "3",
    nome: "Serviços Especializados SA",
    cnpj: "11.222.333/0001-03",
    email: "contato@servicosespecializados.com",
    dataConvite: "2024-01-08",
    diasSemResposta: 12,
    progresso: 10,
    categoria: "Serviços",
    ultimoContato: "2024-01-10",
    tentativasEnvio: 3
  },
  {
    id: "4",
    nome: "Construção & Reformas Ltda",
    cnpj: "22.333.444/0001-04",
    email: "comercial@construcaoreformas.com",
    dataConvite: "2024-01-12",
    diasSemResposta: 8,
    progresso: 45,
    categoria: "Construção",
    ultimoContato: "2024-01-14",
    tentativasEnvio: 1
  },
  {
    id: "5",
    nome: "Equipamentos Médicos Brasil",
    cnpj: "33.444.555/0001-05",
    email: "vendas@equipamentosmedicos.com",
    dataConvite: "2024-01-14",
    diasSemResposta: 6,
    progresso: 5,
    categoria: "Saúde",
    ultimoContato: "2024-01-16",
    tentativasEnvio: 1
  }
];

const FornecedoresEmRegistro = () => {
  const handleReenviarConvite = (fornecedor: any) => {
    toast.success(`Convite reenviado para ${fornecedor.nome}`);
  };

  const handleCancelarRegistro = (fornecedor: any) => {
    toast.warning(`Registro cancelado para ${fornecedor.nome}`);
  };

  const getPrioridadeStyle = (dias: number) => {
    if (dias > 10) return "border-red-200 bg-red-50";
    if (dias > 5) return "border-amber-200 bg-amber-50";
    return "border-blue-200 bg-blue-50";
  };

  const getPrioridadeBadge = (dias: number) => {
    if (dias > 10) return <Badge variant="destructive">Urgente</Badge>;
    if (dias > 5) return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Atenção</Badge>;
    return <Badge variant="outline">Normal</Badge>;
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
                <Clock className="h-6 w-6 text-amber-600" />
                Fornecedores em Registro
              </h1>
              <p className="text-slate-500 mt-1">
                Fornecedores que começaram a preencher o cadastro (progresso ≥ 1%)
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
                  <p className="text-sm text-slate-600">Total em Registro</p>
                  <p className="text-2xl font-bold">{fornecedoresEmRegistro.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Urgentes ({'>'}10 dias)</p>
                  <p className="text-2xl font-bold text-red-600">
                    {fornecedoresEmRegistro.filter(f => f.diasSemResposta > 10).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Com Progresso</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fornecedoresEmRegistro.filter(f => f.progresso > 0).length}
                  </p>
                </div>
                <RefreshCw className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Múltiplas Tentativas</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {fornecedoresEmRegistro.filter(f => f.tentativasEnvio > 1).length}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fornecedores */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lista de Fornecedores</h2>
          
          {fornecedoresEmRegistro.map((fornecedor) => (
            <Card key={fornecedor.id} className={`${getPrioridadeStyle(fornecedor.diasSemResposta)} transition-all hover:shadow-md`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                      <p className="text-sm text-slate-600">{fornecedor.cnpj}</p>
                    </div>
                    {getPrioridadeBadge(fornecedor.diasSemResposta)}
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
                      onClick={() => handleCancelarRegistro(fornecedor)}
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
                      <span className="font-medium">Email:</span>
                      <span className="text-slate-600">{fornecedor.email}</span>
                    </div>
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
                      <span className="text-slate-600">{fornecedor.tentativasEnvio}x</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Sem resposta há:</span>
                      <span className={`font-medium ${fornecedor.diasSemResposta > 10 ? 'text-red-600' : fornecedor.diasSemResposta > 5 ? 'text-amber-600' : 'text-slate-600'}`}>
                        {fornecedor.diasSemResposta} dias
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Progresso do Cadastro:</span>
                        <span className="text-slate-600">{fornecedor.progresso}%</span>
                      </div>
                      <Progress value={fornecedor.progresso} className="h-2" />
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

export default FornecedoresEmRegistro;
