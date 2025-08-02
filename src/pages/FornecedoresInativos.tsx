
import React from "react";
import { XCircle, ArrowLeft, RefreshCw, AlertTriangle, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Dados mock para fornecedores inativos
const fornecedoresInativos = [
  {
    id: "1",
    nome: "Tech Solutions Ltda",
    cnpj: "12.345.678/0001-01",
    categoria: "Tecnologia",
    dataInativacao: "2024-01-20",
    motivoInativacao: "Inatividade por 6 meses",
    inativadoPor: "João Silva",
    ultimaParticipacao: "2023-07-15",
    podeReativar: true,
    observacoes: "Fornecedor com bom histórico, mas sem participação recente"
  },
  {
    id: "2",
    nome: "Industrial Materials SA",
    cnpj: "98.765.432/0001-02",
    categoria: "Materiais",
    dataInativacao: "2024-01-15",
    motivoInativacao: "Documentação vencida",
    inativadoPor: "Maria Santos",
    ultimaParticipacao: "2023-12-10",
    podeReativar: true,
    observacoes: "Documentos de certificação vencidos há mais de 3 meses"
  },
  {
    id: "3",
    nome: "Serviços Problemáticos ME",
    cnpj: "11.222.333/0001-03",
    categoria: "Serviços",
    dataInativacao: "2024-01-10",
    motivoInativacao: "Problemas de qualidade",
    inativadoPor: "Ana Costa",
    ultimaParticipacao: "2023-11-20",
    podeReativar: false,
    observacoes: "Múltiplas reclamações sobre qualidade dos serviços prestados"
  }
];

const FornecedoresInativos = () => {
  const handleVerDetalhes = (fornecedor: any) => {
    toast.info(`Visualizando detalhes de ${fornecedor.nome}`);
  };

  const handleReativar = (fornecedor: any) => {
    if (fornecedor.podeReativar) {
      toast.success(`Processo de reativação iniciado para ${fornecedor.nome}`);
    } else {
      toast.error(`${fornecedor.nome} não pode ser reativado devido ao motivo da inativação`);
    }
  };

  const handleRemoverDefinitivamente = (fornecedor: any) => {
    toast.warning(`${fornecedor.nome} será removido definitivamente da base`);
  };

  const getMotivoColor = (motivo: string) => {
    if (motivo.includes("qualidade") || motivo.includes("Problemas")) return "text-red-600";
    if (motivo.includes("Documentação") || motivo.includes("vencida")) return "text-orange-600";
    return "text-slate-600";
  };

  const getMotivoIcon = (motivo: string) => {
    if (motivo.includes("qualidade") || motivo.includes("Problemas")) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (motivo.includes("Documentação") || motivo.includes("vencida")) return <Calendar className="h-4 w-4 text-orange-500" />;
    return <User className="h-4 w-4 text-slate-500" />;
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
                <XCircle className="h-6 w-6 text-red-600" />
                Fornecedores Inativos
              </h1>
              <p className="text-slate-500 mt-1">
                Fornecedores que foram inativados por diversos motivos
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
                  <p className="text-sm text-slate-600">Total Inativos</p>
                  <p className="text-2xl font-bold">{fornecedoresInativos.length}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Podem Reativar</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fornecedoresInativos.filter(f => f.podeReativar).length}
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
                  <p className="text-sm text-slate-600">Problemas Qualidade</p>
                  <p className="text-2xl font-bold text-red-600">
                    {fornecedoresInativos.filter(f => f.motivoInativacao.includes("qualidade")).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Docs Vencidos</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {fornecedoresInativos.filter(f => f.motivoInativacao.includes("Documentação")).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fornecedores Inativos */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lista de Fornecedores</h2>
          
          {fornecedoresInativos.map((fornecedor) => (
            <Card key={fornecedor.id} className="transition-all hover:shadow-md border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {fornecedor.nome}
                        <XCircle className="h-4 w-4 text-red-500" />
                      </CardTitle>
                      <p className="text-sm text-slate-600">{fornecedor.cnpj}</p>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700">Inativo</Badge>
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
                      onClick={() => handleReativar(fornecedor)}
                      disabled={!fornecedor.podeReativar}
                      className="text-green-600 hover:text-green-700 disabled:text-slate-400"
                    >
                      {fornecedor.podeReativar ? 'Reativar' : 'Não Reativável'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoverDefinitivamente(fornecedor)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
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
                      <span className="font-medium">Data Inativação:</span>
                      <span className="text-slate-600">{fornecedor.dataInativacao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Inativado por:</span>
                      <span className="text-slate-600">{fornecedor.inativadoPor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Última Participação:</span>
                      <span className="text-slate-600">{fornecedor.ultimaParticipacao}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="font-medium">Motivo:</span>
                      <div className="flex items-center gap-1">
                        {getMotivoIcon(fornecedor.motivoInativacao)}
                        <span className={getMotivoColor(fornecedor.motivoInativacao)}>
                          {fornecedor.motivoInativacao}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="font-medium">Observações:</span>
                      <span className="text-slate-600">{fornecedor.observacoes}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Pode Reativar:</span>
                      <Badge variant="outline" className={fornecedor.podeReativar ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                        {fornecedor.podeReativar ? "Sim" : "Não"}
                      </Badge>
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

export default FornecedoresInativos;
