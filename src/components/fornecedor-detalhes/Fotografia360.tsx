
import React from "react";
import {
  Calendar,
  Clock,
  Activity,
  FileCheck,
  Users,
  MessageSquare,
  Award,
  Building,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Fotografia360Props {
  dados: {
    eventosEmAndamento: number;
    ultimaParticipacao: string;
    status: string;
    slaMedio: string;
    npsInterno: number;
    ultimoDocumento: string;
    ultimoContato: string;
    participacaoAreas: string[];
  };
}

export const Fotografia360 = ({ dados }: Fotografia360Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-blue-50 rounded-full">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Eventos em andamento</p>
            <p className="text-xl font-bold">{dados.eventosEmAndamento}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-green-50 rounded-full">
            <Activity className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Última participação</p>
            <p className="text-sm font-medium">{dados.ultimaParticipacao}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-amber-50 rounded-full">
            <Award className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Status geral</p>
            <p className="text-sm font-medium">{dados.status}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-purple-50 rounded-full">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">SLA médio</p>
            <p className="text-xl font-bold">{dados.slaMedio}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-indigo-50 rounded-full">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">NPS interno</p>
            <p className="text-xl font-bold">{dados.npsInterno.toFixed(1)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-red-50 rounded-full">
            <FileCheck className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Último documento</p>
            <p className="text-sm font-medium">{dados.ultimoDocumento}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-cyan-50 rounded-full">
            <MessageSquare className="h-5 w-5 text-cyan-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Último contato</p>
            <p className="text-sm font-medium">{dados.ultimoContato}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-2 bg-emerald-50 rounded-full">
            <Building className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Participação por área</p>
            <p className="text-sm font-medium">{dados.participacaoAreas.join(", ")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
