
import { Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocoComExpandir } from "./BlocoComExpandir";

interface Fornecedor {
  id: string;
  nome: string;
  categoria: string;
  status: "ativo" | "pendente" | "inativo";
}

export const MeusFornecedores = () => {
  // Mock data
  const fornecedores: Fornecedor[] = [
    {
      id: "1",
      nome: "ABC Materiais Ltda",
      categoria: "Materiais de Escritório",
      status: "ativo",
    },
    {
      id: "2",
      nome: "XYZ Serviços S.A.",
      categoria: "Serviços de Manutenção",
      status: "ativo",
    },
    {
      id: "3",
      nome: "Insumos Industriais ME",
      categoria: "Matéria Prima",
      status: "pendente",
    },
    {
      id: "4",
      nome: "Tech Solutions Inc.",
      categoria: "Equipamentos",
      status: "pendente",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>;
      case "pendente":
        return <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>;
      case "inativo":
        return <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ativo": return "Ativo";
      case "pendente": return "Pendente";
      case "inativo": return "Inativo";
      default: return "Desconhecido";
    }
  };

  return (
    <BlocoComExpandir 
      titulo="Meus Fornecedores" 
      icone={<Users className="h-5 w-5 text-slate-500" />}
      actions={
        <Button variant="ghost" size="sm" className="text-xs">
          Ver todos
        </Button>
      }
    >
      <div className="divide-y divide-slate-100">
        {fornecedores.map((fornecedor) => (
          <div key={fornecedor.id} className="p-4 hover:bg-slate-50">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{fornecedor.nome}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    {getStatusBadge(fornecedor.status)}
                    <span>{getStatusText(fornecedor.status)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{fornecedor.categoria}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {fornecedor.status === "pendente" && (
              <div className="mt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Lembrete
                </Button>
                <Button size="sm" className="text-xs">
                  Aprovar
                </Button>
              </div>
            )}
          </div>
        ))}
        
        <div className="p-2 text-center">
          <Button variant="ghost" size="sm" className="text-xs">
            + Adicionar fornecedor
          </Button>
        </div>
      </div>
    </BlocoComExpandir>
  );
};
