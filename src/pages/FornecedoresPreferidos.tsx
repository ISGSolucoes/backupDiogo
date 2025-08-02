
import React from "react";
import { Star, ArrowLeft, RefreshCw, Award, TrendingUp, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Dados mock para fornecedores preferidos
const fornecedoresPreferidos = [
  {
    id: "1",
    nome: "Tech Solutions Ltda",
    cnpj: "12.345.678/0001-01",
    categoria: "Tecnologia",
    dataPreferido: "2024-01-20",
    scoreQualificacao: 95,
    numeroContratos: 8,
    valorTotalContratos: 450000,
    ultimaParticipacao: "2024-01-18",
    motivo: "Excelente performance em projetos anteriores"
  },
  {
    id: "2",
    nome: "Industrial Materials SA",
    cnpj: "98.765.432/0001-02",
    categoria: "Materiais",
    dataPreferido: "2024-01-15",
    scoreQualificacao: 92,
    numeroContratos: 12,
    valorTotalContratos: 780000,
    ultimaParticipacao: "2024-01-16",
    motivo: "Fornecedor estratégico com produtos de alta qualidade"
  },
  {
    id: "3",
    nome: "Serviços Premium ME",
    cnpj: "11.222.333/0001-03",
    categoria: "Serviços",
    dataPreferido: "2024-01-10",
    scoreQualificacao: 88,
    numeroContratos: 5,
    valorTotalContratos: 320000,
    ultimaParticipacao: "2024-01-12",
    motivo: "Especialista em soluções customizadas"
  }
];

const FornecedoresPreferidos = () => {
  const handleVerDetalhes = (fornecedor: any) => {
    toast.info(`Visualizando detalhes de ${fornecedor.nome}`);
  };

  const handleRemoverPreferido = (fornecedor: any) => {
    toast.warning(`${fornecedor.nome} removido dos preferidos`);
  };

  const handleNovoContrato = (fornecedor: any) => {
    toast.success(`Iniciando novo contrato com ${fornecedor.nome}`);
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
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
                <Star className="h-6 w-6 text-purple-600" />
                Fornecedores Preferidos
              </h1>
              <p className="text-slate-500 mt-1">
                Fornecedores com status preferencial para contratações
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
                  <p className="text-sm text-slate-600">Total Preferidos</p>
                  <p className="text-2xl font-bold">{fornecedoresPreferidos.length}</p>
                </div>
                <Star className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Score Médio</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(fornecedoresPreferidos.reduce((acc, f) => acc + f.scoreQualificacao, 0) / fornecedoresPreferidos.length)}
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
                  <p className="text-sm text-slate-600">Contratos Ativos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fornecedoresPreferidos.reduce((acc, f) => acc + f.numeroContratos, 0)}
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
                  <p className="text-sm text-slate-600">Valor Total</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatarValor(fornecedoresPreferidos.reduce((acc, f) => acc + f.valorTotalContratos, 0))}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fornecedores Preferidos */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lista de Fornecedores</h2>
          
          {fornecedoresPreferidos.map((fornecedor) => (
            <Card key={fornecedor.id} className="transition-all hover:shadow-md border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {fornecedor.nome}
                        <Star className="h-4 w-4 text-purple-500 fill-purple-500" />
                      </CardTitle>
                      <p className="text-sm text-slate-600">{fornecedor.cnpj}</p>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">Preferido</Badge>
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
                      onClick={() => handleNovoContrato(fornecedor)}
                      className="text-green-600 hover:text-green-700"
                    >
                      Novo Contrato
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoverPreferido(fornecedor)}
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
                      <span className="font-medium">Preferido desde:</span>
                      <span className="text-slate-600">{fornecedor.dataPreferido}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Última Participação:</span>
                      <span className="text-slate-600">{fornecedor.ultimaParticipacao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Motivo:</span>
                      <span className="text-slate-600">{fornecedor.motivo}</span>
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
                      <span className="font-medium">Contratos Ativos:</span>
                      <span className="text-slate-600">{fornecedor.numeroContratos}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Valor Total:</span>
                      <span className="text-slate-600 font-semibold">{formatarValor(fornecedor.valorTotalContratos)}</span>
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

export default FornecedoresPreferidos;
