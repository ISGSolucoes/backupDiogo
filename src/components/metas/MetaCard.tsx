import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MoreHorizontal, User, Calendar, Target } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Meta {
  id: string;
  titulo: string;
  categoria: string;
  responsavel: string;
  valorMeta: number;
  valorAtual: number;
  status: 'verde' | 'amarelo' | 'vermelho';
  periodo: string;
  progresso: number;
}

interface MetaCardProps {
  meta: Meta;
}

export const MetaCard = ({ meta }: MetaCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verde': return 'bg-green-100 text-green-800 border-green-200';
      case 'amarelo': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'vermelho': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'verde': return 'bg-green-500';
      case 'amarelo': return 'bg-amber-500';
      case 'vermelho': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const formatarValor = (valor: number, categoria: string) => {
    if (categoria === 'Sourcing' || categoria === 'Financeiro') {
      return `R$ ${valor.toLocaleString('pt-BR')}`;
    }
    if (categoria === 'SLA' || categoria === 'Qualidade') {
      return `${valor}%`;
    }
    return valor.toString();
  };

  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-slate-900">{meta.titulo}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {meta.categoria}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Editar Meta</DropdownMenuItem>
              <DropdownMenuItem>Ver Histórico</DropdownMenuItem>
              <DropdownMenuItem>Atualizar Manualmente</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(meta.status)}`}>
            {meta.status === 'verde' && '✅ No Prazo'}
            {meta.status === 'amarelo' && '⚠️ Atenção'}
            {meta.status === 'vermelho' && '🚨 Crítica'}
          </div>
          <span className="text-sm font-medium text-slate-600">
            {meta.progresso.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Progresso</span>
            <span className="font-medium">
              {formatarValor(meta.valorAtual, meta.categoria)} / {formatarValor(meta.valorMeta, meta.categoria)}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${getProgressColor(meta.status)}`}
              style={{ width: `${Math.min(meta.progresso, 100)}%` }}
            />
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User className="h-4 w-4" />
            <span>{meta.responsavel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>{meta.periodo}</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Target className="h-4 w-4 mr-2" />
            Detalhes
          </Button>
          <Button size="sm" className="flex-1">
            Atualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};