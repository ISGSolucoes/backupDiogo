
import { MessageSquare } from "lucide-react";
import { BlocoComExpandir } from "./BlocoComExpandir";

export const UltimosContatos = () => {
  // Mock data - would come from chat history in real implementation
  const contatos = [
    { 
      id: 1, 
      fornecedor: "Tech Solutions", 
      mensagem: "Podem estender o prazo?", 
      anexo: "Contrato_ABC.pdf",
      data: "Ontem – 14h17",
      temAnexo: true
    },
    { 
      id: 2, 
      fornecedor: "ABC Materiais", 
      mensagem: "Já encaminhamos a proposta revisada conforme solicitado.", 
      data: "Hoje – 09h32",
      temAnexo: false
    },
    { 
      id: 3, 
      fornecedor: "Transportes Rápidos SA", 
      mensagem: "Confirmamos entrega para quinta-feira.", 
      data: "Há 2 dias – 16h45",
      temAnexo: false
    }
  ];

  return (
    <BlocoComExpandir 
      titulo="Últimos Contatos" 
      icone={<MessageSquare className="h-5 w-5 text-slate-500" />}
      maxHeight="270px"
    >
      <div className="divide-y divide-slate-100">
        {contatos.map(contato => (
          <div key={contato.id} className="p-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-sm">{contato.fornecedor}</h4>
              <span className="text-xs text-slate-500">{contato.data}</span>
            </div>
            <p className="text-sm mt-1 text-slate-600">💬 "{contato.mensagem}"</p>
            {contato.temAnexo && (
              <p className="text-xs mt-1.5 text-slate-500 flex items-center">
                <span className="mr-1">📎</span> Anexo enviado: {contato.anexo}
              </p>
            )}
          </div>
        ))}
      </div>
    </BlocoComExpandir>
  );
};
