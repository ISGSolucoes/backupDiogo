import React, { useState } from "react";
import { ArrowLeft, Download, FileText, TrendingUp, Users, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { ComparativoAutomatico } from "@/components/sourcing/ComparativoAutomatico";
import { ComparativoItens } from "@/components/sourcing/ComparativoItens";
import { CriteriosTecnicos } from "@/components/sourcing/CriteriosTecnicos";
import { AcoesComprador } from "@/components/sourcing/AcoesComprador";
import { useProposalComparison } from "@/hooks/useProposalComparison";

export default function AvaliacaoRFP() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("geral");
  
  const { 
    rfpData, 
    propostas, 
    resumoAnalise, 
    loading 
  } = useProposalComparison(id || "");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando análise da RFP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/sourcing/projetos")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar aos Projetos
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {rfpData.name}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>🏢 {rfpData.cliente}</span>
                  <span>📂 {rfpData.categoria}</span>
                  <Badge variant={rfpData.status === 'ativo' ? 'default' : 'secondary'}>
                    {rfpData.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Relatório
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo da RFP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propostas Recebidas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {propostas.length} / {rfpData.convidados}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((propostas.length / rfpData.convidados) * 100)}% de participação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menor Preço</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {resumoAnalise.menorPreco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-xs text-muted-foreground">
                {resumoAnalise.fornecedorMenorPreco}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Melhor Pontuação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {resumoAnalise.melhorNota.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                {resumoAnalise.fornecedorMelhorNota}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Encerramento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(rfpData.dataEncerramento).toLocaleDateString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                às {new Date(rfpData.dataEncerramento).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navegação por Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="itens">Por Item</TabsTrigger>
            <TabsTrigger value="criterios">Critérios Técnicos</TabsTrigger>
            <TabsTrigger value="acoes">Ações</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-6">
            <ComparativoAutomatico propostas={propostas} rfpData={rfpData} />
          </TabsContent>

          <TabsContent value="itens" className="space-y-6">
            <ComparativoItens propostas={propostas} rfpData={rfpData} />
          </TabsContent>

          <TabsContent value="criterios" className="space-y-6">
            <CriteriosTecnicos propostas={propostas} criterios={rfpData.criterios} />
          </TabsContent>

          <TabsContent value="acoes" className="space-y-6">
            <AcoesComprador propostas={propostas} rfpData={rfpData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}