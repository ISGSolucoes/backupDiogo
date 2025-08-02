import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Search, Users, Mail, Filter, Plus, UserCheck } from 'lucide-react';

interface Fornecedor {
  id: string;
  cnpj: string;
  razaoSocial: string;
  email: string;
  telefone?: string;
  categoria: string;
  status: 'ativo' | 'inativo' | 'pendente';
  risco: 'baixo' | 'medio' | 'alto';
  convidado: boolean;
}

interface GerenciamentoFornecedoresData {
  fornecedoresSelecionados: string[];
  criteriosSelecao: {
    categorias: string[];
    regioes: string[];
    porte: string[];
    certificacoes: string[];
  };
  convite: {
    assunto: string;
    mensagem: string;
    prazoResposta: number;
    documentosObrigatorios: string[];
  };
  configuracoes: {
    minimoFornecedores: number;
    maximoFornecedores: number;
    permiteCadastroNovo: boolean;
  };
}

interface GerenciamentoFornecedoresProps {
  data: Partial<GerenciamentoFornecedoresData>;
  onComplete: (data: GerenciamentoFornecedoresData) => void;
  wizardData: any;
}

export function GerenciamentoFornecedores({ data, onComplete, wizardData }: GerenciamentoFornecedoresProps) {
  const [formData, setFormData] = useState<GerenciamentoFornecedoresData>({
    fornecedoresSelecionados: [],
    criteriosSelecao: {
      categorias: [],
      regioes: [],
      porte: [],
      certificacoes: []
    },
    convite: {
      assunto: `Convite para participar: ${wizardData?.escopo?.nome || 'Projeto de Sourcing'}`,
      mensagem: '',
      prazoResposta: 5,
      documentosObrigatorios: []
    },
    configuracoes: {
      minimoFornecedores: 3,
      maximoFornecedores: 10,
      permiteCadastroNovo: true
    },
    ...data
  });

  const [fornecedores] = useState<Fornecedor[]>([
    {
      id: '1',
      cnpj: '12.345.678/0001-90',
      razaoSocial: 'Fornecedor Alpha Ltda',
      email: 'contato@alpha.com.br',
      telefone: '(11) 1234-5678',
      categoria: 'Materiais de Escritório',
      status: 'ativo',
      risco: 'baixo',
      convidado: false
    },
    {
      id: '2',
      cnpj: '98.765.432/0001-01',
      razaoSocial: 'Beta Suprimentos S.A.',
      email: 'vendas@beta.com.br',
      telefone: '(11) 8765-4321',
      categoria: 'Equipamentos de TI',
      status: 'ativo',
      risco: 'medio',
      convidado: false
    }
  ]);

  const [filtros, setFiltros] = useState({
    busca: '',
    categoria: '',
    status: '',
    risco: ''
  });

  const [showConviteForm, setShowConviteForm] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const isValid = formData.fornecedoresSelecionados.length >= formData.configuracoes.minimoFornecedores &&
                   formData.convite.assunto.trim() &&
                   formData.convite.mensagem.trim();

    if (isValid) {
      onComplete(formData);
    }
  };

  const toggleFornecedor = (fornecedorId: string) => {
    setFormData(prev => ({
      ...prev,
      fornecedoresSelecionados: prev.fornecedoresSelecionados.includes(fornecedorId)
        ? prev.fornecedoresSelecionados.filter(id => id !== fornecedorId)
        : [...prev.fornecedoresSelecionados, fornecedorId]
    }));
  };

  const fornecedoresFiltrados = fornecedores.filter(f => {
    const matchBusca = !filtros.busca || 
      f.razaoSocial.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      f.cnpj.includes(filtros.busca);
    const matchCategoria = !filtros.categoria || f.categoria === filtros.categoria;
    const matchStatus = !filtros.status || f.status === filtros.status;
    const matchRisco = !filtros.risco || f.risco === filtros.risco;

    return matchBusca && matchCategoria && matchStatus && matchRisco;
  });

  const categorias = [...new Set(fornecedores.map(f => f.categoria))];
  const documentosOpcoes = [
    'Certidão de Regularidade Fiscal',
    'Certidão de Regularidade Trabalhista',
    'Alvará de Funcionamento',
    'Certificado ISO 9001',
    'Referências Comerciais',
    'Balanço Patrimonial'
  ];

  return (
    <div className="space-y-6">
      {/* Configurações de Seleção */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Configurações de Seleção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Mínimo de Fornecedores</Label>
              <Input
                type="number"
                value={formData.configuracoes.minimoFornecedores}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  configuracoes: { ...prev.configuracoes, minimoFornecedores: Number(e.target.value) }
                }))}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Máximo de Fornecedores</Label>
              <Input
                type="number"
                value={formData.configuracoes.maximoFornecedores}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  configuracoes: { ...prev.configuracoes, maximoFornecedores: Number(e.target.value) }
                }))}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Selecionados</Label>
              <div className="h-10 flex items-center">
                <Badge variant="outline" className="text-lg">
                  {formData.fornecedoresSelecionados.length}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar e Filtrar Fornecedores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Busca</Label>
              <Input
                value={filtros.busca}
                onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                placeholder="Nome ou CNPJ..."
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <select
                className="w-full h-10 px-3 border rounded-md"
                value={filtros.categoria}
                onChange={(e) => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
              >
                <option value="">Todas</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="w-full h-10 px-3 border rounded-md"
                value={filtros.status}
                onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">Todos</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Risco</Label>
              <select
                className="w-full h-10 px-3 border rounded-md"
                value={filtros.risco}
                onChange={(e) => setFiltros(prev => ({ ...prev, risco: e.target.value }))}
              >
                <option value="">Todos</option>
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Fornecedores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Fornecedores Disponíveis ({fornecedoresFiltrados.length})</span>
            <Button
              variant="outline"
              onClick={() => setShowConviteForm(!showConviteForm)}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              Configurar Convite
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Selecionar</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risco</TableHead>
                  <TableHead>Contato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fornecedoresFiltrados.map(fornecedor => (
                  <TableRow key={fornecedor.id}>
                    <TableCell>
                      <Checkbox
                        checked={formData.fornecedoresSelecionados.includes(fornecedor.id)}
                        onCheckedChange={() => toggleFornecedor(fornecedor.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{fornecedor.razaoSocial}</div>
                        {fornecedor.convidado && (
                          <Badge variant="outline" className="mt-1">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Já convidado
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{fornecedor.cnpj}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{fornecedor.categoria}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={fornecedor.status === 'ativo' ? 'default' : 'secondary'}
                      >
                        {fornecedor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          fornecedor.risco === 'baixo' ? 'default' :
                          fornecedor.risco === 'medio' ? 'secondary' : 'destructive'
                        }
                      >
                        {fornecedor.risco}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{fornecedor.email}</div>
                        {fornecedor.telefone && (
                          <div className="text-muted-foreground">{fornecedor.telefone}</div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Configuração do Convite */}
      {showConviteForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuração do Convite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assunto do E-mail *</Label>
                <Input
                  value={formData.convite.assunto}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    convite: { ...prev.convite, assunto: e.target.value }
                  }))}
                  placeholder="Assunto do convite"
                />
              </div>

              <div className="space-y-2">
                <Label>Prazo para Resposta (dias)</Label>
                <Input
                  type="number"
                  value={formData.convite.prazoResposta}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    convite: { ...prev.convite, prazoResposta: Number(e.target.value) }
                  }))}
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mensagem do Convite *</Label>
              <Textarea
                value={formData.convite.mensagem}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  convite: { ...prev.convite, mensagem: e.target.value }
                }))}
                placeholder="Mensagem personalizada para os fornecedores..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Documentos Obrigatórios</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {documentosOpcoes.map(doc => (
                  <div key={doc} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.convite.documentosObrigatorios.includes(doc)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          convite: {
                            ...prev.convite,
                            documentosObrigatorios: checked
                              ? [...prev.convite.documentosObrigatorios, doc]
                              : prev.convite.documentosObrigatorios.filter(d => d !== doc)
                          }
                        }));
                      }}
                    />
                    <Label className="text-sm">{doc}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}