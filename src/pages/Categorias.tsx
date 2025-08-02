import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArvoreCategoria } from "@/components/categorias/ArvoreCategoria";
import { EstrategiaCategoria } from "@/components/categorias/EstrategiaCategoria";
import { FornecedoresCategoria } from "@/components/categorias/FornecedoresCategoria";
import { IndicadoresCategoria } from "@/components/categorias/IndicadoresCategoria";
import { CriarCategoriaModal } from "@/components/categorias/CriarCategoriaModal";
import { FiltroCategorias } from "@/components/categorias/FiltroCategorias";
import { Plus, TrendingUp, AlertTriangle, Users, Folder } from "lucide-react";

const Categorias = () => {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtros, setFiltros] = useState({
    busca: "",
    criticidade: "",
    responsavel: "",
    status: ""
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gerenciamento de Categorias</h1>
          <p className="text-slate-600 mt-1">
            Organize, classifique e otimize suas categorias de compra com visão estratégica
          </p>
        </div>
        <Button onClick={() => setMostrarModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Indicadores Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Categorias</p>
                <p className="text-2xl font-bold text-slate-900">47</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Criticidade Alta</p>
                <p className="text-2xl font-bold text-red-600">12</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Gasto Total</p>
                <p className="text-2xl font-bold text-green-600">R$ 4.2M</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Fornecedores Ativos</p>
                <p className="text-2xl font-bold text-purple-600">284</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <FiltroCategorias
        filtros={filtros}
        onFiltrosChange={setFiltros}
      />

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Árvore de Categorias */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Estrutura de Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <ArvoreCategoria
                filtros={filtros}
                categoriaSelecionada={categoriaSelecionada}
                onCategoriaSelect={setCategoriaSelecionada}
              />
            </CardContent>
          </Card>
        </div>

        {/* Detalhes da Categoria */}
        <div className="lg:col-span-2">
          {categoriaSelecionada ? (
            <Tabs defaultValue="indicadores" className="space-y-6">
              <TabsList>
                <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
                <TabsTrigger value="estrategia">Estratégia</TabsTrigger>
                <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
              </TabsList>

              <TabsContent value="indicadores">
                <IndicadoresCategoria categoriaId={categoriaSelecionada} />
              </TabsContent>

              <TabsContent value="estrategia">
                <EstrategiaCategoria categoriaId={categoriaSelecionada} />
              </TabsContent>

              <TabsContent value="fornecedores">
                <FornecedoresCategoria categoriaId={categoriaSelecionada} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Folder className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Selecione uma categoria
                </h3>
                <p className="text-slate-500">
                  Escolha uma categoria na árvore ao lado para visualizar seus indicadores e estratégias
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal Criar Categoria */}
      <CriarCategoriaModal
        open={mostrarModal}
        onOpenChange={setMostrarModal}
      />
    </div>
  );
};

export default Categorias;
