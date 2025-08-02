
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BulkImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BulkImportModal = ({ open, onOpenChange }: BulkImportModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV');
      return;
    }

    setFile(uploadedFile);
    
    // Simular leitura do arquivo CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      // Validar headers obrigatórios
      const requiredHeaders = ['nome_completo', 'email', 'area'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setErrors([`Colunas obrigatórias faltando: ${missingHeaders.join(', ')}`]);
        return;
      }

      // Processar dados
      const data = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        const user: any = {};
        headers.forEach((header, i) => {
          user[header.trim()] = values[i]?.trim() || '';
        });
        user.row = index + 2; // +2 para considerar header e índice baseado em 1
        return user;
      }).filter(user => user.email); // Filtrar linhas vazias

      setPreviewData(data);
      setErrors([]);
    };
    
    reader.readAsText(uploadedFile);
  };

  const handleImport = async () => {
    if (!previewData.length) {
      toast.error('Nenhum dado para importar');
      return;
    }

    setLoading(true);
    
    try {
      // Aqui você implementaria a lógica de importação real
      // Por enquanto, vamos simular
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${previewData.length} usuários importados com sucesso!`);
      onOpenChange(false);
      setFile(null);
      setPreviewData([]);
    } catch (error) {
      toast.error('Erro ao importar usuários');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'nome_completo,email,area,cargo,centro_custo,telefone\n' +
      'João Silva,joao@empresa.com,TI,Desenvolvedor,CC001,11999999999\n' +
      'Maria Santos,maria@empresa.com,Compras,Analista,CC002,11888888888';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_usuarios.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importação em Massa</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Download Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Baixe o template para garantir que seu arquivo está no formato correto.
              </p>
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Template
              </Button>
            </CardContent>
          </Card>

          {/* Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload do Arquivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Selecionar arquivo CSV</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </div>
                
                {file && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Errors */}
          {errors.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Erros de Validação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600">
                      • {error}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Preview */}
          {previewData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Preview dos Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {previewData.length} usuários encontrados
                    </Badge>
                  </div>
                  
                  <div className="overflow-x-auto max-h-60">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Nome</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Área</th>
                          <th className="text-left p-2">Cargo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(0, 10).map((user, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{user.nome_completo}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">{user.area}</td>
                            <td className="p-2">{user.cargo || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {previewData.length > 10 && (
                    <p className="text-sm text-muted-foreground">
                      ... e mais {previewData.length - 10} usuários
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={!previewData.length || errors.length > 0 || loading}
            >
              {loading ? 'Importando...' : 'Importar Usuários'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
