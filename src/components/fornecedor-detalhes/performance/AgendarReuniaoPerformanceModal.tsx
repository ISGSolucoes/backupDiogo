
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, CheckCircle2, Video } from "lucide-react";
import { toast } from "sonner";

interface AgendarReuniaoPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorNome: string;
}

export const AgendarReuniaoPerformanceModal = ({ open, onOpenChange, fornecedorNome }: AgendarReuniaoPerformanceModalProps) => {
  const [tipoReuniao, setTipoReuniao] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [duracao, setDuracao] = useState("60");
  const [participantes, setParticipantes] = useState("");
  const [assunto, setAssunto] = useState("");

  const tiposReuniao = [
    { id: "review_performance", nome: "Review de Performance", icone: "📊" },
    { id: "plano_melhoria", nome: "Discussão do Plano de Melhoria", icone: "📈" },
    { id: "acompanhamento", nome: "Acompanhamento de Metas", icone: "🎯" },
    { id: "feedback", nome: "Sessão de Feedback", icone: "💬" }
  ];

  const handleAgendarReuniao = () => {
    if (!tipoReuniao || !data || !horario) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    toast.success("Reunião de performance agendada com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Agendar Reunião de Performance - {fornecedorNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipo de Reunião</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tiposReuniao.map((tipo) => (
                  <div
                    key={tipo.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      tipoReuniao === tipo.id 
                        ? "border-purple-500 bg-purple-50" 
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => setTipoReuniao(tipo.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{tipo.icone}</span>
                      <span className="font-medium text-sm">{tipo.nome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Data e Horário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Data</Label>
                  <Input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horário</Label>
                  <Input
                    type="time"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duração (min)</Label>
                  <Select value={duracao} onValueChange={setDuracao}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="90">1h 30min</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participantes e Agenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Participantes (emails separados por vírgula)</Label>
                <Input
                  placeholder="participante1@empresa.com, participante2@empresa.com"
                  value={participantes}
                  onChange={(e) => setParticipantes(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Assunto/Agenda</Label>
                <Textarea
                  placeholder="Descreva o objetivo e agenda da reunião..."
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Link da Reunião</span>
            </div>
            <p className="text-sm text-blue-700">
              Um link de videoconferência será gerado automaticamente e enviado para todos os participantes.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAgendarReuniao} className="bg-purple-600 hover:bg-purple-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Agendar Reunião
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
