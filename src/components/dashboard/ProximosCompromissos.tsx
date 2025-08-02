import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Users, Presentation, MapPin, Clock } from "lucide-react";

interface Compromisso {
  id: string;
  tipo: "reuniao" | "visita" | "apresentacao" | "deadline";
  titulo: string;
  data: string;
  local: string;
  participantes?: string;
  status: "proximo" | "hoje" | "amanha";
}

export const ProximosCompromissos = () => {
  const compromissos: Compromisso[] = [
    {
      id: "1",
      tipo: "reuniao",
      titulo: "Renegociação contrato XYZ Materiais", 
      data: "Hoje, 14:00",
      local: "Sala 3",
      participantes: "João Silva, Maria Santos",
      status: "hoje"
    },
    {
      id: "2",
      tipo: "apresentacao",
      titulo: "Apresentação resultados Q1 para diretoria",
      data: "Amanhã, 16:00", 
      local: "Auditório",
      participantes: "Diretoria",
      status: "amanha"
    },
    {
      id: "3",
      tipo: "visita",
      titulo: "Visita técnica - Alpha Indústria",
      data: "Sexta, 09:00",
      local: "Osasco - SP",
      participantes: "Equipe técnica",
      status: "proximo"
    }
  ];

  const getTipoConfig = (tipo: string) => {
    switch (tipo) {
      case "reuniao":
        return {
          icon: <Users className="h-4 w-4 text-blue-500" />,
          label: "Reunião"
        };
      case "visita":
        return {
          icon: <MapPin className="h-4 w-4 text-green-500" />,
          label: "Visita"
        };
      case "apresentacao":
        return {
          icon: <Presentation className="h-4 w-4 text-purple-500" />,
          label: "Apresentação"
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-orange-500" />,
          label: "Deadline"
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hoje": return "border-l-red-500 bg-red-50";
      case "amanha": return "border-l-orange-500 bg-orange-50";
      default: return "border-l-blue-500 bg-blue-50";
    }
  };

  const proximosHoje = compromissos.filter(c => c.status === "hoje").length;

  return (
    <div className="bg-white rounded-lg border border-slate-200 card-shadow h-[400px] flex flex-col">
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="icon-container icon-container-blue">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Próximos Compromissos</h3>
            <Badge variant="destructive" className="text-xs">1 hoje</Badge>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {compromissos.map((compromisso) => {
            const config = getTipoConfig(compromisso.tipo);
            return (
              <div 
                key={compromisso.id}
                className={`p-4 rounded-lg border-l-4 ${getStatusColor(compromisso.status)} transition-all hover:shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {config.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-slate-800">{compromisso.titulo}</h4>
                      <Badge variant="outline" className="text-xs">
                        {config.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {compromisso.data}
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {compromisso.local}
                      </p>
                      {compromisso.participantes && (
                        <p className="text-sm text-slate-600 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {compromisso.participantes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Preparar
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs h-7">
                        Reagendar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="pt-2 text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              Ver toda agenda →
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};