
import { useState } from "react";
import { StickyNote } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BlocoComExpandir } from "./BlocoComExpandir";

export const NotasPessoais = () => {
  // In a real app, we would load this from localStorage or a database
  const [notas, setNotas] = useState<string>(
    "– Verificar status do contrato XYZ\n– Confirmar entrega com fornecedor ABC\n– Atualizar categoria da REQ-027"
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotas(e.target.value);
  };
  
  const handleSave = () => {
    // In a real app, we would save this to localStorage or a database
    console.log("Notas salvas:", notas);
    // Could show a toast notification here
  };

  return (
    <BlocoComExpandir 
      titulo="Minhas Notas" 
      icone={<StickyNote className="h-5 w-5 text-slate-500" />}
      maxHeight="250px"
    >
      <div className="p-4">
        <Textarea
          value={notas}
          onChange={handleChange}
          placeholder="Adicione suas anotações aqui..."
          className="min-h-[120px] text-sm"
        />
        
        <div className="mt-3 flex justify-end">
          <Button 
            size="sm"
            onClick={handleSave}
          >
            Salvar
          </Button>
        </div>
      </div>
    </BlocoComExpandir>
  );
};
