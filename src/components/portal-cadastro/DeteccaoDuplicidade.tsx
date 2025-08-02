import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Users, Plus, Link } from 'lucide-react';

interface DeteccaoDuplicidadeProps {
  duplicidadeInfo: any;
  tipoDocumento: 'cnpj' | 'cpf';
  convite?: any;
  onEscolhaFeita: (dados: any) => void;
  onVoltar: () => void;
}

export function DeteccaoDuplicidade({
  duplicidadeInfo,
  tipoDocumento,
  convite,
  onEscolhaFeita,
  onVoltar
}: DeteccaoDuplicidadeProps) {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string>('');

  const fornecedorExistente = duplicidadeInfo.fornecedorExistente;

  const handleEscolha = (opcao: string) => {
    const dadosRamificacao = {
      documento: duplicidadeInfo.documento,
      tipoDocumento: duplicidadeInfo.tipoDocumento,
      fornecedorExistente,
      opcaoEscolhida: opcao,
      convite_id: convite?.id
    };

    onEscolhaFeita(dadosRamificacao);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <Button variant="ghost" size="sm" onClick={onVoltar} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-900 dark:text-amber-100">
            {tipoDocumento.toUpperCase()} já cadastrado
          </CardTitle>
        </div>
        <CardDescription>
          Este {tipoDocumento.toUpperCase()} já existe em nossa base. Escolha uma das opções abaixo:
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-amber-600" />
            <span className="font-medium">
              {tipoDocumento === 'cnpj' 
                ? (fornecedorExistente?.razao_social || fornecedorExistente?.nome_fantasia)
                : fornecedorExistente?.nome_completo
              }
            </span>
          </div>
          <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
            <p><strong>Documento:</strong> {duplicidadeInfo.documento}</p>
            <p><strong>Cadastrado em:</strong> {new Date(fornecedorExistente?.created_at).toLocaleDateString()}</p>
            {fornecedorExistente?.cidade && (
              <p><strong>Cidade:</strong> {fornecedorExistente.cidade}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">O que você gostaria de fazer?</h3>
          
          <div className="grid gap-4">
            {tipoDocumento === 'cnpj' && (
              <div 
                className="border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setOpcaoSelecionada('novo_contato')}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                    opcaoSelecionada === 'novo_contato' ? 'bg-primary border-primary' : 'border-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Sou um novo contato desta empresa</span>
                      <Badge variant="outline">Recomendado</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cadastrar um novo contato para a mesma empresa.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div 
              className="border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors"
              onClick={() => setOpcaoSelecionada('nova_categoria')}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                  opcaoSelecionada === 'nova_categoria' ? 'bg-primary border-primary' : 'border-muted-foreground'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">Oferecer nova categoria de produtos/serviços</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Adicionar uma nova categoria de fornecimento.
                  </p>
                </div>
              </div>
            </div>

            {convite && (
              <div 
                className="border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setOpcaoSelecionada('vincular_relacionamento')}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                    opcaoSelecionada === 'vincular_relacionamento' ? 'bg-primary border-primary' : 'border-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Link className="h-4 w-4" />
                      <span className="font-medium">Vincular ao convite de {convite.cliente_nome}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Estabelecer relacionamento comercial.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onVoltar}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button 
            onClick={() => opcaoSelecionada && handleEscolha(opcaoSelecionada)}
            disabled={!opcaoSelecionada}
            className="flex-1"
          >
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}