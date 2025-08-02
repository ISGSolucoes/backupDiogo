
import { MotivoInativacao } from "@/types/fornecedor";

export const getMotivoInativacaoTexto = (motivo?: MotivoInativacao, dataInativacao?: string, usuarioInativacao?: string): string => {
  if (!motivo) return "Motivo não informado";
  
  const data = dataInativacao ? new Date(dataInativacao).toLocaleDateString('pt-BR') : '';
  
  switch (motivo) {
    case "manual":
      return usuarioInativacao 
        ? `Inativado por ${usuarioInativacao}${data ? ` em ${data}` : ''}`
        : `Inativado manualmente${data ? ` em ${data}` : ''}`;
    
    case "inatividade_automatica":
      return "Inatividade automática: sem eventos há mais de 180 dias";
    
    case "documento_vencido":
      return "Inativo por pendência documental crítica";
    
    case "descadastramento_usuario":
      return "Fornecedor solicitou encerramento do cadastro";
    
    case "bloqueio_interno":
      return "Bloqueado por política interna";
    
    default:
      return "Motivo não especificado";
  }
};

export const getMotivoInativacaoIcon = (motivo?: MotivoInativacao): string => {
  switch (motivo) {
    case "manual":
      return "👤";
    case "inatividade_automatica":
      return "⏰";
    case "documento_vencido":
      return "📋";
    case "descadastramento_usuario":
      return "🚪";
    case "bloqueio_interno":
      return "🚫";
    default:
      return "⚠️";
  }
};
