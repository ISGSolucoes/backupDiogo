
import React, { useState } from 'react';
import { CheckCircle, Clock, ExternalLink, Plus, LinkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { StatusNaBase } from './StatusNaBase';
import { FornecedorExterno } from './types';
import { formatarCNPJ, obterCnpjRaiz, determinarTipoUnidade, buscarEmpresasDoMesmoGrupo } from './utils';
import { Link } from 'react-router-dom';

interface CardFornecedorExternoProps {
  fornecedor: FornecedorExterno;
  onImportarClick: (fornecedor: FornecedorExterno) => void;
  onVerDetalhes: (fornecedor: FornecedorExterno) => void;
  fornecedores?: FornecedorExterno[]; // Lista completa para buscar do mesmo grupo
}

export const CardFornecedorExterno = ({ 
  fornecedor, 
  onImportarClick, 
  onVerDetalhes,
  fornecedores = []
}: CardFornecedorExternoProps) => {
  const [empresasRelacionadas, setEmpresasRelacionadas] = useState<FornecedorExterno[]>([]);
  
  const cnpjFormatado = formatarCNPJ(fornecedor.cnpj);
  const tipoUnidade = determinarTipoUnidade(fornecedor.cnpj);
  const cnpjRaiz = obterCnpjRaiz(fornecedor.cnpj);
  
  const handleVerHierarquia = () => {
    if (fornecedores.length > 0) {
      const empresasGrupo = buscarEmpresasDoMesmoGrupo(fornecedores, cnpjRaiz);
      setEmpresasRelacionadas(empresasGrupo);
    }
  };

  // Formatar data de cadastro para MM/AAAA
  const dataCadastroFormatada = fornecedor.dataCadastro ? 
    new Date(fornecedor.dataCadastro).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }) : 
    'N/A';

  // Verificar se o fornecedor já está na base e obter o ID dele
  const fornecedorNaBase = fornecedor.statusNaBase && fornecedor.idNaBase;

  return (
    <Card key={fornecedor.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{fornecedor.nome}</CardTitle>
            <CardDescription>{cnpjFormatado}</CardDescription>
          </div>
          <Badge variant={fornecedor.score > 75 ? "secondary" : fornecedor.score > 60 ? "default" : "outline"} 
                  className={fornecedor.score > 75 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
            {fornecedor.score}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-slate-500">Localização</p>
            <p>{fornecedor.cidade} - {fornecedor.uf}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Tipo</p>
            <p>{fornecedor.tipo}</p>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-slate-500">Tipo de unidade</p>
              <p className="text-sm">
                <Badge variant={tipoUnidade === 'Matriz' ? 'default' : 'outline'} className="mr-1">
                  {tipoUnidade}
                </Badge>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">CNPJ raiz</p>
              <p className="text-sm font-mono">{cnpjRaiz}</p>
            </div>
          </div>
        </div>

        {fornecedor.dataCadastro && (
          <div className="mt-2">
            <p className="text-xs text-slate-500">Cadastrado em</p>
            <p className="text-sm">{dataCadastroFormatada}</p>
          </div>
        )}

        {fornecedor.totalUnidadesGrupo && fornecedor.totalUnidadesGrupo > 1 && (
          <div className="mt-2">
            <p className="text-xs text-slate-500">Grupo empresarial</p>
            <p className="text-sm">Esta rede possui {fornecedor.totalUnidadesGrupo} unidades cadastradas</p>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-1 text-xs w-full"
                  onClick={handleVerHierarquia}
                >
                  <LinkIcon className="h-3 w-3 mr-1" />
                  Ver hierarquia
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Hierarquia Empresarial</SheetTitle>
                  <SheetDescription>
                    Unidades com raiz CNPJ: {cnpjRaiz}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {empresasRelacionadas.length > 0 ? (
                    empresasRelacionadas.map((empresa) => (
                      <div key={empresa.id} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{empresa.nome}</p>
                            <p className="text-sm text-slate-500">{formatarCNPJ(empresa.cnpj)}</p>
                          </div>
                          <Badge variant={determinarTipoUnidade(empresa.cnpj) === 'Matriz' ? 'default' : 'outline'}>
                            {determinarTipoUnidade(empresa.cnpj)}
                          </Badge>
                        </div>
                        <div className="text-sm mt-2">
                          <p>{empresa.cidade} - {empresa.uf}</p>
                          <p className="text-slate-500">{empresa.tipo}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">Nenhuma outra unidade encontrada neste momento.</p>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {fornecedor.certificacoes && (
          <div className="mt-2">
            <p className="text-xs text-slate-500">Certificações</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {fornecedor.certificacoes.map((cert, i) => (
                <Badge key={i} variant="outline" className="text-xs bg-green-50 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Indicador de status na base */}
        {fornecedor.statusNaBase && (
          <StatusNaBase status={fornecedor.statusNaBase} />
        )}
        
        <div className="mt-2 flex items-center text-xs text-slate-400">
          <Clock className="h-3 w-3 mr-1" />
          Atualizado em {fornecedor.ultimaAtualizacao}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {/* Renderiza o Link para o detalhe do fornecedor se ele já estiver na base, ou o botão normal caso contrário */}
        {fornecedorNaBase ? (
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs"
            asChild
          >
            <Link to={`/fornecedores/${fornecedor.idNaBase}`}>
              <ExternalLink className="h-3 w-3 mr-1" />
              Ver detalhes
            </Link>
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs"
            onClick={() => onVerDetalhes(fornecedor)}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Ver detalhes
          </Button>
        )}
        <Button 
          size="sm" 
          className="text-xs"
          onClick={() => onImportarClick(fornecedor)}
          disabled={!!fornecedor.statusNaBase}
        >
          <Plus className="h-3 w-3 mr-1" />
          {fornecedor.statusNaBase ? 'Já cadastrado' : 'Importar'}
        </Button>
      </CardFooter>
    </Card>
  );
};
