import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Lock, Info, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  TributosDetalhados, 
  RegimeTributario, 
  ImpostoItem,
  ImpostoCustomizado 
} from '@/types/impostos';
import { useTaxCalculation } from '@/hooks/useTaxCalculation';

interface ImpostosSectionProps {
  valor: number;
  regimeTributario: RegimeTributario;
  impostos: TributosDetalhados;
  onRegimeChange: (regime: RegimeTributario) => void;
  onImpostosChange: (impostos: TributosDetalhados) => void;
  categoria?: string;
  tipo?: 'material' | 'servico';
  disabled?: boolean;
}

export const ImpostosSection: React.FC<ImpostosSectionProps> = ({
  valor,
  regimeTributario,
  impostos,
  onRegimeChange,
  onImpostosChange,
  categoria = 'default',
  tipo = 'material',
  disabled = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { 
    calculateTaxes, 
    calculateTotalWithTaxes, 
    validateTaxData, 
    isCalculating 
  } = useTaxCalculation();

  const handleRegimeChange = (regime: RegimeTributario) => {
    onRegimeChange(regime);
    if (regime && valor > 0) {
      calculateTaxes({ valor, regimeTributario: regime, categoria, tipo })
        .then(onImpostosChange);
    }
  };

  const handleCalculateAuto = async () => {
    if (!validateTaxData(regimeTributario, valor)) return;
    
    const novosImpostos = await calculateTaxes({
      valor,
      regimeTributario,
      categoria,
      tipo
    });
    onImpostosChange(novosImpostos);
  };

  const handleImpostoChange = (
    tipo: keyof TributosDetalhados,
    campo: 'aliquota' | 'valor',
    novoValor: number
  ) => {
    if (tipo === 'outrosImpostos') return;

    const impostoAtual = impostos[tipo] as ImpostoItem;
    if (!impostoAtual.editable) return;

    const novoImposto: ImpostoItem = {
      ...impostoAtual,
      [campo]: novoValor,
      origem: 'manual'
    };

    // Se alterou alíquota, recalcular valor
    if (campo === 'aliquota' && novoImposto.base) {
      novoImposto.valor = (novoImposto.base * novoValor) / 100;
    }

    onImpostosChange({
      ...impostos,
      [tipo]: novoImposto
    });
  };

  const valorComImpostos = calculateTotalWithTaxes(valor, impostos);
  const totalImpostos = valorComImpostos - valor;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (disabled || !valor) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Informações Tributárias
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Informe os impostos para ajudar na comparação de propostas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Seleção de Regime */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Regime Tributário *</label>
          <Select value={regimeTributario || ''} onValueChange={handleRegimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o regime tributário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simples">Simples Nacional</SelectItem>
              <SelectItem value="presumido">Lucro Presumido</SelectItem>
              <SelectItem value="real">Lucro Real</SelectItem>
            </SelectContent>
          </Select>
          {regimeTributario === 'simples' && (
            <p className="text-xs text-muted-foreground">
              Tributação simplificada. Discriminação dos tributos é opcional.
            </p>
          )}
        </div>

        {regimeTributario && (
          <>
            {/* Botão Calcular Automático */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCalculateAuto}
                disabled={isCalculating || !validateTaxData(regimeTributario, valor)}
              >
                <Calculator className="h-4 w-4 mr-2" />
                {isCalculating ? 'Calculando...' : 'Calcular Automaticamente'}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Ocultar' : 'Detalhar'} Impostos
              </Button>
            </div>

            {/* Resumo Rápido */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Valor sem impostos:</p>
                  <p className="text-lg">{formatarMoeda(valor)}</p>
                </div>
                <div>
                  <p className="font-medium">Total de impostos:</p>
                  <p className="text-lg text-orange-600">{formatarMoeda(totalImpostos)}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Valor com impostos:</p>
                  <p className="text-xl font-bold text-green-600">{formatarMoeda(valorComImpostos)}</p>
                </div>
              </div>
            </div>

            {/* Detalhamento dos Impostos */}
            {showDetails && (
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-medium">Detalhamento dos Impostos</h4>
                
                {/* ICMS */}
                <div className="grid grid-cols-3 gap-2 items-end">
                  <div>
                    <label className="text-xs font-medium flex items-center gap-1">
                      ICMS (%)
                      {!impostos.icms.editable && (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={impostos.icms.aliquota || ''}
                      onChange={(e) => handleImpostoChange('icms', 'aliquota', parseFloat(e.target.value) || 0)}
                      disabled={!impostos.icms.editable}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Valor ICMS</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={impostos.icms.valor || ''}
                      onChange={(e) => handleImpostoChange('icms', 'valor', parseFloat(e.target.value) || 0)}
                      disabled={!impostos.icms.editable}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={impostos.icms.origem === 'calculado' ? 'secondary' : 'outline'}>
                      {impostos.icms.origem}
                    </Badge>
                    {impostos.icms.locked_reason && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{impostos.icms.locked_reason}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>

                {/* IPI - apenas para materiais */}
                {tipo === 'material' && (
                  <div className="grid grid-cols-3 gap-2 items-end">
                    <div>
                      <label className="text-xs font-medium flex items-center gap-1">
                        IPI (%)
                        {!impostos.ipi.editable && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={impostos.ipi.aliquota || ''}
                        onChange={(e) => handleImpostoChange('ipi', 'aliquota', parseFloat(e.target.value) || 0)}
                        disabled={!impostos.ipi.editable}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Valor IPI</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={impostos.ipi.valor || ''}
                        onChange={(e) => handleImpostoChange('ipi', 'valor', parseFloat(e.target.value) || 0)}
                        disabled={!impostos.ipi.editable}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant={impostos.ipi.origem === 'calculado' ? 'secondary' : 'outline'}>
                        {impostos.ipi.origem}
                      </Badge>
                      {impostos.ipi.locked_reason && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{impostos.ipi.locked_reason}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                )}

                {/* ISS - apenas para serviços */}
                {tipo === 'servico' && (
                  <div className="grid grid-cols-3 gap-2 items-end">
                    <div>
                      <label className="text-xs font-medium flex items-center gap-1">
                        ISS (%)
                        {!impostos.iss.editable && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={impostos.iss.aliquota || ''}
                        onChange={(e) => handleImpostoChange('iss', 'aliquota', parseFloat(e.target.value) || 0)}
                        disabled={!impostos.iss.editable}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Valor ISS</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={impostos.iss.valor || ''}
                        onChange={(e) => handleImpostoChange('iss', 'valor', parseFloat(e.target.value) || 0)}
                        disabled={!impostos.iss.editable}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant={impostos.iss.origem === 'calculado' ? 'secondary' : 'outline'}>
                        {impostos.iss.origem}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* PIS/COFINS */}
                <div className="grid grid-cols-3 gap-2 items-end">
                  <div>
                    <label className="text-xs font-medium flex items-center gap-1">
                      PIS/COFINS (%)
                      {!impostos.pisCofins.editable && (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={impostos.pisCofins.aliquota || ''}
                      onChange={(e) => handleImpostoChange('pisCofins', 'aliquota', parseFloat(e.target.value) || 0)}
                      disabled={!impostos.pisCofins.editable}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Valor PIS/COFINS</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={impostos.pisCofins.valor || ''}
                      onChange={(e) => handleImpostoChange('pisCofins', 'valor', parseFloat(e.target.value) || 0)}
                      disabled={!impostos.pisCofins.editable}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={impostos.pisCofins.origem === 'calculado' ? 'secondary' : 'outline'}>
                      {impostos.pisCofins.origem}
                    </Badge>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                  <Info className="h-3 w-3 inline mr-1" />
                  Este cálculo é apenas indicativo para ajudar o comprador a avaliar o impacto tributário.
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};