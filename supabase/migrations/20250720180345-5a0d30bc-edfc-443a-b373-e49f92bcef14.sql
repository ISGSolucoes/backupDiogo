-- Add finalidade column to template_acao_lote table
ALTER TABLE public.template_acao_lote 
ADD COLUMN finalidade TEXT;

-- Set default values based on existing tipo_acao
UPDATE public.template_acao_lote 
SET finalidade = CASE 
  WHEN tipo_acao = 'comunicado' THEN 'Comunicado'
  WHEN tipo_acao = 'pesquisa_cliente' THEN 'Pesquisa com Cliente'
  WHEN tipo_acao = 'convite' THEN 'Convite'
  WHEN tipo_acao = 'avaliacao_interna' THEN 'Avaliação Interna'
  WHEN tipo_acao = 'requalificacao' THEN 'Requalificação'
  ELSE 'Comunicado'
END;

-- Make finalidade NOT NULL after setting defaults
ALTER TABLE public.template_acao_lote 
ALTER COLUMN finalidade SET NOT NULL;