import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  
  console.log("🔐 Auth page:", { user: !!user, loading });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome_completo: '',
    area: '',
    cargo: ''
  });

  // Redirecionar se já autenticado (comentado para permitir acesso mesmo logado)
  // useEffect(() => {
  //   if (!loading && user) {
  //     navigate('/inicio');
  //   }
  // }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (!error) {
      navigate('/inicio');
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.email || !registerData.password || !registerData.nome_completo || !registerData.area) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(registerData.email, registerData.password, {
      nome_completo: registerData.nome_completo,
      area: registerData.area,
      cargo: registerData.cargo
    });
    
    if (!error) {
      // Reset form
      setRegisterData({
        email: '',
        password: '',
        confirmPassword: '',
        nome_completo: '',
        area: '',
        cargo: ''
      });
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sistema de Suprimentos All-in-One
          </h1>
          <p className="text-muted-foreground">
            Plataforma unificada para gestão de compras e fornecedores
          </p>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Fornecedores? <a href="/portal-login" className="text-primary hover:underline font-medium">Clique aqui para o Portal de Fornecedores</a>
            </p>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Entrar na sua conta
                </CardTitle>
                <CardDescription>
                  Use suas credenciais para acessar o sistema
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Sua senha"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Criar nova conta
                </CardTitle>
                <CardDescription>
                  Preencha os dados para criar sua conta
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email *</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome Completo *</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={registerData.nome_completo}
                      onChange={(e) => setRegisterData({ ...registerData, nome_completo: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-area">Área *</Label>
                    <Select 
                      value={registerData.area}
                      onValueChange={(value) => setRegisterData({ ...registerData, area: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FACILITIES">Facilities</SelectItem>
                        <SelectItem value="SUPRIMENTOS">Suprimentos</SelectItem>
                        <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
                        <SelectItem value="TI">Tecnologia da Informação</SelectItem>
                        <SelectItem value="COMERCIAL">Comercial</SelectItem>
                        <SelectItem value="DIRETORIA">Diretoria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-cargo">Cargo</Label>
                    <Input
                      id="register-cargo"
                      type="text"
                      placeholder="Seu cargo (opcional)"
                      value={registerData.cargo}
                      onChange={(e) => setRegisterData({ ...registerData, cargo: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha *</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirmar Senha *</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;