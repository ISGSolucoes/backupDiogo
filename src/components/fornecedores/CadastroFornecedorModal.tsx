import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpandedDialog } from "@/components/ui/expanded-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCep } from "@/hooks/useCep";
import { useReceitaWS } from "@/hooks/useReceitaWS";
import { useVerificacaoDuplicidade } from "@/hooks/useVerificacaoDuplicidade";
import { AlertaDuplicidade } from "./AlertaDuplicidade";
import { Loader2 } from "lucide-react";
import { useFullscreenModal } from "@/hooks/useFullscreenModal";

interface CadastroFornecedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  origem_cadastro: string;
  tipo_fornecedor: "cpf" | "cnpj";
  
  // Campos PJ (CNPJ)
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  situacao_cadastral?: string;
  
  // Campos PF (CPF)
  cpf?: string;
  nome_completo?: string;
  rg_ou_cnh?: string;
  profissao?: string;
  e_mei?: boolean;
  cnpj_mei?: string;
  
  // Endereço
  endereco_rua: string;
  endereco_numero: string;
  endereco_edificio?: string;
  endereco_sala?: string;
  endereco_andar?: string;
  endereco_complemento?: string;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_estado: string;
  endereco_cep: string;
  endereco_pais: string;
  
  // Contato
  contato_nome: string;
  contato_sobrenome: string;
  contato_email: string;
  contato_telefone: string;
  contato_idioma: string;
  contato_local?: string;
  
  // Fornecimento
  categoria_fornecimento: string;
  regiao_fornecimento: string;
  cnae_principal?: string;
  cnae_secundario_1?: string;
  cnae_secundario_2?: string;
  
  // Extras
  aceite_nda?: boolean;
  tem_contato_cliente?: boolean;
}

