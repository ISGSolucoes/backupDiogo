
import React, { useState, useEffect } from "react";
import { Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Fornecedor } from "@/types/fornecedor";

interface SelecionarFornecedorProps {
  onFornecedoresSelecionados: (fornecedores: Fornecedor[]) => void;
  fornecedoresSelecionados: Fornecedor[];
}

// Dados mock para demonstração
const fornecedoresMock: Fornecedor[] = [
  {
    id: "1",
    nome: "Tech Solutions Ltda",
    cnpj: "12.345.678/0001-90",
    status: "ativo",
    categoria: "Tecnologia",
    tipoFornecedor: "servico",
    ultimaParticipacao: "10/05/2023",
    uf: "SP",
    cidade: "São Paulo",
    porte: "medio",
    tipoEmpresa: "ltda",
    qualificado: true,
    preferido: true,
    dataCadastro: "2023-05-01"
  },
  {
    id: "2",
    nome: "ABC Materiais de Escritório",
    cnpj: "98.765.432/0001-10",
    status: "ativo",
    categoria: "Materiais",
    tipoFornecedor: "servico",
    ultimaParticipacao: "22/04/2023",
    uf: "RJ",
    cidade: "Rio de Janeiro",
    porte: "pequeno",
    tipoEmpresa: "mei",
    qualificado: true,
    preferido: false,
    dataCadastro: "2023-04-15"
  },
  {
    id: "3",
    nome: "Transportes Rápidos SA",
    cnpj: "45.678.912/0001-34",
    status: "ativo",
    categoria: "Transporte",
    tipoFornecedor: "servico",
    ultimaParticipacao: "15/01/2023",
    uf: "MG",
    cidade: "Belo Horizonte",
    porte: "grande",
    tipoEmpresa: "sa",
    qualificado: false,
    preferido: false,
    dataCadastro: "2022-10-20"
  },
  {
    id: "4",
    nome: "Consultoria Financeira ME",
    cnpj: "23.456.789/0001-21",
    status: "ativo",
    categoria: "Serviços",
    tipoFornecedor: "servico",
    ultimaParticipacao: "N/A",
    uf: "RS",
    cidade: "Porto Alegre",
    porte: "pequeno",
    tipoEmpresa: "mei",
    qualificado: false,
    preferido: false,
    dataCadastro: "2023-05-08"
  },
  {
    id: "5",
    nome: "Equipamentos Industriais LTDA",
    cnpj: "34.567.890/0001-12",
    status: "ativo",
    categoria: "Industrial",
    tipoFornecedor: "industria",
    ultimaParticipacao: "03/05/2023",
    uf: "PR",
    cidade: "Curitiba",
    porte: "grande",
    tipoEmpresa: "ltda",
    qualificado: true,
    preferido: true,
    dataCadastro: "2023-01-15"
  }
];

export const SelecionarFornecedor: React.FC<SelecionarFornecedorProps> = ({
  onFornecedoresSelecionados,
  fornecedoresSelecionados
}) => {
  const [termoBusca, setTermoBusca] = useState("");
  const [fornecedoresFiltrados, setFornecedoresFiltrados] = useState<Fornecedor[]>(fornecedoresMock);
  const [fornecedoresChecados, setFornecedoresChecados] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Inicializar o estado com os fornecedores já selecionados
    if (fornecedoresSelecionados.length > 0) {
      const checados: Record<string, boolean> = {};
      fornecedoresSelecionados.forEach(f => {
        checados[f.id] = true;
      });
      setFornecedoresChecados(checados);
    }
  }, []);

  useEffect(() => {
    // Filtrar fornecedores com base no termo de busca
    if (termoBusca) {
      const termoBuscaLower = termoBusca.toLowerCase();
      const filtrados = fornecedoresMock.filter(
        (f) =>
          f.nome.toLowerCase().includes(termoBuscaLower) ||
          f.cnpj.toLowerCase().includes(termoBuscaLower) ||
          f.categoria.toLowerCase().includes(termoBuscaLower)
      );
      setFornecedoresFiltrados(filtrados);
    } else {
      setFornecedoresFiltrados(fornecedoresMock);
    }
  }, [termoBusca]);

  useEffect(() => {
    // Atualizar a lista de fornecedores selecionados quando mudar os checkboxes
    const selecionados = fornecedoresMock.filter(f => fornecedoresChecados[f.id]);
    onFornecedoresSelecionados(selecionados);
  }, [fornecedoresChecados, onFornecedoresSelecionados]);

  const handleCheckboxChange = (fornecedorId: string, checked: boolean) => {
    setFornecedoresChecados(prev => ({
      ...prev,
      [fornecedorId]: checked
    }));
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar fornecedor por nome, CNPJ ou categoria..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="text-sm font-medium text-gray-500 mb-2">
        {fornecedoresFiltrados.length} fornecedores encontrados
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 p-3 bg-gray-50 border-b font-medium text-sm text-gray-600">
          <div></div>
          <div>Nome</div>
          <div>CNPJ</div>
          <div>Status</div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {fornecedoresFiltrados.map((fornecedor) => (
            <div
              key={fornecedor.id}
              className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 p-3 border-b last:border-b-0 hover:bg-gray-50 items-center"
            >
              <div>
                <Checkbox
                  id={`fornecedor-${fornecedor.id}`}
                  checked={!!fornecedoresChecados[fornecedor.id]}
                  onCheckedChange={(checked) => handleCheckboxChange(fornecedor.id, checked === true)}
                />
              </div>
              <div className="text-sm font-medium">{fornecedor.nome}</div>
              <div className="text-sm text-gray-600">{fornecedor.cnpj}</div>
              <div>
                <span 
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    fornecedor.status === 'ativo'
                      ? 'bg-green-100 text-green-800'
                      : fornecedor.status === 'inativo'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {fornecedor.status === 'ativo' && <Check className="w-3 h-3 mr-1" />}
                  {fornecedor.status.charAt(0).toUpperCase() + fornecedor.status.slice(1).replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
          {fornecedoresFiltrados.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              Nenhum fornecedor encontrado com o termo de busca
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
