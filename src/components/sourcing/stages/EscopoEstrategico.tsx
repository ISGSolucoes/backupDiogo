import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Target, FileText } from 'lucide-react';

interface EscopoEstrategicoData {
  categoria: string;
  prazoInicial: string;
  prazoFinal: string;
  moeda: string;
  objetivos: string[];
  estrategia: string;
  justificativa: string;
}

interface EscopoEstrategicoProps {
  data: Partial<EscopoEstrategicoData>;
  onComplete: (data: EscopoEstrategicoData) => void;
  wizardData: any;
}

export function EscopoEstrategico({ data, onComplete, wizardData }: EscopoEstrategicoProps) {
  const [formData, setFormData] = useState<EscopoEstrategicoData>({
    categoria: '',
    prazoInicial: '',
    prazoFinal: '',
    moeda: 'BRL',
    objetivos: [],
    estrategia: '',
    justificativa: '',
    ...data
  });

  const [novoObjetivo, setNovoObjetivo] = useState('');

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const isValid = formData.categoria.trim() &&
                   formData.prazoInicial &&
                   formData.prazoFinal &&
                   formData.objetivos.length > 0;

    if (isValid) {
      onComplete(formData);
    }
  };

  const adicionarObjetivo = () => {
    if (novoObjetivo.trim()) {
      setFormData(prev => ({
        ...prev,
        objetivos: [...prev.objetivos, novoObjetivo.trim()]
      }));
      setNovoObjetivo('');
    }
  };

  const removerObjetivo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objetivos: prev.objetivos.filter((_, i) => i !== index)
    }));
  };

  const categorias = [
    'Materiais de Escritório',
    'Equipamentos de TI', 
    'Serviços de Consultoria',
    'Materiais de Construção',
    'Produtos Químicos',
    'Serviços de Manutenção',
    'Uniformes e EPI',
    'Mobiliário',
    'Serviços de Limpeza',
    'Telecomunicações',
    'Segurança',
    'Outros'
  ];

  const estrategias = [
    'Menor preço',
    'Melhor custo-benefício',
    'Qualidade técnica',
    'Prazo de entrega',
    'Sustentabilidade',
    'Inovação',
    'Relacionamento estratégico'
  ];

  return (
    <div className="space-y-6">
      {/* Informações do Projeto da Etapa Anterior */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumo do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Nome:</strong> {wizardData?.estrutura?.nome_projeto || 'Não definido'}
            </div>
            <div>
              <strong>Tipo:</strong> {wizardData?.estrutura?.tipo_aquisicao || 'Não definido'}
            </div>
            <div>
              <strong>Evento:</strong> {wizardData?.estrutura?.tipo_evento || 'Não definido'}
            </div>
            <div>
              <strong>Região:</strong> {wizardData?.estrutura?.regiao || 'Não definido'}
            </div>
          </div>
          {wizardData?.estrutura?.descricao && (
            <div className="text-sm">
              <strong>Descrição:</strong> {wizardData.estrutura.descricao}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categoria Específica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Categoria Específica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria Detalhada *</Label>
            <Select 
              value={formData.categoria} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria específica" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Defina uma categoria mais específica que o tipo de aquisição selecionado anteriormente
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cronograma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cronograma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prazoInicial">Data de Início *</Label>
              <Input
                id="prazoInicial"
                type="date"
                value={formData.prazoInicial}
                onChange={(e) => setFormData(prev => ({ ...prev, prazoInicial: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prazoFinal">Data Limite para Propostas *</Label>
              <Input
                id="prazoFinal"
                type="date"
                value={formData.prazoFinal}
                onChange={(e) => setFormData(prev => ({ ...prev, prazoFinal: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações do Projeto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configurações Financeiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="moeda">Moeda do Projeto</Label>
            <Select 
              value={formData.moeda} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, moeda: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real (BRL)</SelectItem>
                <SelectItem value="USD">Dólar (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Valor estimado: {wizardData?.estrutura?.valor_estimado_total ? 
                `${formData.moeda} ${wizardData.estrutura.valor_estimado_total.toLocaleString()}` : 
                'Não informado'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Objetivos Estratégicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objetivos Estratégicos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={novoObjetivo}
              onChange={(e) => setNovoObjetivo(e.target.value)}
              placeholder="Adicionar objetivo..."
              onKeyPress={(e) => e.key === 'Enter' && adicionarObjetivo()}
            />
            <Button onClick={adicionarObjetivo} variant="outline">
              Adicionar
            </Button>
          </div>

          {formData.objetivos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.objetivos.map((objetivo, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removerObjetivo(index)}
                >
                  {objetivo} ×
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="estrategia">Estratégia Principal</Label>
            <Select 
              value={formData.estrategia} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, estrategia: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a estratégia" />
              </SelectTrigger>
              <SelectContent>
                {estrategias.map(est => (
                  <SelectItem key={est} value={est}>{est}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="justificativa">Justificativa do Projeto</Label>
            <Textarea
              id="justificativa"
              value={formData.justificativa}
              onChange={(e) => setFormData(prev => ({ ...prev, justificativa: e.target.value }))}
              placeholder="Justifique a necessidade e benefícios esperados..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}