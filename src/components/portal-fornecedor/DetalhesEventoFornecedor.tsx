import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Calendar,
  Building,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Package,
  DollarSign,
  MapPin,
  Award,
  Info
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

interface ItemEvento {
  id: string;
  codigo: string;
  descricao: string;
  especificacao: string;
  quantidade: number;
  unidade: string;
  prazoEntrega: string;
  observacoes: string;
  categoria: string;
}

interface CriterioHabilitacao {
  id: string;
  criterio: string;
  obrigatorio: boolean;
  descricao?: string;
}

interface DocumentoObrigatorio {
  id: string;
  nome: string;
  descricao: string;
  obrigatorio: boolean;
  formatos: string[];
}

interface EventoDetalhado {
  id: string;
  projetoId: string;
  titulo: string;
  empresa: string;
  empresaCnpj: string;
  categoria: string;
  tipoEvento: string;
  dataLimite: string;
  localEntrega: string;
  avaliacao: {
    tecnico: number;
    comercial: number;
  };
  descricaoCompleta: string;
  itens: ItemEvento[];
  criteriosHabilitacao: CriterioHabilitacao[];
  documentosObrigatorios: DocumentoObrigatorio[];
  condicoes: {
    validadeProposta: string;
    condicaoPagamento: string;
    garantia: string;
    tipoFrete: string;
  };
  observacoesGerais?: string;
  status: string;
}

const eventoMock: EventoDetalhado = {
  id: "1",
  projetoId: "SRC-2024-000001",
  titulo: "RFP – ERP e Serviços de Implementação",
  empresa: "Cliente GOV123",
  empresaCnpj: "12.345.678/0001-90",
  categoria: "ERP Corporativo",
  tipoEvento: "RFP",
  dataLimite: "2025-08-12T17:00:00",
  localEntrega: "São Paulo/SP",
  avaliacao: {
    tecnico: 60,
    comercial: 40
  },
  descricaoCompleta: "Contratação de sistema ERP completo com módulos financeiro, estoque, RH e recursos humanos, incluindo serviços de implementação, migração de dados, treinamento e suporte técnico.",
  itens: [
    {
      id: "1",
      codigo: "SW-001",
      descricao: "Sistema de Gestão ERP",
      especificacao: "Deve incluir módulos: financeiro, estoque, RH",
      quantidade: 1,
      unidade: "Licença",
      prazoEntrega: "45 dias",
      observacoes: "Licença perpétua com direito a atualizações",
      categoria: "Software"
    },
    {
      id: "2", 
      codigo: "SW-002",
      descricao: "Implementação ERP",
      especificacao: "Deve incluir migração de dados e testes finais",
      quantidade: 1,
      unidade: "Projeto",
      prazoEntrega: "60 dias",
      observacoes: "Incluir plano de contingência",
      categoria: "Serviço"
    },
    {
      id: "3",
      codigo: "TR-001", 
      descricao: "Treinamento de Usuários",
      especificacao: "Preferencialmente presencial",
      quantidade: 50,
      unidade: "Usuário",
      prazoEntrega: "15 dias",
      observacoes: "Material didático incluso",
      categoria: "Serviço"
    },
    {
      id: "4",
      codigo: "SP-001",
      descricao: "Suporte Técnico Anual", 
      especificacao: "24/7, 1º ano incluso, com SLA",
      quantidade: 12,
      unidade: "Mês",
      prazoEntrega: "1 dia",
      observacoes: "SLA de 4 horas para casos críticos",
      categoria: "Serviço"
    }
  ],
  criteriosHabilitacao: [
    {
      id: "1",
      criterio: "Experiência mínima de 2 anos em ERP",
      obrigatorio: true,
      descricao: "Comprovação através de referências comerciais"
    },
    {
      id: "2",
      criterio: "Capacidade técnica comprovada",
      obrigatorio: true,
      descricao: "Equipe com certificações relevantes"
    },
    {
      id: "3", 
      criterio: "Equipe com certificações em TI",
      obrigatorio: true
    },
    {
      id: "4",
      criterio: "Empresa legalmente constituída",
      obrigatorio: true
    },
    {
      id: "5",
      criterio: "ISO 9001 (se aplicável)",
      obrigatorio: false
    }
  ],
  documentosObrigatorios: [
    {
      id: "1",
      nome: "Proposta Técnica Detalhada",
      descricao: "Documento com especificações técnicas completas",
      obrigatorio: true,
      formatos: ["PDF", "DOC", "DOCX"]
    },
    {
      id: "2",
      nome: "Proposta Comercial", 
      descricao: "Planilha com preços e condições comerciais",
      obrigatorio: true,
      formatos: ["PDF", "XLS", "XLSX"]
    },
    {
      id: "3",
      nome: "Referências Comerciais",
      descricao: "Lista de clientes com projetos similares",
      obrigatorio: true,
      formatos: ["PDF", "DOC", "DOCX"]
    },
    {
      id: "4",
      nome: "Certidões Negativas",
      descricao: "Certidão negativa de débitos e regularidade fiscal", 
      obrigatorio: true,
      formatos: ["PDF"]
    },
    {
      id: "5",
      nome: "Cronograma de Implantação",
      descricao: "Cronograma detalhado do projeto",
      obrigatorio: true,
      formatos: ["PDF", "XLS", "XLSX", "MPP"]
    }
  ],
  condicoes: {
    validadeProposta: "90 dias",
    condicaoPagamento: "30 dias após entrega completa",
    garantia: "Mínimo 12 meses (para suporte/serviço)",
    tipoFrete: "CIF"
  },
  observacoesGerais: "Favor incluir plano de implantação e indicar estrutura da equipe que atuará no projeto.",
  status: "aberto"
};

