import React, { useState } from 'react';
import { Download, Search, FileText, File, FileArchive, Filter, Send, Mail, Star } from 'lucide-react';
import { ExpandedDialog } from '@/components/ui/expanded-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaSolicitante,
  ModeloBiblioteca,
  TipoFornecimento,
  FormatoModelo,
  FiltroBiblioteca,
} from '@/types/questionario';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnvioQuestionarioDestinatarios } from './questionario/EnvioQuestionarioDestinatarios';
import { useFullscreenModal } from '@/hooks/useFullscreenModal';

// Interface for contact selection
interface ContatoFornecedor {
  id: string;
  nome: string;
  email: string;
  cargo?: string;
  principal: boolean;
  ativo: boolean;
}

interface BibliotecaQuestionariosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorId: string;
  fornecedorNome: string;
}

export const BibliotecaQuestionarios = ({
  open,
  onOpenChange,
  fornecedorId,
  fornecedorNome,
}: BibliotecaQuestionariosProps) => {
  // Estado para filtros
  const [filtro, setFiltro] = useState<FiltroBiblioteca>({
    ordenacao: 'recentes',
  });
  const [termoBusca, setTermoBusca] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'todos' | 'recentes' | 'populares'>('todos');
  
  // Estado para envio de questionário
  const [modeloSelecionado, setModeloSelecionado] = useState<ModeloBiblioteca | null>(null);
  const [isEnvioDialogOpen, setIsEnvioDialogOpen] = useState(false);
  
  // Hook para controle de fullscreen
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();
  
  // Mock de contatos para demonstração
  const [contatos, setContatos] = useState<ContatoFornecedor[]>([
    { 
      id: '1',
      nome: 'João Silva', 
      email: 'joao.silva@techsolutions.com', 
      cargo: 'Diretor Comercial',
      principal: true,
      ativo: true
    },
    { 
      id: '2',
      nome: 'Maria Santos', 
      email: 'maria.santos@techsolutions.com', 
      cargo: 'Gerente de Contas',
      principal: false,
      ativo: true
    },
    {
      id: '3',
      nome: 'Carlos Pereira',
      email: 'carlos.pereira@techsolutions.com',
      cargo: 'Analista de Licitações',
      principal: false,
      ativo: true
    },
    {
      id: '4',
      nome: 'Amanda Oliveira', 
      email: 'amanda@techsolutions.com',
      cargo: 'Gerente Financeiro',
      principal: false,
      ativo: false
    },
    {
      id: '5',
      nome: 'Roberto Gomes',
      email: 'roberto.gomes@techsolutions.com',
      cargo: 'Comprador',
      principal: false,
      ativo: true
    }
  ]);

  // Mock de dados de modelos
  const [modelos, setModelos] = useState<ModeloBiblioteca[]>([
    {
      id: '1',
      nome: 'Formulário de Qualificação Básica',
      descricao: 'Formulário padrão para qualificação inicial de fornecedores de produtos.',
      tipoFornecimento: 'produto',
      areas: ['compras', 'qualidade'],
      formato: 'pdf',
      arquivoUrl: '/modelos/form-qualificacao-basica.pdf',
      dataCriacao: '2023-05-15',
      versao: '1.0',
      autor: 'Departamento de Compras',
      tags: ['qualificação', 'produtos', 'inicial'],
      downloads: 45,
      ultimoDownload: '2023-11-01',
      tamanhoKb: 320,
      ativo: true,
      envios: 12,
      ultimoEnvio: '2023-10-28'
    },
    {
      id: '2',
      nome: 'Avaliação de Fornecedores de Serviço',
      descricao: 'Questionário completo para avaliação de fornecedores de serviços recorrentes.',
      tipoFornecimento: 'servico_recorrente',
      areas: ['compras', 'engenharia'],
      formato: 'docx',
      arquivoUrl: '/modelos/avaliacao-servico.docx',
      dataCriacao: '2023-08-10',
      versao: '2.1',
      autor: 'Departamento de Engenharia',
      tags: ['avaliação', 'serviços', 'recorrente'],
      downloads: 28,
      ultimoDownload: '2023-10-15',
      tamanhoKb: 450,
      ativo: true,
      envios: 8,
      ultimoEnvio: '2023-11-05'
    },
    {
      id: '3',
      nome: 'Formulário ESG para Fornecedores',
      descricao: 'Avaliação de práticas ambientais, sociais e de governança.',
      tipoFornecimento: 'misto',
      areas: ['qualidade', 'juridico'],
      formato: 'xlsx',
      arquivoUrl: '/modelos/esg-form.xlsx',
      dataCriacao: '2023-09-22',
      versao: '1.0',
      autor: 'Departamento de Compliance',
      tags: ['ESG', 'sustentabilidade', 'compliance'],
      downloads: 15,
      ultimoDownload: '2023-10-30',
      tamanhoKb: 280,
      ativo: true,
      envios: 5,
      ultimoEnvio: '2023-10-25'
    },
    {
      id: '4',
      nome: 'Qualificação Técnica - Engenharia',
      descricao: 'Avaliação técnica específica para fornecedores de serviços de engenharia.',
      tipoFornecimento: 'servico',
      areas: ['engenharia'],
      formato: 'pdf',
      arquivoUrl: '/modelos/qualificacao-engenharia.pdf',
      dataCriacao: '2023-07-05',
      versao: '1.2',
      autor: 'Departamento de Engenharia',
      tags: ['técnico', 'engenharia', 'qualificação'],
      downloads: 32,
      ultimoDownload: '2023-11-10',
      tamanhoKb: 520,
      ativo: true,
      envios: 10,
      ultimoEnvio: '2023-11-02'
    },
    {
      id: '5',
      nome: 'Avaliação Financeira de Fornecedores',
      descricao: 'Análise de saúde financeira e documentação fiscal.',
      tipoFornecimento: 'misto',
      areas: ['financeiro'],
      formato: 'interno',
      arquivoUrl: '/modelos/avaliacao-financeira.pdf',
      dataCriacao: '2023-06-18',
      versao: '2.0',
      autor: 'Departamento Financeiro',
      tags: ['financeiro', 'fiscal', 'documentação'],
      downloads: 20,
      ultimoDownload: '2023-10-20',
      tamanhoKb: 380,
      ativo: true,
      envios: 7,
      ultimoEnvio: '2023-10-10'
    }
  ]);

  // Função para filtrar modelos
  const modelosFiltrados = () => {
    return modelos
      .filter(modelo => {
        // Filtro por termo de busca
        if (termoBusca && !modelo.nome.toLowerCase().includes(termoBusca.toLowerCase()) && 
            !modelo.tags.some(tag => tag.toLowerCase().includes(termoBusca.toLowerCase()))) {
          return false;
        }
        
        // Filtro por tipo de fornecimento
        if (filtro.tipoFornecimento && filtro.tipoFornecimento !== 'todos' && modelo.tipoFornecimento !== filtro.tipoFornecimento) {
          return false;
        }
        
        // Filtro por área
        if (filtro.area && filtro.area !== 'todas' && !modelo.areas.includes(filtro.area as AreaSolicitante)) {
          return false;
        }
        
        // Filtro por formato
        if (filtro.formato && modelo.formato !== filtro.formato) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Ordenação
        switch (filtro.ordenacao) {
          case 'recentes':
            return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
          case 'populares':
            return b.downloads - a.downloads;
          case 'alfabetica':
            return a.nome.localeCompare(b.nome);
          default:
            return 0;
        }
      });
  };

  // Filtros para abas específicas
  const modelosRecentes = modelos
    .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
    .slice(0, 3);
  
  const modelosPopulares = modelos
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 3);

  // Função para fazer download do modelo
  const handleDownload = (modelo: ModeloBiblioteca) => {
    setIsLoading(true);
    
    // Simulação de download
    setTimeout(() => {
      // Atualizar contagem de downloads
      setModelos(prev => 
        prev.map(m => 
          m.id === modelo.id 
            ? { ...m, downloads: m.downloads + 1, ultimoDownload: new Date().toISOString() } 
            : m
        )
      );
      
      setIsLoading(false);
      toast.success(`Documento "${modelo.nome}" baixado com sucesso!`);
    }, 1000);
  };

  // Função para enviar questionário
  const handleEnviar = (modelo: ModeloBiblioteca) => {
    setModeloSelecionado(modelo);
    setIsEnvioDialogOpen(true);
  };

  // Função para confirmar envio
  const confirmarEnvio = (contatosIds: string[], observacoes: string) => {
    if (contatosIds.length === 0 || !modeloSelecionado) {
      toast.error("Selecione ao menos um contato para enviar o questionário");
      return;
    }

    setIsLoading(true);
    
    // Simulação de envio
    setTimeout(() => {
      const contatosSelecionados = contatos.filter(c => contatosIds.includes(c.id));
      const nomesContatos = contatosSelecionados.map(c => c.nome).join(', ');
      const emailsContatos = contatosSelecionados.map(c => c.email).join(', ');
      
      // Atualizar contagem de envios
      setModelos(prev => 
        prev.map(m => 
          m.id === modeloSelecionado.id 
            ? { ...m, envios: (m.envios || 0) + 1, ultimoEnvio: new Date().toISOString() } 
            : m
        )
      );
      
      setIsLoading(false);
      setIsEnvioDialogOpen(false);
      
      // Montar a mensagem de sucesso
      let mensagemSucesso = `Questionário "${modeloSelecionado.nome}" enviado com sucesso`;
      if (contatosIds.length === 1) {
        mensagemSucesso += ` para ${nomesContatos} (${emailsContatos})`;
      } else {
        mensagemSucesso += ` para ${contatosIds.length} contatos`;
      }
      
      if (observacoes) {
        mensagemSucesso += " com observações adicionais";
      }
      
      toast.success(mensagemSucesso);

      // Aqui seria o lugar para registrar o log no histórico de qualificação
      console.log(`Log: Questionário ${modeloSelecionado.nome} enviado para ${emailsContatos} em ${new Date().toLocaleString()}`);
      console.log(`Observações: ${observacoes || 'Nenhuma'}`);
    }, 1500);
  };

  // Renderização do ícone de formato
  const renderIconeFormato = (formato: FormatoModelo) => {
    switch (formato) {
      case 'pdf':
        return <File className="h-6 w-6 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-600" />;
      case 'xlsx':
        return <FileText className="h-6 w-6 text-green-600" />;
      default:
        return <FileArchive className="h-6 w-6 text-gray-600" />;
    }
  };

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    } catch (e) {
      return dataString;
    }
  };

  // Traduzir o tipo de fornecimento
  const traduzirTipoFornecimento = (tipo: TipoFornecimento) => {
    switch (tipo) {
      case 'produto': return 'Produto';
      case 'servico': return 'Serviço';
      case 'servico_recorrente': return 'Serviço Recorrente';
      case 'misto': return 'Misto (Produto + Serviço)';
      default: return tipo;
    }
  };

  // Traduzir a área
  const traduzirArea = (area: AreaSolicitante) => {
    switch (area) {
      case 'compras': return 'Compras';
      case 'engenharia': return 'Engenharia';
      case 'logistica': return 'Logística';
      case 'qualidade': return 'Qualidade';
      case 'financeiro': return 'Financeiro';
      case 'juridico': return 'Jurídico';
      case 'suprimentos': return 'Suprimentos';
      default: return area;
    }
  };

  return (
    <>
      <ExpandedDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Biblioteca de Modelos de Questionários"
        description={`Selecione um modelo de questionário para download ou envio ao fornecedor ${fornecedorNome}.`}
        fullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      >
        <div className="space-y-6">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Buscar por nome ou tag..."
                  className="pl-9"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select
                  value={filtro.tipoFornecimento || 'todos'}
                  onValueChange={(valor) =>
                    setFiltro({ ...filtro, tipoFornecimento: valor as TipoFornecimento | 'todos' || undefined })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de Fornecimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tipos</SelectItem>
                    <SelectItem value="produto">Produto</SelectItem>
                    <SelectItem value="servico">Serviço</SelectItem>
                    <SelectItem value="servico_recorrente">Serviço Recorrente</SelectItem>
                    <SelectItem value="misto">Misto</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filtro.area || 'todas'}
                  onValueChange={(valor) =>
                    setFiltro({ ...filtro, area: valor as AreaSolicitante | 'todas' || undefined })
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Área Solicitante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as áreas</SelectItem>
                    <SelectItem value="compras">Compras</SelectItem>
                    <SelectItem value="engenharia">Engenharia</SelectItem>
                    <SelectItem value="logistica">Logística</SelectItem>
                    <SelectItem value="qualidade">Qualidade</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="suprimentos">Suprimentos</SelectItem>
                    <SelectItem value="juridico">Jurídico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="todos" value={abaAtiva} onValueChange={(v) => setAbaAtiva(v as 'todos' | 'recentes' | 'populares')}>
              <TabsList className="mb-4">
                <TabsTrigger value="todos">Todos os modelos</TabsTrigger>
                <TabsTrigger value="recentes">Modelos Recentes</TabsTrigger>
                <TabsTrigger value="populares">Mais Utilizados</TabsTrigger>
              </TabsList>
              
              <TabsContent value="todos" className="flex-1">
                <ScrollArea className="h-[calc(95vh-300px)] pr-4">
                  <div className="grid grid-cols-1 gap-4">
                    {modelosFiltrados().length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        Nenhum modelo encontrado com os filtros selecionados.
                      </div>
                    ) : (
                      modelosFiltrados().map((modelo) => (
                        <Card key={modelo.id} className="overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-start">
                              <div className="mr-3">
                                {renderIconeFormato(modelo.formato)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold">{modelo.nome}</h3>
                                <p className="text-sm text-slate-500">{modelo.descricao}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 pb-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Tipo:</span>{' '}
                                {traduzirTipoFornecimento(modelo.tipoFornecimento)}
                              </div>
                              <div>
                                <span className="font-medium">Formato:</span>{' '}
                                {modelo.formato.toUpperCase()}
                              </div>
                              <div>
                                <span className="font-medium">Última atualização:</span>{' '}
                                {formatarData(modelo.dataCriacao)}
                              </div>
                              <div>
                                <span className="font-medium">Versão:</span> {modelo.versao}
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <span className="text-xs font-medium text-slate-500">Áreas:</span>{' '}
                              <div className="flex flex-wrap gap-1 mt-1">
                                {modelo.areas.map((area) => (
                                  <Badge 
                                    key={area} 
                                    variant="outline" 
                                    className="bg-slate-50"
                                  >
                                    {traduzirArea(area)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <span className="text-xs font-medium text-slate-500">Tags:</span>{' '}
                              <div className="flex flex-wrap gap-1 mt-1">
                                {modelo.tags.map((tag) => (
                                  <Badge 
                                    key={tag} 
                                    variant="outline" 
                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between border-t pt-3">
                            <div className="text-sm text-slate-500">
                              {modelo.downloads} downloads • {modelo.envios || 0} envios
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownload(modelo)}
                                disabled={isLoading}
                              >
                                <Download className="h-4 w-4 mr-1" /> Download
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleEnviar(modelo)}
                                disabled={isLoading}
                              >
                                <Send className="h-4 w-4 mr-1" /> Enviar
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="recentes" className="flex-1">
                <ScrollArea className="h-[calc(95vh-300px)] pr-4">
                  <div className="grid grid-cols-1 gap-4">
                    {modelosRecentes.map((modelo) => (
                      <Card key={modelo.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start">
                            <div className="mr-3">
                              {renderIconeFormato(modelo.formato)}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">{modelo.nome}</h3>
                              <p className="text-sm text-slate-500">{modelo.descricao}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Tipo:</span>{' '}
                              {traduzirTipoFornecimento(modelo.tipoFornecimento)}
                            </div>
                            <div>
                              <span className="font-medium">Formato:</span>{' '}
                              {modelo.formato.toUpperCase()}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-3">
                          <div className="text-sm text-slate-500">
                            Adicionado em {formatarData(modelo.dataCriacao)}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownload(modelo)}
                              disabled={isLoading}
                            >
                              <Download className="h-4 w-4 mr-1" /> Download
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleEnviar(modelo)}
                              disabled={isLoading}
                            >
                              <Send className="h-4 w-4 mr-1" /> Enviar
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="populares" className="flex-1">
                <ScrollArea className="h-[calc(95vh-300px)] pr-4">
                  <div className="grid grid-cols-1 gap-4">
                    {modelosPopulares.map((modelo) => (
                      <Card key={modelo.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start">
                            <div className="mr-3">
                              {renderIconeFormato(modelo.formato)}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">{modelo.nome}</h3>
                              <p className="text-sm text-slate-500">{modelo.descricao}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              {modelo.downloads} downloads
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Tipo:</span>{' '}
                              {traduzirTipoFornecimento(modelo.tipoFornecimento)}
                            </div>
                             <div>
                               <span className="font-medium">Formato:</span>{' '}
                               {modelo.formato.toUpperCase()}
                             </div>
                           </div>
                         </CardContent>
                        <CardFooter className="flex justify-between border-t pt-3">
                          <div className="text-sm text-slate-500">
                            Último download: {modelo.ultimoDownload ? formatarData(modelo.ultimoDownload) : 'N/A'}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownload(modelo)}
                              disabled={isLoading}
                            >
                              <Download className="h-4 w-4 mr-1" /> Download
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleEnviar(modelo)}
                              disabled={isLoading}
                            >
                              <Send className="h-4 w-4 mr-1" /> Enviar
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                   </div>
                 </ScrollArea>
               </TabsContent>
            </Tabs>
        </div>
      </ExpandedDialog>

      {/* Novo componente de seleção de destinatários */}
      <EnvioQuestionarioDestinatarios
        open={isEnvioDialogOpen}
        onOpenChange={setIsEnvioDialogOpen}
        modelo={modeloSelecionado}
        contatos={contatos}
        onEnviar={confirmarEnvio}
        isLoading={isLoading}
      />
    </>
  );
};
