
-- Adicionar papel de admin ao usuário atual
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM public.profiles 
WHERE email = 'luabre2017@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
