
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Building2, Users, Plus, Link, AlertTriangle } from 'lucide-react';

interface DeteccaoDuplicidadeInlineProps {
  duplicidadeInfo: any;
  convite?: any;
  onContinuar: () => void;
  onVoltar: () => void;
}

export function DeteccaoDuplicidadeInline({
  duplicidadeInfo,
  convite,
  onContinuar,
  onVoltar
}: DeteccaoDuplicidadeInlineProps) {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string>('');
  
  const fornecedorExistente = duplicidadeInfo.fornecedorExistente;
  const tipoDocumento = duplicidadeInfo.tipoDocumento;

  const handleContinuar = () => {
    if (opcaoSelecionada) {
      // Aqui poderia salvar a escolha para processamento posterior
      onContinuar();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onVoltar}>
          ← Voltar
        </Button>
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <span className="font-medium text-amber-900">
          {tipoDocumento.toUpperCase()} já cadastrado
        </span>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="h-4 w-4 text-amber-600" />
          <span className="font-medium">
            {tipoDocumento === 'cnpj' 
              ? (fornecedorExistente?.razao_social || fornecedorExistente?.nome_fantasia)
              : fornecedorExistente?.nome_completo
            }
          </span>
        </div>
        <div className="text-sm text-amber-700 space-y-1">
          <p><strong>Documento:</strong> {duplicidadeInfo.documento}</p>
          <p><strong>Cadastrado em:</strong> {new Date(fornecedorExistente?.created_at).toLocaleDateString()}</p>
          {fornecedorExistente?.cidade && (
            <p><strong>Cidade:</strong> {fornecedorExistente.cidade}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Como você gostaria de prosseguir?</h4>
        
        <RadioGroup value={opcaoSelecionada} onValueChange={setOpcaoSelecionada}>
          {tipoDocumento === 'cnpj' && (
            <div className="border rounded-lg p-4 hover:bg-muted/50">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="novo_contato" id="novo_contato" />
                <div className="flex items-center gap-3 flex-1">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <Label htmlFor="novo_contato" className="font-medium cursor-pointer">
                      Sou um novo contato desta empresa
                    </Label>
                    <Badge variant="outline" className="ml-2">Recomendado</Badge>
                    <p className="text-sm text-muted-foreground">
                      Cadastrar um novo contato para a mesma empresa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border rounded-lg p-4 hover:bg-muted/50">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="nova_categoria" id="nova_categoria" />
              <div className="flex items-center gap-3 flex-1">
                <Plus className="h-4 w-4 text-primary" />
                <div>
                  <Label htmlFor="nova_categoria" className="font-medium cursor-pointer">
                    Oferecer nova categoria de produtos/serviços
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Adicionar uma nova categoria de fornecimento
                  </p>
                </div>
              </div>
            </div>
          </div>

          {convite && (
            <div className="border rounded-lg p-4 hover:bg-muted/50">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="vincular_relacionamento" id="vincular_relacionamento" />
                <div className="flex items-center gap-3 flex-1">
                  <Link className="h-4 w-4 text-primary" />
                  <div>
                    <Label htmlFor="vincular_relacionamento" className="font-medium cursor-pointer">
                      Vincular ao convite de {convite.cliente_nome}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Estabelecer relacionamento comercial
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </RadioGroup>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onVoltar} className="flex-1">
          Voltar
        </Button>
        <Button 
          onClick={handleContinuar}
          disabled={!opcaoSelecionada}
          className="flex-1"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
