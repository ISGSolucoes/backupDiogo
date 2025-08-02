
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function PortalLogin() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', senha: '' });
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!loginData.email || !loginData.senha) {
      toast.error('Preencha email e senha');
      return;
    }

    setCarregando(true);
    
    try {
      // Validar login usando a função do banco
      const { data, error } = await supabase
        .rpc('validate_portal_login', {
          p_email: loginData.email,
          p_password: loginData.senha
        });

      if (error) {
        console.error('Erro na validação:', error);
        toast.error('Erro no login. Tente novamente.');
        return;
      }

      if (data && data.length > 0 && data[0].is_valid) {
        toast.success('Login realizado com sucesso!');
        navigate('/portal-fornecedor');
      } else {
        toast.error('Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro inesperado no login');
    } finally {
      setCarregando(false);
    }
  };

  return (
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

            {/* Formulário de Login */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
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
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="h-12"
                  />
                </div>

                <Button 
                  onClick={handleLogin}
                  disabled={carregando}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {carregando ? 'Entrando...' : 'Entrar'}
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
                    onClick={() => navigate('/portal-fornecedor/cadastro')}
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
}
