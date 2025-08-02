import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, DollarSign, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FornecedorCotacao {
  id: string;
  nome: string;
  email: string;
  cnpj: string;
  valor_proposto?: number;
  prazo_entrega?: number;
  observacoes?: string;
  status: 'convidado' | 'respondido' | 'vencedor';
  data_resposta?: string;
}

interface ThreeBidsProps {
  requisicaoId: string;
  valor_estimado: number;
  onComplete: (vencedor: FornecedorCotacao) => void;
}

export const ThreeBidsAndBuy = ({ requisicaoId, valor_estimado, onComplete }: ThreeBidsProps) => {
  const { toast } = useToast();
  const [fornecedores, setFornecedores] = useState<FornecedorCotacao[]>([
    {
      id: '1',
      nome: 'Fornecedor A',
      email: 'contato@fornecedora.com',
      cnpj: '11.111.111/0001-11',
      status: 'convidado'
    },
    {
      id: '2', 
      nome: 'Fornecedor B',
      email: 'vendas@fornecedorb.com',
      cnpj: '22.222.222/0001-22',
      status: 'convidado'
    },
    {
      id: '3',
      nome: 'Fornecedor C', 
      email: 'comercial@fornecedorc.com',
      cnpj: '33.333.333/0001-33',
      status: 'convidado'
    }
  ]);

  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: '',
    email: '',
    cnpj: ''
  });

  const adicionarFornecedor = () => {
    if (!novoFornecedor.nome || !novoFornecedor.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const novoId = (fornecedores.length + 1).toString();
    setFornecedores([...fornecedores, {
      id: novoId,
      ...novoFornecedor,
      status: 'convidado'
    }]);

    setNovoFornecedor({ nome: '', email: '', cnpj: '' });
    
    toast({
      title: "Fornecedor adicionado",
      description: "Convite será enviado automaticamente"
    });
  };

  const simularResposta = (fornecedorId: string) => {
    setFornecedores(prev => prev.map(f => 
      f.id === fornecedorId 
        ? {
            ...f,
            status: 'respondido' as const,
            valor_proposto: valor_estimado * (0.8 + Math.random() * 0.4),
            prazo_entrega: 7 + Math.floor(Math.random() * 14),
            data_resposta: new Date().toISOString(),
            observacoes: 'Proposta enviada conforme solicitado'
          }
        : f
    ));
  };

  const selecionarVencedor = (fornecedorId: string) => {
    const vencedor = fornecedores.find(f => f.id === fornecedorId);
    if (!vencedor || !vencedor.valor_proposto) return;

    setFornecedores(prev => prev.map(f => ({
      ...f,
      status: f.id === fornecedorId ? 'vencedor' as const : f.status
    })));

    toast({
      title: "Fornecedor selecionado",
      description: `${vencedor.nome} foi selecionado como vencedor`
    });

    onComplete(vencedor);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'convidado': return 'bg-yellow-100 text-yellow-800';
      case 'respondido': return 'bg-blue-100 text-blue-800';
      case 'vencedor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const fornecedoresRespondidos = fornecedores.filter(f => f.status === 'respondido');
  const podeFinalizarCotacao = fornecedoresRespondidos.length >= 3;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            3-Bids and Buy - Cotação Rápida
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Processo simplificado para requisições até R$ 1.000 - Mínimo 3 cotações
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Estimado</p>
                <p className="font-semibold">{formatCurrency(valor_estimado)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Prazo Resposta</p>
                <p className="font-semibold">48 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Respostas</p>
                <p className="font-semibold">{fornecedoresRespondidos.length}/3</p>
              </div>
            </div>
          </div>

          {/* Lista de Fornecedores */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium">Fornecedores Convidados</h3>
            {fornecedores.map((fornecedor) => (
              <Card key={fornecedor.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{fornecedor.nome}</h4>
                        <Badge className={getStatusColor(fornecedor.status)}>
                          {fornecedor.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{fornecedor.email}</p>
                      <p className="text-sm text-muted-foreground">{fornecedor.cnpj}</p>
                      
                      {fornecedor.status === 'respondido' && (
                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Valor:</span> {formatCurrency(fornecedor.valor_proposto!)}
                          </div>
                          <div>
                            <span className="font-medium">Prazo:</span> {fornecedor.prazo_entrega} dias
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {fornecedor.status === 'convidado' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => simularResposta(fornecedor.id)}
                        >
                          Simular Resposta
                        </Button>
                      )}
                      {fornecedor.status === 'respondido' && podeFinalizarCotacao && (
                        <Button 
                          size="sm"
                          onClick={() => selecionarVencedor(fornecedor.id)}
                        >
                          Selecionar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Adicionar Novo Fornecedor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Adicionar Fornecedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={novoFornecedor.nome}
                    onChange={(e) => setNovoFornecedor(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Nome do fornecedor"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoFornecedor.email}
                    onChange={(e) => setNovoFornecedor(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contato@fornecedor.com"
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={novoFornecedor.cnpj}
                    onChange={(e) => setNovoFornecedor(prev => ({ ...prev, cnpj: e.target.value }))}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
              </div>
              <Button className="mt-4" onClick={adicionarFornecedor}>
                Adicionar Fornecedor
              </Button>
            </CardContent>
          </Card>

          {!podeFinalizarCotacao && (
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                Aguardando pelo menos 3 respostas para finalizar a cotação
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};