import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import { Book, FileText, FolderOpen, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Biblioteca = () => {
  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Biblioteca Central</h1>
            <p className="text-muted-foreground">Acesso centralizado a todos os documentos e recursos</p>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Novo Documento
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos, templates, políticas..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="h-5 w-5 mr-2" />
                Políticas e Procedimentos
              </CardTitle>
              <CardDescription>
                Documentos oficiais da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">125 documentos</p>
              <Button variant="outline" size="sm">Acessar</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Templates
              </CardTitle>
              <CardDescription>
                Modelos de documentos padrão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">45 templates</p>
              <Button variant="outline" size="sm">Acessar</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FolderOpen className="h-5 w-5 mr-2" />
                Documentos Compartilhados
              </CardTitle>
              <CardDescription>
                Arquivos compartilhados entre equipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">89 arquivos</p>
              <Button variant="outline" size="sm">Acessar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Biblioteca;