
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Video, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

interface AgendarReuniaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorNome: string;
}

export const AgendarReuniaoModal = ({ open, onOpenChange, fornecedorNome }: AgendarReuniaoModalProps) => {
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [duracao, setDuracao] = useState("");
  const [tipo, setTipo] = useState("");
  const [participantes, setParticipantes] = useState("");
  const [agenda, setAgenda] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const handleAgendarReuniao = () => {
    if (!titulo || !data || !horario || !tipo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success("Reunião agendada com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Agendar Reunião - {fornecedorNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Reunião</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título da Reunião *</Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Revisão de Contrato"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Reunião *</Label>
                  <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Presencial
                        </div>
                      </SelectItem>
                      <SelectItem value="videoconferencia">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Videoconferência
                        </div>
                      </SelectItem>
                      <SelectItem value="telefone">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Telefone
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario">Horário *</Label>
                  <Input
                    id="horario"
                    type="time"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração</Label>
                  <Select value={duracao} onValueChange={setDuracao}>
                    <SelectTrigger>
                      <SelectValue placeholder="Duração" />
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

              <div className="space-y-2">
                <Label htmlFor="participantes">Participantes</Label>
                <Input
                  id="participantes"
                  placeholder="Ex: João Silva, Maria Santos..."
                  value={participantes}
                  onChange={(e) => setParticipantes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Agenda */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agenda da Reunião</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agenda">Pauta</Label>
                <Textarea
                  id="agenda"
                  placeholder="1. Revisão de performance&#10;2. Discussão de novos termos&#10;3. Próximos passos..."
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre a reunião..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAgendarReuniao} className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4 mr-2" />
              Agendar Reunião
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
