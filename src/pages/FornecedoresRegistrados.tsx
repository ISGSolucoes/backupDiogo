
import React from "react";
import { FileText, ArrowLeft, RefreshCw, User, Calendar, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

// Dados mock para fornecedores registrados
const fornecedoresRegistrados = [
  {
    id: "1",
    nome: "Tech Solutions Ltda",
    cnpj: "12.345.678/0001-01",
    categoria: "Tecnologia",
    dataCadastro: "2024-01-15",
    ultimaAtualizacao: "2024-01-20",
    porte: "Médio",
    cidade: "São Paulo",
    uf: "SP",
    status: "ativo"
  },
  {
    id: "2",
    nome: "Industrial Materials SA",
    cnpj: "98.765.432/0001-02",
    categoria: "Materiais",
    dataCadastro: "2024-01-12",
    ultimaAtualizacao: "2024-01-18",
    porte: "Grande",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    status: "ativo"
  },
  {
    id: "3",
    nome: "Serviços Especializados ME",
    cnpj: "11.222.333/0001-03",
    categoria: "Serviços",
    dataCadastro: "2024-01-10",
    ultimaAtualizacao: "2024-01-16",
    porte: "Pequeno",
    cidade: "Belo Horizonte",
    uf: "MG",
    status: "ativo"
  }
];

const FornecedoresRegistrados = () => {
  const handleVerDetalhes = (fornecedor: any) => {
    toast.info(`Visualizando detalhes de ${fornecedor.nome}`);
  };

  const handleIniciarQualificacao = (fornecedor: any) => {
    toast.success(`Iniciando qualificação para ${fornecedor.nome}`);
  };

  const getPorteBadge = (porte: string) => {
    switch (porte) {
      case "Grande":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Grande</Badge>;
      case "Médio":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Médio</Badge>;
      case "Pequeno":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">Pequeno</Badge>;
      default:
        return <Badge variant="outline">Não informado</Badge>;
    }
  };

  return (
    <TooltipProvider>
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
                  <FileText className="h-6 w-6 text-blue-600" />
                  Fornecedores Registrados
                </h1>
                <p className="text-slate-500 mt-1">
                  Fornecedores que completaram o cadastro na plataforma
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
                    <p className="text-sm text-slate-600">Total Registrados</p>
                    <p className="text-2xl font-bold">{fornecedoresRegistrados.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="cursor-help">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Porte Grande</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {fornecedoresRegistrados.filter(f => f.porte === 'Grande').length}
                        </p>
                      </div>
                      <Building className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3">
                <div className="space-y-1">
                  <p className="font-medium text-sm">Porte Grande</p>
                  <p className="text-xs text-muted-foreground">
                    • Faturamento: Acima de R$ 300 milhões/ano<br/>
                    • Funcionários: Mais de 500<br/>
                    • Ex: Multinacionais, grandes corporações
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="cursor-help">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Porte Médio</p>
                        <p className="text-2xl font-bold text-green-600">
                          {fornecedoresRegistrados.filter(f => f.porte === 'Médio').length}
                        </p>
                      </div>
                      <Building className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3">
                <div className="space-y-1">
                  <p className="font-medium text-sm">Porte Médio</p>
                  <p className="text-xs text-muted-foreground">
                    • Faturamento: R$ 16 mi a R$ 300 mi/ano<br/>
                    • Funcionários: 100 a 500<br/>
                    • Ex: Empresas regionais, indústrias médias
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="cursor-help">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Porte Pequeno</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {fornecedoresRegistrados.filter(f => f.porte === 'Pequeno').length}
                        </p>
                      </div>
                      <Building className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3">
                <div className="space-y-1">
                  <p className="font-medium text-sm">Porte Pequeno</p>
                  <p className="text-xs text-muted-foreground">
                    • Faturamento: Até R$ 16 mi/ano<br/>
                    • Funcionários: Até 100<br/>
                    • Ex: ME, EPP, empresas familiares
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

        {/* Lista de Fornecedores Registrados */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lista de Fornecedores</h2>
          
          {fornecedoresRegistrados.map((fornecedor) => (
            <Card key={fornecedor.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                      <p className="text-sm text-slate-600">{fornecedor.cnpj}</p>
                    </div>
                    {getPorteBadge(fornecedor.porte)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleVerDetalhes(fornecedor)}
                    >
                      <User className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleIniciarQualificacao(fornecedor)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Iniciar Qualificação
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
                      <span className="font-medium">Localização:</span>
                      <span className="text-slate-600">{fornecedor.cidade}/{fornecedor.uf}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Porte:</span>
                      <span className="text-slate-600">{fornecedor.porte}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Data de Cadastro:</span>
                      <span className="text-slate-600">{fornecedor.dataCadastro}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Última Atualização:</span>
                      <span className="text-slate-600">{fornecedor.ultimaAtualizacao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Status:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Ativo</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default FornecedoresRegistrados;
