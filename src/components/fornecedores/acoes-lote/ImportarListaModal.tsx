import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, AlertCircle, XCircle, FileText } from 'lucide-react';
import { toast } from "sonner";
import type { Fornecedor } from '@/types/fornecedor';
import type { FornecedorCSV, ValidacaoImportacao, FornecedorValidado, FornecedorInvalido } from '@/types/acoes-lote';

interface ImportarListaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedores: Fornecedor[];
  onFornecedoresSelecionados: (fornecedores: FornecedorValidado[]) => void;
}

export const ImportarListaModal: React.FC<ImportarListaModalProps> = ({
  open,
  onOpenChange,
  fornecedores,
  onFornecedoresSelecionados
}) => {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [validacao, setValidacao] = useState<ValidacaoImportacao | null>(null);
  const [processando, setProcessando] = useState(false);

  const validarCNPJ = (cnpj: string): boolean => {
    // Lógica básica de validação de CNPJ
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    return cnpjLimpo.length === 14;
  };

  const validarEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const processarCSV = useCallback(async (file: File) => {
    setProcessando(true);
    
    try {
      const text = await file.text();
      const linhas = text.split('\n').filter(linha => linha.trim());
      
      if (linhas.length === 0) {
        throw new Error('Arquivo CSV vazio');
      }

      const header = linhas[0].split(',').map(col => col.replace(/"/g, '').trim().toLowerCase());
      const dadosLinhas = linhas.slice(1);

      // Verificar se tem campos obrigatórios
      const temCNPJ = header.includes('cnpj');
      const temID = header.includes('id');
      
      if (!temCNPJ && !temID) {
        throw new Error('Arquivo deve conter pelo menos uma coluna "cnpj" ou "id"');
      }

      const validacao: ValidacaoImportacao = {
        validos: [],
        invalidos: [],
        duplicados: [],
        semEmail: []
      };

      const cnpjsProcessados = new Set<string>();

      dadosLinhas.forEach((linha, index) => {
        const numeroLinha = index + 2; // +2 porque começamos do 0 e pulamos o header
        const campos = linha.split(',').map(campo => campo.replace(/"/g, '').trim());
        
        if (campos.length < header.length) {
          validacao.invalidos.push({
            linha: numeroLinha,
            erro: 'Linha com número insuficiente de colunas'
          });
          return;
        }

        const dadosCSV: Partial<FornecedorCSV> = {};
        
        header.forEach((col, i) => {
          if (campos[i]) {
            dadosCSV[col as keyof FornecedorCSV] = campos[i];
          }
        });

        // Validar CNPJ
        if (dadosCSV.cnpj) {
          if (!validarCNPJ(dadosCSV.cnpj)) {
            validacao.invalidos.push({
              linha: numeroLinha,
              cnpj: dadosCSV.cnpj,
              erro: 'CNPJ inválido'
            });
            return;
          }

          // Verificar duplicados no CSV
          if (cnpjsProcessados.has(dadosCSV.cnpj)) {
            validacao.duplicados.push(dadosCSV.cnpj);
            return;
          }
          cnpjsProcessados.add(dadosCSV.cnpj);
        }

        // Procurar fornecedor no sistema
        let fornecedorEncontrado: Fornecedor | undefined;
        
        if (dadosCSV.cnpj) {
          fornecedorEncontrado = fornecedores.find(f => f.cnpj === dadosCSV.cnpj);
        } else if (dadosCSV.id) {
          fornecedorEncontrado = fornecedores.find(f => f.id === dadosCSV.id);
        }

        if (!fornecedorEncontrado) {
          validacao.invalidos.push({
            linha: numeroLinha,
            cnpj: dadosCSV.cnpj,
            razao_social: dadosCSV.razao_social,
            erro: 'Fornecedor não encontrado na base'
          });
          return;
        }

        // Validar email se presente
        if (dadosCSV.email_principal && !validarEmail(dadosCSV.email_principal)) {
          validacao.invalidos.push({
            linha: numeroLinha,
            cnpj: dadosCSV.cnpj,
            erro: 'Email inválido'
          });
          return;
        }

        const fornecedorValidado: FornecedorValidado = {
          fornecedor_id: fornecedorEncontrado.id,
          cnpj: fornecedorEncontrado.cnpj,
          razao_social: fornecedorEncontrado.nome,
          email_principal: dadosCSV.email_principal || 'contato@' + fornecedorEncontrado.nome.toLowerCase().replace(/\s+/g, '') + '.com',
          categoria: fornecedorEncontrado.categoria,
          status: fornecedorEncontrado.status,
          linha: numeroLinha
        };

        // Verificar se tem email
        if (!dadosCSV.email_principal) {
          validacao.semEmail.push(fornecedorValidado);
        } else {
          validacao.validos.push(fornecedorValidado);
        }
      });

      setValidacao(validacao);
      toast.success(`Arquivo processado: ${validacao.validos.length + validacao.semEmail.length} válidos, ${validacao.invalidos.length} inválidos`);
      
    } catch (error) {
      console.error('Erro ao processar CSV:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao processar arquivo CSV');
    } finally {
      setProcessando(false);
    }
  }, [fornecedores]);

  const handleArquivoSelecionado = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setArquivo(file);
      processarCSV(file);
    } else {
      toast.error('Por favor, selecione um arquivo CSV válido');
    }
  };

  const confirmarSelecao = () => {
    if (validacao) {
      const todosFornecedores = [...validacao.validos, ...validacao.semEmail];
      onFornecedoresSelecionados(todosFornecedores);
      onOpenChange(false);
      toast.success(`${todosFornecedores.length} fornecedores selecionados para ação em lote`);
    }
  };

  const resetar = () => {
    setArquivo(null);
    setValidacao(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Selecionar por Lista (.CSV)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload de arquivo */}
          {!arquivo && (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Selecione um arquivo CSV</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Formato aceito: cnpj, id, razao_social, email_principal
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleArquivoSelecionado}
                  className="hidden"
                  id="csv-upload"
                  disabled={processando}
                />
                <label htmlFor="csv-upload">
                  <Button asChild disabled={processando}>
                    <span className="cursor-pointer">
                      {processando ? 'Processando...' : 'Escolher Arquivo'}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          )}

          {/* Arquivo selecionado */}
          {arquivo && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">{arquivo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(arquivo.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={resetar}>
                Trocar arquivo
              </Button>
            </div>
          )}

          {/* Resultados da validação */}
          {validacao && (
            <div className="space-y-4">
              <h3 className="font-medium">Resultado da Validação</h3>
              
              {/* Resumo */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">{validacao.validos.length}</p>
                    <p className="text-sm text-muted-foreground">Válidos</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">{validacao.semEmail.length}</p>
                    <p className="text-sm text-muted-foreground">Sem Email</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">{validacao.invalidos.length}</p>
                    <p className="text-sm text-muted-foreground">Inválidos</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">{validacao.duplicados.length}</p>
                    <p className="text-sm text-muted-foreground">Duplicados</p>
                  </div>
                </div>
              </div>

              {/* Alertas */}
              {validacao.semEmail.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{validacao.semEmail.length} fornecedores</strong> não possuem email cadastrado. 
                    Ações que envolvem disparo de email serão ignoradas para estes fornecedores.
                  </AlertDescription>
                </Alert>
              )}

              {/* Lista de erros */}
              {validacao.invalidos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Fornecedores Inválidos:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {validacao.invalidos.map((invalido, index) => (
                      <div key={index} className="text-sm p-2 bg-red-50 border border-red-200 rounded">
                        <span className="font-medium">Linha {invalido.linha}:</span> {invalido.erro}
                        {invalido.cnpj && <span className="ml-2 text-muted-foreground">({invalido.cnpj})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview dos válidos */}
              {(validacao.validos.length > 0 || validacao.semEmail.length > 0) && (
                <div className="space-y-2">
                  <h4 className="font-medium">Fornecedores Encontrados:</h4>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {[...validacao.validos, ...validacao.semEmail].slice(0, 10).map((fornecedor, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="font-medium">{fornecedor.razao_social}</span>
                            <span className="text-sm text-muted-foreground ml-2">({fornecedor.cnpj})</span>
                            {!fornecedor.email_principal?.includes('@') && (
                              <Badge variant="secondary" className="ml-2">Sem Email</Badge>
                            )}
                          </div>
                          <Badge variant="outline">{fornecedor.status}</Badge>
                        </div>
                      ))}
                      {[...validacao.validos, ...validacao.semEmail].length > 10 && (
                        <p className="text-sm text-muted-foreground text-center">
                          ... e mais {[...validacao.validos, ...validacao.semEmail].length - 10} fornecedores
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            {validacao && (validacao.validos.length > 0 || validacao.semEmail.length > 0) && (
              <Button onClick={confirmarSelecao}>
                Confirmar Seleção ({validacao.validos.length + validacao.semEmail.length} fornecedores)
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};