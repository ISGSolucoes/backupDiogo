
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useReceitaWS } from '@/hooks/useReceitaWS';
import { useVerificacaoDuplicidade } from '@/hooks/useVerificacaoDuplicidade';
import { DeteccaoDuplicidadeInline } from './DeteccaoDuplicidadeInline';
import { SecaoTipoDocumento } from './SecaoTipoDocumento';
import { SecaoDocumento } from './SecaoDocumento';
import { SecaoDados } from './SecaoDados';
import { SecaoTermos } from './SecaoTermos';

interface CadastroUnificadoProps {
  convite?: any;
  origem: 'convite' | 'auto_registro';
  onCadastroCompleto: (dados: any) => void;
}

export function CadastroUnificado({
  convite,
  origem,
  onCadastroCompleto
}: CadastroUnificadoProps) {
  const [tipoDocumento, setTipoDocumento] = useState<'cnpj' | 'cpf' | null>(null);
  const [documento, setDocumento] = useState('');
  const [documentoValidado, setDocumentoValidado] = useState(false);
  const [carregandoValidacao, setCarregandoValidacao] = useState(false);
  const [dadosReceita, setDadosReceita] = useState<any>(null);
  const [duplicidadeInfo, setDuplicidadeInfo] = useState<any>(null);
  const [mostrarDuplicidade, setMostrarDuplicidade] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  
  const { buscarCNPJ } = useReceitaWS();
  const { verificarCNPJ, verificarCPF } = useVerificacaoDuplicidade();

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cargo: '',
    departamento: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    categoria_principal: '',
    descricao_servicos: '',
    profissao: '',
    rg_ou_cnh: '',
    e_mei: false,
    cnpj_mei: ''
  });

  // Calcular progresso
  const etapasCompletas = [
    tipoDocumento !== null,
    documentoValidado,
    formData.nome && formData.email && formData.categoria_principal,
    aceitouTermos
  ];
  const progresso = (etapasCompletas.filter(Boolean).length / etapasCompletas.length) * 100;

  const handleTipoChange = (tipo: 'cnpj' | 'cpf') => {
    setTipoDocumento(tipo);
    setDocumento('');
    setDocumentoValidado(false);
    setDadosReceita(null);
    setMostrarDuplicidade(false);
  };

  const handleDocumentoSubmit = async () => {
    if (!documento) {
      toast.error('Digite o documento');
      return;
    }

    setCarregandoValidacao(true);

    try {
      const verificacao = tipoDocumento === 'cnpj' 
        ? await verificarCNPJ(documento)
        : await verificarCPF(documento);

      if (verificacao.existe) {
        setDuplicidadeInfo({
          documento,
          tipoDocumento,
          fornecedorExistente: verificacao.dados
        });
        setMostrarDuplicidade(true);
        return;
      }

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

      setDocumentoValidado(true);
    } catch (error) {
      console.error('Erro na validação:', error);
      toast.error('Erro ao validar documento. Tente novamente.');
    } finally {
      setCarregandoValidacao(false);
    }
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitFinal = async () => {
    if (!formData.nome || !formData.email) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    if (!aceitouTermos) {
      toast.error('Você deve aceitar os termos de uso');
      return;
    }

    if (tipoDocumento === 'cnpj' && !isEmailCorporativo(formData.email)) {
      toast.error('Para empresas, utilize um email corporativo');
      return;
    }

    try {
      setCarregandoValidacao(true);
      
      // Preparar dados para salvar no banco
      const dadosCadastro = {
        origem_cadastro: origem,
        tipo_fornecedor: tipoDocumento,
        ...(tipoDocumento === 'cnpj' ? {
          cnpj: documento,
          razao_social: dadosReceita?.razao_social || formData.nome,
          nome_fantasia: dadosReceita?.nome_fantasia || formData.nome,
          inscricao_estadual: '',
          inscricao_municipal: ''
        } : {
          cpf: documento,
          nome_completo: formData.nome,
          rg_ou_cnh: formData.rg_ou_cnh || '',
          profissao: formData.profissao || '',
          cnpj_mei: formData.cnpj_mei || null,
          e_mei: formData.e_mei
        }),
        endereco_rua: formData.logradouro || '',
        endereco_numero: formData.numero || '',
        endereco_edificio: null,
        endereco_sala: null,
        endereco_andar: null,
        endereco_complemento: formData.complemento || null,
        endereco_bairro: formData.bairro || '',
        endereco_cidade: formData.cidade || '',
        endereco_estado: formData.estado || '',
        endereco_cep: formData.cep || '',
        endereco_pais: 'Brasil',
        contato_nome: formData.nome.split(' ')[0] || '',
        contato_sobrenome: formData.nome.split(' ').slice(1).join(' ') || '',
        contato_email: formData.email,
        contato_telefone: formData.telefone || '',
        contato_idioma: 'PT',
        contato_local: formData.cidade || '',
        categoria_fornecimento: formData.categoria_principal || 'Geral',
        regiao_fornecimento: 'Nacional',
        convite_id: convite?.id || null,
        aceite_nda: aceitouTermos,
        tem_contato_cliente: origem === 'convite'
      };

      // Salvar no banco de dados
      const { data: cadastroData, error: cadastroError } = await supabase
        .from('cadastro_fornecedores')
        .insert(dadosCadastro)
        .select()
        .single();

      if (cadastroError) {
        console.error('Erro ao salvar cadastro:', cadastroError);
        toast.error('Erro ao salvar cadastro. Tente novamente.');
        return;
      }

      // Por enquanto, apenas salvar o cadastro
      // TODO: Implementar criação de usuário do portal em etapa posterior

      const dadosCompletos = {
        tipoDocumento,
        documento,
        dadosReceita,
        ...formData,
        convite_id: convite?.id,
        origem,
        cadastro_id: cadastroData.id
      };

      toast.success('Cadastro realizado com sucesso!');
      onCadastroCompleto(dadosCompletos);
      
    } catch (error) {
      console.error('Erro geral no cadastro:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setCarregandoValidacao(false);
    }
  };

  const isEmailCorporativo = (email: string): boolean => {
    const dominiosPublicos = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
    const dominio = email.split('@')[1]?.toLowerCase();
    return !dominiosPublicos.includes(dominio);
  };

  if (mostrarDuplicidade) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastro de Fornecedor</CardTitle>
          <CardDescription>Documento já cadastrado</CardDescription>
        </CardHeader>
        <CardContent>
          <DeteccaoDuplicidadeInline
            duplicidadeInfo={duplicidadeInfo}
            convite={convite}
            onContinuar={() => {
              setMostrarDuplicidade(false);
              setDocumentoValidado(true);
            }}
            onVoltar={() => {
              setMostrarDuplicidade(false);
              setDocumento('');
              setDocumentoValidado(false);
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div>
          <CardTitle className="text-2xl">Cadastro de Fornecedor</CardTitle>
          <CardDescription>
            Complete seu cadastro em poucos passos
          </CardDescription>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progresso</span>
            <span>{Math.round(progresso)}%</span>
          </div>
          <Progress value={progresso} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Seção 1: Tipo de Documento - Sempre Visível */}
        <SecaoTipoDocumento
          tipoDocumento={tipoDocumento}
          onTipoChange={handleTipoChange}
        />

        {/* Seção 2: Documento - Sempre Visível se tipo selecionado */}
        {tipoDocumento && (
          <SecaoDocumento
            tipoDocumento={tipoDocumento}
            documento={documento}
            onDocumentoChange={setDocumento}
            onDocumentoSubmit={handleDocumentoSubmit}
            carregandoValidacao={carregandoValidacao}
            validado={documentoValidado}
          />
        )}

        {/* Seção 3: Dados - Sempre Visível se tipo selecionado */}
        {tipoDocumento && (
          <SecaoDados
            tipoDocumento={tipoDocumento}
            documento={documento}
            dadosReceita={dadosReceita}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            isEmailCorporativo={isEmailCorporativo}
          />
        )}

        {/* Seção 4: Termos - Sempre Visível se tipo selecionado */}
        {tipoDocumento && (
          <SecaoTermos
            aceitouTermos={aceitouTermos}
            onAceitouTermosChange={setAceitouTermos}
            onSubmitFinal={handleSubmitFinal}
          />
        )}
      </CardContent>
    </Card>
  );
}
