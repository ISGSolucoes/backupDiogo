
import React, { useState } from 'react';
import { Check, X, AlertTriangle, Send } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

type AcaoQualificacao = 'aprovar' | 'rejeitar' | 'rejeitar_com_ressalvas';

interface QualificacaoAcoesProps {
  fornecedorId: string;
  fornecedorNome: string;
  onAcaoRealizada?: (acao: AcaoQualificacao, detalhes?: any) => void;
}

export const QualificacaoAcoes: React.FC<QualificacaoAcoesProps> = ({
  fornecedorId,
  fornecedorNome,
  onAcaoRealizada
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [acaoSelecionada, setAcaoSelecionada] = useState<AcaoQualificacao | null>(null);
  const [comentarios, setComentarios] = useState('');
  const [notificarFornecedor, setNotificarFornecedor] = useState(true);

  const handleAbrirDialog = (acao: AcaoQualificacao) => {
    setAcaoSelecionada(acao);
    setComentarios('');
    setDialogOpen(true);
  };

  const handleConfirmarAcao = async () => {
    if (!acaoSelecionada) return;

    try {
      // Aqui seria feita uma chamada à API para processar a ação
      // Por enquanto, vamos simular uma chamada com sucesso
      await new Promise(resolve => setTimeout(resolve, 800));

      const detalhes = {
        comentarios,
        dataAcao: new Date().toISOString(),
        usuarioId: 'user-123', // Em produção, seria o ID do usuário atual
        notificarFornecedor: acaoSelecionada === 'rejeitar_com_ressalvas' ? notificarFornecedor : false
      };

      // Exibir mensagem correspondente à ação
      switch (acaoSelecionada) {
        case 'aprovar':
          toast.success(`Fornecedor ${fornecedorNome} aprovado com sucesso!`);
          break;
        case 'rejeitar':
          toast.info(`Fornecedor ${fornecedorNome} rejeitado.`);
          break;
        case 'rejeitar_com_ressalvas':
          const status = notificarFornecedor ? 'aguardando complementação' : 'pendente com ressalvas';
          toast.info(`Fornecedor ${fornecedorNome} rejeitado com ressalvas. Status: ${status}`);
          break;
      }

      // Notificar o componente pai sobre a ação realizada
      if (onAcaoRealizada) {
        onAcaoRealizada(acaoSelecionada, detalhes);
      }

      // Fechar o diálogo
      setDialogOpen(false);
    } catch (error) {
      console.error('Erro ao processar ação:', error);
      toast.error('Ocorreu um erro ao processar a solicitação.');
    }
  };

  const getTituloDialog = () => {
    switch (acaoSelecionada) {
      case 'aprovar':
        return 'Aprovar Fornecedor';
      case 'rejeitar':
        return 'Rejeitar Fornecedor';
      case 'rejeitar_com_ressalvas':
        return 'Rejeitar com Ressalvas';
      default:
        return 'Confirmar Ação';
    }
  };

  const getDescricaoDialog = () => {
    switch (acaoSelecionada) {
      case 'aprovar':
        return `Confirmar a aprovação de ${fornecedorNome}? Este fornecedor receberá o status de Qualificado.`;
      case 'rejeitar':
        return `Confirmar a rejeição de ${fornecedorNome}? O fornecedor será notificado da rejeição.`;
      case 'rejeitar_com_ressalvas':
        return `Você está rejeitando ${fornecedorNome} com ressalvas. Detalhe as pendências abaixo.`;
      default:
        return '';
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-4">
        <Button onClick={() => handleAbrirDialog('aprovar')} className="bg-green-600 hover:bg-green-700">
          <Check className="h-4 w-4 mr-2" /> Aprovar
        </Button>
        <Button onClick={() => handleAbrirDialog('rejeitar')} variant="destructive">
          <X className="h-4 w-4 mr-2" /> Rejeitar
        </Button>
        <Button 
          onClick={() => handleAbrirDialog('rejeitar_com_ressalvas')}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          <AlertTriangle className="h-4 w-4 mr-2" /> Rejeitar com ressalvas
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getTituloDialog()}</DialogTitle>
            <DialogDescription>{getDescricaoDialog()}</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="comentarios">
                {acaoSelecionada === 'rejeitar_com_ressalvas' 
                  ? 'Descreva as pendências ou ajustes necessários:' 
                  : 'Comentários (opcional):'}
              </Label>
              <Textarea
                id="comentarios"
                placeholder={acaoSelecionada === 'rejeitar_com_ressalvas' 
                  ? "Ex: Certidão CND vencida, respostas incompletas no item 4, faltando upload do contrato" 
                  : "Adicione comentários relevantes..."}
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                rows={5}
                className="mt-2"
                required={acaoSelecionada === 'rejeitar_com_ressalvas'}
              />
            </div>

            {acaoSelecionada === 'rejeitar_com_ressalvas' && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notificar" 
                  checked={notificarFornecedor} 
                  onCheckedChange={(checked) => setNotificarFornecedor(checked as boolean)} 
                />
                <Label htmlFor="notificar" className="cursor-pointer text-sm">
                  Sim, notificar e abrir prazo de complementação
                </Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmarAcao}
              disabled={acaoSelecionada === 'rejeitar_com_ressalvas' && !comentarios.trim()}
              className={
                acaoSelecionada === 'aprovar' ? 'bg-green-600 hover:bg-green-700' :
                acaoSelecionada === 'rejeitar' ? 'bg-destructive hover:bg-destructive/90' :
                'bg-amber-500 hover:bg-amber-600 text-white'
              }
            >
              {acaoSelecionada === 'rejeitar_com_ressalvas' && notificarFornecedor ? (
                <>
                  <Send className="h-4 w-4 mr-1" /> Enviar para complementação
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
