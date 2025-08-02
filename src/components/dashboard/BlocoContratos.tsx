import { FileText, AlertCircle, FileSignature, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SecaoContextual } from "./SecaoContextual";

export const BlocoContratos = () => {
  const contratosVencendo = [
    {
      id: "CNT-123",
      fornecedor: "Alpha Serviços",
      categoria: "Limpeza",
      vencimento: "15 dias",
      valor: "R$ 45.000/mês",
      criticidade: "alta"
    },
    {
      id: "CNT-124",
      fornecedor: "Gamma Segurança",
      categoria: "Segurança",
      vencimento: "12 dias", 
      valor: "R$ 28.000/mês",
      criticidade: "alta"
    }
  ];

  const pendentesAssinatura = [
    {
      id: "CNT-445",
      fornecedor: "Beta Corp",
      tipo: "Prestação de serviços",
      valorTotal: "R$ 120.000",
      diasPendente: 3
    }
  ];

  const proximosVencimentos = [
    {
      documento: "Certidão Negativa",
      fornecedor: "Delta Ltda",
      vencimento: "5 dias",
      status: "crítico"
    },
    {
      documento: "Alvará Sanitário",
      fornecedor: "Epsilon Foods",
      vencimento: "10 dias",
      status: "atenção"
    }
  ];

  return (
    <SecaoContextual
      titulo="Contratos & Documentos"
      icone={FileText}
      contador={contratosVencendo.length + pendentesAssinatura.length}
    >
      {/* Contratos Vencendo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            Contratos Vencendo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {contratosVencendo.map((contrato) => (
              <div key={contrato.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{contrato.id}</span>
                    <Badge variant="destructive" className="text-xs">
                      {contrato.vencimento}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{contrato.fornecedor} • {contrato.categoria}</p>
                  <p className="text-xs text-slate-500">{contrato.valor}</p>
                </div>
                <Button size="sm" className="text-xs">
                  Renovar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pendentes de Assinatura */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileSignature className="h-4 w-4 text-orange-500" />
            Pendentes de Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {pendentesAssinatura.map((contrato) => (
              <div key={contrato.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{contrato.id}</span>
                    {contrato.diasPendente > 2 && (
                      <Badge variant="outline" className="text-xs">
                        {contrato.diasPendente} dias
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{contrato.fornecedor}</p>
                  <p className="text-xs text-slate-500">{contrato.tipo} • {contrato.valorTotal}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Assinar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vencimento de Documentos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            Documentos Vencendo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {proximosVencimentos.map((doc, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="font-semibold text-sm">{doc.documento}</span>
                  <p className="text-sm text-slate-600">{doc.fornecedor}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-500">Vence em {doc.vencimento}</p>
                    <Badge 
                      variant={doc.status === "crítico" ? "destructive" : "outline"}
                      className="text-xs"
                    >
                      {doc.status}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Solicitar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </SecaoContextual>
  );
};