export const CadastroFornecedorModal = ({ open, onOpenChange }: CadastroFornecedorModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicidadeDetectada, setDuplicidadeDetectada] = useState<{
    tipo: "cnpj" | "cpf";
    documento: string;
    dados: any;
  } | null>(null);
  const [permitirDuplicidade, setPermitirDuplicidade] = useState(false);
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();

  const { buscarCep, loading: loadingCep, error: errorCep } = useCep();
  const { buscarCNPJ, loading: loadingReceitaWS, error: errorReceitaWS } = useReceitaWS();
  const { verificarCNPJ, verificarCPF, loading: loadingVerificacao } = useVerificacaoDuplicidade();

  const form = useForm<FormData>({
    defaultValues: {
      origem_cadastro: "",
      tipo_fornecedor: "cnpj",
      endereco_pais: "Brasil",
      contato_idioma: "PT",
      e_mei: false,
      aceite_nda: false,
      tem_contato_cliente: false,
    },
  });

  const tipoFornecedor = form.watch("tipo_fornecedor");
  const eMei = form.watch("e_mei");

  const origensOpcoes = [
    "Portal da Empresa",
    "Indicação",
    "Evento/Feira",
    "Busca Online",
    "Contato Direto",
    "Rede Social",
    "Outro"
  ];

  const estadosBrasil = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  const idiomas = [
    { value: "PT", label: "Português" },
    { value: "EN", label: "English" },
    { value: "ES", label: "Español" },
    { value: "FR", label: "Français" },
  ];

  const handleCepChange = async (cep: string) => {
    form.setValue("endereco_cep", cep);

    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      const dadosCep = await buscarCep(cep);
      
      if (dadosCep) {
        form.setValue("endereco_rua", dadosCep.logradouro || "");
        form.setValue("endereco_bairro", dadosCep.bairro || "");
        form.setValue("endereco_cidade", dadosCep.localidade || "");
        form.setValue("endereco_estado", dadosCep.uf || "");
        if (dadosCep.complemento) {
          form.setValue("endereco_complemento", dadosCep.complemento);
        }
        
        toast.success("Endereço preenchido automaticamente!");
      } else if (errorCep) {
        toast.error(errorCep);
      }
    }
  };

  const handleCNPJChange = async (cnpj: string) => {
    form.setValue("cnpj", cnpj);

    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length === 14) {
      // Primeiro busca os dados na ReceitaWS
      const dadosReceita = await buscarCNPJ(cnpj);
      
      if (dadosReceita) {
        // Preenche automaticamente os campos com os dados da Receita
        form.setValue("razao_social", dadosReceita.nome || "");
        form.setValue("nome_fantasia", dadosReceita.fantasia || "");
        form.setValue("situacao_cadastral", dadosReceita.situacao || "");
        
        // Preenche CNAE principal se disponível
        if (dadosReceita.atividade_principal && dadosReceita.atividade_principal[0]) {
          form.setValue("cnae_principal", `${dadosReceita.atividade_principal[0].code} - ${dadosReceita.atividade_principal[0].text}`);
        }
        
        // Preenche endereço se não estiver preenchido
        if (!form.getValues("endereco_rua")) {
          form.setValue("endereco_rua", dadosReceita.logradouro || "");
          form.setValue("endereco_numero", dadosReceita.numero || "");
          form.setValue("endereco_bairro", dadosReceita.bairro || "");
          form.setValue("endereco_cidade", dadosReceita.municipio || "");
          form.setValue("endereco_estado", dadosReceita.uf || "");
          form.setValue("endereco_cep", dadosReceita.cep || "");
          if (dadosReceita.complemento) {
            form.setValue("endereco_complemento", dadosReceita.complemento);
          }
        }
        
        toast.success("Dados da empresa preenchidos automaticamente!");
      } else if (errorReceitaWS) {
        toast.error(errorReceitaWS);
      }
      
      // Depois verifica duplicidade (se não estiver permitindo duplicidade)
      if (!permitirDuplicidade) {
        const resultado = await verificarCNPJ(cnpj);
        if (resultado.existe && resultado.dados) {
          setDuplicidadeDetectada({
            tipo: "cnpj",
            documento: cnpj,
            dados: resultado.dados
          });
        }
      }
    }
  };

  const handleCPFBlur = async (cpf: string) => {
    if (!cpf || permitirDuplicidade) return;

    const resultado = await verificarCPF(cpf);
    if (resultado.existe && resultado.dados) {
      setDuplicidadeDetectada({
        tipo: "cpf",
        documento: cpf,
        dados: resultado.dados
      });
    }
  };

  const handleContinuarComDuplicidade = () => {
    setPermitirDuplicidade(true);
    setDuplicidadeDetectada(null);
  };

  const handleCancelarDuplicidade = () => {
    setDuplicidadeDetectada(null);
    // Limpar o campo que causou a duplicidade
    if (duplicidadeDetectada?.tipo === "cnpj") {
      form.setValue("cnpj", "");
    } else {
      form.setValue("cpf", "");
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("cadastro_fornecedores")
        .insert([data]);

      if (error) throw error;

      toast.success("Cadastro enviado com sucesso!");
      form.reset();
      setPermitirDuplicidade(false);
      setDuplicidadeDetectada(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao enviar cadastro:", error);
      toast.error("Erro ao enviar cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If há duplicidade detectada, mostrar o alerta
  if (duplicidadeDetectada) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verificação de Duplicidade</DialogTitle>
          </DialogHeader>
          <AlertaDuplicidade
            tipo={duplicidadeDetectada.tipo}
            documento={duplicidadeDetectada.documento}
            dados={duplicidadeDetectada.dados}
            onContinuar={handleContinuarComDuplicidade}
            onCancelar={handleCancelarDuplicidade}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <ExpandedDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cadastro de Fornecedor"
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
    >

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Seção 1: Identificação do Cadastro */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Identificação do Cadastro</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="origem_cadastro"
                  rules={{ required: "Campo obrigatório" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Como conheceu nossa empresa? *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {origensOpcoes.map((origem) => (
                            <SelectItem key={origem} value={origem}>
                              {origem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Seção 2: Tipo de Fornecedor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Tipo de Fornecedor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tipo_fornecedor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Cadastro *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cnpj" id="cnpj" />
                            <Label htmlFor="cnpj">Pessoa Jurídica (CNPJ)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cpf" id="cpf" />
                            <Label htmlFor="cpf">Pessoa Física (CPF)</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campos condicionais para CNPJ */}
                {tipoFornecedor === "cnpj" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cnpj"
                      rules={{ required: "CNPJ é obrigatório" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNPJ *</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input 
                                placeholder="00.000.000/0000-00" 
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleCNPJChange(e.target.value);
                                }}
                              />
                              {(loadingVerificacao || loadingReceitaWS) && <Loader2 className="h-4 w-4 animate-spin" />}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="razao_social"
                      rules={{ required: "Razão Social é obrigatória" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Razão Social *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nome_fantasia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Fantasia</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inscricao_estadual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inscrição Estadual</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inscricao_municipal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inscrição Municipal</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="situacao_cadastral"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Situação Cadastral</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: Ativa" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Campos condicionais para CPF */}
                {tipoFornecedor === "cpf" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cpf"
                      rules={{ required: "CPF é obrigatório" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF *</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input 
                                placeholder="000.000.000-00" 
                                {...field}
                                onBlur={(e) => {
                                  field.onBlur();
                                  handleCPFBlur(e.target.value);
                                }}
                              />
                              {loadingVerificacao && <Loader2 className="h-4 w-4 animate-spin" />}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nome_completo"
                      rules={{ required: "Nome completo é obrigatório" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rg_ou_cnh"
                      rules={{ required: "RG ou CNH é obrigatório" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RG ou CNH *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profissao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profissão</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="e_mei"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>É MEI (Microempreendedor Individual)?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {eMei && (
                      <FormField
                        control={form.control}
                        name="cnpj_mei"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CNPJ MEI</FormLabel>
                            <FormControl>
                              <Input placeholder="00.000.000/0000-00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seção 3: Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Endereço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="endereco_cep"
                    rules={{ required: "CEP é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP *</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input 
                              placeholder="00000-000" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleCepChange(e.target.value);
                              }}
                            />
                            {loadingCep && <Loader2 className="h-4 w-4 animate-spin" />}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco_rua"
                    rules={{ required: "Rua é obrigatória" }}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Rua *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco_numero"
                    rules={{ required: "Número é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco_edificio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Edifício</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco_sala"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sala</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco_andar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Andar</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco_complemento"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco_bairro"
                    rules={{ required: "Bairro é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco_cidade"
                    rules={{ required: "Cidade é obrigatória" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco_estado"
                    rules={{ required: "Estado é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estadosBrasil.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco_pais"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País *</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Seção 4: Contato */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4. Dados de Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contato_nome"
                    rules={{ required: "Nome é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Contato *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contato_sobrenome"
                    rules={{ required: "Sobrenome é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sobrenome *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contato_email"
                    rules={{ 
                      required: "E-mail é obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "E-mail inválido"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contato_telefone"
                    rules={{ required: "Telefone é obrigatório" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone *</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contato_idioma"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idioma Preferencial *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {idiomas.map((idioma) => (
                              <SelectItem key={idioma.value} value={idioma.value}>
                                {idioma.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contato_local"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local do Contato</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Matriz, Filial SP, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Seção 5: Informações de Fornecimento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">5. Informações de Fornecimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categoria_fornecimento"
                    rules={{ required: "Categoria é obrigatória" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria de Fornecimento *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Materiais de Escritório, Serviços de TI..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regiao_fornecimento"
                    rules={{ required: "Região é obrigatória" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Região de Fornecimento *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Nacional, SP, RJ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cnae_principal"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>CNAE Principal</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 62.09-1/00 - Suporte técnico, manutenção e outros serviços em TI" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cnae_secundario_1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNAE Secundário 1</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 43.21-5/00 - Instalação elétrica" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cnae_secundario_2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNAE Secundário 2</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 77.33-1/00 - Aluguel de máquinas" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Seção 6: Extras */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">6. Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="aceite_nda"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Aceito assinar um Acordo de Confidencialidade (NDA)
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tem_contato_cliente"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Fornecedor tem contato direto com clientes
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Enviando..." : "Enviar Cadastro"}
              </Button>
            </div>
          </form>
        </Form>
    </ExpandedDialog>
  );
};
