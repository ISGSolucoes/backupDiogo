
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Save,
  X,
  Info,
  Sparkles,
  Eye
} from 'lucide-react';
import { toast } from "sonner";
import type { TemplateAcaoLote } from '@/types/acoes-lote';
import { FINALIDADES_BIBLIOTECA, AREAS_BIBLIOTECA, obterTipoAcaoPorFinalidade } from '@/constants/biblioteca-constantes';

interface CriarTemplateManualProps {
  onCriarTemplate: (template: Partial<TemplateAcaoLote>) => void;
  templateParaEditar?: TemplateAcaoLote | null;
  onSalvarEdicao?: (dadosAtualizados: Partial<TemplateAcaoLote>) => void;
  onCancelarEdicao?: () => void;
}

export const CriarTemplateManual: React.FC<CriarTemplateManualProps> = ({
  onCriarTemplate,
  templateParaEditar,
  onSalvarEdicao,
  onCancelarEdicao
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    finalidade: '',
    categoria: '',
    conteudo_texto: '',
    validade_dias: 30,
    permite_anonimato: false,
    tipo: 'procedimento'
  });

  const [previewAtivo, setPreviewAtivo] = useState(false);
  const modoEdicao = !!templateParaEditar;

  useEffect(() => {
    if (templateParaEditar) {
      setFormData({
        nome: templateParaEditar.nome || '',
        finalidade: templateParaEditar.finalidade || '',
        categoria: templateParaEditar.categoria || '',
        conteudo_texto: templateParaEditar.conteudo_texto || '',
        validade_dias: templateParaEditar.validade_dias || 30,
        permite_anonimato: templateParaEditar.permite_anonimato || false,
        tipo: templateParaEditar.configuracoes?.tipo || 'procedimento'
      });
    }
  }, [templateParaEditar]);

  const variaveisDinamicas = [
    { variavel: '{{nome_fornecedor}}', descricao: 'Nome da empresa fornecedora' },
    { variavel: '{{email}}', descricao: 'Email do contato' },
    { variavel: '{{data_limite}}', descricao: 'Data limite para resposta' },
    { variavel: '{{responsavel}}', descricao: 'Nome do responsável pelo envio' },
    { variavel: '{{empresa}}', descricao: 'Nome da sua empresa' },
    { variavel: '{{telefone}}', descricao: 'Telefone de contato' },
    { variavel: '{{categoria}}', descricao: 'Categoria do fornecedor' },
    { variavel: '{{cnpj}}', descricao: 'CNPJ do fornecedor' }
  ];

  const handleFinalidadeChange = (finalidade: string) => {
    const tipoAcao = obterTipoAcaoPorFinalidade(finalidade);
    setFormData(prev => ({ 
      ...prev, 
      finalidade,
      permite_anonimato: tipoAcao === 'pesquisa_cliente'
    }));
  };

  const inserirVariavel = (variavel: string) => {
    const textarea = document.getElementById('conteudo-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.conteudo_texto;
      const newText = text.slice(0, start) + variavel + text.slice(end);
      
      setFormData(prev => ({ ...prev, conteudo_texto: newText }));
      
      // Restaurar posição do cursor
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variavel.length, start + variavel.length);
      }, 0);
    }
  };

  const gerarConteudoIA = () => {
    const conteudoBase = `Prezado(a) {{nome_fornecedor}},

Esperamos que esta mensagem encontre sua empresa em pleno crescimento e sucesso.

${formData.finalidade === 'Avaliação ESG' ? 
  'Estamos conduzindo uma avaliação de práticas ESG (Environmental, Social and Governance) entre nossos fornecedores parceiros.' :
  formData.finalidade === 'Requalificação' ?
  'É necessário realizar a requalificação dos dados cadastrais de sua empresa em nossa base.' :
  'Solicitamos sua colaboração para o processo em andamento.'
}

Dados da solicitação:
- Empresa: {{empresa}}
- Data limite: {{data_limite}}
- Responsável: {{responsavel}}
- Telefone: {{telefone}}

Agradecemos sua colaboração e aguardamos retorno.

Atenciosamente,
{{responsavel}}
{{empresa}}`;

    setFormData(prev => ({ ...prev, conteudo_texto: conteudoBase }));
    toast.success('Conteúdo gerado pela IA!');
  };

  const handleSubmit = () => {
    if (!formData.nome || !formData.finalidade) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const tipoAcao = obterTipoAcaoPorFinalidade(formData.finalidade);
    
    const dadosTemplate = {
      nome: formData.nome,
      finalidade: formData.finalidade,
      tipo_acao: tipoAcao,
      categoria: formData.categoria,
      conteudo_texto: formData.conteudo_texto,
      campos_formulario: [],
      configuracoes: {
        tipo: formData.tipo,
        criado_manualmente: true
      },
      permite_anonimato: formData.permite_anonimato,
      validade_dias: formData.validade_dias
    };

    if (modoEdicao && onSalvarEdicao) {
      onSalvarEdicao(dadosTemplate);
    } else {
      onCriarTemplate(dadosTemplate);
    }

    // Limpar formulário se não for edição
    if (!modoEdicao) {
      setFormData({
        nome: '',
        finalidade: '',
        categoria: '',
        conteudo_texto: '',
        validade_dias: 30,
        permite_anonimato: false,
        tipo: 'procedimento'
      });
    }
  };

  const handleCancelar = () => {
    if (modoEdicao && onCancelarEdicao) {
      onCancelarEdicao();
    } else {
      setFormData({
        nome: '',
        finalidade: '',
        categoria: '',
        conteudo_texto: '',
        validade_dias: 30,
        permite_anonimato: false,
        tipo: 'procedimento'
      });
    }
  };

  const renderPreview = () => {
    if (!formData.conteudo_texto) return null;

    const conteudoComVariaveis = formData.conteudo_texto
      .replace(/\{\{nome_fornecedor\}\}/g, 'Empresa Exemplo Ltda.')
      .replace(/\{\{email\}\}/g, 'contato@exemplo.com')
      .replace(/\{\{data_limite\}\}/g, '30/12/2024')
      .replace(/\{\{responsavel\}\}/g, 'João Silva')
      .replace(/\{\{empresa\}\}/g, 'Sua Empresa S.A.')
      .replace(/\{\{telefone\}\}/g, '(11) 9999-9999')
      .replace(/\{\{categoria\}\}/g, formData.categoria || 'Geral')
      .replace(/\{\{cnpj\}\}/g, '12.345.678/0001-90');

    return (
      <div className="bg-muted/50 p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="h-4 w-4" />
          <span className="font-medium">Preview da Mensagem</span>
        </div>
        <div className="whitespace-pre-line text-sm leading-relaxed">
          {conteudoComVariaveis}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {modoEdicao ? 'Editar Template' : 'Criar Template Manualmente'}
          </CardTitle>
          <CardDescription>
            {modoEdicao ? 'Modifique as informações do template' : 'Crie um novo template personalizado do zero'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campos Básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome-manual">Nome do Template *</Label>
              <Input
                id="nome-manual"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Avaliação ESG 2025"
              />
            </div>

            <div>
              <Label htmlFor="finalidade-manual">Finalidade *</Label>
              <Select
                value={formData.finalidade}
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

            <div>
              <Label htmlFor="categoria-manual">Área/Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao_especificado">Não especificado</SelectItem>
                  {AREAS_BIBLIOTECA.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tipo-manual">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="procedimento">Procedimento</SelectItem>
                  <SelectItem value="avaliacao">Avaliação</SelectItem>
                  <SelectItem value="comunicacao">Comunicação</SelectItem>
                  <SelectItem value="pesquisa">Pesquisa</SelectItem>
                  <SelectItem value="requalificacao">Requalificação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="validade-manual">Validade (dias)</Label>
              <Input
                id="validade-manual"
                type="number"
                value={formData.validade_dias}
                onChange={(e) => setFormData(prev => ({ ...prev, validade_dias: parseInt(e.target.value) }))}
                min="1"
                max="365"
              />
            </div>

            {obterTipoAcaoPorFinalidade(formData.finalidade) === 'pesquisa_cliente' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonimato-manual"
                  checked={formData.permite_anonimato}
                  onChange={(e) => setFormData(prev => ({ ...prev, permite_anonimato: e.target.checked }))}
                />
                <Label htmlFor="anonimato-manual">Permitir respostas anônimas</Label>
              </div>
            )}
          </div>

          {/* Conteúdo Base */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="conteudo-textarea">Conteúdo Base</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={gerarConteudoIA}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Gerar com IA
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewAtivo(!previewAtivo)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {previewAtivo ? 'Ocultar' : 'Preview'}
                </Button>
              </div>
            </div>
            <Textarea
              id="conteudo-textarea"
              value={formData.conteudo_texto}
              onChange={(e) => setFormData(prev => ({ ...prev, conteudo_texto: e.target.value }))}
              placeholder="Digite o conteúdo base do template..."
              rows={8}
              className="resize-none"
            />
          </div>

          {/* Preview */}
          {previewAtivo && renderPreview()}

          {/* Variáveis Dinâmicas */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4" />
              Variáveis Dinâmicas
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {variaveisDinamicas.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => inserirVariavel(item.variavel)}
                  className="justify-start text-xs"
                  title={item.descricao}
                >
                  {item.variavel}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Clique nas variáveis para inseri-las no conteúdo
            </p>
          </div>

          {/* Informações da Finalidade */}
          {formData.finalidade && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4" />
                <span className="font-medium">Informações da Finalidade</span>
              </div>
              <div className="space-y-1 text-sm">
                <p><strong>Tipo de ação:</strong> {obterTipoAcaoPorFinalidade(formData.finalidade)?.replace('_', ' ')}</p>
                <p><strong>Permite anonimato:</strong> {formData.permite_anonimato ? 'Sim' : 'Não'}</p>
                <p><strong>Validade:</strong> {formData.validade_dias} dias</p>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancelar}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              {modoEdicao ? 'Salvar Alterações' : 'Criar Template'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
