import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  SlidersHorizontal,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FiltrosPedidos as FiltrosPedidosType, StatusPedido } from "@/types/pedido";

interface FiltrosPedidosProps {
  filtros: FiltrosPedidosType;
  setFiltros: (filtros: FiltrosPedidosType) => void;
  termoBusca: string;
  setTermoBusca: (termo: string) => void;
  onExportar: () => void;
  totalRegistros: number;
}

export function FiltrosPedidos({ 
  filtros, 
  setFiltros, 
  termoBusca, 
  setTermoBusca,
  onExportar,
  totalRegistros
}: FiltrosPedidosProps) {
  const statusOptions = [
    { value: 'rascunho', label: 'Rascunho' },
    { value: 'aguardando_aprovacao', label: 'Aguardando Aprovação' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const fornecedoresOptions = [
    { value: '1', label: 'Tech Solutions Ltda' },
    { value: '2', label: 'ABC Materiais de Escritório' },
    { value: '3', label: 'Equipamentos Industriais LTDA' }
  ];

  const handleStatusChange = (status: StatusPedido) => {
    const statusAtuais = filtros.status || [];
    const novoStatus = statusAtuais.includes(status)
      ? statusAtuais.filter(s => s !== status)
      : [...statusAtuais, status];
    
    setFiltros({ ...filtros, status: novoStatus.length > 0 ? novoStatus : undefined });
  };

  const limparFiltros = () => {
    setFiltros({});
    setTermoBusca('');
  };

  const contadorFiltrosAtivos = () => {
    let contador = 0;
    if (filtros.status && filtros.status.length > 0) contador++;
    if (filtros.fornecedor_id) contador++;
    if (filtros.data_inicio) contador++;
    if (filtros.data_fim) contador++;
    if (filtros.valor_min) contador++;
    if (filtros.valor_max) contador++;
    if (termoBusca) contador++;
    return contador;
  };

  const filtrosAtivos = contadorFiltrosAtivos();

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
            {filtrosAtivos > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filtrosAtivos} filtro{filtrosAtivos > 1 ? 's' : ''} ativo{filtrosAtivos > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {totalRegistros} resultado{totalRegistros !== 1 ? 's' : ''}
            </span>
            {filtrosAtivos > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={limparFiltros}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Busca Global */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por número, fornecedor, observações..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="pl-10 pr-4"
          />
          {termoBusca && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTermoBusca('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filtros Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <div className="flex flex-wrap gap-1">
              {statusOptions.map((status) => (
                <Badge
                  key={status.value}
                  variant={filtros.status?.includes(status.value as StatusPedido) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors text-xs"
                  onClick={() => handleStatusChange(status.value as StatusPedido)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Fornecedor */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Fornecedor</Label>
            <Select 
              value={filtros.fornecedor_id || "todos"} 
              onValueChange={(value) => setFiltros({ ...filtros, fornecedor_id: value === "todos" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os fornecedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os fornecedores</SelectItem>
                {fornecedoresOptions.map((fornecedor) => (
                  <SelectItem key={fornecedor.value} value={fornecedor.value}>
                    {fornecedor.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Início */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Data Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filtros.data_inicio && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filtros.data_inicio 
                    ? format(new Date(filtros.data_inicio), "dd/MM/yyyy", { locale: ptBR })
                    : "Selecionar data"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filtros.data_inicio ? new Date(filtros.data_inicio) : undefined}
                  onSelect={(date) => setFiltros({ 
                    ...filtros, 
                    data_inicio: date ? date.toISOString().split('T')[0] : undefined 
                  })}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data Fim */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Data Fim</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filtros.data_fim && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filtros.data_fim 
                    ? format(new Date(filtros.data_fim), "dd/MM/yyyy", { locale: ptBR })
                    : "Selecionar data"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filtros.data_fim ? new Date(filtros.data_fim) : undefined}
                  onSelect={(date) => setFiltros({ 
                    ...filtros, 
                    data_fim: date ? date.toISOString().split('T')[0] : undefined 
                  })}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Filtros de Valor */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Valor Mínimo</Label>
            <Input
              type="number"
              placeholder="R$ 0,00"
              value={filtros.valor_min || ''}
              onChange={(e) => setFiltros({ 
                ...filtros, 
                valor_min: e.target.value ? parseFloat(e.target.value) : undefined 
              })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Valor Máximo</Label>
            <Input
              type="number"
              placeholder="R$ 999.999,99"
              value={filtros.valor_max || ''}
              onChange={(e) => setFiltros({ 
                ...filtros, 
                valor_max: e.target.value ? parseFloat(e.target.value) : undefined 
              })}
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Filtros aplicados em tempo real
            </span>
          </div>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={onExportar}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}