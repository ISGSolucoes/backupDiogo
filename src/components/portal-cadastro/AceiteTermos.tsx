import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Shield, FileText, Handshake, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AceiteTermosProps {
  dadosCadastro: any;
  convite?: any;
  origem: 'convite' | 'auto_registro';
  onAceiteCompleto: () => void;
  onVoltar: () => void;
}

export function AceiteTermos({
  dadosCadastro,
  convite,
  origem,
  onAceiteCompleto,
  onVoltar
}: AceiteTermosProps) {
  const [aceites, setAceites] = useState({
    termos_uso: false,
    politica_privacidade: false,
    relacionamento_cliente: false
  });
  const [processando, setProcessando] = useState(false);

  const handleAceiteChange = (tipo: keyof typeof aceites, checked: boolean) => {
    setAceites(prev => ({ ...prev, [tipo]: checked }));
  };

  const handleSubmit = async () => {
    // Validar aceites obrigatórios
    if (!aceites.termos_uso || !aceites.politica_privacidade) {
      toast.error('Você deve aceitar os termos de uso e política de privacidade');
      return;
    }

    if (origem === 'convite' && !aceites.relacionamento_cliente) {
      toast.error('Você deve aceitar o relacionamento comercial');
      return;
    }

    setProcessando(true);

    try {
      // 1. Criar ou encontrar fornecedor
      let fornecedorId: string;
      
      if (dadosCadastro.opcaoEscolhida) {
        // Cenário de ramificação - usar fornecedor existente
        fornecedorId = dadosCadastro.fornecedorExistente.id;
      } else {
        // Cenário de novo fornecedor
        const { data: novoFornecedor, error: errorFornecedor } = await supabase
          .from('fornecedores')
          .insert({
            tipo_documento: dadosCadastro.tipoDocumento,
            documento: dadosCadastro.documento.replace(/\D/g, ''),
            documento_formatado: dadosCadastro.documento,
            razao_social: dadosCadastro.dadosReceita?.nome || dadosCadastro.nome_completo,
            nome_fantasia: dadosCadastro.dadosReceita?.fantasia,
            nome_completo: dadosCadastro.tipoDocumento === 'cpf' ? `${dadosCadastro.nome} ${dadosCadastro.sobrenome}` : null,
            situacao_receita: dadosCadastro.dadosReceita?.situacao,
            porte_empresa: dadosCadastro.dadosReceita?.porte,
            cnae_principal_codigo: dadosCadastro.dadosReceita?.atividade_principal?.[0]?.code,
            cnae_principal_descricao: dadosCadastro.dadosReceita?.atividade_principal?.[0]?.text,
            profissao: dadosCadastro.profissao,
            rg_ou_cnh: dadosCadastro.rg_ou_cnh,
            e_mei: dadosCadastro.e_mei,
            cnpj_mei: dadosCadastro.cnpj_mei,
            validado_receita: !!dadosCadastro.dadosReceita,
            data_validacao_receita: dadosCadastro.dadosReceita ? new Date().toISOString() : null
          })
          .select()
          .single();

        if (errorFornecedor) throw errorFornecedor;
        fornecedorId = novoFornecedor.id;

        // Criar unidade operacional principal
        await supabase
          .from('unidades_operacionais')
          .insert({
            fornecedor_id: fornecedorId,
            nome_unidade: 'Matriz',
            tipo_unidade: 'matriz',
            logradouro: dadosCadastro.logradouro,
            numero: dadosCadastro.numero,
            complemento: dadosCadastro.complemento,
            bairro: dadosCadastro.bairro,
            cidade: dadosCadastro.cidade,
            estado: dadosCadastro.estado,
            cep: dadosCadastro.cep,
            principal: true,
            ativa: true
          });
      }

      // 2. Criar contato
      const { data: novoContato, error: errorContato } = await supabase
        .from('contatos_fornecedor')
        .insert({
          fornecedor_id: fornecedorId,
          nome: dadosCadastro.nome,
          sobrenome: dadosCadastro.sobrenome,
          email: dadosCadastro.email,
          telefone: dadosCadastro.telefone,
          cargo: dadosCadastro.cargo,
          departamento: dadosCadastro.departamento,
          principal: !dadosCadastro.opcaoEscolhida || dadosCadastro.opcaoEscolhida === 'novo_contato',
          ativo: true,
          perfil_acesso: 'operacional'
        })
        .select()
        .single();

      if (errorContato) throw errorContato;

      // 3. Criar categoria de fornecimento
      await supabase
        .from('categorias_fornecimento')
        .insert({
          contato_id: novoContato.id,
          categoria_principal: dadosCadastro.categoria_principal,
          descricao_servicos: dadosCadastro.descricao_servicos,
          regiao_atendimento: dadosCadastro.regiao_atendimento || [],
          ativa: true
        });

      // 4. Registrar aceites
      const aceitesParaRegistrar: Array<{ tipo: string; aceito: boolean }> = [
        { tipo: 'termos_uso', aceito: aceites.termos_uso },
        { tipo: 'politica_privacidade', aceito: aceites.politica_privacidade }
      ];

      if (origem === 'convite') {
        aceitesParaRegistrar.push({ tipo: 'relacionamento_cliente', aceito: aceites.relacionamento_cliente });
      }

      for (const aceite of aceitesParaRegistrar) {
        if (aceite.aceito) {
          await supabase
            .from('aceites_fornecedor')
            .insert({
              contato_id: novoContato.id,
              tipo_aceite: aceite.tipo,
              versao_documento: '1.0',
              data_aceite: new Date().toISOString()
            });
        }
      }

      // 5. Criar relacionamento se vier de convite
      if (origem === 'convite' && convite && aceites.relacionamento_cliente) {
        await supabase
          .from('relacionamentos_clientes_fornecedores')
          .insert({
            fornecedor_id: fornecedorId,
            contato_id: novoContato.id,
            cliente_codigo: convite.cliente_codigo,
            cliente_nome: convite.cliente_nome,
            status: 'ativo',
            data_aceite: new Date().toISOString(),
            convite_id: convite.id,
            origem: 'convite_cliente'
          });

        // Atualizar status do convite
        await supabase
          .from('convites_fornecedor')
          .update({
            status: 'aceito',
            data_cadastro: new Date().toISOString()
          })
          .eq('id', convite.id);
      } else if (origem === 'auto_registro') {
        // Para auto-registro, criar relacionamento pendente se necessário
        await supabase
          .from('relacionamentos_clientes_fornecedores')
          .insert({
            fornecedor_id: fornecedorId,
            contato_id: novoContato.id,
            status: 'pendente',
            origem: 'auto_registro'
          });
      }

      toast.success('Cadastro realizado com sucesso!');
      onAceiteCompleto();

    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro ao processar cadastro. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  const todosAceitesObrigatorios = aceites.termos_uso && 
    aceites.politica_privacidade && 
    (origem === 'auto_registro' || aceites.relacionamento_cliente);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <Button variant="ghost" size="sm" onClick={onVoltar} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <CardTitle>Aceite de Termos</CardTitle>
        </div>
        <CardDescription>
          Para finalizar seu cadastro, é necessário aceitar os termos abaixo
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Resumo do cadastro */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Resumo do Cadastro</h3>
          <div className="text-sm space-y-1">
            <p><strong>Nome:</strong> {dadosCadastro.nome} {dadosCadastro.sobrenome}</p>
            <p><strong>Email:</strong> {dadosCadastro.email}</p>
            <p><strong>Documento:</strong> {dadosCadastro.documento}</p>
            <p><strong>Categoria:</strong> {dadosCadastro.categoria_principal}</p>
            {origem === 'convite' && convite && (
              <p><strong>Cliente:</strong> {convite.cliente_nome}</p>
            )}
          </div>
        </div>

        {/* Termos de Uso */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="termos_uso"
              checked={aceites.termos_uso}
              onCheckedChange={(checked) => handleAceiteChange('termos_uso', !!checked)}
            />
            <label htmlFor="termos_uso" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <FileText className="inline h-4 w-4 mr-1" />
              Aceito os Termos de Uso da Plataforma *
            </label>
          </div>
          <ScrollArea className="h-32 w-full rounded-md border p-3">
            <div className="text-xs space-y-2">
              <p><strong>TERMOS DE USO - PORTAL SOURCEXPRESS</strong></p>
              <p>Ao utilizar nosso portal, você concorda com:</p>
              <p>1. Fornecer informações verdadeiras e atualizadas sobre sua empresa;</p>
              <p>2. Manter a confidencialidade de suas credenciais de acesso;</p>
              <p>3. Utilizar a plataforma apenas para fins comerciais legítimos;</p>
              <p>4. Respeitar os direitos de propriedade intelectual;</p>
              <p>5. Cumprir todas as leis e regulamentações aplicáveis;</p>
              <p>6. Não usar a plataforma para atividades fraudulentas ou ilegais.</p>
            </div>
          </ScrollArea>
        </div>

        {/* Política de Privacidade */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="politica_privacidade"
              checked={aceites.politica_privacidade}
              onCheckedChange={(checked) => handleAceiteChange('politica_privacidade', !!checked)}
            />
            <label htmlFor="politica_privacidade" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              <Shield className="inline h-4 w-4 mr-1" />
              Aceito a Política de Privacidade *
            </label>
          </div>
          <ScrollArea className="h-32 w-full rounded-md border p-3">
            <div className="text-xs space-y-2">
              <p><strong>POLÍTICA DE PRIVACIDADE</strong></p>
              <p>Seus dados serão tratados conforme a LGPD:</p>
              <p>1. Coletamos apenas dados necessários para prestação do serviço;</p>
              <p>2. Seus dados não serão compartilhados sem autorização;</p>
              <p>3. Você pode solicitar alteração ou exclusão de dados a qualquer momento;</p>
              <p>4. Utilizamos medidas de segurança para proteção dos dados;</p>
              <p>5. Os dados são armazenados em servidores seguros no Brasil;</p>
              <p>6. Você será notificado sobre qualquer alteração nesta política.</p>
            </div>
          </ScrollArea>
        </div>

        {/* Relacionamento Cliente (só para convites) */}
        {origem === 'convite' && convite && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="relacionamento_cliente"
                checked={aceites.relacionamento_cliente}
                onCheckedChange={(checked) => handleAceiteChange('relacionamento_cliente', !!checked)}
              />
              <label htmlFor="relacionamento_cliente" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                <Handshake className="inline h-4 w-4 mr-1" />
                Aceito estabelecer relacionamento comercial com {convite.cliente_nome} *
              </label>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs">
              <p>Ao aceitar, você concorda em:</p>
              <p>• Receber solicitações de cotação de {convite.cliente_nome}</p>
              <p>• Compartilhar informações comerciais relevantes</p>
              <p>• Participar de processos de qualificação quando solicitado</p>
              <p>• Manter atualizado seu cadastro e documentação</p>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onVoltar}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!todosAceitesObrigatorios || processando}
            className="flex-1"
          >
            {processando && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Finalizar Cadastro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}