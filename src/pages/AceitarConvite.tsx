
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AceitarConvite = () => {
  const { token } = useParams<{ token: string }>();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [convite, setConvite] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    telefone: '',
    cargo: ''
  });

  useEffect(() => {
    if (token) {
      buscarConvite();
    }
  }, [token]);

  const buscarConvite = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_invites')
        .select('*')
        .eq('token', token)
        .eq('status', 'enviado')
        .single();

      if (error || !data) {
        setError('Convite não encontrado ou já foi utilizado');
        return;
      }

      // Verificar se não expirou
      const dataExpiracao = new Date(data.data_expiracao);
      if (dataExpiracao < new Date()) {
        setError('Este convite expirou');
        return;
      }

      setConvite(data);
      setFormData(prev => ({
        ...prev,
        cargo: data.cargo || ''
      }));
    } catch (err) {
      setError('Erro ao buscar convite');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setSubmitting(true);
    
    try {
      // Criar conta
      const { error: signUpError } = await signUp(convite.email, formData.password, {
        nome_completo: convite.nome_completo,
        area: convite.area,
        cargo: formData.cargo || convite.cargo,
        telefone: formData.telefone
      });

      if (signUpError) {
        toast.error(`Erro ao criar conta: ${signUpError.message}`);
        return;
      }

      // Marcar convite como aceito
      await supabase
        .from('user_invites')
        .update({
          status: 'aceito',
          data_aceite: new Date().toISOString()
        })
        .eq('id', convite.id);

      toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
      navigate('/auth');
    } catch (error: any) {
      toast.error('Erro ao processar convite');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando convite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-900">Convite Inválido</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/auth')} variant="outline">
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Aceitar Convite</CardTitle>
          <CardDescription>
            Complete seu cadastro para acessar o sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Informações do Convite</h3>
            <p className="text-sm text-muted-foreground">
              <strong>Nome:</strong> {convite.nome_completo}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> {convite.email}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Área:</strong> {convite.area}
            </p>
            {convite.cargo && (
              <p className="text-sm text-muted-foreground">
                <strong>Cargo:</strong> {convite.cargo}
              </p>
            )}
            {convite.mensagem_personalizada && (
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Mensagem:</strong> {convite.mensagem_personalizada}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
                placeholder="Seu cargo (opcional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirme sua senha"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Criando conta...' : 'Aceitar Convite'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AceitarConvite;
