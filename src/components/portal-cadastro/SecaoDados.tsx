
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatarCnpj } from '@/utils/cnpjUtils';

interface SecaoDadosProps {
  tipoDocumento: 'cnpj' | 'cpf';
  documento: string;
  dadosReceita: any;
  formData: any;
  onFormDataChange: (field: string, value: string) => void;
  isEmailCorporativo: (email: string) => boolean;
}

export function SecaoDados({
  tipoDocumento,
  documento,
  dadosReceita,
  formData,
  onFormDataChange,
  isEmailCorporativo
}: SecaoDadosProps) {
  return (
    <div className="space-y-6 p-6 border rounded-lg bg-background">
      <h3 className="font-medium text-lg">3. Dados do Cadastro</h3>

      {dadosReceita && (
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <strong>{dadosReceita.nome}</strong>
          <br />
          {formatarCnpj(documento)} - {dadosReceita.situacao}
        </div>
      )}

      {/* Dados do Contato */}
      <div className="space-y-4">
        <h4 className="font-medium">Dados do Contato</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => onFormDataChange('nome', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="sobrenome">Sobrenome *</Label>
            <Input
              id="sobrenome"
              value={formData.sobrenome}
              onChange={(e) => onFormDataChange('sobrenome', e.target.value)}
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
              onChange={(e) => onFormDataChange('email', e.target.value)}
              required
            />
            {tipoDocumento === 'cnpj' && formData.email && !isEmailCorporativo(formData.email) && (
              <p className="text-sm text-orange-600 mt-1">
                Recomendamos usar email corporativo
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => onFormDataChange('telefone', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categoria */}
      <div className="space-y-4">
        <h4 className="font-medium">Categoria de Fornecimento</h4>
        <div>
          <Label htmlFor="categoria_principal">Categoria Principal *</Label>
          <Select onValueChange={(value) => onFormDataChange('categoria_principal', value)}>
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
            onChange={(e) => onFormDataChange('descricao_servicos', e.target.value)}
            placeholder="Descreva brevemente os produtos ou serviços que oferece"
          />
        </div>
      </div>
    </div>
  );
}
