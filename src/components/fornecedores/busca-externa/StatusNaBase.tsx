
import React from 'react';
import { UserCheck, Check, Star, Clock, AlertTriangle } from 'lucide-react';

interface StatusNaBaseProps {
  status: 'registrado' | 'em_registro' | 'pendente' | 'qualificado' | 'preferido' | null;
}

export const StatusNaBase = ({ status }: StatusNaBaseProps) => {
  if (!status) return null;
  
  // Configurações para cada tipo de status
  const statusConfig = {
    registrado: {
      icon: UserCheck,
      text: "Registrado na base",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    em_registro: {
      icon: Clock,
      text: "Em registro",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    pendente: {
      icon: AlertTriangle,
      text: "Pendente",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    qualificado: {
      icon: Check,
      text: "Qualificado",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    preferido: {
      icon: Star,
      text: "Preferido",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <div className={`mt-2 p-1.5 rounded-md ${config.bgColor} border ${config.borderColor} flex items-center`}>
      <Icon className={`h-3.5 w-3.5 mr-1.5 ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>{config.text}</span>
    </div>
  );
};
