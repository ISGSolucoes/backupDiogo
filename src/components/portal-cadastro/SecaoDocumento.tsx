
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, User, Loader2, CheckCircle } from 'lucide-react';

interface SecaoDocumentoProps {
  tipoDocumento: 'cnpj' | 'cpf';
  documento: string;
  onDocumentoChange: (doc: string) => void;
  onDocumentoSubmit: () => void;
  carregandoValidacao: boolean;
  validado: boolean;
}

export function SecaoDocumento({
  tipoDocumento,
  documento,
  onDocumentoChange,
  onDocumentoSubmit,
  carregandoValidacao,
  validado
}: SecaoDocumentoProps) {
  return (
    <div className={`space-y-4 p-6 border rounded-lg transition-all ${validado ? 'bg-green-50 dark:bg-green-900/10 border-green-200' : 'bg-background'}`}>
      <div className="flex items-center gap-2">
        {tipoDocumento === 'cnpj' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
        <h3 className="font-medium text-lg">
          2. {tipoDocumento === 'cnpj' ? 'CNPJ da Empresa' : 'CPF'}
        </h3>
        {validado && <CheckCircle className="h-5 w-5 text-green-600" />}
      </div>

      <div className="space-y-3">
        <Label htmlFor="documento">
          {tipoDocumento === 'cnpj' ? 'CNPJ' : 'CPF'}
        </Label>
        <div className="flex gap-2">
          <Input
            id="documento"
            value={documento}
            onChange={(e) => onDocumentoChange(e.target.value)}
            placeholder={tipoDocumento === 'cnpj' ? '00.000.000/0000-00' : '000.000.000-00'}
            maxLength={tipoDocumento === 'cnpj' ? 18 : 14}
            disabled={validado}
            className="flex-1"
          />
          {!validado && (
            <Button 
              onClick={onDocumentoSubmit}
              disabled={carregandoValidacao || !documento}
            >
              {carregandoValidacao && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {tipoDocumento === 'cnpj' ? 'Buscar' : 'Validar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
