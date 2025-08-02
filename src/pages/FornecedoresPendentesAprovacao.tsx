import React from "react";
import { Clock, ArrowLeft, RefreshCw, User, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Dados mock para fornecedores pendentes de aprovação
const fornecedoresPendentesAprovacao = [
  {
    id: "1",
    nome: "Inovação Tecnológica Ltda",
    cnpj: "33.444.555/0001-01",
    email: "contato@inovacaotec.com",
    categoria: "Tecnologia",
    tipoProcesso: "Registro",
    dataEnvio: "2024-01-18",
    diasAguardando: 2,
    regrasAplicadas: [
      "Verificação de documentos",
      "Análise de capacidade técnica",
      "Avaliação financeira"
    ],
    proximaAcao: "Aprovação da diretoria",
    responsavelAprovacao: "João Silva - Diretor Comercial",
    prioridade: "alta"
  },
  {
    id: "2", 
    nome: "Construções Especiais SA",
    cnpj: "44.555.666/0001-02",
    email: "comercial@construcoesespeciais.com",
    categoria: "Construção",
    tipoProcesso: "Qualificação",
    dataEnvio: "2024-01-16",
    diasAguardando: 4,
    regrasAplicadas: [
      "Análise de portfolio de obras",
      "Verificação de certidões",
      "Avaliação de capacidade financeira",
      "Checklist de segurança"
    ],
    proximaAcao: "Aprovação do comitê técnico",
    responsavelAprovacao: "Maria Santos - Gerente de Engenharia",
    prioridade: "media"
  }
];

const FornecedoresPendentesAprovacao = () => {
  const handleAprovar = (fornecedor: any) => {
    toast.success(`${fornecedor.nome} aprovado com sucesso!`);
  };

  const handleRejeitar = (fornecedor: any) => {
    toast.error(`Processo de ${fornecedor.nome} rejeitado`);
  };

  const handleSolicitarAjustes = (fornecedor: any) => {
    toast.info(`Solicitação de ajustes enviada para ${fornecedor.nome}`);
  };

  const getPrioridadeStyle = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "border-red-200 bg-red-50";
      case "media":
        return "border-amber-200 bg-amber-50";
      case "baixa":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return <Badge variant="destructive">Alta Prioridade</Badge>;
      case "media":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Média Prioridade</Badge>;
      case "baixa":
        return <Badge variant="outline">Baixa Prioridade</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getTipoProcessoBadge = (tipo: string) => {
    switch (tipo) {
      case "Registro":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Registro</Badge>;
      case "Qualificação":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Qualificação</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
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
                <Clock className="h-6 w-6 text-orange-600" />
                Fornecedores Pendentes de Aprovação
              </h1>
              <p className="text-slate-500 mt-1">
                Fornecedores com regras aplicadas aguardando aprovação do cliente
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
                  <p className="text-sm text-slate-600">Total Pendentes</p>
                  <p className="text-2xl font-bold">{fornecedoresPendentesAprovacao.length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Registro</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {fornecedoresPendentesAprovacao.filter(f => f.tipoProcesso === 'Registro').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Qualificação</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {fornecedoresPendentesAprovacao.filter(f => f.tipoProcesso === 'Qualificação').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Alta Prioridade</p>
                  <p className="text-2xl font-bold text-red-600">
                    {fornecedoresPendentesAprovacao.filter(f => f.prioridade === 'alta').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fornecedores Pendentes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lista de Fornecedores</h2>
          
          {fornecedoresPendentesAprovacao.map((fornecedor) => (
            <Card key={fornecedor.id} className={`${getPrioridadeStyle(fornecedor.prioridade)} transition-all hover:shadow-md`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                      <p className="text-sm text-slate-600">{fornecedor.cnpj}</p>
                    </div>
                    <div className="flex gap-2">
                      {getPrioridadeBadge(fornecedor.prioridade)}
                      {getTipoProcessoBadge(fornecedor.tipoProcesso)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAprovar(fornecedor)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSolicitarAjustes(fornecedor)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Solicitar Ajustes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRejeitar(fornecedor)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Rejeitar
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
                      <span className="font-medium">Tipo de Processo:</span>
                      <span className="text-slate-600">{fornecedor.tipoProcesso}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Data de Envio:</span>
                      <span className="text-slate-600">{fornecedor.dataEnvio}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Aguardando há:</span>
                      <span className={`font-medium ${fornecedor.diasAguardando > 3 ? 'text-red-600' : 'text-slate-600'}`}>
                        {fornecedor.diasAguardando} dias
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">Regras Aplicadas:</span>
                      <ul className="mt-1 text-slate-600 text-xs">
                        {fornecedor.regrasAplicadas.map((regra, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {regra}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Próxima Ação:</span>
                      <p className="text-slate-600 text-xs mt-1">{fornecedor.proximaAcao}</p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Responsável:</span>
                      <p className="text-slate-600 text-xs mt-1">{fornecedor.responsavelAprovacao}</p>
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

export default FornecedoresPendentesAprovacao;