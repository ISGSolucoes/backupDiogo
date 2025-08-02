
import React from 'react';
import { Building, Flag, MapPin, FileSpreadsheet, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GlobeIcon } from './GlobeIcon';
import { SegmentoEstatisticas, FornecedorExterno } from './types';
import { exportarFornecedores } from './utils';

interface ResumoSegmentoProps {
  segmento: string;
  estatisticas: SegmentoEstatisticas;
  fornecedores: FornecedorExterno[];
}

export const ResumoSegmento = ({ segmento, estatisticas, fornecedores }: ResumoSegmentoProps) => {
  const handleExportar = (formato: 'xlsx' | 'csv') => {
    const resultado = exportarFornecedores(
      fornecedores.filter(f => f.tipo === segmento),
      formato,
      segmento
    );
    
    if (resultado.sucesso) {
      toast.success(`${resultado.mensagem}. Arquivo: ${resultado.nomeArquivo}`);
    } else {
      toast.error("Erro ao exportar dados");
    }
  };

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-5">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-base font-medium">Resumo do segmento: {segmento}</h4>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => handleExportar('xlsx')}
          >
            <FileSpreadsheet className="h-4 w-4" />
            XLSX
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => handleExportar('csv')}
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Card de total de empresas */}
        <Card className="bg-white border-blue-100">
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center">
              <Building className="h-4 w-4 text-blue-500 mr-2" />
              <CardTitle className="text-sm">Total de Empresas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold">
                {estatisticas.totalEmpresas}
              </p>
              <Badge variant="outline" className="bg-blue-50">
                {estatisticas.percentualDoTotal.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card de regiões */}
        <Card className="bg-white border-blue-100">
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center">
              <GlobeIcon className="h-4 w-4 text-green-500 mr-2" />
              <CardTitle className="text-sm">Por Região</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm space-y-1">
              {Object.entries(estatisticas.dadosPorRegiao)
                .sort((a, b) => b[1].quantidade - a[1].quantidade)
                .slice(0, 3)
                .map(([regiao, { quantidade, percentual }]) => (
                  <li key={regiao} className="flex justify-between">
                    <span>{regiao}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{quantidade}</span>
                      <span className="text-xs text-slate-500">({percentual.toFixed(1)}%)</span>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        {/* Card de estados */}
        <Card className="bg-white border-blue-100">
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center">
              <Flag className="h-4 w-4 text-amber-500 mr-2" />
              <CardTitle className="text-sm">Por Estado</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm space-y-1">
              {Object.entries(estatisticas.dadosPorEstado)
                .sort((a, b) => b[1].quantidade - a[1].quantidade)
                .slice(0, 3)
                .map(([estado, { quantidade, percentual }]) => (
                  <li key={estado} className="flex justify-between">
                    <span>{estado}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{quantidade}</span>
                      <span className="text-xs text-slate-500">({percentual.toFixed(1)}%)</span>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        {/* Card de cidades */}
        <Card className="bg-white border-blue-100">
          <CardHeader className="pb-2 pt-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-indigo-500 mr-2" />
              <CardTitle className="text-sm">Por Cidade</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm space-y-1">
              {Object.entries(estatisticas.dadosPorCidade)
                .sort((a, b) => b[1].quantidade - a[1].quantidade)
                .slice(0, 3)
                .map(([cidade, { quantidade, percentual }]) => (
                  <li key={cidade} className="flex justify-between">
                    <span>{cidade}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{quantidade}</span>
                      <span className="text-xs text-slate-500">({percentual.toFixed(1)}%)</span>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="mt-2 text-xs text-slate-500">
        <span className="font-medium">Exportação:</span> A lista exportada inclui Nome, CNPJ, Categoria, Estado, Cidade, E-mail, Score e Status
      </div>
    </div>
  );
};
