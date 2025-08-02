
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, X, File, Calendar } from 'lucide-react';
import { toast } from "sonner";
import { useBibliotecaDocumentos } from '@/hooks/useBibliotecaDocumentos';
import { DocumentoUpload } from '@/types/biblioteca-documentos';
import { FINALIDADES_BIBLIOTECA, AREAS_BIBLIOTECA } from '@/constants/biblioteca-constantes';

interface UploadDocumentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadDocumentoModal: React.FC<UploadDocumentoModalProps> = ({
  open,
  onOpenChange
}) => {
  const { uploadDocumento } = useBibliotecaDocumentos();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [documento, setDocumento] = useState<Partial<DocumentoUpload>>({
    nome_arquivo: '',
    descricao: '',
    area: '',
    finalidade: '',
    categoria: '',
    publico: false,
    notificar_vencimento: false,
    observacoes: ''
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumento(prev => ({
        ...prev,
        nome_arquivo: file.name.split('.')[0]
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async () => {
    if (!selectedFile || !documento.area || !documento.finalidade) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setUploading(true);
    
    try {
      const documentoData: DocumentoUpload = {
        file: selectedFile,
        nome_arquivo: documento.nome_arquivo || selectedFile.name.split('.')[0],
        descricao: documento.descricao,
        area: documento.area,
        finalidade: documento.finalidade,
        categoria: documento.categoria,
        tags: tags,
        publico: documento.publico || false,
        data_validade: documento.data_validade,
        notificar_vencimento: documento.notificar_vencimento || false,
        observacoes: documento.observacoes
      };

      await uploadDocumento(documentoData);
      
      // Reset form
      setSelectedFile(null);
      setTags([]);
      setDocumento({
        nome_arquivo: '',
        descricao: '',
        area: '',
        finalidade: '',
        categoria: '',
        publico: false,
        notificar_vencimento: false,
        observacoes: ''
      });
      
      onOpenChange(false);
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Enviar Documento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload de arquivo */}
          <div>
            <Label>Arquivo *</Label>
            <div className="mt-2">
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <File className="h-12 w-12 mx-auto text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Clique para selecionar um arquivo
                        </span>
                        <input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileSelect}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.png"
                        />
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        PDF, DOC, XLS, PPT, TXT, JPG, PNG até 10MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <File className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome do Documento *</Label>
              <Input
                id="nome"
                value={documento.nome_arquivo || ''}
                onChange={(e) => setDocumento(prev => ({ ...prev, nome_arquivo: e.target.value }))}
                placeholder="Nome para identificação"
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                value={documento.categoria || ''}
                onChange={(e) => setDocumento(prev => ({ ...prev, categoria: e.target.value }))}
                placeholder="Ex: Contratos, Políticas"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={documento.descricao || ''}
              onChange={(e) => setDocumento(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descreva o conteúdo do documento..."
              rows={3}
            />
          </div>

          {/* Classificação */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area">Área *</Label>
              <Select
                value={documento.area || ''}
                onValueChange={(value) => setDocumento(prev => ({ ...prev, area: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  {AREAS_BIBLIOTECA.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="finalidade">Finalidade *</Label>
              <Select
                value={documento.finalidade || ''}
                onValueChange={(value) => setDocumento(prev => ({ ...prev, finalidade: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a finalidade" />
                </SelectTrigger>
                <SelectContent>
                  {FINALIDADES_BIBLIOTECA.map(finalidade => (
                    <SelectItem key={finalidade} value={finalidade}>{finalidade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Digite uma tag..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button type="button" onClick={handleAddTag}>
                Adicionar
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer">
                    {tag}
                    <X 
                      className="h-3 w-3 ml-1" 
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Configurações de acesso */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Documento Público</Label>
                <p className="text-sm text-gray-500">
                  Documento será visível para todos os usuários
                </p>
              </div>
              <Switch
                checked={documento.publico || false}
                onCheckedChange={(checked) => setDocumento(prev => ({ ...prev, publico: checked }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validade">Data de Validade</Label>
                <Input
                  id="validade"
                  type="date"
                  value={documento.data_validade || ''}
                  onChange={(e) => setDocumento(prev => ({ ...prev, data_validade: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center justify-between pt-8">
                <div>
                  <Label>Notificar Vencimento</Label>
                  <p className="text-xs text-gray-500">
                    Avisar próximo ao vencimento
                  </p>
                </div>
                <Switch
                  checked={documento.notificar_vencimento || false}
                  onCheckedChange={(checked) => setDocumento(prev => ({ ...prev, notificar_vencimento: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={documento.observacoes || ''}
              onChange={(e) => setDocumento(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações adicionais..."
              rows={2}
            />
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Documento
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
