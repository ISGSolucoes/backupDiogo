import { Users, AlertTriangle, UserCheck, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SecaoContextual } from "./SecaoContextual";

export const BlocoFornecedoresContextual = () => {
  const fornecedoresPendentes = [
    {
      id: "F001",
      nome: "ABC Materiais Ltda",
      status: "Documentação incompleta",
      diasPendente: 4,
      etapa: "Compliance"
    },
    {
      id: "F002",
      nome: "XYZ Suprimentos",
      status: "Aguardando aprovação",
      diasPendente: 2,
      etapa: "Aprovação final"
    }
  ];

  const fornecedoresRisco = [
    {
      nome: "DEF Construção",
      risco: "Alto",
      motivo: "40% entregas atrasadas",
      ultimaAvaliacao: "15 dias"
    }
  ];

  const proximosContatos = [
    {
      fornecedor: "Beta Corp",
      tipo: "Reunião",
      data: "Amanhã, 14:00",
      assunto: "Renegociação contrato anual"
    }
  ];

  return (
    <SecaoContextual
      titulo="Fornecedores"
      icone={Users}
      contador={fornecedoresPendentes.length + fornecedoresRisco.length}
    >
      {/* Fornecedores Pendentes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-orange-500" />
            Pendentes de Aprovação
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {fornecedoresPendentes.map((fornecedor, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{fornecedor.nome}</span>
                    {fornecedor.diasPendente > 3 && (
                      <Badge variant="destructive" className="text-xs">
                        {fornecedor.diasPendente} dias
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{fornecedor.status}</p>
                  <p className="text-xs text-slate-500">Etapa: {fornecedor.etapa}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Analisar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Radar de Risco */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Radar de Risco
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {fornecedoresRisco.map((fornecedor, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{fornecedor.nome}</span>
                    <Badge variant="destructive" className="text-xs">
                      Risco {fornecedor.risco}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{fornecedor.motivo}</p>
                  <p className="text-xs text-slate-500">Última avaliação: {fornecedor.ultimaAvaliacao}</p>
                </div>
                <Button size="sm" variant="destructive" className="text-xs">
                  Revisar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Próximos Contatos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            Próximos Contatos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {proximosContatos.map((contato, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="font-semibold text-sm">{contato.fornecedor}</span>
                  <p className="text-sm text-slate-600">{contato.assunto}</p>
                  <p className="text-xs text-slate-500">{contato.tipo} • {contato.data}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Preparar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </SecaoContextual>
  );
};