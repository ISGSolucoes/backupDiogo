
import React from "react";
import { 
  FileText,
  Download, 
  Send,
  MessageSquare,
  Calendar,
  User,
  Briefcase,
  Building,
  FileSpreadsheet,
  DollarSign,
  Clock,
  CircleDot,
  CheckCircle,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Tipo para os dados da requisição
export type Requisicao = {
  id: string;
  nome: string;
  solicitante: string;
  area: string;
  centroCusto: string;
  tipo: string;
  classificacao: string;
  dataRequisicao: string;
  prazo: string;
  status: string;
  justificativa: string;
  itens: Item[];
  anexos: Anexo[];
  timeline: TimelineEvent[];
  valorTotal: number;
};

type Item = {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  categoria: string;
  valorEstimado: number;
};

type Anexo = {
  id: string;
  nome: string;
  tipo: string;
  tamanho: string;
  dataUpload: string;
};

export type TimelineEvent = {
  id: string;
  data: string;
  titulo: string;
  descricao: string;
  tipo: string;
  responsavel?: string;
  comentario?: string;
};

interface DetalhesRequisicaoProps {
  requisicao: Requisicao;
}

export const DetalhesRequisicaoComponente = ({ requisicao }: DetalhesRequisicaoProps) => {
  const [comentario, setComentario] = React.useState("");

  // Função para obter a classe de estilo com base no status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-amber-100 text-amber-800";
      case "aprovada":
        return "bg-blue-100 text-blue-800";
      case "em_cotacao":
        return "bg-purple-100 text-purple-800";
      case "finalizada":
        return "bg-green-100 text-green-800";
      case "atrasada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case "pendente":
        return "Aguardando aprovação";
      case "aprovada":
        return "Aprovada";
      case "em_cotacao":
        return "Em cotação";
      case "finalizada":
        return "Finalizada";
      case "atrasada":
        return "Atrasada";
      default:
        return status;
    }
  };

  // Função para obter o ícone do tipo de evento da timeline
  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case "criacao":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "aprovacao":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejeicao":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "cotacao":
        return <FileCheck className="h-5 w-5 text-purple-500" />;
      case "comentario":
        return <MessageSquare className="h-5 w-5 text-slate-500" />;
      default:
        return <CircleDot className="h-5 w-5 text-slate-500" />;
    }
  };

  // Enviar comentário
  const enviarComentario = () => {
    if (!comentario.trim()) {
      toast.error("Digite um comentário antes de enviar");
      return;
    }
    
    toast.success("Comentário enviado com sucesso!");
    setComentario("");
  };

  // Solicitar atualização
  const solicitarAtualizacao = () => {
    toast.success("Solicitação de atualização enviada ao comprador!");
  };

  // Baixar PO
  const baixarPO = () => {
    toast.info("Funcionalidade de download do PO será implementada em breve");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna 1: Informações e itens */}
      <div className="lg:col-span-2 space-y-6">
        {/* Dados da requisição */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-600" /> 
              Informações da Requisição
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Solicitante</p>
                <p className="font-medium flex items-center gap-1">
                  <User className="h-4 w-4 text-slate-400" />
                  {requisicao.solicitante}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Área/Departamento</p>
                <p className="font-medium flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  {requisicao.area}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Centro de Custo</p>
                <p className="font-medium flex items-center gap-1">
                  <Building className="h-4 w-4 text-slate-400" />
                  {requisicao.centroCusto}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Tipo de Requisição</p>
                <p className="font-medium">{requisicao.tipo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Data da Solicitação</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {new Date(requisicao.dataRequisicao).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Prazo Desejado</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {new Date(requisicao.prazo).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Classificação</p>
                <p className="font-medium">{requisicao.classificacao}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Valor Total Estimado</p>
                <p className="font-medium flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(requisicao.valorTotal)}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-slate-500">Justificativa</p>
              <p className="text-sm bg-slate-50 p-3 rounded border border-slate-200">
                {requisicao.justificativa}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Itens da requisição */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FileSpreadsheet className="h-5 w-5 text-amber-600" /> 
              Itens da Requisição
            </h2>
            
            <div className="space-y-4">
              {requisicao.itens.map((item, index) => (
                <div key={item.id} className="border border-slate-200 rounded-md p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Item {index + 1}</h3>
                    <Badge variant="outline">{item.categoria}</Badge>
                  </div>
                  <p className="mt-2">{item.nome}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                    <span>Quantidade: {item.quantidade} {item.unidade}</span>
                    <span>Valor unitário est.: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorEstimado)}</span>
                    <span>Total est.: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantidade * item.valorEstimado)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anexos */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-amber-600" /> 
              Documentos e Anexos
            </h2>
            
            <div className="space-y-2">
              {requisicao.anexos.map((anexo) => (
                <div key={anexo.id} className="flex justify-between items-center py-2 border-b">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{anexo.nome}</p>
                      <p className="text-xs text-slate-500">
                        {anexo.tamanho} • Adicionado em {new Date(anexo.dataUpload).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {requisicao.anexos.length === 0 && (
                <p className="text-slate-500 text-center py-4">
                  Nenhum anexo disponível para esta requisição
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Coluna 2: Timeline e comunicação */}
      <div className="space-y-6">
        {/* Informações de status e ações */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Ações</h2>
            
            <div className="space-y-4">
              <Button onClick={solicitarAtualizacao} className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" /> Solicitar Atualização
              </Button>
              
              {requisicao.status === "finalizada" && (
                <Button onClick={baixarPO} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" /> Download do PO
                </Button>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Contato do Comprador</h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Mariana Costa</p>
                  <p className="text-xs text-slate-500">mariana.costa@exemplo.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Comentários */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Comentários</h2>
            
            <div className="space-y-4 mb-4">
              <Textarea 
                placeholder="Adicione um comentário para o comprador..." 
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={enviarComentario} className="w-full">
                <Send className="h-4 w-4 mr-2" /> Enviar Comentário
              </Button>
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">MC</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">Mariana Costa</p>
                  </div>
                  <p className="text-xs text-slate-500">14/05/2023 09:30</p>
                </div>
                <p className="text-sm mt-2">
                  Olá, os fornecedores já foram convidados para o evento de cotação. Estamos aguardando as propostas que devem chegar até amanhã.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Timeline */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Linha do Tempo</h2>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
              
              <div className="space-y-6">
                {requisicao.timeline.map((evento) => (
                  <div key={evento.id} className="pl-10 relative">
                    <div className="absolute left-0 top-0 bg-white p-1 rounded-full">
                      {getEventIcon(evento.tipo)}
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500">
                        {evento.data}
                      </p>
                      <p className="font-medium">{evento.titulo}</p>
                      <p className="text-sm text-slate-600">{evento.descricao}</p>
                      
                      {evento.responsavel && (
                        <p className="text-xs text-slate-500 mt-1">
                          Por: {evento.responsavel}
                        </p>
                      )}
                      
                      {evento.comentario && (
                        <div className="mt-2 text-sm bg-slate-50 p-2 rounded border border-slate-200">
                          "{evento.comentario}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
