import { Badge } from '@/components/ui/badge';
import { Package, Wrench, Layers } from 'lucide-react';

export type ItemType = 'material' | 'servico' | 'misto';

interface ItemTypeTagsProps {
  type: ItemType;
  className?: string;
}

export function ItemTypeTags({ type, className }: ItemTypeTagsProps) {
  const getTypeConfig = (itemType: ItemType) => {
    switch (itemType) {
      case 'material':
        return {
          icon: Package,
          label: 'Material',
          variant: 'secondary' as const,
          color: 'text-blue-600'
        };
      case 'servico':
        return {
          icon: Wrench,
          label: 'Serviço',
          variant: 'outline' as const,
          color: 'text-green-600'
        };
      case 'misto':
        return {
          icon: Layers,
          label: 'Misto',
          variant: 'default' as const,
          color: 'text-purple-600'
        };
      default:
        // Fallback para casos não esperados
        return {
          icon: Package,
          label: 'Material',
          variant: 'secondary' as const,
          color: 'text-blue-600'
        };
    }
  };

  const config = getTypeConfig(type);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${className}`}>
      <Icon className={`h-3 w-3 ${config.color}`} />
      {config.label}
    </Badge>
  );
}

// Função utilitária para detectar automaticamente o tipo do item
export function detectItemType(description: string): ItemType {
  const materialKeywords = [
    'produto', 'material', 'equipamento', 'ferramenta', 'peça', 'componente',
    'insumo', 'matéria-prima', 'software', 'hardware', 'licença'
  ];
  
  const servicoKeywords = [
    'serviço', 'manutenção', 'consultoria', 'assessoria', 'treinamento',
    'capacitação', 'suporte', 'instalação', 'implementação', 'desenvolvimento'
  ];

  const descLower = description.toLowerCase();
  
  const hasMaterial = materialKeywords.some(keyword => descLower.includes(keyword));
  const hasServico = servicoKeywords.some(keyword => descLower.includes(keyword));
  
  if (hasMaterial && hasServico) {
    return 'misto';
  } else if (hasServico) {
    return 'servico';
  } else {
    return 'material';
  }
}