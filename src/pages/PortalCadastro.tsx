
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Building2, CheckCircle2, Mail, Sparkles, ArrowRight, User, Lock, Shield, TrendingUp, Users, Clock, ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { CadastroUnificado } from '@/components/portal-cadastro/CadastroUnificado';
import { useDeteccaoOrigem } from '@/hooks/useDeteccaoOrigem';

export default function PortalCadastro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { origem, convite, carregando } = useDeteccaoOrigem(searchParams.get('token'));
  
  const [modoAtual, setModoAtual] = useState<'entrada' | 'login' | 'registro' | 'concluido'>('entrada');
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [dadosCadastro, setDadosCadastro] = useState<any>(null);
  const [loginData, setLoginData] = useState({ usuario: '', senha: '' });

  useEffect(() => {
    if (origem === 'convite' && convite) {
      toast.info(`Bem-vindo! Você foi convidado por ${convite.cliente_nome}`);
    }
  }, [origem, convite]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const renderEtapaConcluido = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-green-900 dark:text-green-100">Cadastro Realizado!</CardTitle>
          <CardDescription>
            Seu cadastro foi processado com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {origem === 'convite' ? 'Relacionamento Aceito' : 'Auto-Registro'}
            </Badge>
            
            {origem === 'convite' && convite && (
              <p className="text-sm text-muted-foreground">
                Você agora está conectado com <strong>{convite.cliente_nome}</strong>
              </p>
            )}
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>Próximos passos:</strong>
            </p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>• Verificação de email será enviada</li>
              <li>• Documentos podem ser solicitados</li>
              <li>• Acesso ao portal será liberado em breve</li>
            </ul>
          </div>
          
          <Button 
            onClick={() => navigate('/portal-fornecedor')} 
            className="w-full"
          >
            Ir para o Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const handleCadastroCompleto = (dados: any) => {
    setDadosCadastro(dados);
    setModoAtual('concluido');
    toast.success('Cadastro realizado com sucesso!');
  };

  const handleLogin = () => {
    if (!loginData.usuario || !loginData.senha) {
      toast.error('Preencha usuário e senha');
      return;
    }
    
    // Aqui você implementaria a lógica de autenticação
    toast.success('Login realizado com sucesso!');
    navigate('/portal-fornecedor');
  };

  const renderEntrada = () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[90vh]">
          {/* Lado Esquerdo - Formulário de Login */}
          <div className="w-full max-w-md mx-auto lg:mx-0 space-y-8">
            {/* Logo e Saudação */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">SourceXpress</h1>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  👋 Bem-vindo à SourceXpress!
                </h2>
                <p className="text-muted-foreground">
                  A sua plataforma de compras e fornecedores unificada
                </p>
              </div>
            </div>

            {/* Convite Info */}
            {convite && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>Convite de <strong>{convite.cliente_nome}</strong></span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formulário de Login */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="usuario" className="text-sm font-medium">
                    Login
                  </Label>
                  <Input
                    id="usuario"
                    placeholder="Digite seu usuário"
                    value={loginData.usuario}
                    onChange={(e) => setLoginData(prev => ({ ...prev, usuario: e.target.value }))}
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-sm font-medium">
                    Senha
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={loginData.senha}
                    onChange={(e) => setLoginData(prev => ({ ...prev, senha: e.target.value }))}
                    className="h-12"
                  />
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  Entrar
                </Button>
              </div>

              {/* Links */}
              <div className="space-y-3 text-center">
                <button 
                  onClick={() => toast.info('Funcionalidade em desenvolvimento')}
                  className="text-sm text-primary hover:underline"
                >
                  Esqueci meus dados
                </button>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <span>Novo na SourceXpress?</span>
                  <button 
                    onClick={() => setModoAtual('registro')}
                    className="text-primary hover:underline font-medium"
                  >
                    Cadastrar-se →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Espaço para Imagem */}
          <div className="hidden lg:block">
            <div className="w-full max-w-lg mx-auto h-96 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Building2 className="h-16 w-16 text-muted-foreground/40 mx-auto" />
                <p className="text-muted-foreground/60 text-lg">Espaço reservado para sua imagem</p>
                <p className="text-muted-foreground/40 text-sm">
                  Envie uma imagem para personalizar esta área
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegistro = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 overflow-y-auto">
      <div className="w-full px-8 py-6">
        {/* Header Fixo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">SourceXpress</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">
            Registre-se como Fornecedor
          </h1>
          <p className="text-muted-foreground mb-8">
            Complete seu cadastro em poucos passos e faça parte da nossa rede de fornecedores
          </p>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/portal-login')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Login
          </Button>
        </div>

        {/* Formulário Expandido para Largura Completa */}
        <div className="w-full">
          <CadastroUnificado
            convite={convite}
            origem={origem}
            onCadastroCompleto={handleCadastroCompleto}
          />
        </div>

        {/* Informações de Segurança no Final */}
        <div className="mt-12 p-6 bg-card rounded-lg border">
          <div className="flex items-center space-x-2 text-foreground mb-4">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Seus dados estão seguros</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança da informação
          </p>
        </div>
      </div>
    </div>
  );

  // Renderização principal baseada no modo atual
  switch (modoAtual) {
    case 'entrada':
      return renderEntrada();
    case 'registro':
      return renderRegistro();
    case 'concluido':
      return renderEtapaConcluido();
    default:
      return renderEntrada();
  }
}
