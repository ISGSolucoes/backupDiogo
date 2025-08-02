import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package, Trash2, Edit3 } from 'lucide-react';
import { ItemTypeTags, ItemType } from './ItemTypeTags';

export interface LoteItem {
  id: string;
  descricao: string;
  tipo: ItemType;
  loteId?: string;
}

export interface Lote {
  id: string;
  nome: string;
  descricao?: string;
  tipo: ItemType;
  ordem: number;
}

interface LoteManagerProps {
  itens: LoteItem[];
  lotes: Lote[];
  onLotesChange: (lotes: Lote[]) => void;
  onItensChange: (itens: LoteItem[]) => void;
  className?: string;
}

export function LoteManager({ 
  itens, 
  lotes, 
  onLotesChange, 
  onItensChange,
  className 
}: LoteManagerProps) {
  const [novoLote, setNovoLote] = useState({ nome: '', descricao: '', tipo: 'material' as ItemType });
  const [editandoLote, setEditandoLote] = useState<string | null>(null);

  const adicionarLote = () => {
    if (!novoLote.nome.trim()) return;
    
    const lote: Lote = {
      id: `lote_${Date.now()}`,
      nome: novoLote.nome,
      descricao: novoLote.descricao,
      tipo: novoLote.tipo,
      ordem: lotes.length + 1
    };
    
    onLotesChange([...lotes, lote]);
    setNovoLote({ nome: '', descricao: '', tipo: 'material' });
  };

  const removerLote = (loteId: string) => {
    // Remove o lote
    onLotesChange(lotes.filter(l => l.id !== loteId));
    
    // Remove a associação dos itens com este lote
    onItensChange(itens.map(item => 
      item.loteId === loteId ? { ...item, loteId: undefined } : item
    ));
  };

  const moverItemParaLote = (itemId: string, loteId: string | undefined) => {
    onItensChange(itens.map(item => 
      item.id === itemId ? { ...item, loteId } : item
    ));
  };

  const getItensDoLote = (loteId: string) => {
    return itens.filter(item => item.loteId === loteId);
  };

  const getItensSemLote = () => {
    return itens.filter(item => !item.loteId);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gerenciamento de Lotes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulário para novo lote */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg">
            <div>
              <Label htmlFor="nome-lote">Nome do Lote</Label>
              <Input
                id="nome-lote"
                value={novoLote.nome}
                onChange={(e) => setNovoLote({ ...novoLote, nome: e.target.value })}
                placeholder="Ex: Licenças Software"
              />
            </div>
            <div>
              <Label htmlFor="descricao-lote">Descrição</Label>
              <Input
                id="descricao-lote"
                value={novoLote.descricao}
                onChange={(e) => setNovoLote({ ...novoLote, descricao: e.target.value })}
                placeholder="Descrição opcional"
              />
            </div>
            <div>
              <Label htmlFor="tipo-lote">Tipo</Label>
              <Select value={novoLote.tipo} onValueChange={(value: ItemType) => setNovoLote({ ...novoLote, tipo: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="servico">Serviço</SelectItem>
                  <SelectItem value="misto">Misto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={adicionarLote} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Lista de lotes existentes */}
          {lotes.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Lotes Configurados:</h4>
              {lotes.map((lote) => (
                <Card key={lote.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h5 className="font-medium">{lote.nome}</h5>
                        <ItemTypeTags type={lote.tipo} />
                        <Badge variant="outline">
                          {getItensDoLote(lote.id).length} itens
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditandoLote(lote.id)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removerLote(lote.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    {lote.descricao && (
                      <p className="text-sm text-muted-foreground mb-3">{lote.descricao}</p>
                    )}
                    
                    {/* Itens do lote */}
                    <div className="space-y-2">
                      {getItensDoLote(lote.id).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                          <div className="flex items-center gap-2">
                            <ItemTypeTags type={item.tipo} />
                            <span className="text-sm">{item.descricao}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => moverItemParaLote(item.id, undefined)}
                          >
                            Remover do Lote
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Itens sem lote */}
          {getItensSemLote().length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Itens Não Agrupados:</h4>
              <div className="space-y-2">
                {getItensSemLote().map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <ItemTypeTags type={item.tipo} />
                      <span>{item.descricao}</span>
                    </div>
                    <div className="flex gap-2">
                      <Select onValueChange={(loteId) => moverItemParaLote(item.id, loteId)}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Mover para lote..." />
                        </SelectTrigger>
                        <SelectContent>
                          {lotes.map((lote) => (
                            <SelectItem key={lote.id} value={lote.id}>
                              {lote.nome} ({lote.tipo})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}