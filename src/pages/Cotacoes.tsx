
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import PageNavigation from '@/components/PageNavigation';

const Cotacoes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const cotacoes = [
    {
      id: 'COT-2024-001',
      titulo: 'Equipamentos de Segurança',
      cliente: 'Petrobras',
      valor: 'R$ 85.000,00',
      status: 'aguardando',
      prazo: '15/08/2024',
      itens: 12,
      fornecedores: 3
    },
    {
      id: 'COT-2024-002',
      titulo: 'Materiais de Construção',
      cliente: 'Vale',
      valor: 'R$ 125.000,00',
      status: 'em_analise',
      prazo: '20/08/2024',
      itens: 8,
      fornecedores: 5
    },
    {
      id: 'COT-2024-003',
      titulo: 'Componentes Aeronáuticos',
      cliente: 'Embraer',
      valor: 'R$ 450.000,00',
      status: 'finalizada',
      prazo: '10/08/2024',
      itens: 25,
      fornecedores: 2
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      aguardando: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-800' },
      em_analise: { label: 'Em Análise', color: 'bg-blue-100 text-blue-800' },
      finalizada: { label: 'Finalizada', color: 'bg-green-100 text-green-800' },
      cancelada: { label: 'Cancelada', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.aguardando;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredCotacoes = cotacoes.filter(cotacao => {
    const matchesSearch = cotacao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cotacao.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cotacao.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || cotacao.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageNavigation />
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Cotações</h1>
            <p className="text-slate-600">Gerencie suas cotações e propostas</p>
          </div>
          <Button className="bg-sourcexpress-blue hover:bg-sourcexpress-blue/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Cotação
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <FileText className="h-8 w-8 text-sourcexpress-blue mr-4" />
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Cotações</p>
                <p className="text-2xl font-bold text-slate-900">127</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-yellow-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-slate-600">Aguardando Resposta</p>
                <p className="text-2xl font-bold text-slate-900">23</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <DollarSign className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-slate-600">Valor Total</p>
                <p className="text-2xl font-bold text-slate-900">R$ 2.8M</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <TrendingUp className="h-8 w-8 text-blue-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-slate-600">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-slate-900">87%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar cotações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="aguardando">Aguardando</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="finalizada">Finalizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Cotações */}
        <Card>
          <CardHeader>
            <CardTitle>Cotações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCotacoes.map((cotacao) => (
                <div key={cotacao.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{cotacao.titulo}</h3>
                        {getStatusBadge(cotacao.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">ID:</span>
                          <p className="font-medium">{cotacao.id}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Cliente:</span>
                          <p className="font-medium">{cotacao.cliente}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Valor:</span>
                          <p className="font-medium text-green-600">{cotacao.valor}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Prazo:</span>
                          <p className="font-medium">{cotacao.prazo}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                        <span>{cotacao.itens} itens</span>
                        <span>{cotacao.fornecedores} fornecedores</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cotacoes;
