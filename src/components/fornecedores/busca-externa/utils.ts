
import { FornecedorExterno, SegmentoEstatisticas } from './types';

// Função para formatar CNPJ
export const formatarCNPJ = (cnpj: string): string => {
  // Remove qualquer formatação existente
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  
  // Formata no padrão XX.XXX.XXX/XXXX-XX ou XXXXXXXX/XXXX-XX
  if (cnpjLimpo.length === 14) {
    return `${cnpjLimpo.substring(0, 8)}/${cnpjLimpo.substring(8, 12)}-${cnpjLimpo.substring(12)}`;
  }
  
  // Retorna o original se não conseguir formatar
  return cnpj;
};

// Função para extrair a raiz do CNPJ (8 primeiros dígitos)
export const obterCnpjRaiz = (cnpj: string): string => {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  return cnpjLimpo.substring(0, 8);
};

// Função para determinar se é matriz ou filial
export const determinarTipoUnidade = (cnpj: string): 'Matriz' | 'Filial' => {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  const numeroFilial = cnpjLimpo.substring(8, 12);
  
  return numeroFilial === '0001' ? 'Matriz' : 'Filial';
};

// Função para gerar dados mock de fornecedores externos baseados na pesquisa
export const gerarFornecedoresExternos = (quantidade: number, termo: string): FornecedorExterno[] => {
  const tipos = ["Indústria", "Serviços", "Comércio", "Importador", "Tecnologia"];
  const certificacoes = ["ISO 9001", "ISO 14001", "ISO 45001", "FSC", "PROCON", "ABNT"];
  
  // Mapeamento consistente entre estados e cidades para garantir coerência geográfica
  const estadosECidades = {
    "SP": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto"],
    "RJ": ["Rio de Janeiro", "Niterói", "Petrópolis"],
    "MG": ["Belo Horizonte", "Juiz de Fora", "Uberlândia"],
    "PR": ["Curitiba", "Londrina", "Maringá"],
    "RS": ["Porto Alegre", "Caxias do Sul", "Pelotas"],
    "PE": ["Recife", "Olinda", "Petrolina"]
  };
  
  // Obter lista de todos os estados disponíveis
  const ufs = Object.keys(estadosECidades);
  
  // Para simulação, alguns fornecedores (30%) já estarão na base com diferentes status
  const statusPossiveis = ['registrado', 'qualificado', 'preferido', null];
  
  // Gerar uma lista de raízes de CNPJ para simular grupos empresariais
  const raizesCnpj = [];
  for (let i = 0; i < Math.ceil(quantidade / 3); i++) {
    raizesCnpj.push(Math.floor(10000000 + Math.random() * 90000000).toString());
  }
  
  // Criar mapa para contar quantas unidades cada raiz tem
  const contagemPorRaiz: Record<string, number> = {};
  
  const fornecedores = [];
  for (let i = 0; i < quantidade; i++) {
    // Selecionar uma raiz CNPJ (para simular empresas do mesmo grupo)
    const raizIndex = Math.floor(Math.random() * raizesCnpj.length);
    const raizCnpj = raizesCnpj[raizIndex];
    
    // Atualizar contagem para esta raiz
    contagemPorRaiz[raizCnpj] = (contagemPorRaiz[raizCnpj] || 0) + 1;
    
    // Gerar número filial - 0001 é matriz, outros são filiais
    // Para garantir que cada grupo tenha uma matriz, o primeiro registro de cada raiz é sempre matriz
    let numeroFilial;
    if (contagemPorRaiz[raizCnpj] === 1) {
      numeroFilial = '0001';
    } else {
      numeroFilial = String(contagemPorRaiz[raizCnpj]).padStart(4, '0');
    }
    
    // Gerar dígitos verificadores (simplificado para simulação)
    const digitosVerificadores = Math.floor(10 + Math.random() * 90).toString();
    
    // Formar o CNPJ completo
    const cnpj = `${raizCnpj}/${numeroFilial}-${digitosVerificadores}`;
    
    // Selecionar um estado aleatório
    const uf = ufs[Math.floor(Math.random() * ufs.length)];
    // Selecionar uma cidade do estado selecionado
    const cidadesDaUF = estadosECidades[uf];
    const cidade = cidadesDaUF[Math.floor(Math.random() * cidadesDaUF.length)];
    
    // Data de cadastro aleatória nos últimos 2 anos
    const dataAtual = new Date();
    const dataInicial = new Date(dataAtual);
    dataInicial.setFullYear(dataInicial.getFullYear() - 2);
    
    const dataCadastro = new Date(
      dataInicial.getTime() + Math.random() * (dataAtual.getTime() - dataInicial.getTime())
    ).toISOString().split('T')[0];
    
    fornecedores.push({
      id: `ext-${Date.now()}-${i}`,
      nome: `${termo.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} ${tipos[Math.floor(Math.random() * tipos.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      cnpj: cnpj,
      cidade: cidade,
      uf: uf,
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      ultimaAtualizacao: `${Math.floor(1 + Math.random() * 12)}/${2024}`,
      score: Math.floor(50 + Math.random() * 50),
      email: `contato@${termo.toLowerCase().replace(/\s+/g, '')}-${Math.floor(Math.random() * 999)}.com.br`,
      certificacoes: Math.random() > 0.4 ? 
        Array.from({ length: Math.floor(1 + Math.random() * 3) })
          .map(() => certificacoes[Math.floor(Math.random() * certificacoes.length)])
        : undefined,
      // Simulando que aproximadamente 30% dos fornecedores já estão na base com algum status
      statusNaBase: Math.random() > 0.7 ? 
        statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)] as 'registrado' | 'qualificado' | 'preferido' | null : 
        null,
      dataCadastro: dataCadastro,
      totalUnidadesGrupo: contagemPorRaiz[raizCnpj]
    });
  }
  
  return fornecedores;
};

// Função para calcular estatísticas por segmento
export const calcularEstatisticasSegmento = (
  fornecedores: FornecedorExterno[], 
  segmento: string
): SegmentoEstatisticas => {
  const fornecedoresFiltrados = fornecedores.filter(f => f.tipo === segmento);
  
  // Total de empresas
  const totalEmpresas = fornecedoresFiltrados.length;
  const totalGeral = fornecedores.length;
  const percentualDoTotal = (totalEmpresas / totalGeral) * 100;
  
  // Dados por região
  const dadosPorRegiao: Record<string, { quantidade: number, percentual: number }> = {};
  fornecedoresFiltrados.forEach(f => {
    const regiao = obterRegiaoPorUF(f.uf);
    if (!dadosPorRegiao[regiao]) {
      dadosPorRegiao[regiao] = { quantidade: 1, percentual: 0 };
    } else {
      dadosPorRegiao[regiao].quantidade += 1;
    }
  });
  
  // Calcular percentuais por região
  Object.keys(dadosPorRegiao).forEach(regiao => {
    dadosPorRegiao[regiao].percentual = (dadosPorRegiao[regiao].quantidade / totalEmpresas) * 100;
  });

  // Dados por estado
  const dadosPorEstado: Record<string, { quantidade: number, percentual: number }> = {};
  fornecedoresFiltrados.forEach(f => {
    if (!dadosPorEstado[f.uf]) {
      dadosPorEstado[f.uf] = { quantidade: 1, percentual: 0 };
    } else {
      dadosPorEstado[f.uf].quantidade += 1;
    }
  });
  
  // Calcular percentuais por estado
  Object.keys(dadosPorEstado).forEach(estado => {
    dadosPorEstado[estado].percentual = (dadosPorEstado[estado].quantidade / totalEmpresas) * 100;
  });
  
  // Dados por cidade
  const dadosPorCidade: Record<string, { quantidade: number, percentual: number }> = {};
  fornecedoresFiltrados.forEach(f => {
    if (!dadosPorCidade[f.cidade]) {
      dadosPorCidade[f.cidade] = { quantidade: 1, percentual: 0 };
    } else {
      dadosPorCidade[f.cidade].quantidade += 1;
    }
  });
  
  // Calcular percentuais por cidade
  Object.keys(dadosPorCidade).forEach(cidade => {
    dadosPorCidade[cidade].percentual = (dadosPorCidade[cidade].quantidade / totalEmpresas) * 100;
  });

  return {
    totalEmpresas,
    percentualDoTotal,
    dadosPorRegiao,
    dadosPorEstado,
    dadosPorCidade,
  };
};

// Função auxiliar para obter a região baseada na UF
export const obterRegiaoPorUF = (uf: string): string => {
  const mapaRegioes: Record<string, string> = {
    'AC': 'Norte', 'AM': 'Norte', 'RR': 'Norte', 'RO': 'Norte', 'PA': 'Norte', 'AP': 'Norte', 'TO': 'Norte',
    'MA': 'Nordeste', 'PI': 'Nordeste', 'CE': 'Nordeste', 'RN': 'Nordeste', 'PB': 'Nordeste', 
    'PE': 'Nordeste', 'AL': 'Nordeste', 'SE': 'Nordeste', 'BA': 'Nordeste',
    'MT': 'Centro-Oeste', 'MS': 'Centro-Oeste', 'GO': 'Centro-Oeste', 'DF': 'Centro-Oeste',
    'MG': 'Sudeste', 'ES': 'Sudeste', 'RJ': 'Sudeste', 'SP': 'Sudeste',
    'PR': 'Sul', 'SC': 'Sul', 'RS': 'Sul'
  };

  return mapaRegioes[uf] || 'Outra';
};

// Função para exportar dados dos fornecedores para Excel ou CSV
export const exportarFornecedores = (
  fornecedores: FornecedorExterno[],
  formato: 'xlsx' | 'csv',
  segmento?: string
) => {
  // Esta é uma função simulada - em um ambiente real, você usaria uma biblioteca 
  // como xlsx ou file-saver para gerar e baixar o arquivo
  console.log(`Exportando ${fornecedores.length} fornecedores em formato ${formato}`);
  
  // Aqui apenas simulamos o download através do console
  const cabecalho = ['Nome', 'CNPJ', 'Categoria', 'Estado', 'Cidade', 'E-mail', 'Score', 'Status'];
  const dados = fornecedores.map(f => [
    f.nome,
    f.cnpj,
    f.tipo,
    f.uf,
    f.cidade,
    f.email || 'N/A',
    f.score.toString(),
    f.statusNaBase || 'N/A'
  ]);
  
  console.log('Cabeçalho:', cabecalho);
  console.log('Dados:', dados);
  
  return {
    sucesso: true,
    mensagem: `Exportação de ${fornecedores.length} fornecedores concluída`,
    nomeArquivo: `fornecedores_${segmento ? segmento.toLowerCase().replace(/\s+/g, '_') : 'todos'}_${new Date().toISOString().slice(0,10)}.${formato}`
  };
};

// Função para ver todas as empresas do mesmo grupo (mesma raiz de CNPJ)
export const buscarEmpresasDoMesmoGrupo = (
  fornecedores: FornecedorExterno[],
  cnpjRaiz: string
): FornecedorExterno[] => {
  return fornecedores.filter(fornecedor => {
    const raiz = obterCnpjRaiz(fornecedor.cnpj);
    return raiz === cnpjRaiz;
  });
};
