
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimelineCicloVida } from "./raio-x/TimelineCicloVida";
import { IndicadoresEstrategicos } from "./raio-x/IndicadoresEstrategicos";
import { DashboardVisual } from "./raio-x/DashboardVisual";
import { SugestoesIA } from "./raio-x/SugestoesIA";
import { Fornecedor } from "@/types/fornecedor";

interface RaioXFornecedorProps {
  fornecedor: Fornecedor;
}

export const RaioXFornecedor = ({ fornecedor }: RaioXFornecedorProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🔎</span>
        <h2 className="text-2xl font-bold">Raio-X Estratégico</h2>
        <span className="text-lg font-medium text-muted-foreground">
          {fornecedor.nome}
        </span>
      </div>

      {/* Timeline do Ciclo de Vida */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>⏳</span>
            Timeline do Ciclo de Vida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TimelineCicloVida fornecedor={fornecedor} />
        </CardContent>
      </Card>

      {/* Indicadores Transacionais e Estratégicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            Indicadores Transacionais e Estratégicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IndicadoresEstrategicos fornecedor={fornecedor} />
        </CardContent>
      </Card>

      {/* Dashboard Visual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📈</span>
            Dashboard Visual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardVisual fornecedor={fornecedor} />
        </CardContent>
      </Card>

      {/* Sugestões Estratégicas com IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🧠</span>
            Sugestões Estratégicas com IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SugestoesIA fornecedor={fornecedor} />
        </CardContent>
      </Card>
    </div>
  );
};
