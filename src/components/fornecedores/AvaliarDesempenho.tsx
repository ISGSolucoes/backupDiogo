
import React, { useState } from "react";
import { BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvaliarDesempenhoModal } from "./avaliacao/AvaliarDesempenhoModal";
import { toast } from "sonner";

export const AvaliarDesempenho: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAvaliacaoCompleta = () => {
    // Aqui poderia atualizar algum estado global ou refazer busca de dados
    console.log("Avaliação completada com sucesso");
  };

  return (
    <>
      <Button 
        className="bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => setModalOpen(true)}
      >
        <BarChart className="h-4 w-4 mr-2" /> 
        Avaliar Fornecedor
      </Button>

      <AvaliarDesempenhoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onComplete={handleAvaliacaoCompleta}
      />
    </>
  );
};
