
import React from "react";
import { CheckCircle, ArrowLeft, RefreshCw, Star, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Dados mock para fornecedores qualificados
const fornecedoresQualificados = [
  {
    id: "1",
    nome: "Tech Solutions Ltda",
    cnpj: "12.345.678/0001-01",
    categoria: "Tecnologia",
    dataQualificacao: "2024-01-15",
    scoreQualificacao: 85,
    areasQualificadas: ["Desenvolvimento", "Suporte"],
    proximaReavaliacao: "2024-07-15",
    status: "ativo"
  },
  {
    id: "2",
    nome: "Industrial Materials SA",
    cnpj: "98.765.432/0001-02",
    categoria: "Materiais",
    dataQualificacao: "2024-01-12",
    scoreQualificacao: 92,
    areasQualificadas: ["Matéria Prima", "Logística"],
    proximaReavaliacao: "2024-07-12",
    status: "ativo"
  },
  {
    id: "3",
    nome: "Serviços Especializados ME",
    cnpj: "11.222.333/0001-03",
    categoria: "Serviços",
    dataQualificacao: "2024-01-10",
    scoreQualificacao: 78,
    areasQualificadas: ["Consultoria"],
    proximaReavaliacao: "2024-07-10",
    status: "ativo"
  }
];

const FornecedoresQualificados = () => {
  const handleVerDetalhes = (fornecedor: any) => {
    toast.info(`Visualizando detalhes de ${fornecedor.nome}`);
  };

  const handleTornarPreferido = (fornecedor: any) => {
    toast.success(`${fornecedor.nome} adicionado aos preferidos`);
  };

  const handleReavaliacao = (fornecedor: any) => {
    toast.info(`Iniciando reavaliação de ${fornecedor.nome}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    return "text-orange-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return <Badge variant="outline" className="bg-green-50 text-green-700">Excelente</Badge>;
    if (score >= 70) return <Badge variant="outline" className="bg-blue-50 text-blue-700">Bom</Badge>;
    return <Badge variant="outline" className="bg-orange-50 text-orange-700">Regular</Badge>;
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
                <CheckCircle className="h-6 w-6 text-green-600" />
                Fornecedores Qualificados
              </h1>
              <p className="text-slate-500 mt-1">
                Fornecedores que passaram pelo processo de qualificação
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
                  <p className="text-sm text-slate-600">Total Qualificados</p>
                  <p className="text-2xl font-bold">{fornecedoresQualificados.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Score Médio</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(fornecedoresQualificados.reduce((acc, f) => acc + f.scoreQualificacao, 0) / fornecedoresQualificados.length)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Excelentes ({'>'}85)</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fornecedoresQualificados.filter(f => f.scoreQualificacao >= 85).length}
                  </p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Próximas Reavaliações</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {fornecedoresQualificados.filter(f => new Date(f.proximaReavaliacao) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
                  </p>
                </div>
                <RefreshCw className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fornecedores Qualificados */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lista de Fornecedores</h2>
          
          {fornecedoresQualificados.map((fornecedor) => (
            <Card key={fornecedor.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                      <p className="text-sm text-slate-600">{fornecedor.cnpj}</p>
                    </div>
                    {getScoreBadge(fornecedor.scoreQualificacao)}
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
                      onClick={() => handleTornarPreferido(fornecedor)}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Tornar Preferido
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReavaliacao(fornecedor)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Reavaliar
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
                      <span className="font-medium">Data Qualificação:</span>
                      <span className="text-slate-600">{fornecedor.dataQualificacao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Próxima Reavaliação:</span>
                      <span className="text-slate-600">{fornecedor.proximaReavaliacao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Áreas Qualificadas:</span>
                      <span className="text-slate-600">{fornecedor.areasQualificadas.join(", ")}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Score de Qualificação:</span>
                        <span className={`font-bold ${getScoreColor(fornecedor.scoreQualificacao)}`}>
                          {fornecedor.scoreQualificacao}%
                        </span>
                      </div>
                      <Progress value={fornecedor.scoreQualificacao} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Status:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Qualificado</Badge>
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

export default FornecedoresQualificados;
