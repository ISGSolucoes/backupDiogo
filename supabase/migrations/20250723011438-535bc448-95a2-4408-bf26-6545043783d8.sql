
-- Create table for user invites
CREATE TABLE public.user_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  nome_completo TEXT NOT NULL,
  area TEXT NOT NULL,
  cargo TEXT,
  mensagem_personalizada TEXT,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  data_expiracao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  status TEXT NOT NULL DEFAULT 'enviado',
  enviado_por UUID REFERENCES auth.users(id),
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_aceite TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage invites
CREATE POLICY "Admins can manage user invites" 
ON public.user_invites 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create policy for users to accept their own invites
CREATE POLICY "Users can accept their own invites"
ON public.user_invites
FOR SELECT
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_user_invites_updated_at
BEFORE UPDATE ON public.user_invites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
