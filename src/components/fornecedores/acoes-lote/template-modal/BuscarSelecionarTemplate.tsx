
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search,
  Eye,
  Edit,
  Copy,
  Trash2,
  Plus,
  Download,
  Loader2,
  FileText,
  Globe,
  Lock,
  Clock,
  Star,
  RefreshCw,
  Send
} from 'lucide-react';
import type { TemplateAcaoLote } from '@/types/acoes-lote';
import { FINALIDADES_BIBLIOTECA } from '@/constants/biblioteca-constantes';
import { formatarData } from '@/utils/dateUtils';

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

interface BuscarSelecionarTemplateProps {
  templates: TemplateAcaoLote[];
  documentos: DocumentoParaTemplate[];
  loading: boolean;
  loadingBiblioteca: boolean;
  templateSelecionado?: TemplateAcaoLote | null;
  documentoSelecionado?: DocumentoParaTemplate | null;
  onSelecionarTemplate: (template: TemplateAcaoLote) => void;
  onSelecionarDocumento: (documento: DocumentoParaTemplate) => void;
  onDuplicarTemplate: (template: TemplateAcaoLote) => void;
  onExcluirTemplate: (templateId: string) => void;
  onCriarTemplateDaBiblioteca: (documento: DocumentoParaTemplate, nomeTemplate: string) => Promise<any>;
  onAtualizarDocumentos: () => void;
  onEnviarTemplate?: (template: TemplateAcaoLote) => void;
}

