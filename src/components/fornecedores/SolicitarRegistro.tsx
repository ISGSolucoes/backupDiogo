import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Loader2, Copy, ExternalLink, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function SolicitarRegistro() {
  const [open, setOpen] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [conviteCriado, setConviteCriado] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    emailContato: '',
    clienteCodigo: 'CLIENTE001', // Pode vir do contexto do usuário
    clienteNome: 'Empresa Cliente', // Pode vir do contexto do usuário
    categoriasSolicitadas: [] as string[],
    mensagemPersonalizada: ''
  });

  const categorias = [
    'Materiais e Suprimentos',
    'Serviços',
    'Equipamentos',
    'Consultoria',
    'Tecnologia',
    'Construção',
    'Transporte',
    'Outros'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomeEmpresa || !formData.emailContato) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setEnviando(true);

    try {
      // Criar convite na base de dados
      const { data: novoConvite, error } = await supabase
        .from('convites_fornecedor')
        .insert({
          nome_empresa: formData.nomeEmpresa,
          email_contato: formData.emailContato,
          cliente_codigo: formData.clienteCodigo,
          cliente_nome: formData.clienteNome,
          categorias_solicitadas: formData.categoriasSolicitadas,
          mensagem_personalizada: formData.mensagemPersonalizada || undefined,
          mensagem_convite: `Você foi convidado por ${formData.clienteNome} para se cadastrar como fornecedor na plataforma SourceXpress.`,
          status: 'enviado',
          enviado_por: null, // TODO: pegar do contexto de auth quando implementado
          data_envio: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar convite:', error);
        toast.error('Erro ao criar convite. Tente novamente.');
        return;
      }

      // Apenas criar o convite, sem enviar email automaticamente
      setConviteCriado(novoConvite);
      toast.success('Convite criado com sucesso!');

      // Reset form
      setFormData({
        nomeEmpresa: '',
        emailContato: '',
        clienteCodigo: 'CLIENTE001',
        clienteNome: 'Empresa Cliente',
        categoriasSolicitadas: [],
        mensagemPersonalizada: ''
      });

    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const gerarLinkConvite = (token: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/portal-fornecedor/cadastro?token=${token}`;
  };

  const copiarLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  const enviarConvitePorEmail = async () => {
    if (!conviteCriado) return;
    
    setEnviandoEmail(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-invite-email', {
        body: {
          inviteId: conviteCriado.id,
          email: conviteCriado.email_contato,
          nome_completo: conviteCriado.nome_empresa,
          area: 'Fornecedor',
          mensagem_personalizada: conviteCriado.mensagem_personalizada,
          token: conviteCriado.token_unico
        }
      });

      if (error) {
        console.error('Erro ao enviar email:', error);
        toast.error('Erro ao enviar email. Tente novamente.');
        return;
      }

      toast.success('Email enviado com sucesso!');
    } catch (error) {
      console.error('Erro inesperado ao enviar email:', error);
      toast.error('Erro ao enviar email. Tente novamente.');
    } finally {
      setEnviandoEmail(false);
    }
  };

  const renderConviteCriado = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          Convite Criado!
        </h3>
        <p className="text-sm text-green-700">
          O convite para <strong>{conviteCriado?.nome_empresa}</strong> foi criado com sucesso.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-700">Link do Convite:</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(gerarLinkConvite(conviteCriado.token_unico), '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Abrir
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={gerarLinkConvite(conviteCriado.token_unico)}
            readOnly
            className="text-xs font-mono"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => copiarLink(gerarLinkConvite(conviteCriado.token_unico))}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <p><strong>Token:</strong></p>
            <p className="font-mono text-xs bg-slate-100 p-1 rounded">{conviteCriado.token_unico.substring(0, 16)}...</p>
          </div>
          <div>
            <p><strong>Válido até:</strong></p>
            <p>{new Date(conviteCriado.data_expiracao).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-3">Status: <span className="text-green-600 font-medium">{conviteCriado.status}</span></p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={enviarConvitePorEmail}
          disabled={enviandoEmail}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {enviandoEmail ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Mail className="h-4 w-4 mr-2" />
          )}
          {enviandoEmail ? 'Enviando...' : 'Enviar Convite'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setConviteCriado(null);
            // Reset form data para novo convite
            setFormData({
              nomeEmpresa: '',
              emailContato: '',
              clienteCodigo: 'CLIENTE001',
              clienteNome: 'Empresa Cliente',
              categoriasSolicitadas: [],
              mensagemPersonalizada: ''
            });
          }}
          className="flex-1"
        >
          Criar Novo Convite
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
        <p className="text-xs text-blue-700 font-medium mb-2">
          Próximos passos:
        </p>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Use "Enviar Convite" para disparar automaticamente por email</li>
          <li>• Ou copie o link e envie manualmente</li>
          <li>• O fornecedor acessará o portal de cadastro</li>
          <li>• Você receberá notificação quando o cadastro for concluído</li>
        </ul>
      </div>
    </div>
  );

  const renderFormulario = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
        <Input
          id="nomeEmpresa"
          value={formData.nomeEmpresa}
          onChange={(e) => setFormData(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
          placeholder="Ex: Fornecedor ABC Ltda"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emailContato">Email do Contato *</Label>
        <Input
          id="emailContato"
          type="email"
          value={formData.emailContato}
          onChange={(e) => setFormData(prev => ({ ...prev, emailContato: e.target.value }))}
          placeholder="contato@fornecedor.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categorias">Categorias Solicitadas</Label>
        <Select onValueChange={(value) => {
          if (!formData.categoriasSolicitadas.includes(value)) {
            setFormData(prev => ({
              ...prev,
              categoriasSolicitadas: [...prev.categoriasSolicitadas, value]
            }));
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione as categorias de interesse" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map(categoria => (
              <SelectItem 
                key={categoria} 
                value={categoria}
                disabled={formData.categoriasSolicitadas.includes(categoria)}
              >
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {formData.categoriasSolicitadas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.categoriasSolicitadas.map(categoria => (
              <span 
                key={categoria}
                className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-primary/20"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  categoriasSolicitadas: prev.categoriasSolicitadas.filter(c => c !== categoria)
                }))}
              >
                {categoria} ×
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mensagem">Mensagem Personalizada</Label>
        <Textarea
          id="mensagem"
          value={formData.mensagemPersonalizada}
          onChange={(e) => setFormData(prev => ({ ...prev, mensagemPersonalizada: e.target.value }))}
          placeholder="Adicione uma mensagem personalizada para o convite (opcional)"
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          {enviando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {enviando ? 'Criando...' : 'Continuar'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      // Reset o estado quando fechar o modal
      if (!isOpen) {
        setConviteCriado(null);
        setFormData({
          nomeEmpresa: '',
          emailContato: '',
          clienteCodigo: 'CLIENTE001',
          clienteNome: 'Empresa Cliente',
          categoriasSolicitadas: [],
          mensagemPersonalizada: ''
        });
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Solicitar Registro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {conviteCriado ? 'Convite Criado' : 'Solicitar Registro de Fornecedor'}
          </DialogTitle>
          <DialogDescription>
            {conviteCriado 
              ? 'Seu convite foi criado com sucesso. Compartilhe o link ou envie automaticamente:'
              : 'Envie um convite para um fornecedor se cadastrar na plataforma'
            }
          </DialogDescription>
        </DialogHeader>
        
        {conviteCriado ? renderConviteCriado() : renderFormulario()}
      </DialogContent>
    </Dialog>
  );
}