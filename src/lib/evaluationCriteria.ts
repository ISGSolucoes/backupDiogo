import { EvaluationCriteria } from './sourcingTypes';

export class EvaluationCriteriaManager {
  /**
   * Critérios padrão para avaliação de fornecedores
   */
  static getDefaultCriteria(): EvaluationCriteria[] {
    return [
      {
        id: 'price',
        name: 'Preço',
        weight: 40,
        type: 'numeric',
        description: 'Valor total da proposta',
        required: true,
        min_value: 0
      },
      {
        id: 'delivery_time',
        name: 'Prazo de Entrega',
        weight: 25,
        type: 'numeric',
        description: 'Tempo de entrega em dias',
        required: true,
        min_value: 1
      },
      {
        id: 'quality',
        name: 'Qualidade',
        weight: 20,
        type: 'rating',
        description: 'Avaliação da qualidade do produto/serviço',
        required: true,
        min_value: 1,
        max_value: 5
      },
      {
        id: 'experience',
        name: 'Experiência do Fornecedor',
        weight: 10,
        type: 'rating',
        description: 'Experiência prévia com produtos similares',
        required: false,
        min_value: 1,
        max_value: 5
      },
      {
        id: 'compliance',
        name: 'Conformidade',
        weight: 5,
        type: 'boolean',
        description: 'Atende a todos os requisitos técnicos',
        required: true
      }
    ];
  }

  /**
   * Validar critérios de avaliação
   */
  static validateCriteria(criteria: EvaluationCriteria[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Verificar se há critérios
    if (!criteria || criteria.length === 0) {
      errors.push('Pelo menos um critério é obrigatório');
      return { valid: false, errors };
    }

    // Verificar se os pesos somam 100%
    const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      errors.push(`Soma dos pesos deve ser 100%. Atual: ${totalWeight}%`);
    }

    // Verificar cada critério
    criteria.forEach((criterion, index) => {
      if (!criterion.name?.trim()) {
        errors.push(`Critério ${index + 1}: Nome é obrigatório`);
      }

      if (criterion.weight <= 0) {
        errors.push(`Critério ${index + 1}: Peso deve ser maior que 0`);
      }

      if (criterion.type === 'rating') {
        if (!criterion.min_value || !criterion.max_value) {
          errors.push(`Critério ${index + 1}: Valores mínimo e máximo são obrigatórios para tipo 'rating'`);
        } else if (criterion.min_value >= criterion.max_value) {
          errors.push(`Critério ${index + 1}: Valor mínimo deve ser menor que o máximo`);
        }
      }

      if (criterion.type === 'numeric' && criterion.min_value !== undefined && criterion.max_value !== undefined) {
        if (criterion.min_value >= criterion.max_value) {
          errors.push(`Critério ${index + 1}: Valor mínimo deve ser menor que o máximo`);
        }
      }
    });

    return { valid: errors.length === 0, errors };
  }

  /**
   * Normalizar peso dos critérios para somar 100%
   */
  static normalizeCriteriaWeights(criteria: EvaluationCriteria[]): EvaluationCriteria[] {
    const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    
    if (totalWeight === 0) {
      // Se todos os pesos são zero, distribuir igualmente
      const equalWeight = 100 / criteria.length;
      return criteria.map(criterion => ({
        ...criterion,
        weight: equalWeight
      }));
    }

    // Normalizar proporcionalmente
    return criteria.map(criterion => ({
      ...criterion,
      weight: (criterion.weight / totalWeight) * 100
    }));
  }

  /**
   * Criar critério personalizado
   */
  static createCustomCriterion(
    name: string,
    weight: number,
    type: EvaluationCriteria['type'],
    options?: Partial<EvaluationCriteria>
  ): EvaluationCriteria {
    return {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      weight,
      type,
      description: options?.description || '',
      required: options?.required ?? false,
      min_value: options?.min_value,
      max_value: options?.max_value,
      options: options?.options
    };
  }

  /**
   * Calcular score total baseado nos critérios e avaliações
   */
  static calculateTotalScore(
    criteria: EvaluationCriteria[],
    evaluations: Record<string, any>
  ): number {
    let totalScore = 0;
    let totalWeight = 0;

    criteria.forEach(criterion => {
      const evaluation = evaluations[criterion.id];
      if (evaluation !== undefined && evaluation !== null) {
        let normalizedScore = 0;

        switch (criterion.type) {
          case 'boolean':
            normalizedScore = evaluation ? 100 : 0;
            break;
          
          case 'rating':
            if (criterion.min_value && criterion.max_value) {
              normalizedScore = ((evaluation - criterion.min_value) / 
                               (criterion.max_value - criterion.min_value)) * 100;
            }
            break;
          
          case 'numeric':
            // Para valores numéricos, assumir que menor é melhor (ex: preço, prazo)
            // Pode ser customizado conforme a necessidade
            if (criterion.min_value !== undefined) {
              normalizedScore = Math.max(0, 100 - ((evaluation - criterion.min_value) / 
                                       (criterion.min_value || 1)) * 10);
            } else {
              normalizedScore = evaluation;
            }
            break;
          
          case 'text':
            // Para texto, assumir score fixo se preenchido
            normalizedScore = evaluation.toString().trim() ? 100 : 0;
            break;
        }

        totalScore += (normalizedScore * criterion.weight / 100);
        totalWeight += criterion.weight;
      }
    });

    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  }
}