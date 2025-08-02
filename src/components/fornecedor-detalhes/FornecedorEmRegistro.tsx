
import React from "react";
import { Calendar, Mail, AlertCircle, X, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Fornecedor } from "@/types/fornecedor";
import { formatarData } from "@/utils/dateUtils";

interface FornecedorEmRegistroProps {
  fornecedor: Fornecedor & { dataConvite?: string; diasSemResposta?: number };
}

export const FornecedorEmRegistro = ({ fornecedor }: FornecedorEmRegistroProps) => {
  const handleReenviarConvite = () => {
    toast.success(`Convite reenviado para ${fornecedor.nome}`);
  };

  const handleCancelarRegistro = () => {
    toast.warning(`Confirmação necessária para cancelar registro de ${fornecedor.nome}`);
  };

  const diasSemResposta = fornecedor.diasSemResposta || 7;
  const dataConvite = fornecedor.dataConvite || "10/06/2025";

  return (
    <div className="space-y-6">
      {/* Cabeçalho Simplificado */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            {/* Nome e Status */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{fornecedor.nome}</h1>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  Em Registro
                </Badge>
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <span className="font-semibold">CNPJ:</span>
                <span className="ml-2">{fornecedor.cnpj}</span>
              </div>
              <div>
                <span className="font-semibold">Cidade:</span>
                <span className="ml-2">{fornecedor.cidade} - {fornecedor.uf}</span>
              </div>
              {fornecedor.categoria && (
                <div>
                  <span className="font-semibold">Categoria:</span>
                  <span className="ml-2">{fornecedor.categoria}</span>
                </div>
              )}
              {fornecedor.porte && (
                <div>
                  <span className="font-semibold">Porte:</span>
                  <span className="ml-2">{fornecedor.porte}</span>
                </div>
              )}
            </div>

            {/* Datas Importantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-slate-500">Data do convite:</span>
                <span className="font-medium">{formatarData(dataConvite)}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-slate-500">Sem resposta há:</span>
                <span className="font-medium text-amber-700">{diasSemResposta} dias</span>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Preenchimento da Ficha</span>
                <span className="font-medium text-amber-700">0%</span>
              </div>
              <Progress value={0} className="h-3 bg-slate-200" />
              <p className="text-xs text-slate-500 mt-1">Aguardando preenchimento do cadastro</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerta Principal */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Este fornecedor ainda não completou o cadastro.</strong>
          <br />
          Você pode reenviar o convite ou cancelar o registro.
        </AlertDescription>
      </Alert>

      {/* Ações Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleReenviarConvite} className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Reenviar Convite
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancelarRegistro}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Cancelar Registro
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documentos - Estado Vazio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📁 Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <div className="text-lg mb-2">Nenhum documento enviado</div>
            <p className="text-sm">O fornecedor precisa completar o cadastro para enviar documentos</p>
          </div>
        </CardContent>
      </Card>

      {/* Qualificação - Desabilitada */}
      <Card className="opacity-60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📝 Qualificação
            <Badge variant="secondary" className="ml-2">Indisponível</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-slate-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <div className="text-sm">
              <p className="font-medium mb-1">Qualificação indisponível</p>
              <p>Aguardando finalização do cadastro para iniciar processo de qualificação</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico - Limitado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🕓 Histórico de Registro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Convite enviado</div>
                <div className="text-xs text-slate-500">{formatarData(dataConvite)} - Sistema</div>
              </div>
            </div>
            
            {diasSemResposta > 3 && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Lembrete automático</div>
                  <div className="text-xs text-slate-500">
                    {formatarData(new Date(Date.now() - (diasSemResposta - 3) * 24 * 60 * 60 * 1000).toLocaleDateString())} - Sistema
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center py-4 text-slate-400 text-sm">
              Mais eventos aparecerão após o fornecedor completar o cadastro
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
