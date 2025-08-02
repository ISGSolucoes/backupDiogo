
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TemplateAcaoLote } from '@/types/acoes-lote';
import { FINALIDADES_BIBLIOTECA, AREAS_BIBLIOTECA, obterTipoAcaoPorFinalidade } from '@/constants/biblioteca-constantes';

interface FormularioNovoTemplateProps {
  novoTemplate: Partial<TemplateAcaoLote>;
  setNovoTemplate: (template: Partial<TemplateAcaoLote> | ((prev: Partial<TemplateAcaoLote>) => Partial<TemplateAcaoLote>)) => void;
  onCriar: () => void;
  onCancelar: () => void;
}

export const FormularioNovoTemplate: React.FC<FormularioNovoTemplateProps> = ({
  novoTemplate,
  setNovoTemplate,
  onCriar,
  onCancelar
}) => {
  const handleFinalidadeChange = (finalidade: string) => {
    const tipoAcao = obterTipoAcaoPorFinalidade(finalidade);
    setNovoTemplate(prev => ({ 
      ...prev, 
      finalidade,
      tipo_acao: tipoAcao,
      permite_anonimato: tipoAcao === 'pesquisa_cliente'
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome do Template *</Label>
          <Input
            id="nome"
            value={novoTemplate.nome || ''}
            onChange={(e) => setNovoTemplate(prev => ({ ...prev, nome: e.target.value }))}
            placeholder="Ex: Avaliação ESG 2025"
          />
        </div>
        
        <div>
          <Label htmlFor="finalidade">Finalidade *</Label>
          <Select
            value={novoTemplate.finalidade || ''}
            onValueChange={handleFinalidadeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a finalidade" />
            </SelectTrigger>
            <SelectContent>
              {FINALIDADES_BIBLIOTECA.map((finalidade) => (
                <SelectItem key={finalidade} value={finalidade}>
                  {finalidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="categoria">Área/Categoria</Label>
        <Select
          value={novoTemplate.categoria || ''}
          onValueChange={(value) => setNovoTemplate(prev => ({ ...prev, categoria: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nao-especificado">Não especificado</SelectItem>
            {AREAS_BIBLIOTECA.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="conteudo">Conteúdo Base</Label>
        <Textarea
          id="conteudo"
          value={novoTemplate.conteudo_texto || ''}
          onChange={(e) => setNovoTemplate(prev => ({ ...prev, conteudo_texto: e.target.value }))}
          placeholder="Digite o texto base para este tipo de ação..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="validade">Validade (dias)</Label>
          <Input
            id="validade"
            type="number"
            value={novoTemplate.validade_dias || 30}
            onChange={(e) => setNovoTemplate(prev => ({ ...prev, validade_dias: parseInt(e.target.value) }))}
          />
        </div>
        
        {novoTemplate.tipo_acao === 'pesquisa_cliente' && (
          <div className="flex items-center space-x-2 pt-8">
            <input
              type="checkbox"
              id="anonimo"
              checked={novoTemplate.permite_anonimato || false}
              onChange={(e) => setNovoTemplate(prev => ({ ...prev, permite_anonimato: e.target.checked }))}
            />
            <Label htmlFor="anonimo">Permitir respostas anônimas</Label>
          </div>
        )}
      </div>

      {novoTemplate.finalidade && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tipo de ação:</strong> {novoTemplate.tipo_acao?.replace('_', ' ')}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button onClick={onCriar}>
          Criar Template
        </Button>
      </div>
    </div>
  );
};
