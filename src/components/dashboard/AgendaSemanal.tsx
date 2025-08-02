
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocoComExpandir } from "./BlocoComExpandir";

interface Evento {
  id: string;
  titulo: string;
  horario: string;
  tipo: "reuniao" | "prazo" | "evento" | "outro";
}

export const AgendaSemanal = () => {
  // Mock data
  const eventos: Evento[] = [
    {
      id: "1",
      titulo: "Reunião: Revisão de contratos",
      horario: "Hoje, 14:00",
      tipo: "reuniao",
    },
    {
      id: "2",
      titulo: "Prazo final: Evento EV-007",
      horario: "Amanhã, 18:00",
      tipo: "prazo",
    },
    {
      id: "3",
      titulo: "Visita técnica: Fornecedor XYZ",
      horario: "Quarta, 10:00",
      tipo: "reuniao",
    },
  ];

  return (
    <BlocoComExpandir 
      titulo="Agenda da Semana" 
      icone={<CalendarIcon className="h-5 w-5 text-slate-500" />}
      actions={
        <Button variant="outline" size="sm" className="text-xs">
          <CalendarIcon className="h-3 w-3 mr-1" />
          Calendário
        </Button>
      }
    >
      <div className="divide-y divide-slate-100">
        {eventos.map((evento) => (
          <div key={evento.id} className="p-4 hover:bg-slate-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{evento.titulo}</p>
                <p className="text-xs text-slate-500 mt-1">{evento.horario}</p>
              </div>
              
              <div className="ml-2">
                {evento.tipo === "prazo" ? (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    Prazo
                  </span>
                ) : evento.tipo === "reuniao" ? (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    Reunião
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                    {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="p-2 text-center">
          <Button variant="ghost" size="sm" className="text-xs">
            Ver mais eventos
          </Button>
        </div>
      </div>
    </BlocoComExpandir>
  );
};
