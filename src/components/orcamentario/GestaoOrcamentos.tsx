
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OrcamentoItem {
  id: string;
  centro_custo: string;
  categoria?: string;
  projeto?: string;
  valor_total: number;
  valor_utilizado: number;
  valor_reservado: number;
  valor_disponivel: number;
  ano: number;
}

export const GestaoOrcamentos = () => {
  const [orcamentos, setOrcamentos] = useState<OrcamentoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<OrcamentoItem | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    centro_custo: '',
    categoria: '',
    projeto: '',
    valor_total: 0,
    ano: new Date().getFullYear()
  });

  const carregarOrcamentos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('ano', new Date().getFullYear())
        .order('centro_custo');

      if (error) throw error;
      setOrcamentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os orçamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const salvarOrcamento = async () => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('orcamentos')
          .update({
            centro_custo: formData.centro_custo,
            categoria: formData.categoria || null,
            projeto: formData.projeto || null,
            valor_total: formData.valor_total,
            valor_disponivel: formData.valor_total - editingItem.valor_utilizado - editingItem.valor_reservado
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('orcamentos')
          .insert({
            centro_custo: formData.centro_custo,
            categoria: formData.categoria || null,
            projeto: formData.projeto || null,
            valor_total: formData.valor_total,
            valor_disponivel: formData.valor_total,
            ano: formData.ano
          });

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Orçamento salvo com sucesso.",
      });

      setShowAddModal(false);
      setEditingItem(null);
      setFormData({
        centro_custo: '',
        categoria: '',
        projeto: '',
        valor_total: 0,
        ano: new Date().getFullYear()
      });
      carregarOrcamentos();
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o orçamento.",
        variant: "destructive",
      });
    }
  };

  const excluirOrcamento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orcamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Orçamento excluído com sucesso.",
      });

      carregarOrcamentos();
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o orçamento.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast({
      title: "Info",
      description: "Funcionalidade de importação será implementada em breve.",
    });
  };

  const downloadTemplate = () => {
    const csvContent = "centro_custo,categoria,projeto,valor_total,ano\nTI,,Sistema X,10000,2025\nMarketing,Eventos,,5000,2025";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_orcamento.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (item: OrcamentoItem) => {
    const percentualUsado = ((item.valor_utilizado + item.valor_reservado) / item.valor_total) * 100;
    if (percentualUsado >= 95) return 'destructive';
    if (percentualUsado >= 80) return 'secondary';
    return 'default';
  };

  const getStatusText = (item: OrcamentoItem) => {
    const percentualUsado = ((item.valor_utilizado + item.valor_reservado) / item.valor_total) * 100;
    if (percentualUsado >= 95) return 'Crítico';
    if (percentualUsado >= 80) return 'Atenção';
    return 'Normal';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gestão de Orçamentos</h2>
        <div className="flex gap-2">
          <Button onClick={downloadTemplate} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Template
          </Button>
          <Button onClick={() => document.getElementById('file-upload')?.click()} variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Editar Orçamento' : 'Adicionar Orçamento'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Centro de Custo</label>
                  <Input
                    value={formData.centro_custo}
                    onChange={(e) => setFormData({...formData, centro_custo: e.target.value})}
                    placeholder="Ex: TI, Marketing, Produção"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Categoria (Opcional)</label>
                  <Input
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    placeholder="Ex: Software, Eventos, Materiais"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Projeto (Opcional)</label>
                  <Input
                    value={formData.projeto}
                    onChange={(e) => setFormData({...formData, projeto: e.target.value})}
                    placeholder="Ex: Sistema X, Campanha Y"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Valor Total</label>
                  <Input
                    type="number"
                    value={formData.valor_total}
                    onChange={(e) => setFormData({...formData, valor_total: parseFloat(e.target.value) || 0})}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Ano</label>
                  <Select value={formData.ano.toString()} onValueChange={(value) => setFormData({...formData, ano: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                  }}>
                    Cancelar
                  </Button>
                  <Button onClick={salvarOrcamento}>
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <input
        id="file-upload"
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
      />

      <Card>
        <CardHeader>
          <CardTitle>Orçamentos {new Date().getFullYear()}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centro de Custo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Utilizado</TableHead>
                <TableHead>Reservado</TableHead>
                <TableHead>Disponível</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orcamentos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.centro_custo}</TableCell>
                  <TableCell>{item.categoria || '-'}</TableCell>
                  <TableCell>{item.projeto || '-'}</TableCell>
                  <TableCell>R$ {item.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ {item.valor_utilizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ {item.valor_reservado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ {item.valor_disponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item)}>
                      {getStatusText(item)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingItem(item);
                          setFormData({
                            centro_custo: item.centro_custo,
                            categoria: item.categoria || '',
                            projeto: item.projeto || '',
                            valor_total: item.valor_total,
                            ano: item.ano
                          });
                          setShowAddModal(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => excluirOrcamento(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
