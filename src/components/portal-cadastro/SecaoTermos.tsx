
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, CheckCircle } from 'lucide-react';

interface SecaoTermosProps {
  aceitouTermos: boolean;
  onAceitouTermosChange: (aceito: boolean) => void;
  onSubmitFinal: () => void;
}

export function SecaoTermos({
  aceitouTermos,
  onAceitouTermosChange,
  onSubmitFinal
}: SecaoTermosProps) {
  return (
    <div className="space-y-6 p-6 border rounded-lg bg-background">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5" />
        <h3 className="font-medium text-lg">4. Aceite dos Termos</h3>
      </div>

      <div className="bg-muted p-4 rounded-lg max-h-40 overflow-y-auto text-sm">
        <h4 className="font-medium mb-2">Termos de Uso e Política de Privacidade</h4>
        <p className="mb-2">
          Ao aceitar estes termos, você concorda com:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Fornecer informações verdadeiras e atualizadas</li>
          <li>Cumprir com os padrões de qualidade exigidos</li>
          <li>Manter a confidencialidade das informações</li>
          <li>Respeitar os prazos e condições estabelecidos</li>
          <li>Nossa política de tratamento de dados pessoais</li>
        </ul>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="aceite-termos"
          checked={aceitouTermos}
          onCheckedChange={(checked) => onAceitouTermosChange(checked === true)}
        />
        <Label htmlFor="aceite-termos" className="cursor-pointer">
          Eu aceito os termos de uso e política de privacidade
        </Label>
      </div>

      <Button 
        onClick={onSubmitFinal}
        disabled={!aceitouTermos}
        className="w-full"
        size="lg"
      >
        <CheckCircle className="h-5 w-5 mr-2" />
        Finalizar Cadastro
      </Button>
    </div>
  );
}
