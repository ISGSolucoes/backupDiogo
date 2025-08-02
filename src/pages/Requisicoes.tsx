
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardsStatusRequisicoes } from "@/components/requisicoes/CardsStatusRequisicoes";
import { FiltrosRequisicao } from "@/components/requisicoes/FiltrosRequisicao";
import { TabelaRequisicoesReal } from "@/components/requisicoes/TabelaRequisicoesReal";
import { useRequisicaoTriggers } from "@/hooks/useRequisicaoTriggers";
import { NotificacaoFluxoAutomatico } from "@/components/requisicoes/NotificacaoFluxoAutomatico";
import { BotaoSimularAprovacao } from "@/components/requisicoes/BotaoSimularAprovacao";
import { Processo3BidsAndBuy } from "@/components/requisicoes/Processo3BidsAndBuy";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Requisicoes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todas");
  
  // Ativar triggers automáticos para passagem de bastão
  useRequisicaoTriggers();

  const handleVerDetalhes = (id: string) => {
    navigate(`/requisicoes/${id}/detalhes`);
  };

  return (
    <>
      <NotificacaoFluxoAutomatico />
      <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            📋 Requisições Internas
          </h1>
          <p className="text-slate-600">
            Gerencie solicitações de compra entre áreas da empresa
          </p>
        </div>
        
        <div className="flex gap-2">
          <BotaoSimularAprovacao />
          <Button 
            onClick={() => navigate('/requisicoes/criar')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Requisição
          </Button>
        </div>
      </div>

      {/* Cards de Status */}
      <CardsStatusRequisicoes />

      {/* Conteúdo Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas Requisições</TabsTrigger>
          <TabsTrigger value="3bids">3-Bids & Buy</TabsTrigger>
          <TabsTrigger value="filtros">Filtros Avançados</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          {/* Filtros */}
          <FiltrosRequisicao 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Tabela de Requisições */}
          <TabelaRequisicoesReal onVerDetalhes={handleVerDetalhes} />
        </TabsContent>

        <TabsContent value="3bids" className="space-y-4">
          <Processo3BidsAndBuy />
        </TabsContent>

        <TabsContent value="filtros" className="space-y-4">
          <FiltrosRequisicao 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <div className="text-center py-12">
            <p className="text-gray-500">Relatórios em desenvolvimento</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
};

export default Requisicoes;
