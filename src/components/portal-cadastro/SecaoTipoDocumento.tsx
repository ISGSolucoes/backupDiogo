
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Building2, User } from 'lucide-react';

interface SecaoTipoDocumentoProps {
  tipoDocumento: 'cnpj' | 'cpf' | null;
  onTipoChange: (tipo: 'cnpj' | 'cpf') => void;
}

export function SecaoTipoDocumento({ tipoDocumento, onTipoChange }: SecaoTipoDocumentoProps) {
  return (
    <div className="space-y-4 p-6 border rounded-lg bg-background">
      <h3 className="font-medium text-lg">1. Escolha o tipo de cadastro</h3>
      <RadioGroup value={tipoDocumento || ''} onValueChange={onTipoChange} className="space-y-3">
        <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="cnpj" id="cnpj" />
            <div className="flex items-center gap-3 flex-1">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="cnpj" className="font-medium cursor-pointer">
                  Pessoa Jurídica (CNPJ)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Para empresas e organizações
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="cpf" id="cpf" />
            <div className="flex items-center gap-3 flex-1">
              <User className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="cpf" className="font-medium cursor-pointer">
                  Pessoa Física (CPF)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Para profissionais autônomos e MEI
                </p>
              </div>
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
