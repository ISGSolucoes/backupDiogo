
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { FeedPreferences } from '@/hooks/useFeedPreferences';

interface FeedLayoutTabProps {
  preferences: FeedPreferences;
  onPreferenceChange: (preferences: Partial<FeedPreferences>) => void;
}

export const FeedLayoutTab = ({ preferences, onPreferenceChange }: FeedLayoutTabProps) => {
  const handleCompactoChange = (compacto: boolean) => {
    onPreferenceChange({
      layout: {
        ...preferences.layout,
        compacto
      }
    });
  };

  const handleItemsPorPaginaChange = (itemsPorPagina: number[]) => {
    onPreferenceChange({
      layout: {
        ...preferences.layout,
        itemsPorPagina: itemsPorPagina[0]
      }
    });
  };

  const handleAlturaChange = (altura: number[]) => {
    onPreferenceChange({
      layout: {
        ...preferences.layout,
        altura: altura[0]
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Modo Compacto */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Modo Compacto</Label>
          <p className="text-xs text-slate-500">
            Reduz o espaçamento e tamanho dos itens
          </p>
        </div>
        <Switch
          checked={preferences.layout.compacto}
          onCheckedChange={handleCompactoChange}
        />
      </div>

      {/* Items por Página */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Items por página: {preferences.layout.itemsPorPagina}
        </Label>
        <Slider
          value={[preferences.layout.itemsPorPagina]}
          onValueChange={handleItemsPorPaginaChange}
          max={20}
          min={3}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>3 items</span>
          <span>20 items</span>
        </div>
      </div>

      {/* Altura do Feed */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Altura do feed: {preferences.layout.altura}px
        </Label>
        <Slider
          value={[preferences.layout.altura]}
          onValueChange={handleAlturaChange}
          max={800}
          min={300}
          step={50}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>300px</span>
          <span>800px</span>
        </div>
      </div>

      {/* Prévia do Layout */}
      <div className="border rounded-lg p-4 bg-slate-50">
        <Label className="text-sm font-medium mb-3 block">Prévia</Label>
        <div className="space-y-2">
          <div className={`border rounded p-2 bg-white ${preferences.layout.compacto ? 'py-1' : 'py-2'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Badge variant="secondary" className="text-xs">💰 Economia</Badge>
            </div>
            <p className={`text-sm mt-1 ${preferences.layout.compacto ? 'text-xs' : ''}`}>
              Exemplo de item do feed...
            </p>
          </div>
          <div className={`border rounded p-2 bg-white ${preferences.layout.compacto ? 'py-1' : 'py-2'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <Badge variant="destructive" className="text-xs">⚠️ Alerta</Badge>
            </div>
            <p className={`text-sm mt-1 ${preferences.layout.compacto ? 'text-xs' : ''}`}>
              Exemplo de item do feed...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
