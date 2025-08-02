
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserCheck } from "lucide-react";

interface DesignarAvaliadorProps {
  onAvaliadorSelecionado: (avaliador: string) => void;
  avaliadorAtual: string;
}

// Mock de usuários com permissão de avaliador
const avaliadores = [
  { id: "user-1", nome: "João Silva", cargo: "Gerente de Compras" },
  { id: "user-2", nome: "Maria Oliveira", cargo: "Analista de Suprimentos" },
  { id: "user-3", nome: "Roberto Santos", cargo: "Coordenador de Qualidade" },
  { id: "user-4", nome: "Ana Ferreira", cargo: "Diretora de Operações" },
  { id: "user-5", nome: "Carlos Eduardo", cargo: "Analista de Compras" }
];

export const DesignarAvaliador: React.FC<DesignarAvaliadorProps> = ({
  onAvaliadorSelecionado,
  avaliadorAtual
}) => {
  const [tipoSelecao, setTipoSelecao] = useState<"eu_mesmo" | "outro">(
    avaliadorAtual === "Usuário Atual" ? "eu_mesmo" : "outro"
  );
  
  const [avaliadorSelecionado, setAvaliadorSelecionado] = useState<string>(
    avaliadorAtual && avaliadorAtual !== "Usuário Atual" ? avaliadorAtual : ""
  );

  // Nomear usuário atual
  const usuarioAtual = "Usuário Atual";

  const handleTipoSelecao = (value: "eu_mesmo" | "outro") => {
    setTipoSelecao(value);
    
    if (value === "eu_mesmo") {
      onAvaliadorSelecionado(usuarioAtual);
    } else if (value === "outro" && avaliadorSelecionado) {
      onAvaliadorSelecionado(avaliadorSelecionado);
    } else {
      onAvaliadorSelecionado("");
    }
  };

  const handleAvaliadorChange = (value: string) => {
    setAvaliadorSelecionado(value);
    onAvaliadorSelecionado(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
        <div className="flex items-start">
          <UserCheck className="h-6 w-6 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-700">Quem realizará a avaliação?</h3>
            <p className="text-sm text-blue-600 mt-1">
              A avaliação deve ser realizada por quem teve contato direto com o fornecedor ou
              tem conhecimento sobre o seu desempenho.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <RadioGroup
          value={tipoSelecao}
          onValueChange={(value) => handleTipoSelecao(value as "eu_mesmo" | "outro")}
          className="space-y-4"
        >
          <div className="flex items-start space-x-3 p-3 border rounded-md hover:bg-slate-50">
            <RadioGroupItem value="eu_mesmo" id="eu_mesmo" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="eu_mesmo" className="font-medium">
                Eu mesmo realizarei a avaliação
              </Label>
              <p className="text-sm text-muted-foreground">
                Você conhece o fornecedor e pode avaliar seu desempenho diretamente.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 border rounded-md hover:bg-slate-50">
            <RadioGroupItem value="outro" id="outro" className="mt-1" />
            <div className="grid gap-1.5 w-full">
              <Label htmlFor="outro" className="font-medium">
                Designar outro avaliador
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Selecione outro colaborador para realizar esta avaliação.
              </p>
              
              <Select 
                disabled={tipoSelecao !== "outro"} 
                onValueChange={handleAvaliadorChange}
                value={avaliadorSelecionado}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um avaliador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Avaliadores disponíveis</SelectLabel>
                    {avaliadores.map((avaliador) => (
                      <SelectItem key={avaliador.id} value={avaliador.nome}>
                        {avaliador.nome} ({avaliador.cargo})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
