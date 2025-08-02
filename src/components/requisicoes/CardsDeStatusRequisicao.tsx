
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardStatusProps {
  title: string;
  value: number | string;
  color?: string;
}

const CardStatus = ({ title, value, color = "text-slate-800" }: CardStatusProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-medium text-slate-600">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </CardContent>
  </Card>
);

interface CardsDeStatusRequisicaoProps {
  totalRequisicoes: number;
  totalPendentes: number;
  totalEmCotacao: number;
  totalFinalizadas: number;
  totalAtrasadas: number;
  valorTotal: number;
}

export const CardsDeStatusRequisicao = ({
  totalRequisicoes,
  totalPendentes,
  totalEmCotacao,
  totalFinalizadas,
  totalAtrasadas,
  valorTotal
}: CardsDeStatusRequisicaoProps) => {
  // Formatar o valor para moeda brasileira
  const valorFormatado = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(valorTotal);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <CardStatus title="Em Andamento" value={totalRequisicoes} />
      <CardStatus title="Aguardando" value={totalPendentes} color="text-amber-600" />
      <CardStatus title="Em Cotação" value={totalEmCotacao} color="text-purple-600" />
      <CardStatus title="Finalizadas" value={totalFinalizadas} color="text-green-600" />
      <CardStatus title="Atrasadas" value={totalAtrasadas} color="text-red-600" />
      <CardStatus title="Valor Total" value={valorFormatado} />
    </div>
  );
};
