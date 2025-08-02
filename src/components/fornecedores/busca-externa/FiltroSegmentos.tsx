
import React from 'react';
import { Button } from '@/components/ui/button';

interface FiltroSegmentosProps {
  segmentos: string[];
  contagemPorSegmento: Record<string, number>;
  segmentoSelecionado: string | null;
  onSegmentoClick: (segmento: string) => void;
}

export const FiltroSegmentos = ({ 
  segmentos, 
  contagemPorSegmento, 
  segmentoSelecionado,
  onSegmentoClick
}: FiltroSegmentosProps) => {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">Segmentos encontrados:</p>
      <div className="flex flex-wrap gap-2">
        {segmentos.map((segmento) => (
          <Button
            key={segmento}
            variant={segmentoSelecionado === segmento ? "secondary" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => onSegmentoClick(segmento)}
          >
            {segmento} ({contagemPorSegmento[segmento]})
          </Button>
        ))}
      </div>
    </div>
  );
};
