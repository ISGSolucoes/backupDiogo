import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  MessageCircle, 
  FileText, 
  TrendingUp, 
  Search,
  Send,
  Mic,
  Settings,
  History,
  Star,
  ArrowLeft,
  Building2,
  ChartBar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  response?: string;
  timestamp: string;
  isLoading?: boolean;
}

const IAAssistente = () => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 1,
      user: 'Você',
      message: 'Como está meu desempenho com os clientes este mês?',
      response: 'Seu desempenho está excelente! Você tem 94% de taxa de resposta no prazo e 89% de aprovação nos documentos enviados. Destaque para Petrobras: 100% de conformidade nas últimas 5 entregas.',
      timestamp: '10:30'
    },
    {
      id: 2,
      user: 'Você',
      message: 'Quais documentos estão próximos do vencimento?',
      response: 'Identifiquei 3 documentos urgentes: 1 cotação da Vale (vence em 2 dias), 1 contrato da Petrobras (vence amanhã) e 1 qualificação da Braskem (vence hoje). Posso te ajudar a priorizá-los?',
      timestamp: '10:25'
    }
  ]);

  // Auto scroll para o final do chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const sugestoes = [
    'Analisar minha performance por cliente',
    'Listar documentos pendentes urgentes',
    'Gerar relatório de entregas',
    'Identificar oportunidades de novos negócios',
    'Comparar meu desempenho trimestral',
    'Verificar prazos vencendo hoje'
  ];

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    const timestamp = new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Adicionar mensagem do usuário ao histórico
    const newUserMessage: ChatMessage = {
      id: Date.now(),
      user: 'Você',
      message: userMessage,
      timestamp,
      isLoading: true
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ia-assistant', {
        body: { message: userMessage }
      });

      if (error) {
        console.error('Error calling edge function:', error);
        toast.error('Erro ao processar sua mensagem. Tente novamente.');
        return;
      }

      // Atualizar com a resposta da IA
      setChatHistory(prev => 
        prev.map(chat => 
          chat.id === newUserMessage.id 
            ? { ...chat, response: data.response, isLoading: false }
            : chat
        )
      );

    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao conectar com a IA. Verifique sua conexão.');
      
      // Remover mensagem em caso de erro
      setChatHistory(prev => prev.filter(chat => chat.id !== newUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/portal-fornecedor">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Portal
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">🤖 Assistente IA do Fornecedor</h1>
              <p className="text-slate-600">Seu assistente inteligente para gestão de negócios e documentos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ● Online
            </Badge>
            <span className="text-sm text-slate-500">Última atualização: agora</span>
            <div className="flex items-center gap-2 ml-auto">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600">TechSupply Solutions</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Principal */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Conversação
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Histórico de Chat */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {chatHistory.map((chat) => (
                    <div key={chat.id} className="space-y-3">
                      {/* Mensagem do usuário */}
                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg max-w-[80%] shadow-md">
                          <p className="text-sm">{chat.message}</p>
                          <span className="text-xs opacity-75">{chat.timestamp}</span>
                        </div>
                      </div>
                      
                      {/* Resposta da IA ou Loading */}
                      {chat.isLoading ? (
                        <div className="flex justify-start">
                          <div className="bg-slate-100 border p-3 rounded-lg max-w-[80%] shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-sm text-blue-600">Assistente IA</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                              <span className="text-sm text-slate-500">Processando...</span>
                            </div>
                          </div>
                        </div>
                      ) : chat.response && (
                        <div className="flex justify-start">
                          <div className="bg-slate-100 border p-3 rounded-lg max-w-[80%] shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-sm text-blue-600">Assistente IA</span>
                            </div>
                            <p className="text-sm text-slate-700">{chat.response}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                
                {/* Input de Mensagem */}
                <div className="border-t p-4 bg-slate-50">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Textarea
                        placeholder="Digite sua pergunta sobre seus clientes, documentos ou desempenho..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[50px] pr-12 bg-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`absolute right-2 top-2 ${isListening ? 'text-red-500' : 'text-slate-400'}`}
                        onClick={toggleListening}
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isLoading || !message.trim()}
                      className="px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Painel Lateral */}
          <div className="space-y-6">
            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChartBar className="h-5 w-5 text-blue-600" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sugestoes.map((sugestao, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-sm h-auto p-3 hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => setMessage(sugestao)}
                  >
                    {sugestao}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Status Rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Status Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Urgentes</span>
                  </div>
                  <Badge variant="destructive">3</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Pendentes</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">12</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Concluídos hoje</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">8</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas da IA */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas da IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Consultas hoje</span>
                  <Badge variant="secondary">23</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Tempo médio resposta</span>
                  <Badge variant="secondary">0.8s</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Precisão das análises</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">96%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Satisfação</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funcionalidades */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Funcionalidades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Análise de Documentos</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Análise de Performance</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer">
                  <Search className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Busca Inteligente</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Alertas Proativos</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer">
                  <History className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Histórico Completo</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IAAssistente;