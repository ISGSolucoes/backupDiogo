
import React, { useState } from "react";
import { ShoppingBag, FileText, Calendar, PieChart, Search, Building, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Eventos = () => {
  const [activeTab, setActiveTab] = useState("cotacoes");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-1">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            Módulo de Sourcing
          </h1>
          <p className="text-slate-500">
            Gerencie eventos de cotação e propostas de fornecedores
          </p>
        </div>
      </div>

      {/* Tabs de navegação */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("cotacoes")}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "cotacoes"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Cotações
        </button>
        <button
          onClick={() => setActiveTab("leiloes")}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "leiloes"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Leilões
        </button>
        <button
          onClick={() => setActiveTab("rfps")}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "rfps"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          RFPs
        </button>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar eventos de sourcing"
            className="pl-9 bg-white"
          />
        </div>
        <Select defaultValue="todas">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todos os Status</SelectItem>
            <SelectItem value="ativas">Em andamento</SelectItem>
            <SelectItem value="encerradas">Encerradas</SelectItem>
            <SelectItem value="draft">Rascunhos</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileText className="mr-2 h-4 w-4" /> Nova Cotação
        </Button>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="text-blue-500 h-5 w-5" /> Próximos Eventos
              </h3>
            </div>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <p className="font-medium">Cotação de Material de Escritório</p>
                <p className="text-sm text-slate-500">Encerra em 2 dias</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-3 py-1">
                <p className="font-medium">Leilão de Equipamentos de TI</p>
                <p className="text-sm text-slate-500">Inicia em 5 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <PieChart className="text-blue-500 h-5 w-5" /> Economia Gerada
              </h3>
            </div>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-green-600">R$ 127.500</p>
              <p className="text-sm text-slate-500 mt-1">Acumulado do mês</p>
            </div>
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>Meta mensal:</span>
                <span className="font-medium">R$ 150.000</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Building className="text-blue-500 h-5 w-5" /> Fornecedores Participantes
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total de fornecedores:</span>
                <span className="font-medium">48</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Novos este mês:</span>
                <span className="font-medium">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Taxa de participação:</span>
                <span className="font-medium">78%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nova Plataforma Sourcing */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Zap className="h-6 w-6 text-blue-700" />
          </div>
          <div className="flex-grow">
            <h2 className="text-lg font-medium text-blue-800">🚀 Novo: Sourcing Avançado</h2>
            <p className="text-blue-700 mt-1">
              Acesse nossa nova plataforma de Sourcing com recursos avançados de cotações, leilões, gestão de fornecedores e IA.
            </p>
          </div>
          <Link to="/sourcing/projetos">
            <Button className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 gap-2">
              Acessar Nova Plataforma
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Integração com requisições */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <ShoppingBag className="h-6 w-6 text-blue-700" />
          </div>
          <div className="flex-grow">
            <h2 className="text-lg font-medium text-blue-800">Integração com Requisições</h2>
            <p className="text-blue-700 mt-1">
              Receba dados diretamente do módulo de requisições para criar suas cotações de forma rápida e eficiente.
              Os dados do produto, especificações e anexos são transferidos automaticamente.
            </p>
          </div>
          <Button className="whitespace-nowrap bg-blue-600 hover:bg-blue-700">
            Cotações Pendentes
            <span className="ml-2 bg-white text-blue-700 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">3</span>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden bg-white border rounded-lg">
        <div className="p-4 border-b bg-slate-50">
          <h2 className="font-medium text-slate-800">Cotações Recentes</h2>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Evento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Data Limite
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Participantes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">Equipamentos de TI</div>
                    <div className="text-sm text-slate-500">REQ-2023-003</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Em andamento
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    23/05/2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    5 fornecedores
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">Material de Escritório</div>
                    <div className="text-sm text-slate-500">REQ-2023-002</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Análise
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    18/05/2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    3 fornecedores
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventos;
