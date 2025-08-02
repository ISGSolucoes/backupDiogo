
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { Categoria } from "@/types/categoria";

interface ArvoreCategoriaProps {
  filtros: {
    busca: string;
    criticidade: string;
    responsavel: string;
    status: string;
  };
  categoriaSelecionada: string | null;
  onCategoriaSelect: (id: string) => void;
}

export const ArvoreCategoria = ({ 
  filtros, 
  categoriaSelecionada, 
  onCategoriaSelect 
}: ArvoreCategoriaProps) => {
  const [expandidas, setExpandidas] = useState<string[]>(["1", "2", "3"]);

  // Mock data - em produção viria da API
  const categorias: Categoria[] = [
    {
      id: "1",
      nome_categoria: "Materiais Elétricos",
      descricao: "Componentes e materiais elétricos",
      nivel: 1,
      tipo_critico: "alto",
      tipo_impacto: "alto",
      score_risco: 8,
      score_complexidade: 7,
      responsavel_id: "user1",
      responsavel_nome: "João Silva",
      atualizado_em: "2024-01-15",
      total_fornecedores: 15,
      fornecedores_ativos: 12,
      gasto_acumulado: 850000,
      sla_medio: 95,
      status_revisao: "amarelo",
      ultima_revisao: "2023-09-01",
      subcategorias: [
        {
          id: "1-1",
          parent_id: "1",
          nome_categoria: "Cabos",
          descricao: "Cabos elétricos diversos",
          nivel: 2,
          tipo_critico: "alto",
          tipo_impacto: "medio",
          score_risco: 7,
          score_complexidade: 6,
          responsavel_id: "user1",
          responsavel_nome: "João Silva",
          atualizado_em: "2024-01-10",
          total_fornecedores: 8,
          fornecedores_ativos: 7,
          gasto_acumulado: 450000,
          sla_medio: 92,
          status_revisao: "vermelho",
          ultima_revisao: "2023-08-01"
        },
        {
          id: "1-2",
          parent_id: "1",
          nome_categoria: "Conectores",
          descricao: "Conectores e terminais",
          nivel: 2,
          tipo_critico: "medio",
          tipo_impacto: "medio",
          score_risco: 5,
          score_complexidade: 4,
          responsavel_id: "user1",
          responsavel_nome: "João Silva",
          atualizado_em: "2024-01-12",
          total_fornecedores: 7,
          fornecedores_ativos: 5,
          gasto_acumulado: 400000,
          sla_medio: 98,
          status_revisao: "verde",
          ultima_revisao: "2023-12-01"
        }
      ]
    },
    {
      id: "2",
      nome_categoria: "Serviços",
      descricao: "Serviços terceirizados",
      nivel: 1,
      tipo_critico: "medio",
      tipo_impacto: "alto",
      score_risco: 6,
      score_complexidade: 8,
      responsavel_id: "user2",
      responsavel_nome: "Maria Santos",
      atualizado_em: "2024-01-20",
      total_fornecedores: 25,
      fornecedores_ativos: 22,
      gasto_acumulado: 1200000,
      sla_medio: 87,
      status_revisao: "verde",
      ultima_revisao: "2024-01-01",
      subcategorias: [
        {
          id: "2-1",
          parent_id: "2",
          nome_categoria: "Manutenção",
          descricao: "Serviços de manutenção",
          nivel: 2,
          tipo_critico: "alto",
          tipo_impacto: "alto",
          score_risco: 7,
          score_complexidade: 9,
          responsavel_id: "user2",
          responsavel_nome: "Maria Santos",
          atualizado_em: "2024-01-18",
          total_fornecedores: 12,
          fornecedores_ativos: 10,
          gasto_acumulado: 800000,
          sla_medio: 85,
          status_revisao: "amarelo",
          ultima_revisao: "2023-11-01"
        }
      ]
    }
  ];

  const toggleExpansao = (categoriaId: string) => {
    setExpandidas(prev => 
      prev.includes(categoriaId) 
        ? prev.filter(id => id !== categoriaId)
        : [...prev, categoriaId]
    );
  };

  const getCriticidadeCor = (criticidade: string) => {
    const cores = {
      baixo: "bg-green-100 text-green-700",
      medio: "bg-yellow-100 text-yellow-700",
      alto: "bg-red-100 text-red-700"
    };
    return cores[criticidade as keyof typeof cores] || cores.baixo;
  };

  const getStatusCor = (status: string) => {
    const cores = {
      verde: "bg-green-500",
      amarelo: "bg-yellow-500",
      vermelho: "bg-red-500"
    };
    return cores[status as keyof typeof cores] || cores.verde;
  };

  const filtrarCategorias = (categoria: Categoria): boolean => {
    if (filtros.busca && !categoria.nome_categoria.toLowerCase().includes(filtros.busca.toLowerCase())) {
      return false;
    }
    if (filtros.criticidade && categoria.tipo_critico !== filtros.criticidade) {
      return false;
    }
    if (filtros.responsavel && categoria.responsavel_nome.toLowerCase() !== filtros.responsavel.toLowerCase()) {
      return false;
    }
    if (filtros.status && categoria.status_revisao !== filtros.status) {
      return false;
    }
    return true;
  };

  const renderCategoria = (categoria: Categoria, nivel: number = 0) => {
    if (!filtrarCategorias(categoria)) return null;

    const temSubcategorias = categoria.subcategorias && categoria.subcategorias.length > 0;
    const estaExpandida = expandidas.includes(categoria.id);
    const estaSelecionada = categoriaSelecionada === categoria.id;

    return (
      <div key={categoria.id} className="space-y-1">
        <div
          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
            estaSelecionada 
              ? "bg-blue-50 border-blue-200" 
              : "bg-white hover:bg-slate-50 border-slate-200"
          }`}
          style={{ marginLeft: `${nivel * 20}px` }}
          onClick={() => onCategoriaSelect(categoria.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              {temSubcategorias && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpansao(categoria.id);
                  }}
                >
                  {estaExpandida ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900">{categoria.nome_categoria}</span>
                  <div className={`w-2 h-2 rounded-full ${getStatusCor(categoria.status_revisao)}`} />
                </div>
                
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {categoria.fornecedores_ativos}/{categoria.total_fornecedores}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {(categoria.gasto_acumulado / 1000000).toFixed(1)}M
                  </div>
                  {categoria.score_risco >= 7 && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertTriangle className="h-3 w-3" />
                      Alto Risco
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getCriticidadeCor(categoria.tipo_critico)}>
                {categoria.tipo_critico}
              </Badge>
            </div>
          </div>
        </div>

        {temSubcategorias && estaExpandida && (
          <div className="space-y-1">
            {categoria.subcategorias!.map(sub => renderCategoria(sub, nivel + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {categorias.map(categoria => renderCategoria(categoria))}
    </div>
  );
};
