
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus,
  Eye,
  Search,
  Download,
  Loader2,
  FileText,
  Lock,
  Globe,
  Send,
  Star,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { FINALIDADES_BIBLIOTECA } from '@/constants/biblioteca-constantes';

interface DocumentoParaTemplate {
  id: string;
  nome: string;
  finalidade: string;
  area: string;
  tipo_arquivo: string;
  url_arquivo: string;
  descricao?: string;
  tags?: string[];
  conteudo_base?: string;
  publico: boolean;
}

interface AbaBibliotecaProps {
  documentos: DocumentoParaTemplate[];
  loading: boolean;
  onAtualizarDocumentos: () => void;
  onCriarTemplateDaBiblioteca: (documento: DocumentoParaTemplate) => void;
  onEnviarTemplate?: (documento: DocumentoParaTemplate) => void;
  documentoSelecionado?: DocumentoParaTemplate;
}

export const AbaBiblioteca: React.FC<AbaBibliotecaProps> = ({
  documentos,
  loading,
  onAtualizarDocumentos,
  onCriarTemplateDaBiblioteca,
  onEnviarTemplate,
  documentoSelecionado
}) => {
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroFinalidade, setFiltroFinalidade] = useState<string>('todas');

  const documentosFiltrados = documentos.filter(doc => {
    const matchTexto = !buscaTexto || 
      doc.nome.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      doc.finalidade.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      doc.area.toLowerCase().includes(buscaTexto.toLowerCase());
    
    const matchFinalidade = !filtroFinalidade || filtroFinalidade === 'todas' || doc.finalidade === filtroFinalidade;
    
    return matchTexto && matchFinalidade;
  });

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos aprovados..."
              value={buscaTexto}
              onChange={(e) => setBuscaTexto(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={filtroFinalidade} onValueChange={setFiltroFinalidade}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas as finalidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as finalidades</SelectItem>
            {FINALIDADES_BIBLIOTECA.map((finalidade) => (
              <SelectItem key={finalidade} value={finalidade}>
                {finalidade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          onClick={onAtualizarDocumentos}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Atualizar
        </Button>
      </div>

      {/* Lista de documentos */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando documentos da biblioteca...</span>
        </div>
      )}

      {!loading && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Finalidade</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Visibilidade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentosFiltrados.map((documento) => (
                <TableRow key={documento.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{documento.nome}</p>
                      {documento.descricao && (
                        <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                          {documento.descricao}
                        </p>
                      )}
                      {documento.tags && documento.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {documento.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {documento.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{documento.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="secondary">{documento.finalidade}</Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline">{documento.area}</Badge>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm text-muted-foreground uppercase">
                      {documento.tipo_arquivo}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    {documento.publico ? (
                      <Badge variant="default" className="text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        Público
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Interno
                      </Badge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          // TODO: Toggle favorito
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          // TODO: Duplicar documento
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => window.open(documento.url_arquivo, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          // TODO: Editar documento
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
                        onClick={() => onCriarTemplateDaBiblioteca(documento)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      {onEnviarTemplate && documentoSelecionado?.id === documento.id && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
                          onClick={() => onEnviarTemplate(documento)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        onClick={() => {
                          // TODO: Excluir documento
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && documentosFiltrados.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum documento aprovado encontrado</p>
          {documentos.length === 0 ? (
            <p className="text-sm mt-2">
              Os documentos aprovados na Biblioteca aparecerão aqui para criar templates
            </p>
          ) : (
            <p className="text-sm mt-2">
              Tente ajustar os filtros de busca
            </p>
          )}
        </div>
      )}
    </div>
  );
};
