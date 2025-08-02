import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, DollarSign, Target, AlertTriangle } from 'lucide-react';
import { useControleOrcamentario } from '@/hooks/useControleOrcamentario';
import type { ConfiguracaoControleOrcamentario } from '@/types/orcamento';

export const ControleOrcamentarioConfig = () => {
  const { 
    loading, 
    regras, 
    configuracao, 
    salvarConfiguracao 
  } = useControleOrcamentario();
  
  const [configLocal, setConfigLocal] = useState<ConfiguracaoControleOrcamentario>(configuracao);

  useEffect(() => {
    setConfigLocal(configuracao);
  }, [configuracao]);

  const handleSalvar = async () => {
    await salvarConfiguracao(configLocal);
  };

  const handleModoChange = (modo: 'global' | 'condicional' | 'desativado') => {
    setConfigLocal(prev => ({
      ...prev,
      modo,
      ativo: modo !== 'desativado',
      regras_ativas: modo === 'global' ? 
        regras.filter(r => r.tipo_condicao === 'global').map(r => r.id) :
        modo === 'desativado' ? [] : prev.regras_ativas
    }));
  };

  const handleRegraToggle = (regraId: string, checked: boolean) => {
    setConfigLocal(prev => ({
      ...prev,
      regras_ativas: checked ? 
        [...prev.regras_ativas, regraId] :
        prev.regras_ativas.filter(id => id !== regraId)
    }));
  };

  const regrasPorTipo = {
    global: regras.filter(r => r.tipo_condicao === 'global'),
    por_tipo: regras.filter(r => r.tipo_condicao === 'por_tipo'),
    por_valor: regras.filter(r => r.tipo_condicao === 'por_valor'),
    por_categoria: regras.filter(r => r.tipo_condicao === 'por_categoria'),
    por_centro_custo: regras.filter(r => r.tipo_condicao === 'por_centro_custo')
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Controle Orçamentário</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configuração Geral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Ativar Controle Orçamentário?</Label>
            <RadioGroup 
              value={configLocal.modo} 
              onValueChange={handleModoChange}
              className="mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desativado" id="desativado" />
                <Label htmlFor="desativado">Não usar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="global" id="global" />
                <Label htmlFor="global">Ativar para TODAS as requisições</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="condicional" id="condicional" />
                <Label htmlFor="condicional">Ativar por regras específicas</Label>
              </div>
            </RadioGroup>
          </div>

          {configLocal.modo === 'condicional' && (
            <>
              <Separator />
              <div>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Regras Condicionais
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Selecione as condições que ativarão o controle orçamentário
                </p>

                <div className="space-y-4 mt-4">
                  {regrasPorTipo.por_tipo.length > 0 && (
                    <div>
                      <Label className="font-medium">Por Tipo de Requisição</Label>
                      <div className="space-y-2 mt-2">
                        {regrasPorTipo.por_tipo.map(regra => (
                          <div key={regra.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={regra.id}
                              checked={configLocal.regras_ativas.includes(regra.id)}
                              onCheckedChange={(checked) => handleRegraToggle(regra.id, checked as boolean)}
                            />
                            <Label htmlFor={regra.id} className="flex items-center gap-2">
                              {regra.nome}
                              <Badge variant="outline" className="text-xs">
                                {Object.keys(regra.condicao_config).length > 0 && 
                                  typeof regra.condicao_config === 'object' && 
                                  'tipos' in regra.condicao_config ? 
                                  (regra.condicao_config.tipos as string[]).join(', ') : 
                                  'Configurado'
                                }
                              </Badge>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {regrasPorTipo.por_valor.length > 0 && (
                    <div>
                      <Label className="font-medium">Por Valor da Requisição</Label>
                      <div className="space-y-2 mt-2">
                        {regrasPorTipo.por_valor.map(regra => (
                          <div key={regra.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={regra.id}
                              checked={configLocal.regras_ativas.includes(regra.id)}
                              onCheckedChange={(checked) => handleRegraToggle(regra.id, checked as boolean)}
                            />
                            <Label htmlFor={regra.id} className="flex items-center gap-2">
                              {regra.nome}
                              <Badge variant="outline" className="text-xs">
                                {typeof regra.condicao_config === 'object' && 
                                  'valor_minimo' in regra.condicao_config ? 
                                  `> R$ ${Number(regra.condicao_config.valor_minimo).toLocaleString('pt-BR')}` : 
                                  'Configurado'
                                }
                              </Badge>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {regrasPorTipo.por_categoria.length > 0 && (
                    <div>
                      <Label className="font-medium">Por Categoria</Label>
                      <div className="space-y-2 mt-2">
                        {regrasPorTipo.por_categoria.map(regra => (
                          <div key={regra.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={regra.id}
                              checked={configLocal.regras_ativas.includes(regra.id)}
                              onCheckedChange={(checked) => handleRegraToggle(regra.id, checked as boolean)}
                            />
                            <Label htmlFor={regra.id} className="flex items-center gap-2">
                              {regra.nome}
                              <Badge variant="outline" className="text-xs">
                                {typeof regra.condicao_config === 'object' && 
                                  'categorias' in regra.condicao_config ? 
                                  (regra.condicao_config.categorias as string[]).join(', ') : 
                                  'Configurado'
                                }
                              </Badge>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {regrasPorTipo.por_centro_custo.length > 0 && (
                    <div>
                      <Label className="font-medium">Por Centro de Custo</Label>
                      <div className="space-y-2 mt-2">
                        {regrasPorTipo.por_centro_custo.map(regra => (
                          <div key={regra.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={regra.id}
                              checked={configLocal.regras_ativas.includes(regra.id)}
                              onCheckedChange={(checked) => handleRegraToggle(regra.id, checked as boolean)}
                            />
                            <Label htmlFor={regra.id} className="flex items-center gap-2">
                              {regra.nome}
                              <Badge variant="outline" className="text-xs">
                                {typeof regra.condicao_config === 'object' && 
                                  'centros_custo' in regra.condicao_config ? 
                                  (regra.condicao_config.centros_custo as string[]).join(', ') : 
                                  'Configurado'
                                }
                              </Badge>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {configLocal.ativo && (
            <>
              <Separator />
              <div className="bg-accent/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="font-medium">Status do Controle</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {configLocal.modo === 'global' && 'Controle orçamentário ativo para todas as requisições.'}
                  {configLocal.modo === 'condicional' && `Controle ativo para ${configLocal.regras_ativas.length} regra(s) específica(s).`}
                </p>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSalvar} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Configuração'}
            </Button>
            <Button variant="outline" onClick={() => setConfigLocal(configuracao)}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};