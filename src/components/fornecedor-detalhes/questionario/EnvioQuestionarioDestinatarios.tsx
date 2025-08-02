
import React, { useState } from 'react';
import { Mail, Star, Send, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { ModeloBiblioteca } from '@/types/questionario';
import { useForm } from 'react-hook-form';

// Interface for contact selection
interface ContatoFornecedor {
  id: string;
  nome: string;
  email: string;
  cargo?: string;
  principal: boolean;
  ativo: boolean;
}

interface EnvioFormValues {
  contatosIds: string[];
  enviarParaTodos: boolean;
  observacoes: string;
}

interface EnvioQuestionarioDestinatariosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelo: ModeloBiblioteca | null;
  contatos: ContatoFornecedor[];
  onEnviar: (contatosIds: string[], observacoes: string) => void;
  isLoading: boolean;
}

export const EnvioQuestionarioDestinatarios = ({
  open,
  onOpenChange,
  modelo,
  contatos,
  onEnviar,
  isLoading
}: EnvioQuestionarioDestinatariosProps) => {
  const form = useForm<EnvioFormValues>({
    defaultValues: {
      contatosIds: contatos.filter(c => c.principal).map(c => c.id),
      enviarParaTodos: false,
      observacoes: ''
    }
  });

  const [enviarParaTodos, setEnviarParaTodos] = useState(false);
  
  const handleToggleTodos = (checked: boolean) => {
    setEnviarParaTodos(checked);
    
    if (checked) {
      // Selecionar todos os contatos ativos
      const todosIds = contatos.filter(c => c.ativo).map(c => c.id);
      form.setValue('contatosIds', todosIds);
    } else {
      // Manter apenas o principal selecionado
      const principalIds = contatos.filter(c => c.principal).map(c => c.id);
      form.setValue('contatosIds', principalIds);
    }
  };
  
  const handleCheckboxChange = (id: string, checked: boolean) => {
    const currentValues = form.getValues('contatosIds');
    
    if (checked) {
      form.setValue('contatosIds', [...currentValues, id]);
    } else {
      form.setValue('contatosIds', currentValues.filter(value => value !== id));
      // Se desmarcar qualquer checkbox, também desmarca "enviar para todos"
      if (enviarParaTodos) {
        setEnviarParaTodos(false);
      }
    }
  };
  
  const handleSubmit = (data: EnvioFormValues) => {
    onEnviar(data.contatosIds, data.observacoes);
  };

  const contatosAtivos = contatos.filter(contato => contato.ativo);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Send className="h-5 w-5" />
            Enviar Questionário de Qualificação
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {modelo && (
              <div className="bg-slate-50 p-3 border rounded-md">
                <h3 className="font-medium">{modelo.nome}</h3>
                <p className="text-sm text-slate-600">{modelo.descricao}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm mb-2">
                A empresa possui múltiplos contatos. Selecione para quem deseja enviar o e-mail:
              </p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                {contatos.map((contato) => (
                  <div key={contato.id} className={`flex items-start gap-2 p-2 rounded-md ${!contato.ativo ? 'opacity-50' : ''} ${contato.principal ? 'bg-blue-50' : ''}`}>
                    <Checkbox 
                      id={`contato-${contato.id}`}
                      checked={form.watch('contatosIds').includes(contato.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(contato.id, checked === true)}
                      disabled={!contato.ativo || isLoading}
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`contato-${contato.id}`} 
                        className={`flex items-center gap-1 ${contato.principal ? 'font-medium text-blue-700' : ''}`}
                      >
                        <Mail className={`h-4 w-4 ${contato.principal ? 'text-blue-600' : 'text-slate-600'}`} />
                        {contato.nome}
                        {contato.principal && (
                          <Badge className="ml-1 bg-blue-100 text-blue-700 border-blue-200">
                            <Star className="h-3 w-3 mr-1 text-blue-600 fill-blue-500" />
                            Principal
                          </Badge>
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground ml-5">
                        {contato.email}
                        {contato.cargo && ` - ${contato.cargo}`}
                        {!contato.ativo && <span className="text-red-500 ml-2">(Inativo)</span>}
                      </p>
                    </div>
                  </div>
                ))}
                {contatos.length === 0 && (
                  <p className="text-center py-4 text-slate-500">
                    Nenhum contato cadastrado para este fornecedor.
                  </p>
                )}
              </div>
              
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="enviar-todos" 
                    checked={enviarParaTodos}
                    onCheckedChange={handleToggleTodos}
                    disabled={contatosAtivos.length === 0 || isLoading}
                  />
                  <Label htmlFor="enviar-todos">
                    Enviar para todos contatos ativos ({contatosAtivos.length})
                  </Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="observacoes" className="flex items-center gap-1">
                💬 Observações adicionais (opcional):
              </Label>
              <Textarea
                id="observacoes"
                placeholder="Informações relevantes que serão incluídas no corpo do e-mail"
                {...form.register('observacoes')}
                className="mt-1"
                disabled={isLoading}
              />
            </div>
            
            <div className="pt-2 space-x-2 flex justify-end">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" /> Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={form.watch('contatosIds').length === 0 || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="h-4 w-4 mr-2" /> 
                    Enviar Questionário
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
