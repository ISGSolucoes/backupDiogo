
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PermissionManagerSimple = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Sistema de Permissões Multicamadas</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Templates de Cargo
            </CardTitle>
            <CardDescription>
              Configure templates pré-definidos baseados em cargos reais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium">Comprador Regional</div>
                  <div className="text-xs text-muted-foreground">Fornecedores + Sourcing</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium">Gestor de Suprimentos</div>
                  <div className="text-xs text-muted-foreground">Visão ampla</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium">Aprovador Nível 1</div>
                  <div className="text-xs text-muted-foreground">Requisições unidade</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium">Analista de Sourcing</div>
                  <div className="text-xs text-muted-foreground">Cotações + Fornecedores</div>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/templates">
                  Configurar Templates
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuração por Usuário
            </CardTitle>
            <CardDescription>
              Aplique templates e configure permissões específicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Sistema configurado com:
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between text-sm">
                  <span>✅ Permissões funcionais</span>
                  <span>O que pode fazer</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>✅ Escopos de visibilidade</span>
                  <span>O que pode ver</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>✅ Filtros por categoria</span>
                  <span>Acesso granular</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>✅ Filtros por unidade</span>
                  <span>Controle regional</span>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link to="/admin/permissoes">
                  Gerenciar Usuários
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exemplo: Configuração do Renato (Comprador Regional)</CardTitle>
          <CardDescription>
            Como ficaria a configuração de um usuário real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="font-medium mb-2">1. Módulos Acessíveis</div>
              <div className="space-y-1 text-sm">
                <div>✅ Gestão de Fornecedores</div>
                <div>✅ Sourcing</div>
                <div>✅ Requisições</div>
                <div>✅ Dashboards</div>
                <div>❌ Pedidos (não contratado)</div>
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">2. Permissões Funcionais</div>
              <div className="space-y-1 text-sm">
                <div>✅ Ver Raio-X de fornecedor</div>
                <div>✅ Criar requisição</div>
                <div>✅ Criar cotação</div>
                <div>✅ Enviar para fornecedores</div>
                <div>❌ Suspender fornecedor</div>
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">3. Visibilidade</div>
              <div className="space-y-1 text-sm">
                <div>📂 Categorias: MRO, Facilities</div>
                <div>🏢 Unidade: Filial SP</div>
                <div>👁️ Fornecedores: Só suas categorias</div>
                <div>📋 Requisições: Só sua unidade</div>
                <div>📊 Dashboard: Filtrado automaticamente</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
