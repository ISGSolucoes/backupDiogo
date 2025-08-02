import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText } from 'lucide-react';
import { toast } from "sonner";
import type { Fornecedor } from '@/types/fornecedor';

interface ExportarFornecedoresModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedores: Fornecedor[];
}

interface FiltrosExportacao {
  status: string[];
  categoria: string[];
  porte: string[];
  qualificado?: boolean;
}

export const ExportarFornecedoresModal: React.FC<ExportarFornecedoresModalProps> = ({
  open,
  onOpenChange,
  fornecedores
}) => {
  const [filtros, setFiltros] = useState<FiltrosExportacao>({
    status: [],
    categoria: [],
    porte: []
  });
  const [incluirTodos, setIncluirTodos] = useState(true);
  const [exportando, setExportando] = useState(false);

  const statusOptions = ['ativo', 'qualificado', 'preferido', 'em_qualificacao', 'pendente_aprovacao'];
  const categoriaOptions = ['Tecnologia', 'Materiais', 'Serviços', 'Construção', 'Alimentação'];
  const porteOptions = ['pequeno', 'medio', 'grande'];

  const aplicarFiltros = (fornecedores: Fornecedor[]): Fornecedor[] => {
    if (incluirTodos) return fornecedores;

    return fornecedores.filter(fornecedor => {
      const statusMatch = filtros.status.length === 0 || filtros.status.includes(fornecedor.status);
      const categoriaMatch = filtros.categoria.length === 0 || filtros.categoria.includes(fornecedor.categoria);
      const porteMatch = filtros.porte.length === 0 || filtros.porte.includes(fornecedor.porte);
      const qualificadoMatch = filtros.qualificado === undefined || fornecedor.qualificado === filtros.qualificado;

      return statusMatch && categoriaMatch && porteMatch && qualificadoMatch;
    });
  };

  const fornecedoresFiltrados = aplicarFiltros(fornecedores);

  const exportarCSV = () => {
    setExportando(true);
    
    try {
      const headers = ['id', 'cnpj', 'razao_social', 'email_principal', 'categoria', 'status', 'porte', 'cidade', 'uf'];
      
      const csvData = fornecedoresFiltrados.map(fornecedor => [
        fornecedor.id,
        fornecedor.cnpj,
        fornecedor.nome,
        'contato@' + fornecedor.nome.toLowerCase().replace(/\s+/g, '') + '.com', // Mock email
        fornecedor.categoria,
        fornecedor.status,
        fornecedor.porte,
        fornecedor.cidade,
        fornecedor.uf
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `fornecedores_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${fornecedoresFiltrados.length} fornecedores exportados com sucesso!`);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      toast.error('Erro ao exportar arquivo CSV');
    } finally {
      setExportando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Fornecedores (.CSV)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Opção de incluir todos */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="incluir-todos"
              checked={incluirTodos}
              onCheckedChange={(checked) => setIncluirTodos(checked === true)}
            />
            <Label htmlFor="incluir-todos" className="font-medium">
              Incluir todos os fornecedores ({fornecedores.length} total)
            </Label>
          </div>

          {/* Filtros */}
          {!incluirTodos && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">Filtros de Exportação</h3>
              
              {/* Status */}
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {statusOptions.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filtros.status.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFiltros(prev => ({
                              ...prev,
                              status: [...prev.status, status]
                            }));
                          } else {
                            setFiltros(prev => ({
                              ...prev,
                              status: prev.status.filter(s => s !== status)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                        {status.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categoria */}
              <div>
                <Label className="text-sm font-medium">Categoria</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categoriaOptions.map(categoria => (
                    <div key={categoria} className="flex items-center space-x-2">
                      <Checkbox
                        id={`categoria-${categoria}`}
                        checked={filtros.categoria.includes(categoria)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFiltros(prev => ({
                              ...prev,
                              categoria: [...prev.categoria, categoria]
                            }));
                          } else {
                            setFiltros(prev => ({
                              ...prev,
                              categoria: prev.categoria.filter(c => c !== categoria)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`categoria-${categoria}`} className="text-sm">
                        {categoria}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Porte */}
              <div>
                <Label className="text-sm font-medium">Porte</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {porteOptions.map(porte => (
                    <div key={porte} className="flex items-center space-x-2">
                      <Checkbox
                        id={`porte-${porte}`}
                        checked={filtros.porte.includes(porte)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFiltros(prev => ({
                              ...prev,
                              porte: [...prev.porte, porte]
                            }));
                          } else {
                            setFiltros(prev => ({
                              ...prev,
                              porte: prev.porte.filter(p => p !== porte)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`porte-${porte}`} className="text-sm capitalize">
                        {porte}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualificação */}
              <div>
                <Label className="text-sm font-medium">Qualificação</Label>
                <Select
                  value={filtros.qualificado?.toString() || 'todos'}
                  onValueChange={(value) => {
                    setFiltros(prev => ({
                      ...prev,
                      qualificado: value === 'todos' ? undefined : value === 'true'
                    }));
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="true">Apenas Qualificados</SelectItem>
                    <SelectItem value="false">Apenas Não Qualificados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Prévia da Exportação</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>{fornecedoresFiltrados.length}</strong> fornecedores serão incluídos no arquivo CSV
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Campos incluídos: ID, CNPJ, Razão Social, Email Principal, Categoria, Status, Porte, Cidade, UF
            </p>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={exportarCSV} 
              disabled={exportando || fornecedoresFiltrados.length === 0}
            >
              {exportando ? 'Exportando...' : 'Exportar CSV'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};