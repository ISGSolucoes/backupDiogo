import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Building2, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReceitaWS } from '@/hooks/useReceitaWS';
import { useVerificacaoDuplicidade } from '@/hooks/useVerificacaoDuplicidade';
import { formatarCnpj } from '@/utils/cnpjUtils';

interface CadastroInteligenteFormProps {
  tipoDocumento: 'cnpj' | 'cpf';
  convite?: any;
  onDuplicidadeDetectada: (info: any) => void;
  onCadastroCompleto: (dados: any) => void;
  onVoltar: () => void;
}

export function CadastroInteligenteForm({
  tipoDocumento,
  convite,
  onDuplicidadeDetectada,
  onCadastroCompleto,
  onVoltar
}: CadastroInteligenteFormProps) {
  const [etapa, setEtapa] = useState<'documento' | 'dados'>('documento');
  const [documento, setDocumento] = useState('');
  const [carregandoValidacao, setCarregandoValidacao] = useState(false);
  const [dadosReceita, setDadosReceita] = useState<any>(null);
  
  const { buscarCNPJ } = useReceitaWS();
  const { verificarCNPJ, verificarCPF } = useVerificacaoDuplicidade();

  const [formData, setFormData] = useState({
    // Contato
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cargo: '',
    departamento: '',

    // Endereço
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',

    // Categoria
    categoria_principal: '',
    descricao_servicos: '',
    regiao_atendimento: [] as string[],

    // Específico para CPF
    profissao: '',
    rg_ou_cnh: '',
    e_mei: false,
    cnpj_mei: ''
  });

  const handleDocumentoSubmit = async () => {
    if (!documento) {
      toast.error('Digite o documento');
      return;
    }

    setCarregandoValidacao(true);

    try {
      // Verificar duplicidade
      const verificacao = tipoDocumento === 'cnpj' 
        ? await verificarCNPJ(documento)
        : await verificarCPF(documento);

      if (verificacao.existe) {
        onDuplicidadeDetectada({
          documento,
          tipoDocumento,
          fornecedorExistente: verificacao.dados
        });
        return;
      }

      // Para CNPJ, buscar dados na Receita Federal
      if (tipoDocumento === 'cnpj') {
        const dadosEmpresa = await buscarCNPJ(documento);
        if (dadosEmpresa) {
          setDadosReceita(dadosEmpresa);
          setFormData(prev => ({
            ...prev,
            logradouro: dadosEmpresa.logradouro || '',
            numero: dadosEmpresa.numero || '',
            complemento: dadosEmpresa.complemento || '',
            bairro: dadosEmpresa.bairro || '',
            cidade: dadosEmpresa.municipio || '',
            estado: dadosEmpresa.uf || '',
            cep: dadosEmpresa.cep || ''
          }));
        }
      }

      setEtapa('dados');
    } catch (error) {
      console.error('Erro na validação:', error);
      toast.error('Erro ao validar documento. Tente novamente.');
    } finally {
      setCarregandoValidacao(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    // Validar email corporativo para CNPJ
    if (tipoDocumento === 'cnpj' && !isEmailCorporativo(formData.email)) {
      toast.error('Para empresas, utilize um email corporativo');
      return;
    }

    const dadosCompletos = {
      tipoDocumento,
      documento,
      dadosReceita,
      ...formData,
      convite_id: convite?.id
    };

    onCadastroCompleto(dadosCompletos);
  };

  const isEmailCorporativo = (email: string): boolean => {
    const dominiosPublicos = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
    const dominio = email.split('@')[1]?.toLowerCase();
    return !dominiosPublicos.includes(dominio);
  };

  const renderEtapaDocumento = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Button variant="ghost" size="sm" onClick={onVoltar} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          {tipoDocumento === 'cnpj' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
          <CardTitle>
            {tipoDocumento === 'cnpj' ? 'CNPJ da Empresa' : 'CPF'}
          </CardTitle>
        </div>
        <CardDescription>
          {tipoDocumento === 'cnpj' 
            ? 'Digite o CNPJ para buscar os dados automaticamente'
            : 'Digite seu CPF para continuar'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="documento">
            {tipoDocumento === 'cnpj' ? 'CNPJ' : 'CPF'}
          </Label>
          <Input
            id="documento"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            placeholder={tipoDocumento === 'cnpj' ? '00.000.000/0000-00' : '000.000.000-00'}
            maxLength={tipoDocumento === 'cnpj' ? 18 : 14}
          />
        </div>

        <Button 
          onClick={handleDocumentoSubmit}
          disabled={carregandoValidacao || !documento}
          className="w-full"
        >
          {carregandoValidacao && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {tipoDocumento === 'cnpj' ? 'Buscar Empresa' : 'Continuar'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderEtapaDados = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <Button variant="ghost" size="sm" onClick={() => setEtapa('documento')} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Alterar {tipoDocumento.toUpperCase()}
        </Button>
        <CardTitle>Dados do Cadastro</CardTitle>
        <CardDescription>
          {dadosReceita && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mt-2">
              <strong>{dadosReceita.nome}</strong>
              <br />
              {formatarCnpj(documento)} - {dadosReceita.situacao}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Contato */}
          <div className="space-y-4">
            <h3 className="font-medium">Dados do Contato</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sobrenome">Sobrenome *</Label>
                <Input
                  id="sobrenome"
                  value={formData.sobrenome}
                  onChange={(e) => setFormData(prev => ({ ...prev, sobrenome: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                {tipoDocumento === 'cnpj' && formData.email && !isEmailCorporativo(formData.email) && (
                  <p className="text-sm text-orange-600 mt-1">
                    Recomendamos usar email corporativo para empresas
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                />
              </div>
            </div>
            {tipoDocumento === 'cnpj' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input
                    id="departamento"
                    value={formData.departamento}
                    onChange={(e) => setFormData(prev => ({ ...prev, departamento: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dados específicos para CPF */}
          {tipoDocumento === 'cpf' && (
            <div className="space-y-4">
              <h3 className="font-medium">Dados Pessoais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input
                    id="profissao"
                    value={formData.profissao}
                    onChange={(e) => setFormData(prev => ({ ...prev, profissao: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="rg_ou_cnh">RG ou CNH</Label>
                  <Input
                    id="rg_ou_cnh"
                    value={formData.rg_ou_cnh}
                    onChange={(e) => setFormData(prev => ({ ...prev, rg_ou_cnh: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="e_mei"
                  checked={formData.e_mei}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, e_mei: !!checked }))}
                />
                <Label htmlFor="e_mei">Sou MEI (Microempreendedor Individual)</Label>
              </div>
              {formData.e_mei && (
                <div>
                  <Label htmlFor="cnpj_mei">CNPJ do MEI</Label>
                  <Input
                    id="cnpj_mei"
                    value={formData.cnpj_mei}
                    onChange={(e) => setFormData(prev => ({ ...prev, cnpj_mei: e.target.value }))}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              )}
            </div>
          )}

          {/* Categoria de Fornecimento */}
          <div className="space-y-4">
            <h3 className="font-medium">Categoria de Fornecimento</h3>
            <div>
              <Label htmlFor="categoria_principal">Categoria Principal *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_principal: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materiais">Materiais e Suprimentos</SelectItem>
                  <SelectItem value="servicos">Serviços</SelectItem>
                  <SelectItem value="equipamentos">Equipamentos</SelectItem>
                  <SelectItem value="consultoria">Consultoria</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="descricao_servicos">Descrição dos Serviços/Produtos</Label>
              <Textarea
                id="descricao_servicos"
                value={formData.descricao_servicos}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao_servicos: e.target.value }))}
                placeholder="Descreva brevemente os produtos ou serviços que oferece"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Continuar para Aceite
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex justify-center">
      {etapa === 'documento' && renderEtapaDocumento()}
      {etapa === 'dados' && renderEtapaDados()}
    </div>
  );
}