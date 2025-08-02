
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload,
  FileText,
  Image,
  File,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from "sonner";
import { FINALIDADES_BIBLIOTECA, AREAS_BIBLIOTECA, obterTipoAcaoPorFinalidade } from '@/constants/biblioteca-constantes';

interface ImportarNovoTemplateProps {
  onImportarArquivo: (arquivo: File, metadados: any) => void;
}

export const ImportarNovoTemplate: React.FC<ImportarNovoTemplateProps> = ({
  onImportarArquivo
}) => {
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [metadados, setMetadados] = useState({
    nome: '',
    finalidade: '',
    categoria: '',
    conteudo_texto: '',
    validade_dias: 30,
    visibilidade: 'interno'
  });
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tiposArquivoAceitos = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-excel',
    'text/plain'
  ];

  const obterIconeArquivo = (tipo: string) => {
    if (tipo.includes('image')) return <Image className="h-8 w-8" />;
    if (tipo.includes('pdf')) return <FileText className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  const formatarTamanhoArquivo = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleArquivo(e.dataTransfer.files[0]);
    }
  };

  const handleArquivo = (arquivo: File) => {
    if (!tiposArquivoAceitos.includes(arquivo.type)) {
      toast.error('Tipo de arquivo não suportado');
      return;
    }

    if (arquivo.size > 10 * 1024 * 1024) { // 10MB
      toast.error('Arquivo muito grande. Máximo 10MB');
      return;
    }

    setArquivoSelecionado(arquivo);
    
    // Auto-preencher nome se não estiver preenchido
    if (!metadados.nome) {
      const nomeArquivo = arquivo.name.replace(/\.[^/.]+$/, '');
      setMetadados(prev => ({ ...prev, nome: nomeArquivo }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleArquivo(e.target.files[0]);
    }
  };

  const handleFinalidadeChange = (finalidade: string) => {
    const tipoAcao = obterTipoAcaoPorFinalidade(finalidade);
    setMetadados(prev => ({ 
      ...prev, 
      finalidade,
      conteudo_texto: prev.conteudo_texto || `Template baseado em arquivo importado para ${finalidade}`
    }));
  };

  const handleImportar = () => {
    if (!arquivoSelecionado) {
      toast.error('Selecione um arquivo');
      return;
    }

    if (!metadados.nome || !metadados.finalidade) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const tipoAcao = obterTipoAcaoPorFinalidade(metadados.finalidade);
    
    onImportarArquivo(arquivoSelecionado, {
      ...metadados,
      tipo_acao: tipoAcao
    });

    // Limpar formulário
    setArquivoSelecionado(null);
    setMetadados({
      nome: '',
      finalidade: '',
      categoria: '',
      conteudo_texto: '',
      validade_dias: 30,
      visibilidade: 'interno'
    });
  };

  const handleRemoverArquivo = () => {
    setArquivoSelecionado(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Área de Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Novo Arquivo
          </CardTitle>
          <CardDescription>
            Selecione um arquivo para criar um template automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.pptx,.xlsx,.doc,.ppt,.xls,.txt"
              onChange={handleInputChange}
            />
            
            {arquivoSelecionado ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  {obterIconeArquivo(arquivoSelecionado.type)}
                  <div className="text-left">
                    <p className="font-medium">{arquivoSelecionado.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatarTamanhoArquivo(arquivoSelecionado.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoverArquivo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Arquivo carregado com sucesso</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Selecione um arquivo ou arraste aqui</p>
                  <p className="text-sm text-muted-foreground">
                    Suporte a PDF, DOCX, PPTX, XLSX e outros formatos
                  </p>
                </div>
                <Button
                  onClick={() => inputRef.current?.click()}
                  variant="outline"
                >
                  Selecionar Arquivo
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metadados do Template */}
      {arquivoSelecionado && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Template</CardTitle>
            <CardDescription>
              Configure as informações do template baseado no arquivo importado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome-template">Nome do Template *</Label>
                <Input
                  id="nome-template"
                  value={metadados.nome}
                  onChange={(e) => setMetadados(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Procedimento ESG 2025"
                />
              </div>

              <div>
                <Label htmlFor="finalidade-template">Finalidade *</Label>
                <Select
                  value={metadados.finalidade}
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
                <Label htmlFor="categoria-template">Área/Categoria</Label>
                <Select
                  value={metadados.categoria}
                  onValueChange={(value) => setMetadados(prev => ({ ...prev, categoria: value }))}
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
                <Label htmlFor="visibilidade-template">Visibilidade</Label>
                <Select
                  value={metadados.visibilidade}
                  onValueChange={(value) => setMetadados(prev => ({ ...prev, visibilidade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interno">Interno</SelectItem>
                    <SelectItem value="compartilhado">Compartilhado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="validade-template">Validade (dias)</Label>
                <Input
                  id="validade-template"
                  type="number"
                  value={metadados.validade_dias}
                  onChange={(e) => setMetadados(prev => ({ ...prev, validade_dias: parseInt(e.target.value) }))}
                  min="1"
                  max="365"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="conteudo-template">Texto-base da Mensagem</Label>
              <Textarea
                id="conteudo-template"
                value={metadados.conteudo_texto}
                onChange={(e) => setMetadados(prev => ({ ...prev, conteudo_texto: e.target.value }))}
                placeholder="Digite o texto padrão que será enviado com este template..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Você pode usar variáveis como {'{{nome_fornecedor}}'} e {'{{data_limite}}'}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleRemoverArquivo}>
                Cancelar
              </Button>
              <Button onClick={handleImportar}>
                <Upload className="h-4 w-4 mr-2" />
                Importar Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
