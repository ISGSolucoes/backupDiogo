
import { Star } from "lucide-react";
import { BlocoComExpandir } from "./BlocoComExpandir";

export const BlocoFavoritos = () => {
  // Mock data - would come from user preferences in real implementation
  const favoritos = [
    { id: 1, tipo: "evento", nome: "Evento EV-008", status: "aguardando cotação" },
    { id: 2, tipo: "fornecedor", nome: "Fornecedor XYZ", status: "certidão pendente" },
    { id: 3, tipo: "requisicao", nome: "Requisição #REQ-2023-032", status: "crítica" }
  ];

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "evento": return "📅";
      case "fornecedor": return "🏢";
      case "requisicao": return "📝";
      default: return "•";
    }
  };

  return (
    <BlocoComExpandir 
      titulo="Favoritos" 
      icone={<Star className="h-5 w-5 text-yellow-500" />}
      maxHeight="200px"
    >
      <div className="p-4">
        <ul className="space-y-2">
          {favoritos.map(item => (
            <li key={item.id} className="flex items-start gap-2">
              <span className="flex-shrink-0">{getIcon(item.tipo)}</span>
              <p className="text-sm">
                <span className="font-medium">{item.nome}</span>
                <span className="text-slate-500 text-xs"> ({item.status})</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </BlocoComExpandir>
  );
};
