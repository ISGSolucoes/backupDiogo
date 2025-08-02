import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useSourcingRules } from '@/hooks/useSourcingRules';
import { Settings, Building2, Tag, Users, FileText, Plus, Edit } from 'lucide-react';

export function SourcingRulesAdmin() {
  const { eventOptions, sectorOptions, categoryOptions, departmentOptions, loading } = useSourcingRules();
  const [activeTab, setActiveTab] = useState('sectors');

  if (loading) {
    return <div className="p-6">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Configurações de Sourcing</h2>
          <p className="text-muted-foreground">
            Gerencie regras inteligentes para projetos de sourcing
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="sectors" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Setores
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Eventos
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Departamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sectors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Regras por Setor</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Setor
            </Button>
          </div>
          
          <div className="grid gap-4">
            {sectorOptions.map(sector => (
              <Card key={sector.value}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-medium">{sector.label}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          Padrão: {sector.defaultEvent?.toUpperCase()}
                        </Badge>
                        <Badge variant={sector.auctionEnabled ? "default" : "secondary"}>
                          {sector.auctionEnabled ? "Leilão OK" : "Sem Leilão"}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Regras por Categoria</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
          
          <div className="grid gap-4">
            {categoryOptions.map(category => (
              <Card key={category.value}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-medium">{category.label}</h4>
                      <div className="flex gap-2">
                        {category.sector && (
                          <Badge variant="outline">Setor: {category.sector}</Badge>
                        )}
                        {category.suggestedEvent && (
                          <Badge variant="default">
                            Sugerido: {category.suggestedEvent.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Configurações de Eventos</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </div>
          
          <div className="grid gap-4">
            {eventOptions.map(event => (
              <Card key={event.value}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-medium">{event.label}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex gap-2">
                        <Badge variant={event.allowsAuction ? "default" : "secondary"}>
                          {event.allowsAuction ? "Permite Leilão" : "Só Cotação"}
                        </Badge>
                        <Badge variant="outline" style={{color: event.color}}>
                          {event.color}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Templates de Departamento</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Departamento
            </Button>
          </div>
          
          <div className="grid gap-4">
            {departmentOptions.map(dept => (
              <Card key={dept.value}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-medium">{dept.label}</h4>
                      {dept.responsavel && (
                        <p className="text-sm text-muted-foreground">
                          Responsável: {dept.responsavel}
                        </p>
                      )}
                      {dept.email && (
                        <p className="text-xs text-muted-foreground">{dept.email}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}