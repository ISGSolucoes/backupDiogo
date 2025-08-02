import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, RotateCcw, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useConfiguracoesValidacao, 
  ConfiguracoesCliente, 
  NivelValidacao 
} from '@/hooks/useConfiguracoesValidacao';

interface ConfiguracoesValidacaoProps {
  onClose?: () => void;
}

export function ConfiguracoesValidacao({ onClose }: ConfiguracoesValidacaoProps) {
  const { toast } = useToast();
  const { 
    configuracoes, 
    loading, 
    salvarConfiguracoes,
    carregarConfiguracoes 
  } = useConfiguracoesValidacao();
  
  const [configuracoesLocal, setConfiguracoesLocal] = useState<ConfiguracoesCliente>(configuracoes);
  const [salvando, setSalvando] = useState(false);

  const niveisValidacao: { value: NivelValidacao; label: string; color: string }[] = [
    { value: 'off', label: 'Desligado', color: 'bg-gray-500' },
    { value: 'warn', label: 'Alerta', color: 'bg-yellow-500' },
    { value: 'required', label: 'Obrigatório', color: 'bg-red-500' }
  ];

  const handleSalvar = async () => {
    try {
      setSalvando(true);
      const resultado = await salvarConfiguracoes(configuracoesLocal);
      
      if (resultado.success) {
        toast({
          title: "Sucesso",
          description: "Configurações salvas com sucesso!",
        });
        onClose?.();
      } else {
        throw resultado.error;
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleReset = async () => {
    await carregarConfiguracoes();
    setConfiguracoesLocal(configuracoes);
    toast({
      title: "Configurações restauradas",
      description: "As configurações foram restauradas para os valores salvos",
    });
  };

  const atualizarValidacao = (campo: keyof typeof configuracoesLocal.validacoes, valor: NivelValidacao) => {
    setConfiguracoesLocal(prev => ({
      ...prev,
      validacoes: {
        ...prev.validacoes,
        [campo]: valor
      }
    }));
  };

  const atualizarAprovacao = (campo: keyof typeof configuracoesLocal.aprovacao, valor: any) => {
    setConfiguracoesLocal(prev => ({
      ...prev,
      aprovacao: {
        ...prev.aprovacao,
        [campo]: valor
      }
    }));
  };

  const getNivelInfo = (nivel: NivelValidacao) => {
    const info = niveisValidacao.find(n => n.value === nivel);
    return info || niveisValidacao[0];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-semibold">Configurações de Validação</h1>
            <p className="text-sm text-muted-foreground">
              Configure as regras de validação para pedidos de compra
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Níveis de Validação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {niveisValidacao.map((nivel) => (
              <div key={nivel.value} className="flex items-center gap-2">
                <Badge className={nivel.color}>{nivel.label}</Badge>
                <span className="text-xs text-muted-foreground">
                  {nivel.value === 'off' && 'Não aplica validação'}
                  {nivel.value === 'warn' && 'Permite continuar com alerta'}
                  {nivel.value === 'required' && 'Bloqueia se não atendido'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validações de Campos */}
      <Card>
        <CardHeader>
          <CardTitle>Validações de Campos</CardTitle>
          <CardDescription>
            Configure o nível de validação para cada campo do pedido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(configuracoesLocal.validacoes).map(([campo, valor]) => (
            <div key={campo} className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  {campo === 'fornecedorHomologado' && 'Fornecedor Homologado'}
                  {campo === 'validarSaldoOrcamentario' && 'Saldo Orçamentário'}
                  {campo === 'exigirContaContabil' && 'Conta Contábil'}
                  {campo === 'exigirCentroCusto' && 'Centro de Custo'}
                  {campo === 'exigirProjetoAtividade' && 'Projeto/Atividade'}
                  {campo === 'exigirResponsavelInterno' && 'Responsável Interno'}
                  {campo === 'validarDataEntrega' && 'Data de Entrega'}
                  {campo === 'exigirCondicaoPagamento' && 'Condição de Pagamento'}
                  {campo === 'validarLocalEntrega' && 'Local de Entrega'}
                  {campo === 'exigirObservacoesTecnicas' && 'Observações Técnicas'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  Nível atual: <Badge className={getNivelInfo(valor).color}>{getNivelInfo(valor).label}</Badge>
                </p>
              </div>
              <Select 
                value={valor} 
                onValueChange={(novoValor: NivelValidacao) => atualizarValidacao(campo as any, novoValor)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {niveisValidacao.map((nivel) => (
                    <SelectItem key={nivel.value} value={nivel.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${nivel.color}`} />
                        {nivel.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Configurações de Aprovação */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Aprovação</CardTitle>
          <CardDescription>
            Configure as regras de aprovação por valor e comportamento do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Aprovação Automática</Label>
              <p className="text-xs text-muted-foreground">
                Aprovar automaticamente pedidos que atendem todos os critérios
              </p>
            </div>
            <Switch 
              checked={configuracoesLocal.aprovacao.aprovacaoAutomatica}
              onCheckedChange={(checked) => atualizarAprovacao('aprovacaoAutomatica', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Escalonamento Automático</Label>
              <p className="text-xs text-muted-foreground">
                Escalonar automaticamente após prazo limite
              </p>
            </div>
            <Switch 
              checked={configuracoesLocal.aprovacao.escalonamentoAutomatico}
              onCheckedChange={(checked) => atualizarAprovacao('escalonamentoAutomatico', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Prazo para Aprovação (horas)</Label>
              <p className="text-xs text-muted-foreground">
                Tempo limite antes do escalonamento automático
              </p>
            </div>
            <Input 
              type="number"
              value={configuracoesLocal.aprovacao.prazoAprovacaoHoras}
              onChange={(e) => atualizarAprovacao('prazoAprovacaoHoras', parseInt(e.target.value) || 48)}
              className="w-24"
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Aprovação por Valor</Label>
            <div className="text-xs text-muted-foreground mb-3">
              Configure os limites de valor e perfis de aprovação necessários
            </div>
            {Object.entries(configuracoesLocal.aprovacao.aprovacaoPorValor).map(([valor, perfis], index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded">
                <Label className="min-w-20">Até R$ {parseInt(valor).toLocaleString()}</Label>
                <div className="flex gap-2 flex-wrap">
                  {perfis.map((perfil, i) => (
                    <Badge key={i} variant="outline">{perfil}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleReset} disabled={salvando}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Restaurar
        </Button>
        <Button onClick={handleSalvar} disabled={salvando}>
          <Save className="h-4 w-4 mr-2" />
          {salvando ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
}