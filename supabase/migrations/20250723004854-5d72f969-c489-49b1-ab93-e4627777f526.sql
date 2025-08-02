
-- Corrigir: Adicionar papel de admin ao usuário atual
INSERT INTO public.user_roles (user_id, role, area_especifica, centro_custo_especifico) 
SELECT id, 'admin'::app_role, NULL, NULL
FROM public.profiles 
WHERE email = 'luabre2017@gmail.com'
ON CONFLICT (user_id, role, area_especifica, centro_custo_especifico) DO NOTHING;
