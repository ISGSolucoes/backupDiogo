
import React, { useState } from "react";
import { ExpandedDialog } from "@/components/ui/expanded-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useFullscreenModal } from "@/hooks/useFullscreenModal";

interface CriarCategoriaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CriarCategoriaModal = ({ open, onOpenChange }: CriarCategoriaModalProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();
  const [categoria, setCategoria] = useState({
    nome_categoria: "",
    descricao: "",
    parent_id: "",
    tipo_critico: "",
    tipo_impacto: "",
    responsavel_id: ""
  });

  const salvarCategoria = () => {
    if (!categoria.nome_categoria || !categoria.tipo_critico || !categoria.tipo_impacto) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Simular salvamento
    setTimeout(() => {
      toast.success("Categoria criada com sucesso!");
      onOpenChange(false);
      setCategoria({
        nome_categoria: "",
        descricao: "",
        parent_id: "",
        tipo_critico: "",
        tipo_impacto: "",
        responsavel_id: ""
      });
    }, 1000);
  };

  return (
    <ExpandedDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nova Categoria"
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
    >

        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome da Categoria *</Label>
            <Input
              id="nome"
              value={categoria.nome_categoria}
              onChange={(e) => setCategoria(prev => ({ ...prev, nome_categoria: e.target.value }))}
              placeholder="Ex: Materiais Elétricos"
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={categoria.descricao}
              onChange={(e) => setCategoria(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição da categoria..."
            />
          </div>

          <div>
            <Label htmlFor="categoria-pai">Categoria Pai</Label>
            <Select
              value={categoria.parent_id}
              onValueChange={(value) => setCategoria(prev => ({ ...prev, parent_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria pai (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Materiais Elétricos</SelectItem>
                <SelectItem value="2">Serviços</SelectItem>
                <SelectItem value="3">Equipamentos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="criticidade">Criticidade *</Label>
              <Select
                value={categoria.tipo_critico}
                onValueChange={(value) => setCategoria(prev => ({ ...prev, tipo_critico: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="impacto">Impacto *</Label>
              <Select
                value={categoria.tipo_impacto}
                onValueChange={(value) => setCategoria(prev => ({ ...prev, tipo_impacto: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="responsavel">Responsável</Label>
            <Select
              value={categoria.responsavel_id}
              onValueChange={(value) => setCategoria(prev => ({ ...prev, responsavel_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">João Silva</SelectItem>
                <SelectItem value="user2">Maria Santos</SelectItem>
                <SelectItem value="user3">Pedro Costa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={salvarCategoria} className="flex-1">
              Criar Categoria
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
    </ExpandedDialog>
  );
};
