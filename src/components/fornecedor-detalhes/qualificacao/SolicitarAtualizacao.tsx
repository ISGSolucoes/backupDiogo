
import React, { useState } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { ExpandedDialog } from '@/components/ui/expanded-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useFullscreenModal } from '@/hooks/useFullscreenModal';

interface SolicitarAtualizacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorId: string;
  fornecedorNome: string;
  onSolicitacaoEnviada: (tipos: string[]) => void;
}

export const SolicitarAtualizacao = ({
  open,
  onOpenChange,
  fornecedorId,
  fornecedorNome,
  onSolicitacaoEnviada,
}: SolicitarAtualizacaoProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();
  const [opcoes, setOpcoes] = useState({
    questionario: false,
    documentos: false,
    cadastro: false,
  });
  const [notificar, setNotificar] = useState(true);

  const handleOpcaoChange = (opcao: keyof typeof opcoes) => {
    setOpcoes((prev) => ({
      ...prev,
      [opcao]: !prev[opcao],
    }));
  };

  const handleEnviar = async () => {
    const selecionados = Object.entries(opcoes)
      .filter(([_, selecionado]) => selecionado)
      .map(([tipo]) => tipo);

    if (selecionados.length === 0) {
      toast.warning('Selecione pelo menos uma opção para solicitar atualização');
      return;
    }

    try {
      // Simular chamada para API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Converter selecionados para array de strings mais amigáveis
      const tiposFormatados = selecionados.map((tipo) => {
        switch (tipo) {
          case 'questionario':
            return 'Questionário de qualificação';
          case 'documentos':
            return 'Documentos';
          case 'cadastro':
            return 'Informações cadastrais';
          default:
            return tipo;
        }
      });

      onSolicitacaoEnviada(tiposFormatados);

      toast.success(
        `Solicitação de atualização enviada para ${fornecedorNome}${
          notificar ? ' via e-mail e WhatsApp' : ''
        }`
      );
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast.error('Ocorreu um erro ao enviar a solicitação');
    }
  };

  return (
    <ExpandedDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Solicitar Atualização"
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
    >

        <div className="space-y-4 py-3">
          <p className="text-sm text-slate-600">
            Solicite ao fornecedor que atualize ou complemente informações específicas.
          </p>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="questionario"
                checked={opcoes.questionario}
                onCheckedChange={() => handleOpcaoChange('questionario')}
              />
              <Label htmlFor="questionario" className="text-sm font-normal">
                Reenviar questionário de qualificação
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="documentos"
                checked={opcoes.documentos}
                onCheckedChange={() => handleOpcaoChange('documentos')}
              />
              <Label htmlFor="documentos" className="text-sm font-normal">
                Solicitar atualização de documentos
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="cadastro"
                checked={opcoes.cadastro}
                onCheckedChange={() => handleOpcaoChange('cadastro')}
              />
              <Label htmlFor="cadastro" className="text-sm font-normal">
                Atualizar informações cadastrais (contatos, áreas atendidas)
              </Label>
            </div>
          </div>

          <div className="pt-2 border-t mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="notificar" checked={notificar} onCheckedChange={() => setNotificar(!notificar)} />
              <Label htmlFor="notificar" className="text-sm font-normal">
                Notificar fornecedor via e-mail e WhatsApp
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleEnviar} className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4 mr-2" /> Enviar Solicitação
          </Button>
        </div>
    </ExpandedDialog>
  );
};
