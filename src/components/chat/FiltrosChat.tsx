
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Building, ShoppingBag, FileText, MessageCircle } from "lucide-react";
import { FiltroChat, ContextoChat } from "@/types/mensagens";

interface FiltrosChatProps {
  filtros: FiltroChat;
  onFiltrosChange: (filtros: FiltroChat) => void;
  onFechar: () => void;
}

export const FiltrosChat = ({ filtros, onFiltrosChange, onFechar }: FiltrosChatProps) => {
  const contextos: { value: ContextoChat; label: string; icon: any; color: string }[] = [
    { value: 'gestao_fornecedores', label: 'Gestão de Fornecedores', icon: Building, color: 'bg-blue-100 text-blue-700' },
    { value: 'cotacoes', label: 'Cotações', icon: ShoppingBag, color: 'bg-green-100 text-green-700' },
    { value: 'propostas', label: 'Propostas', icon: FileText, color: 'bg-orange-100 text-orange-700' },
    { value: 'documentos', label: 'Documentos', icon: FileText, color: 'bg-purple-100 text-purple-700' },
    { value: 'pedidos_contratos', label: 'Pedidos/Contratos', icon: FileText, color: 'bg-red-100 text-red-700' },
    { value: 'assistente_virtual', label: 'IA Rê', icon: MessageCircle, color: 'bg-indigo-100 text-indigo-700' }
  ];

  const handleContextoChange = (contexto: ContextoChat, checked: boolean) => {
    const novosFiltros = { ...filtros };
    
    if (checked) {
      novosFiltros.contexto = [...(filtros.contexto || []), contexto];
    } else {
      novosFiltros.contexto = (filtros.contexto || []).filter(c => c !== contexto);
    }
    
    onFiltrosChange(novosFiltros);
  };

  const handleLimparFiltros = () => {
    onFiltrosChange({});
  };

  const filtrosAtivos = (filtros.contexto?.length || 0) + 
                       (filtros.naoLidas ? 1 : 0) + 
                       (filtros.importantes ? 1 : 0);

  return (
    <div className="border rounded-lg p-3 bg-white space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Filtros</h3>
          {filtrosAtivos > 0 && (
            <Badge variant="outline" className="text-xs">
              {filtrosAtivos} ativo{filtrosAtivos > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          {filtrosAtivos > 0 && (
            <Button variant="ghost" size="sm" onClick={handleLimparFiltros} className="h-7 text-xs">
              Limpar
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onFechar} className="h-7 w-7">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Filtros por Contexto */}
      <div>
        <h4 className="text-xs font-medium text-slate-600 mb-2">Contexto</h4>
        <div className="space-y-2">
          {contextos.map((contexto) => {
            const Icon = contexto.icon;
            return (
              <div key={contexto.value} className="flex items-center space-x-2">
                <Checkbox
                  id={contexto.value}
                  checked={(filtros.contexto || []).includes(contexto.value)}
                  onCheckedChange={(checked) => 
                    handleContextoChange(contexto.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={contexto.value}
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                >
                  <Icon className="h-3 w-3" />
                  {contexto.label}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outros Filtros */}
      <div>
        <h4 className="text-xs font-medium text-slate-600 mb-2">Status</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="nao-lidas"
              checked={filtros.naoLidas || false}
              onCheckedChange={(checked) => 
                onFiltrosChange({ ...filtros, naoLidas: checked as boolean })
              }
            />
            <label
              htmlFor="nao-lidas"
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Apenas não lidas
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="importantes"
              checked={filtros.importantes || false}
              onCheckedChange={(checked) => 
                onFiltrosChange({ ...filtros, importantes: checked as boolean })
              }
            />
            <label
              htmlFor="importantes"
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Mensagens importantes
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
