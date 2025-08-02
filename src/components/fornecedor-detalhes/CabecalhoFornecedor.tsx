
import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Fornecedor, HierarquiaItem } from "@/types/fornecedor";
import { HierarquiaFornecedor } from "./HierarquiaFornecedor";
import { formatarData } from "@/utils/dateUtils";
import { PreferidoBadge } from "./cabecalho/PreferidoBadge";
import { FornecedorMetadata } from "./cabecalho/FornecedorMetadata";
import { HierarquiaButton } from "./cabecalho/HierarquiaButton";
import { FichaCompleta } from "./cabecalho/FichaCompleta";
import { ContatosFornecedor } from "./cabecalho/ContatosFornecedor";

interface CabecalhoFornecedorProps {
  fornecedor: Fornecedor;
  onPreferidoChange?: (preferido: boolean) => void;
  isAdmin?: boolean;
}

export const CabecalhoFornecedor = ({ 
  fornecedor, 
  onPreferidoChange,
  isAdmin = true // Por padrão, mostramos o botão (para demonstração)
}: CabecalhoFornecedorProps) => {
  const [contatosAbertos, setContatosAbertos] = useState(false);
  const [hierarquiaAberta, setHierarquiaAberta] = useState(false);
  const [isPreferido, setIsPreferido] = useState(fornecedor.preferido);
  
  // Mock data for hierarchy view - in production this would come from API
  const hierarquiaMock: HierarquiaItem[] = [
    {
      id: "1",
      nome: "Tech Solutions Ltda",
      cnpj: "12.345.678/0001-90",
      tipoUnidade: "Matriz",
      status: "Ativo",
      cidade: "São Paulo",
      uf: "SP",
      ultimaParticipacao: "10/05/2023",
    },
    {
      id: "2",
      nome: "Tech Solutions Serviços BH",
      cnpj: "12.345.678/0002-45",
      tipoUnidade: "Filial",
      status: "Ativo",
      cidade: "Belo Horizonte",
      uf: "MG",
      ultimaParticipacao: "08/02/2023",
    },
    {
      id: "3",
      nome: "Tech Solutions Industrial RS",
      cnpj: "12.345.678/0005-79",
      tipoUnidade: "Filial",
      status: "Inativo",
      cidade: "Porto Alegre",
      uf: "RS",
      ultimaParticipacao: "16/12/2022",
    }
  ];

  // Handle preferido change
  const handlePreferidoChange = (preferido: boolean) => {
    setIsPreferido(preferido);
    
    // Notificar o componente pai sobre a mudança
    if (onPreferidoChange) {
      onPreferidoChange(preferido);
    }
  };

  // Mock contacts for demonstration
  const contatos = [
    { 
      id: '1', 
      nome: 'João Silva', 
      cargo: 'Diretor Comercial', 
      email: 'joao.silva@techsolutions.com',
      telefone: '(11) 98765-4321'
    },
    { 
      id: '2', 
      nome: 'Maria Santos', 
      cargo: 'Gerente de Contas', 
      email: 'maria.santos@techsolutions.com',
      telefone: '(11) 91234-5678'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex flex-col space-y-4">
        {/* Linha 1: Nome, qualificado, preferido */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{fornecedor.nome}</h1>
            <div className="flex gap-2">
              {fornecedor.qualificado && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Qualificado
                </Badge>
              )}
              {isPreferido && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Preferido
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <PreferidoBadge 
              isPreferido={isPreferido} 
              onPreferidoChange={handlePreferidoChange} 
              isAdmin={isAdmin}
              fornecedorNome={fornecedor.nome}
            />
            
            <div className="mt-2 md:mt-0 space-y-1 text-sm">
              <div>
                <span className="text-slate-500">Data de cadastro:</span>
                <span className="ml-2">{formatarData(fornecedor.dataCadastro)}</span>
              </div>
              
              {fornecedor.ultimaAtualizacao && (
                <div>
                  <span className="text-slate-500">Última atualização:</span>
                  <span className="ml-2">{formatarData(fornecedor.ultimaAtualizacao)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metadados do Fornecedor */}
        <FornecedorMetadata
          cnpj={fornecedor.cnpj}
          tipoEmpresa={fornecedor.tipoEmpresa}
          cidade={fornecedor.cidade}
          uf={fornecedor.uf}
          tipoFornecedor={fornecedor.tipoFornecedor}
          categoria={fornecedor.categoria}
          subcategoria={fornecedor.subcategoria}
          porte={fornecedor.porte}
          funcionarios={fornecedor.funcionarios}
          faturamento={fornecedor.faturamento}
          cnae={fornecedor.cnae}
        />

        {/* CNPJ Raiz com botão de hierarquia */}
        <HierarquiaButton 
          cnpjRaiz={fornecedor.cnpjRaiz || ""} 
          onClick={() => setHierarquiaAberta(true)}
        />

        {/* Ficha completa (barra de progresso) */}
        <FichaCompleta porcentagem={fornecedor.completo || 0} />

        {/* Contatos vinculados */}
        <div className="pt-2">
          <ContatosFornecedor 
            contatos={contatos}
            open={contatosAbertos}
            onOpenChange={setContatosAbertos}
          />
        </div>
      </div>
      
      {/* Hierarchy Dialog */}
      <HierarquiaFornecedor 
        open={hierarquiaAberta}
        onOpenChange={setHierarquiaAberta}
        raizCnpj={fornecedor.cnpjRaiz || ""}
        nomeGrupo={fornecedor.nome.split(' ')[0]} // Simplificação para exemplo, usar nome do grupo real em produção
        hierarquia={hierarquiaMock}
      />
    </div>
  );
};
