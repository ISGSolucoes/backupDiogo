import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FeatureFlag } from '@/types/modular';
import { ToggleLeft, Settings, Info, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface FeatureFlagConfigProps {
  flag: FeatureFlag;
  onUpdate: (flagId: string, enabled: boolean) => void;
  trigger: React.ReactNode;
}

export const FeatureFlagConfig = ({ flag, onUpdate, trigger }: FeatureFlagConfigProps) => {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState(flag.config || {});

  const getFeatureFlagDescription = (flagName: string) => {
    const descriptions = {
      // Fornecedores
      'bulk_operations': 'Permite operações em lote para múltiplos fornecedores simultaneamente',
      'risk_analysis': 'Análise automática de risco baseada em dados históricos e externos',
      'duplicate_detection': 'Detecção automática de fornecedores duplicados no sistema',
      'external_search': 'Busca de fornecedores em bases externas (Serasa, SPC, etc.)',
      'advanced_search': 'Busca avançada com filtros complexos e salvamento de pesquisas',
      
      // Requisições
      'auto_approval': 'Aprovação automática de requisições baseada em regras e valores',
      'budget_control': 'Controle orçamentário integrado com validação de limites',
      'multi_approval': 'Sistema de aprovação multi-nível com workflows personalizados',
      'urgent_requests': 'Tratamento especial para requisições urgentes',
      
      // Pedidos
      'supplier_integration': 'Integração automática com portais de fornecedores',
      'electronic_signature': 'Assinatura eletrônica de documentos e contratos',
      'delivery_tracking': 'Rastreamento de entregas em tempo real',
      'price_validation': 'Validação automática de preços contra histórico e mercado'
    };
    
    return descriptions[flagName as keyof typeof descriptions] || 'Configuração específica do sistema';
  };

  const getFeatureIcon = (flagName: string) => {
    if (flagName.includes('auto') || flagName.includes('detection') || flagName.includes('validation')) {
      return <Zap className="h-4 w-4 text-yellow-600" />;
    }
    return <ToggleLeft className="h-4 w-4 text-blue-600" />;
  };

  const renderConfigFields = () => {
    switch (flag.flag_name) {
      case 'bulk_operations':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="max_bulk_size">Tamanho máximo do lote</Label>
              <Input
                id="max_bulk_size"
                type="number"
                value={config.max_bulk_size || 100}
                onChange={(e) => setConfig(prev => ({ ...prev, max_bulk_size: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        );
        
      case 'risk_analysis':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto_calculate">Cálculo automático</Label>
              <Switch
                id="auto_calculate"
                checked={config.auto_calculate || false}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, auto_calculate: checked }))}
              />
            </div>
            <div>
              <Label htmlFor="alert_threshold">Limite de alerta (0-1)</Label>
              <Input
                id="alert_threshold"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={config.alert_threshold || 0.7}
                onChange={(e) => setConfig(prev => ({ ...prev, alert_threshold: parseFloat(e.target.value) }))}
              />
            </div>
          </div>
        );
        
      case 'duplicate_detection':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="similarity_threshold">Limite de similaridade (0-1)</Label>
              <Input
                id="similarity_threshold"
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={config.similarity_threshold || 0.85}
                onChange={(e) => setConfig(prev => ({ ...prev, similarity_threshold: parseFloat(e.target.value) }))}
              />
            </div>
          </div>
        );
        
      case 'auto_approval':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="max_value">Valor máximo (R$)</Label>
              <Input
                id="max_value"
                type="number"
                value={config.max_value || 1000}
                onChange={(e) => setConfig(prev => ({ ...prev, max_value: parseFloat(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="trusted_areas">Áreas confiáveis</Label>
              <Input
                id="trusted_areas"
                value={Array.isArray(config.trusted_areas) ? config.trusted_areas.join(', ') : ''}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  trusted_areas: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                }))}
                placeholder="TI, RH, Compras"
              />
            </div>
          </div>
        );
        
      case 'budget_control':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="check_budget">Verificar orçamento</Label>
              <Switch
                id="check_budget"
                checked={config.check_budget || false}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, check_budget: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="block_over_budget">Bloquear se ultrapassar</Label>
              <Switch
                id="block_over_budget"
                checked={config.block_over_budget || false}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, block_over_budget: checked }))}
              />
            </div>
          </div>
        );
        
      case 'price_validation':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tolerance">Tolerância de variação</Label>
              <Input
                id="tolerance"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.tolerance || 0.05}
                onChange={(e) => setConfig(prev => ({ ...prev, tolerance: parseFloat(e.target.value) }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto_block">Bloquear automaticamente</Label>
              <Switch
                id="auto_block"
                checked={config.auto_block || false}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, auto_block: checked }))}
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8 text-slate-500">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Configurações específicas não disponíveis para esta feature</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFeatureIcon(flag.flag_name)}
            Configurar Feature: {flag.flag_name}
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros específicos desta funcionalidade
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Status da Feature</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={flag.is_enabled ? "default" : "secondary"}>
                  {flag.is_enabled ? 'Ativada' : 'Desativada'}
                </Badge>
                <Switch
                  checked={flag.is_enabled}
                  onCheckedChange={(checked) => {
                    onUpdate(flag.id, checked);
                    toast.success(`Feature ${checked ? 'ativada' : 'desativada'}`);
                  }}
                />
              </div>
            </div>
            <CardDescription className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
              {getFeatureFlagDescription(flag.flag_name)}
            </CardDescription>
          </CardHeader>
        </Card>

        {flag.is_enabled && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações</CardTitle>
              <CardDescription>
                Ajuste os parâmetros específicos desta funcionalidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderConfigFields()}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Informações Técnicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Ambiente:</span>
              <Badge variant="outline">{flag.environment}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Última atualização:</span>
              <span>{new Date(flag.updated_at).toLocaleString('pt-BR')}</span>
            </div>
          </CardContent>
        </Card>

        <Separator />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
          <Button onClick={() => {
            // Aqui seria implementada a lógica para salvar as configurações específicas
            toast.success('Configurações salvas com sucesso');
            setOpen(false);
          }}>
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};