export const BuscarSelecionarTemplate: React.FC<BuscarSelecionarTemplateProps> = ({
  templates,
  documentos,
  loading,
  loadingBiblioteca,
  templateSelecionado,
  documentoSelecionado,
  onSelecionarTemplate,
  onSelecionarDocumento,
  onDuplicarTemplate,
  onExcluirTemplate,
  onCriarTemplateDaBiblioteca,
  onAtualizarDocumentos,
  onEnviarTemplate
}) => {
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroFinalidade, setFiltroFinalidade] = useState<string>('todas');
  const [filtroArea, setFiltroArea] = useState<string>('todas');
  const [filtroTipo, setFiltroTipo] = useState<string>('todas');
  const [filtroOrigem, setFiltroOrigem] = useState<string>('todas');

  const templatesFiltrados = templates.filter(template => {
    const matchTexto = !buscaTexto || 
      template.nome.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      template.categoria?.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      template.finalidade?.toLowerCase().includes(buscaTexto.toLowerCase());
    
    const matchFinalidade = filtroFinalidade === 'todas' || 
      template.finalidade === filtroFinalidade;
    
    const matchArea = filtroArea === 'todas' || 
      template.categoria === filtroArea;
    
    const matchOrigem = filtroOrigem === 'todas' || 
      (filtroOrigem === 'interno' && !template.configuracoes?.criado_da_biblioteca) ||
      (filtroOrigem === 'biblioteca' && template.configuracoes?.criado_da_biblioteca);
    
    return matchTexto && matchFinalidade && matchArea && matchOrigem;
  });

  const documentosFiltrados = documentos.filter(doc => {
    const matchTexto = !buscaTexto || 
      doc.nome.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      doc.finalidade.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      doc.area.toLowerCase().includes(buscaTexto.toLowerCase());
    
    const matchFinalidade = filtroFinalidade === 'todas' || doc.finalidade === filtroFinalidade;
    const matchArea = filtroArea === 'todas' || doc.area === filtroArea;
    const matchTipo = filtroTipo === 'todas' || doc.tipo_arquivo.toLowerCase().includes(filtroTipo.toLowerCase());
    
    return matchTexto && matchFinalidade && matchArea && matchTipo;
  });

  const areas = [...new Set([...templates.map(t => t.categoria).filter(Boolean), ...documentos.map(d => d.area)])];
  const tiposArquivo = [...new Set(documentos.map(d => d.tipo_arquivo))];

  // Função para obter data de último uso baseada na data de criação/atualização
  const obterUltimoUso = (template: TemplateAcaoLote) => {
    const dataUpdated = template.updated_at || template.created_at;
    return formatarData(dataUpdated);
  };

  const obterValidadeRestante = (template: TemplateAcaoLote) => {
    const diasRestantes = template.validade_dias || 30;
    return `${diasRestantes} dias`;
  };

  const handleAtualizarDocumentos = () => {
    console.log('Forçando atualização de documentos...');
    onAtualizarDocumentos();
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar templates..."
            value={buscaTexto}
            onChange={(e) => setBuscaTexto(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filtroFinalidade} onValueChange={setFiltroFinalidade}>
          <SelectTrigger>
            <SelectValue placeholder="Finalidade" />
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

        <Select value={filtroArea} onValueChange={setFiltroArea}>
          <SelectTrigger>
            <SelectValue placeholder="Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as áreas</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todos os tipos</SelectItem>
            {tiposArquivo.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtroOrigem} onValueChange={setFiltroOrigem}>
          <SelectTrigger>
            <SelectValue placeholder="Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as origens</SelectItem>
            <SelectItem value="interno">Interno</SelectItem>
            <SelectItem value="biblioteca">Biblioteca</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Abas: Templates vs Biblioteca */}
      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Templates Salvos ({templatesFiltrados.length})</TabsTrigger>
          <TabsTrigger value="biblioteca">Biblioteca ({documentosFiltrados.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando templates...</span>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Template</TableHead>
                    <TableHead>Finalidade</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Último Uso</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templatesFiltrados.map((template) => {
                    const isSelected = templateSelecionado?.id === template.id;
                    return (
                    <TableRow 
                      key={template.id} 
                      className={`hover:bg-muted/50 cursor-pointer ${isSelected ? 'bg-primary/10 border-primary' : ''}`}
                      onClick={() => onSelecionarTemplate(template)}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {isSelected && <Star className="h-4 w-4 text-primary fill-primary" />}
                            <p className="font-medium">{template.nome}</p>
                          </div>
                          {template.conteudo_texto && (
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {template.conteudo_texto}
                            </p>
                          )}
                          <div className="flex gap-1">
                            {template.configuracoes?.criado_da_biblioteca && (
                              <Badge variant="secondary" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                Biblioteca
                              </Badge>
                            )}
                            {isSelected && (
                              <Badge variant="default" className="text-xs">
                                Selecionado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.finalidade}</Badge>
                      </TableCell>
                      <TableCell>
                        {template.categoria && (
                          <Badge variant="secondary">{template.categoria}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {obterUltimoUso(template)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{obterValidadeRestante(template)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant={isSelected ? "default" : "ghost"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelecionarTemplate(template);
                            }}
                            title="Selecionar"
                          >
                            {isSelected ? <Star className="h-4 w-4 fill-current" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onDuplicarTemplate(template)}
                            title="Duplicar"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {onEnviarTemplate && isSelected && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEnviarTemplate(template);
                              }}
                              title="Enviar"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onExcluirTemplate(template.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && templatesFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum template encontrado</p>
              <p className="text-sm mt-2">
                Tente ajustar os filtros ou crie um novo template
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="biblioteca" className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleAtualizarDocumentos}
              disabled={loadingBiblioteca}
            >
              {loadingBiblioteca ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Atualizar Biblioteca
            </Button>
          </div>

          {loadingBiblioteca ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando biblioteca...</span>
            </div>
          ) : (
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
                  {documentosFiltrados.map((documento) => {
                    const isSelected = documentoSelecionado?.id === documento.id;
                    return (
                    <TableRow 
                      key={documento.id} 
                      className={`hover:bg-muted/50 cursor-pointer ${isSelected ? 'bg-primary/10 border-primary' : ''}`}
                      onClick={() => onSelecionarDocumento(documento)}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {isSelected && <Star className="h-4 w-4 text-primary fill-primary" />}
                            <p className="font-medium">{documento.nome}</p>
                          </div>
                          {documento.descricao && (
                            <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                              {documento.descricao}
                            </p>
                          )}
                          {documento.tags && documento.tags.length > 0 && (
                            <div className="flex gap-1">
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
                          {isSelected && (
                            <Badge variant="default" className="text-xs">
                              Selecionado
                            </Badge>
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
                            variant={isSelected ? "default" : "ghost"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelecionarDocumento(documento);
                            }}
                            title="Selecionar"
                          >
                            {isSelected ? <Star className="h-4 w-4 fill-current" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(documento.url_arquivo, '_blank');
                            }}
                            title="Visualizar Documento"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCriarTemplateDaBiblioteca(documento, documento.nome);
                            }}
                            title="Criar Template"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {!loadingBiblioteca && documentosFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum documento encontrado</p>
              <p className="text-sm mt-2">
                Tente ajustar os filtros ou verifique se há documentos aprovados
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
