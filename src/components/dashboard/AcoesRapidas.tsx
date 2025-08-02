import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Search, 
  Calendar, 
  FileText, 
  BarChart, 
  Download,
  Settings
} from "lucide-react";

export const AcoesRapidas = () => {
  const acoes = [
    {
      nome: "Nova Requisição",
      descricao: "Criar requisição de compra",
      icone: <Plus className="h-5 w-5" />,
      cor: "bg-blue-500 hover:bg-blue-600",
      textColor: "text-white"
    },
    {
      nome: "Buscar Fornecedor",
      descricao: "Encontrar fornecedores",
      icone: <Search className="h-5 w-5" />,
      cor: "bg-green-500 hover:bg-green-600", 
      textColor: "text-white"
    },
    {
      nome: "Novo Evento",
      descricao: "Criar evento de cotação",
      icone: <Calendar className="h-5 w-5" />,
      cor: "bg-purple-500 hover:bg-purple-600",
      textColor: "text-white"
    },
    {
      nome: "Relatórios",
      descricao: "Gerar analytics",
      icone: <BarChart className="h-5 w-5" />,
      cor: "bg-orange-500 hover:bg-orange-600",
      textColor: "text-white"
    },
    {
      nome: "Contratos",
      descricao: "Gerenciar contratos",
      icone: <FileText className="h-5 w-5" />,
      cor: "bg-red-500 hover:bg-red-600",
      textColor: "text-white"
    },
    {
      nome: "Exportar Dados",
      descricao: "Download planilhas",
      icone: <Download className="h-5 w-5" />,
      cor: "bg-gray-500 hover:bg-gray-600",
      textColor: "text-white"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 card-shadow h-[400px] flex flex-col">
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="icon-container icon-container-blue">
            <Settings className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-lg">Ações Rápidas</h3>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-3">
          {acoes.map((acao, index) => (
            <Button
              key={index}
              variant="outline" 
              className={`h-20 flex flex-col items-center justify-center gap-2 p-3 hover:shadow-md transition-all duration-200 ${acao.cor} ${acao.textColor} border-none`}
            >
              {acao.icone}
              <div className="text-center">
                <div className="font-medium text-xs">{acao.nome}</div>
                <div className="text-xs opacity-80">{acao.descricao}</div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};