export const DetalhesEventoFornecedor: React.FC = () => {
  const { projetoId } = useParams();
  const navigate = useNavigate();
  const [evento] = useState<EventoDetalhado>(eventoMock);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEnviarProposta = () => {
    navigate(`/portal-fornecedor/proposta/${projetoId}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header do Evento */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{evento.titulo}</h1>
                <Badge variant="outline">{evento.tipoEvento}</Badge>
              </div>
              <p className="text-muted-foreground">{evento.projetoId}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{evento.empresa}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{evento.categoria}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{evento.localEntrega}</span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <Clock className="h-4 w-4" />
                <span>Prazo: {formatarData(evento.dataLimite)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Avaliação: Técnica ({evento.avaliacao.tecnico}%) + Preço ({evento.avaliacao.comercial}%)
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Resumo do Evento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Resumo do Evento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm leading-relaxed">{evento.descricaoCompleta}</p>
          </div>
        </CardContent>
      </Card>

      {/* Itens para Proposta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Itens para Proposta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
              <span>Item</span>
              <span>Quantidade</span>
              <span>Unidade</span>
              <span>Prazo Entrega</span>
              <span>Observações</span>
              <span>Categoria</span>
              <span>Preencher Preço?</span>
            </div>
            {evento.itens.map((item) => (
              <div key={item.id} className="grid grid-cols-7 gap-4 text-sm py-3 border-b">
                <div>
                  <p className="font-medium">{item.descricao}</p>
                  <p className="text-muted-foreground text-xs">{item.codigo}</p>
                  <p className="text-muted-foreground text-xs">{item.especificacao}</p>
                </div>
                <span>{item.quantidade}</span>
                <span>{item.unidade}</span>
                <span>{item.prazoEntrega}</span>
                <span className="text-xs">{item.observacoes}</span>
                <Badge variant="outline" className="w-fit">{item.categoria}</Badge>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="ml-1 text-xs">Sim</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ✅ <strong>O fornecedor insere:</strong> Preço unitário, Preço total (calculado), Pode anexar observação por item (opcional)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documentos Obrigatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos Obrigatórios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {evento.documentosObrigatorios.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{doc.nome}</span>
                    {doc.obrigatorio && (
                      <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{doc.descricao}</p>
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: {doc.formatos.join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">[Enviar]</span>
                  <Button variant="outline" size="sm">
                    Selecionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
            <p className="text-sm text-orange-800">
              🟡 <strong>O botão "Enviar Proposta" só será liberado se:</strong><br/>
              • Todos os documentos obrigatórios forem enviados<br/>
              • Todos os campos de preço forem preenchidos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Critérios de Habilitação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Critérios de Habilitação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {evento.criteriosHabilitacao.map((criterio) => (
              <div key={criterio.id} className="flex items-start gap-3 p-3 border rounded">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{criterio.criterio}</span>
                    {criterio.obrigatorio && (
                      <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                    )}
                  </div>
                  {criterio.descricao && (
                    <p className="text-sm text-muted-foreground">{criterio.descricao}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>O fornecedor é alertado que só será avaliado se cumprir os critérios.</strong><br/>
              Não há campo para preenchimento direto aqui, mas os documentos serão usados para validar.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Condições Comerciais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Condições Comerciais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Validade da Proposta</p>
              <p className="text-sm text-muted-foreground">{evento.condicoes.validadeProposta}</p>
            </div>
            <div>
              <p className="font-medium">Condição de Pagamento</p>
              <p className="text-sm text-muted-foreground">{evento.condicoes.condicaoPagamento}</p>
            </div>
            <div>
              <p className="font-medium">Garantia</p>
              <p className="text-sm text-muted-foreground">{evento.condicoes.garantia}</p>
            </div>
            <div>
              <p className="font-medium">Tipo de Frete</p>
              <p className="text-sm text-muted-foreground">{evento.condicoes.tipoFrete}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observações do Cliente */}
      {evento.observacoesGerais && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Observações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm">{evento.observacoesGerais}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão de Ação */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleEnviarProposta}>
          <FileText className="h-4 w-4 mr-2" />
          Enviar Proposta
        </Button>
      </div>
    </div>
  );
};