
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FeedPreferences } from '@/hooks/useFeedPreferences';

interface FeedFiltrosTabProps {
  preferences: FeedPreferences;
  onPreferenceChange: (preferences: Partial<FeedPreferences>) => void;
}

const tiposDisponiveis = [
  { id: 'economia', nome: 'Economia', emoji: '💰', cor: 'bg-green-100 text-green-800' },
  { id: 'alerta', nome: 'Alerta', emoji: '⚠️', cor: 'bg-red-100 text-red-800' },
  { id: 'sucesso', nome: 'Sucesso', emoji: '✅', cor: 'bg-blue-100 text-blue-800' },
  { id: 'acao', nome: 'Ação', emoji: '📋', cor: 'bg-purple-100 text-purple-800' },
  { id: 'contato', nome: 'Contato', emoji: '👥', cor: 'bg-yellow-100 text-yellow-800' },
  { id: 'atualizacao', nome: 'Atualização', emoji: '📦', cor: 'bg-gray-100 text-gray-800' }
];

const relevanciasDisponiveis = [
  { id: 'alta', nome: 'Alta', cor: 'bg-red-100 text-red-800' },
  { id: 'media', nome: 'Média', cor: 'bg-yellow-100 text-yellow-800' },
  { id: 'baixa', nome: 'Baixa', cor: 'bg-gray-100 text-gray-800' }
];

const autoresSugeridos = [
  'Rê (IA)', 'Sistema', 'Maria Santos', 'Carlos Lima', 'João Silva', 'Ana Costa'
];

export const FeedFiltrosTab = ({ preferences, onPreferenceChange }: FeedFiltrosTabProps) => {
  const handleTipoChange = (tipo: string, checked: boolean) => {
    const novosTipos = checked
      ? [...preferences.filtros.tipos, tipo]
      : preferences.filtros.tipos.filter(t => t !== tipo);

    onPreferenceChange({
      filtros: {
        ...preferences.filtros,
        tipos: novosTipos
      }
    });
  };

  const handleRelevanciaChange = (relevancia: string, checked: boolean) => {
    const novasRelevancias = checked
      ? [...preferences.filtros.relevancia, relevancia]
      : preferences.filtros.relevancia.filter(r => r !== relevancia);

    onPreferenceChange({
      filtros: {
        ...preferences.filtros,
        relevancia: novasRelevancias
      }
    });
  };

  const handlePeriodoChange = (periodo: number[]) => {
    onPreferenceChange({
      filtros: {
        ...preferences.filtros,
        periodo: periodo[0]
      }
    });
  };

  const handleAutorAdd = (autor: string) => {
    if (!preferences.filtros.autores.includes(autor)) {
      onPreferenceChange({
        filtros: {
          ...preferences.filtros,
          autores: [...preferences.filtros.autores, autor]
        }
      });
    }
  };

  const handleAutorRemove = (autor: string) => {
    onPreferenceChange({
      filtros: {
        ...preferences.filtros,
        autores: preferences.filtros.autores.filter(a => a !== autor)
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Tipos de Atividade */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Tipos de Atividade</Label>
        <div className="grid grid-cols-2 gap-3">
          {tiposDisponiveis.map((tipo) => (
            <div key={tipo.id} className="flex items-center space-x-2">
              <Checkbox
                id={tipo.id}
                checked={preferences.filtros.tipos.includes(tipo.id)}
                onCheckedChange={(checked) => handleTipoChange(tipo.id, checked as boolean)}
              />
              <Label htmlFor={tipo.id} className="flex items-center gap-2 cursor-pointer">
                <span>{tipo.emoji}</span>
                <span>{tipo.nome}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Relevância */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Relevância</Label>
        <div className="flex gap-3">
          {relevanciasDisponiveis.map((relevancia) => (
            <div key={relevancia.id} className="flex items-center space-x-2">
              <Checkbox
                id={relevancia.id}
                checked={preferences.filtros.relevancia.includes(relevancia.id)}
                onCheckedChange={(checked) => handleRelevanciaChange(relevancia.id, checked as boolean)}
              />
              <Label htmlFor={relevancia.id} className="cursor-pointer">
                <Badge className={relevancia.cor}>{relevancia.nome}</Badge>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Período */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Período: últimos {preferences.filtros.periodo} dias
        </Label>
        <Slider
          value={[preferences.filtros.periodo]}
          onValueChange={handlePeriodoChange}
          max={30}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>1 dia</span>
          <span>30 dias</span>
        </div>
      </div>

      {/* Autores */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Autores</Label>
        
        {/* Autores selecionados */}
        {preferences.filtros.autores.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {preferences.filtros.autores.map((autor) => (
              <Badge key={autor} variant="secondary" className="flex items-center gap-1">
                {autor}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleAutorRemove(autor)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Autores sugeridos */}
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">Adicionar autor:</Label>
          <div className="flex flex-wrap gap-2">
            {autoresSugeridos
              .filter(autor => !preferences.filtros.autores.includes(autor))
              .map((autor) => (
                <Button
                  key={autor}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleAutorAdd(autor)}
                >
                  {autor}
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
