-- Criar trigger para gerar solicitação de sourcing automaticamente
CREATE OR REPLACE FUNCTION public.criar_solicitacao_sourcing()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  recomendacoes JSONB;
BEGIN
  -- Verificar se requisição foi aprovada e valor >= 1000
  IF NEW.status = 'aprovada' AND OLD.status != 'aprovada' AND NEW.valor_estimado >= 1000 THEN
    
    -- Gerar recomendações de fornecedores (simuladas por enquanto)
    recomendacoes := '[
      {
        "fornecedor_id": "1",
        "nome": "Fornecedor Alpha",
        "score": 85,
        "razao": "Histórico excelente na categoria",
        "categoria_match": true,
        "historico_performance": 92
      },
      {
        "fornecedor_id": "2", 
        "nome": "Fornecedor Beta",
        "score": 78,
        "razao": "Preços competitivos",
        "categoria_match": true,
        "historico_performance": 85
      }
    ]'::jsonb;
    
    -- Criar solicitação de sourcing
    INSERT INTO public.solicitacoes_sourcing (
      requisicao_id,
      valor_estimado,
      categoria,
      observacoes,
      recomendacoes_fornecedores
    ) VALUES (
      NEW.id,
      NEW.valor_estimado,
      'categoria_generica',
      'Solicitação criada automaticamente após aprovação da requisição',
      recomendacoes
    );
    
    -- Registrar no histórico da requisição
    INSERT INTO public.historico_requisicao (
      requisicao_id,
      evento,
      descricao,
      usuario_nome,
      origem
    ) VALUES (
      NEW.id,
      'encaminhado_sourcing',
      'Requisição encaminhada automaticamente para Sourcing (valor >= R$ 1.000)',
      'Sistema Automático',
      'sistema'
    );
    
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Criar o trigger se não existir
DROP TRIGGER IF EXISTS trigger_criar_solicitacao_sourcing ON public.requisicoes;
CREATE TRIGGER trigger_criar_solicitacao_sourcing
  AFTER UPDATE ON public.requisicoes
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_solicitacao_sourcing();