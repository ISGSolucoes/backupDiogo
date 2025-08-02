
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Edit,
  Copy,
  Eye,
  Trash2,
  MessageSquare,
  Users,
  Mail,
  CheckSquare,
  Star,
  FileText,
  Send
} from 'lucide-react';
import type { TemplateAcaoLote, TipoAcaoLote } from '@/types/acoes-lote';

interface TabelaTemplatesProps {
  templates: TemplateAcaoLote[];
  onSelecionarTemplate?: (template: TemplateAcaoLote) => void;
  onDuplicarTemplate: (template: TemplateAcaoLote) => void;
  onInativarTemplate: (templateId: string) => void;
  onEnviarTemplate?: (template: TemplateAcaoLote) => void;
  templateSelecionado?: TemplateAcaoLote | null;
}

const iconesPorTipo: Record<TipoAcaoLote, React.ComponentType<any>> = {
  comunicado: MessageSquare,
  pesquisa_cliente: Users,
  convite: Mail,
  avaliacao_interna: CheckSquare,
  requalificacao: Star
};

export const TabelaTemplates: React.FC<TabelaTemplatesProps> = ({
  templates,
  onSelecionarTemplate,
  onDuplicarTemplate,
  onInativarTemplate,
  onEnviarTemplate,
  templateSelecionado
}) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Finalidade</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Validade / Ações</TableHead>
            <TableHead>Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => {
            const Icone = iconesPorTipo[template.tipo_acao];
            
            return (
              <TableRow key={template.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{template.nome}</p>
                    {template.conteudo_texto && (
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {template.conteudo_texto}
                      </p>
                    )}
                    {template.configuracoes?.criado_da_biblioteca && (
                      <Badge variant="secondary" className="mt-1">
                        <FileText className="h-3 w-3 mr-1" />
                        Da Biblioteca
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Icone className="h-4 w-4" />
                    <span>{template.finalidade || template.tipo_acao.replace('_', ' ')}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  {template.categoria && (
                    <Badge variant="secondary">{template.categoria}</Badge>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{template.validade_dias} dias</span>
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
                      {onSelecionarTemplate && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => onSelecionarTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => onDuplicarTemplate(template)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {onEnviarTemplate && templateSelecionado?.id === template.id && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
                          onClick={() => onEnviarTemplate(template)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        onClick={() => onInativarTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  {new Date(template.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
