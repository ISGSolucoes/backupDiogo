
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, User, Building2, Calendar, Mail } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DadosDuplicidade {
  id: string;
  razao_social?: string;
  nome_completo?: string;
  cidade: string;
  created_at: string;
  contato_nome: string;
  contato_email: string;
}

interface AlertaDuplicidadeProps {
  tipo: "cnpj" | "cpf";
  documento: string;
  dados: DadosDuplicidade;
  onContinuar: () => void;
  onCancelar: () => void;
}

export const AlertaDuplicidade = ({ 
  tipo, 
  documento, 
  dados, 
  onContinuar, 
  onCancelar 
}: AlertaDuplicidadeProps) => {
  const formatarData = (data: string) => {
    return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
  };

  const getTitulo = () => {
    if (tipo === "cnpj") {
      return "CNPJ já cadastrado";
    }
    return "CPF já cadastrado";
  };

  const getDescricao = () => {
    if (tipo === "cnpj") {
      return `O CNPJ ${documento} já está cadastrado em nossa base de dados.`;
    }
    return `O CPF ${documento} já está cadastrado como fornecedor.`;
  };

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{getTitulo()}</AlertTitle>
        <AlertDescription>
          {getDescricao()}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {tipo === "cnpj" ? (
              <Building2 className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
            Dados do Cadastro Existente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {tipo === "cnpj" ? (
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-medium">
                  {tipo === "cnpj" ? "Razão Social:" : "Nome Completo:"}
                </span>
              </div>
              <p className="text-sm">
                {dados.razao_social || dados.nome_completo}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Data do Cadastro:</span>
              </div>
              <p className="text-sm">
                {formatarData(dados.created_at)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Responsável:</span>
              </div>
              <p className="text-sm">{dados.contato_nome}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">E-mail:</span>
              </div>
              <p className="text-sm">{dados.contato_email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button 
          onClick={onContinuar}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          {tipo === "cnpj" ? "Continuar com Novo Registro" : "Entrar em Contato"}
        </Button>
      </div>
    </div>
  );
};
