
import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Contato {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
}

interface ContatosFornecedorProps {
  contatos: Contato[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContatosFornecedor = ({ 
  contatos,
  open,
  onOpenChange
}: ContatosFornecedorProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <User className="h-3.5 w-3.5 mr-1.5" />
          Ver contatos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contatos</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {contatos.length > 0 ? (
            contatos.map((contato) => (
              <div key={contato.id} className="border rounded-md p-3">
                <div className="font-medium">{contato.nome}</div>
                <div className="text-sm text-slate-500">{contato.cargo}</div>
                <div className="mt-2 text-sm">
                  <div>{contato.email}</div>
                  <div>{contato.telefone}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500">
              Nenhum contato cadastrado para este fornecedor.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
