import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CriarMetaModalProps {
  aberto: boolean;
  onFechar: () => void;
}

export const CriarMetaModal = ({ aberto, onFechar }: CriarMetaModalProps) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipoMeta: '',
    categoria: '',
    indicador: '',
    unidadeMedida: '',
    valorMeta: '',
    responsavel: '',
    origemDados: '',
    frequenciaAvaliacao: ''
  });
  
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de criação da meta
    console.log('Meta criada:', { ...formData, dataInicio, dataFim });
    onFechar();
  };

  const handleInputChange = (campo: string, valor: string) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Save className="h-5 w-5" />
            Nova Meta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 border-b pb-2">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="titulo">Título da Meta *</Label>
                <Input
                  id="titulo"
                  placeholder="Ex: Saving Trimestral Q3"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descrição detalhada da meta..."
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label>Tipo de Meta *</Label>
                <Select value={formData.tipoMeta} onValueChange={(value) => handleInputChange('tipoMeta', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estrategica">Estratégica</SelectItem>
                    <SelectItem value="tatica">Tática</SelectItem>
                    <SelectItem value="operacional">Operacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requisicao">Requisições</SelectItem>
                    <SelectItem value="pedido">Pedidos</SelectItem>
                    <SelectItem value="sourcing">Sourcing</SelectItem>
                    <SelectItem value="fornecedor">Fornecedores</SelectItem>
                    <SelectItem value="contrato">Contratos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Configuração da Meta */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 border-b pb-2">Configuração da Meta</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Indicador (KPI) *</Label>
                <Select value={formData.indicador} onValueChange={(value) => handleInputChange('indicador', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saving">Saving</SelectItem>
                    <SelectItem value="sla">SLA</SelectItem>
                    <SelectItem value="prazo_medio">Prazo Médio</SelectItem>
                    <SelectItem value="quantidade">Quantidade</SelectItem>
                    <SelectItem value="qualidade">Qualidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Unidade de Medida *</Label>
                <Select value={formData.unidadeMedida} onValueChange={(value) => handleInputChange('unidadeMedida', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reais">R$ (Reais)</SelectItem>
                    <SelectItem value="percentual">% (Percentual)</SelectItem>
                    <SelectItem value="dias">Dias</SelectItem>
                    <SelectItem value="numero">Número</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="valorMeta">Valor da Meta *</Label>
                <Input
                  id="valorMeta"
                  type="number"
                  placeholder="Ex: 500000"
                  value={formData.valorMeta}
                  onChange={(e) => handleInputChange('valorMeta', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Responsável *</Label>
                <Select value={formData.responsavel} onValueChange={(value) => handleInputChange('responsavel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joao_silva">João Silva</SelectItem>
                    <SelectItem value="maria_santos">Maria Santos</SelectItem>
                    <SelectItem value="pedro_costa">Pedro Costa</SelectItem>
                    <SelectItem value="equipe_sourcing">Equipe Sourcing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Período e Configurações */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 border-b pb-2">Período e Configurações</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Data de Início *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataInicio ? format(dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecione..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataInicio}
                      onSelect={setDataInicio}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Data de Fim *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataFim ? format(dataFim, "dd/MM/yyyy", { locale: ptBR }) : "Selecione..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataFim}
                      onSelect={setDataFim}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Origem dos Dados *</Label>
                <Select value={formData.origemDados} onValueChange={(value) => handleInputChange('origemDados', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="integracao">Integração Automática</SelectItem>
                    <SelectItem value="manual">Atualização Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Frequência de Avaliação *</Label>
                <Select value={formData.frequenciaAvaliacao} onValueChange={(value) => handleInputChange('frequenciaAvaliacao', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onFechar}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Criar Meta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};