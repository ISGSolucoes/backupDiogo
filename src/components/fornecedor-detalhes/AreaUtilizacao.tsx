
import React, { useState } from "react";
import { Building, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtilizacaoArea } from "@/types/fornecedor";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface AreaUtilizacaoProps {
  utilizacoes: UtilizacaoArea[];
}

export const AreaUtilizacao = ({ utilizacoes }: AreaUtilizacaoProps) => {
  const [areaAtiva, setAreaAtiva] = useState<string | null>(null);
  
  const exportarHistorico = (area: string) => {
    toast.success(`Exportando histórico da área ${area}`);
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#83a6ed'];
  
  // Função para abreviar nomes de áreas
  const abreviarNome = (nome: string): string => {
    if (nome.length <= 3) return nome;
    // Pega as 3 primeiras letras do nome
    return nome.substring(0, 3);
  };

  const getGrafico = () => {
    // Calcular total de participações para percentuais
    const totalParticipacoes = utilizacoes.reduce((total, item) => total + item.participacoes, 0);
    
    // Preparar os dados para o gráfico de pizza
    const data = utilizacoes.map((utilizacao, index) => ({
      name: utilizacao.area,
      shortName: abreviarNome(utilizacao.area),
      value: utilizacao.participacoes,
      percent: ((utilizacao.participacoes / totalParticipacoes) * 100).toFixed(0),
      color: COLORS[index % COLORS.length]
    }));
    
    const renderCustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-xs">
            <p className="font-medium">Área: {data.name}</p>
            <p>Participações: {data.value} ({data.percent}%)</p>
          </div>
        );
      }
      return null;
    };
    
    // Verificar se precisamos usar legenda lateral (quando temos mais de 4 áreas)
    const useLegend = utilizacoes.length > 4;
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={useLegend ? 45 : 35}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={(entry) => {
              // Fixing the label function to return a React element instead of an object
              return <text x={entry.x} y={entry.y} fill="#333" fontSize="12px" textAnchor="middle">
                {`${entry.shortName} (${entry.percent}%)`}
              </text>
            }}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={renderCustomTooltip} />
          {useLegend && (
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value, entry: any, index) => (
                <span style={{ fontSize: '14px', color: '#333' }}>
                  {value} ({data[index].percent}%)
                </span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 md:mb-0">
          <Building className="h-5 w-5" /> Área de Utilização
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Área</TableHead>
                  <TableHead className="text-xs">Participações</TableHead>
                  <TableHead className="text-xs">Nota Média</TableHead>
                  <TableHead className="text-xs">Última Participação</TableHead>
                  <TableHead className="text-xs">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utilizacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500 text-xs">
                      Nenhuma utilização encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  utilizacoes.map((utilizacao) => (
                    <TableRow key={utilizacao.area} className={areaAtiva === utilizacao.area ? "bg-slate-50" : ""}>
                      <TableCell className="font-medium text-xs">{utilizacao.area}</TableCell>
                      <TableCell className="text-xs">{utilizacao.participacoes}</TableCell>
                      <TableCell className="text-xs">
                        {utilizacao.notaMedia ? utilizacao.notaMedia.toFixed(1) : "-"}
                      </TableCell>
                      <TableCell className="text-xs">{utilizacao.ultimaParticipacao || "-"}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center text-xs h-7"
                          onClick={() => exportarHistorico(utilizacao.area)}
                        >
                          <Download className="h-3 w-3 mr-1" /> Exportar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-sm">Distribuição por Área</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-52">{getGrafico()}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
