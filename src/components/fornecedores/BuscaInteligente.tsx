import React, { useState } from "react";
import { Search, Filter, Globe, Database, Sparkles, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBuscaExterna } from "@/hooks/useBuscaExterna";
import { toast } from "sonner";
import { FiltroFaturamento } from "./filtros/FiltroFaturamento";
import { FiltroFuncionarios } from "./filtros/FiltroFuncionarios";
import { FiltroLocalizacao } from "./filtros/FiltroLocalizacao";
import { FiltroCompliance } from "./filtros/FiltroCompliance";
import { FiltroCNAE } from "./filtros/FiltroCNAE";
import { FiltroRegiao } from "./filtros/FiltroRegiao";

interface BuscaInteligenteProps {
  onSearch: (params: any) => void;
  hasActiveSearch?: boolean;
}

export const BuscaInteligente = ({ onSearch, hasActiveSearch = false }: BuscaInteligenteProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tipoConsulta, setTipoConsulta] = useState<"interna" | "externa">("interna");
  
  // Filtros avançados reorganizados
  const [filtrosAvancados, setFiltrosAvancados] = useState({
    // Status no sistema
    compliance: {
      documentacaoOk: false,
      esgValidado: false,
      semIncidentes: false,
      status: "todos"
    },
    // Localização
    localizacao: {
      pais: "Brasil",
      estado: "",
      cidade: "",
      raio: ""
    },
    // Região
    regioesSelecionadas: [],
    // Faturamento
    faturamento: "",
    faturamentoCustom: { min: "", max: "" },
    // Funcionários
    funcionarios: "",
    funcionariosCustom: { min: "", max: "" },
    // CNAE
    cnaeSelecionados: []
  });

  const { buscarFornecedoresExternos, loading } = useBuscaExterna();

  const handleApplyFilters = () => {
    onSearch({
      tipoConsulta: "interna",
      searchTerm,
      filters: filtrosAvancados
    });
    toast.success("Filtros aplicados à busca interna");
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Digite um termo para buscar");
      return;
    }

    if (tipoConsulta === "externa") {
      toast.info("Iniciando busca externa em APIs...");
      
      try {
        const resultadosExternos = await buscarFornecedoresExternos(searchTerm, {
          uf: filtrosAvancados.localizacao.estado,
          cidade: filtrosAvancados.localizacao.cidade,
          segmento: searchTerm
        });

        onSearch({
          tipoConsulta: "externa",
          searchTerm,
          filters: filtrosAvancados,
          externalResults: resultadosExternos.length,
          resultadosReais: resultadosExternos
        });

        toast.success(`Busca externa concluída: ${resultadosExternos.length} fornecedores encontrados`);
      } catch (error) {
        console.error("Erro na busca externa:", error);
        toast.error("Erro na busca externa. Usando dados simulados.");
        
        onSearch({
          tipoConsulta: "externa",
          searchTerm,
          filters: filtrosAvancados,
          externalResults: Math.floor(Math.random() * 8) + 2
        });
      }
    } else {
      onSearch({
        tipoConsulta: "interna",
        searchTerm,
        filters: filtrosAvancados
      });
    }
  };

  const handleNovaPesquisa = () => {
    setSearchTerm("");
    setTipoConsulta("interna");
    clearFilters();
    setShowFilters(false);
    
    onSearch({
      tipoConsulta: "reset"
    });
    
    toast.info("Filtros limpos. Exibindo todos os fornecedores.");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      compliance: {
        documentacaoOk: false,
        esgValidado: false,
        semIncidentes: false,
        status: "todos"
      },
      localizacao: {
        pais: "Brasil",
        estado: "",
        cidade: "",
        raio: ""
      },
      regioesSelecionadas: [],
      faturamento: "",
      faturamentoCustom: { min: "", max: "" },
      funcionarios: "",
      funcionariosCustom: { min: "", max: "" },
      cnaeSelecionados: []
    };
    
    setFiltrosAvancados(clearedFilters);
    
    // Apply cleared filters to trigger table update
    onSearch({
      tipoConsulta: "interna",
      searchTerm,
      filters: clearedFilters
    });
    
    toast.success("Filtros limpos e aplicados!");
  };

  // Contadores de filtros ativos - incluindo região
  const filtrosAvancadosAtivos = [
    filtrosAvancados.faturamento,
    filtrosAvancados.funcionarios,
    filtrosAvancados.localizacao.estado,
    filtrosAvancados.localizacao.cidade,
    filtrosAvancados.compliance.status !== "todos" ? filtrosAvancados.compliance.status : "",
    ...filtrosAvancados.cnaeSelecionados,
    ...filtrosAvancados.regioesSelecionadas
  ].filter(v => v).length + 
  (filtrosAvancados.compliance.documentacaoOk ? 1 : 0) +
  (filtrosAvancados.compliance.esgValidado ? 1 : 0) +
  (filtrosAvancados.compliance.semIncidentes ? 1 : 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Busca Inteligente de Fornecedores
          {hasActiveSearch && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNovaPesquisa}
              className="ml-auto bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:border-orange-600"
            >
              <X className="h-4 w-4 mr-1" />
              Nova Pesquisa
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={tipoConsulta === "interna" ? "default" : "outline"}
                  onClick={() => setTipoConsulta("interna")}
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  Base Interna
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Busca nos fornecedores já cadastrados no sistema.<br/>
                Use os filtros para refinar os resultados da tabela.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={tipoConsulta === "externa" ? "default" : "outline"}
                  onClick={() => setTipoConsulta("externa")}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Busca Externa
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    APIs Reais
                  </Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Busca fornecedores em bases externas<br/>
                usando APIs reais (BrasilAPI, ReceitaWS).</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder={
                tipoConsulta === "externa" 
                  ? "Digite o segmento, CNPJ ou nome da empresa..." 
                  : "Buscar por nome, CNPJ ou segmento..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Buscando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </>
            )}
          </Button>
        </div>

        {tipoConsulta === "externa" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Globe className="h-4 w-4" />
              <span className="font-medium">Busca Externa Ativada</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Fonte: BrasilAPI → ReceitaWS → LLM (fallback automático)
            </p>
          </div>
        )}

        {/* Filtros Avançados */}
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between border-2 border-sourcexpress-blue hover:border-sourcexpress-purple transition-colors">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-sourcexpress-blue" />
                <span className="font-semibold text-sourcexpress-blue">Filtros Avançados</span>
                {filtrosAvancadosAtivos > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-sourcexpress-purple text-white">
                    {filtrosAvancadosAtivos}
                  </Badge>
                )}
              </div>
              {showFilters ? (
                <ChevronUp className="h-4 w-4 transition-transform duration-200 text-sourcexpress-purple" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform duration-200 text-sourcexpress-blue" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 pt-4">
            <div>
              <h4 className="font-medium text-sm mb-4 text-slate-700">Filtros Avançados</h4>
              <div className="space-y-6">
                
                {/* Primeira linha: Status + Localização */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 1. Status no Sistema + Compliance */}
                  <FiltroCompliance
                    compliance={filtrosAvancados.compliance}
                    onComplianceChange={(field, value) => setFiltrosAvancados(prev => ({ 
                      ...prev, 
                      compliance: { ...prev.compliance, [field]: value }
                    }))}
                  />

                  {/* 2. Localização */}
                  <FiltroLocalizacao
                    localizacao={filtrosAvancados.localizacao}
                    onLocalizacaoChange={(field, value) => setFiltrosAvancados(prev => ({ 
                      ...prev, 
                      localizacao: { ...prev.localizacao, [field]: value }
                    }))}
                  />
                </div>

                {/* Segunda linha: Filtros com Accordion */}
                <Accordion type="multiple" className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 3. Faturamento */}
                    <AccordionItem value="faturamento" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-sm font-medium">
                        Faturamento Anual
                        {filtrosAvancados.faturamento && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Ativo
                          </Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 pb-4">
                        <FiltroFaturamento
                          faturamento={filtrosAvancados.faturamento}
                          faturamentoCustom={filtrosAvancados.faturamentoCustom}
                          onFaturamentoChange={(value) => setFiltrosAvancados(prev => ({ ...prev, faturamento: value }))}
                          onFaturamentoCustomChange={(values) => setFiltrosAvancados(prev => ({ ...prev, faturamentoCustom: values }))}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    {/* 4. Funcionários */}
                    <AccordionItem value="funcionarios" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-sm font-medium">
                        Quantidade de Funcionários
                        {filtrosAvancados.funcionarios && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Ativo
                          </Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 pb-4">
                        <FiltroFuncionarios
                          funcionarios={filtrosAvancados.funcionarios}
                          funcionariosCustom={filtrosAvancados.funcionariosCustom}
                          onFuncionariosChange={(value) => setFiltrosAvancados(prev => ({ ...prev, funcionarios: value }))}
                          onFuncionariosCustomChange={(values) => setFiltrosAvancados(prev => ({ ...prev, funcionariosCustom: values }))}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </div>

                  {/* Terceira linha: Região + CNAE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* 5. Região */}
                    <AccordionItem value="regiao" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-sm font-medium">
                        Região
                        {filtrosAvancados.regioesSelecionadas.length > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {filtrosAvancados.regioesSelecionadas.length}
                          </Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 pb-4">
                        <FiltroRegiao
                          regioesSelecionadas={filtrosAvancados.regioesSelecionadas}
                          onRegiaoChange={(regioes) => setFiltrosAvancados(prev => ({ ...prev, regioesSelecionadas: regioes }))}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    {/* 6. CNAE */}
                    <AccordionItem value="cnae" className="border rounded-lg px-4">
                      <AccordionTrigger className="text-sm font-medium">
                        Segmento / CNAE
                        {filtrosAvancados.cnaeSelecionados.length > 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {filtrosAvancados.cnaeSelecionados.length}
                          </Badge>
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 pb-4">
                        <FiltroCNAE
                          cnaeSelecionados={filtrosAvancados.cnaeSelecionados}
                          onCNAEChange={(cnaes) => setFiltrosAvancados(prev => ({ ...prev, cnaeSelecionados: cnaes }))}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                </Accordion>

              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleApplyFilters} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Pesquisar com Filtros
              </Button>
              <Button variant="outline" onClick={clearFilters} className="flex-1">
                Limpar Filtros
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
