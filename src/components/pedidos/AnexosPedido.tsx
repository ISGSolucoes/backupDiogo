import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Upload, Download, Trash2, Eye, AlertCircle } from 'lucide-react';

interface Anexo {
  id: string;
  nome_arquivo: string;
  nome_original: string;
  tipo_mime: string;
  tamanho_bytes: number;
  caminho_arquivo: string;
  url_publica?: string;
  descricao?: string;
  tipo_anexo?: string;
  created_at: string;
}

interface AnexosPedidoProps {
  pedidoId?: string;
  anexos: Anexo[];
  onAnexosChange: (anexos: Anexo[]) => void;
  readonly?: boolean;
}

export function AnexosPedido({ 
  pedidoId, 
  anexos, 
  onAnexosChange, 
  readonly = false 
}: AnexosPedidoProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
    return '📎';
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `pedidos/${pedidoId || 'temp'}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('pedidos-anexos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;
    return filePath;
  };

  const salvarAnexoNoBanco = async (file: File, caminhoArquivo: string): Promise<Anexo> => {
    const anexoData = {
      pedido_id: pedidoId || null,
      nome_arquivo: file.name.split('.')[0],
      nome_original: file.name,
      tipo_mime: file.type,
      tamanho_bytes: file.size,
      caminho_arquivo: caminhoArquivo,
      bucket: 'pedidos-anexos',
      tipo_anexo: 'documento',
      criado_por: (await supabase.auth.getUser()).data.user?.id,
    };

    const { data, error } = await supabase
      .from('anexos_pedido')
      .insert(anexoData)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo não permitido",
        description: "São aceitos apenas PDF, imagens, Excel e Word.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simular progresso de upload
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const caminhoArquivo = await uploadFile(file);
      
      // Se há pedidoId, salvar no banco
      if (pedidoId) {
        const novoAnexo = await salvarAnexoNoBanco(file, caminhoArquivo);
        onAnexosChange([...anexos, novoAnexo]);
      } else {
        // Para novos pedidos, manter em memória
        const anexoTemporario: Anexo = {
          id: `temp_${Date.now()}`,
          nome_arquivo: file.name.split('.')[0],
          nome_original: file.name,
          tipo_mime: file.type,
          tamanho_bytes: file.size,
          caminho_arquivo: caminhoArquivo,
          created_at: new Date().toISOString(),
        };
        onAnexosChange([...anexos, anexoTemporario]);
      }

      clearInterval(interval);
      setUploadProgress(100);

      toast({
        title: "Arquivo enviado",
        description: `${file.name} foi adicionado com sucesso.`,
      });

    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível enviar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadFile = async (anexo: Anexo) => {
    try {
      const { data, error } = await supabase.storage
        .from('pedidos-anexos')
        .download(anexo.caminho_arquivo);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = anexo.nome_original;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download iniciado",
        description: `${anexo.nome_original} está sendo baixado.`,
      });

    } catch (error: any) {
      console.error('Erro no download:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo.",
        variant: "destructive",
      });
    }
  };

  const excluirAnexo = async (anexo: Anexo) => {
    try {
      // Excluir do storage
      const { error: storageError } = await supabase.storage
        .from('pedidos-anexos')
        .remove([anexo.caminho_arquivo]);

      if (storageError) throw storageError;

      // Excluir do banco se não for temporário
      if (pedidoId && !anexo.id.startsWith('temp_')) {
        const { error: dbError } = await supabase
          .from('anexos_pedido')
          .delete()
          .eq('id', anexo.id);

        if (dbError) throw dbError;
      }

      // Atualizar lista local
      onAnexosChange(anexos.filter(a => a.id !== anexo.id));

      toast({
        title: "Arquivo excluído",
        description: `${anexo.nome_original} foi removido.`,
      });

    } catch (error: any) {
      console.error('Erro ao excluir:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível remover o arquivo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Documentos e Anexos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        {!readonly && (
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleFileSelect}
              disabled={uploading}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Enviando...' : 'Adicionar Arquivo'}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx,.doc,.docx"
            />

            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Enviando arquivo... {uploadProgress}%
                </p>
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Tipos aceitos: PDF, Excel, Word, imagens (JPG, PNG)</p>
              <p>Tamanho máximo: 10MB por arquivo</p>
            </div>
          </div>
        )}

        {/* Lista de Anexos */}
        <div className="space-y-3">
          {anexos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum documento anexado</p>
            </div>
          ) : (
            anexos.map((anexo) => (
              <div
                key={anexo.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-card"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(anexo.tipo_mime)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{anexo.nome_original}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatFileSize(anexo.tamanho_bytes)}</span>
                      <span>•</span>
                      <span>{new Date(anexo.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(anexo)}
                    title="Baixar arquivo"
                  >
                    <Download className="w-4 h-4" />
                  </Button>

                  {!readonly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => excluirAnexo(anexo)}
                      title="Excluir arquivo"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Dicas */}
        {!readonly && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Documentos recomendados:</p>
                <ul className="space-y-0.5 text-xs">
                  <li>• Especificações técnicas detalhadas</li>
                  <li>• Desenhos ou plantas (quando aplicável)</li>
                  <li>• Condições comerciais especiais</li>
                  <li>• Certificações ou homologações necessárias</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}