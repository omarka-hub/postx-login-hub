
-- Create table for AI prompts
CREATE TABLE public.ai_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for X credentials
CREATE TABLE public.x_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  account_name TEXT NOT NULL,
  bearer_token TEXT NOT NULL,
  api_key TEXT NOT NULL,
  api_secret_key TEXT NOT NULL,
  access_token TEXT NOT NULL,
  access_token_secret TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for ai_prompts
ALTER TABLE public.ai_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_prompts
CREATE POLICY "Users can view their own ai_prompts" 
  ON public.ai_prompts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ai_prompts" 
  ON public.ai_prompts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ai_prompts" 
  ON public.ai_prompts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ai_prompts" 
  ON public.ai_prompts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add Row Level Security (RLS) for x_credentials
ALTER TABLE public.x_credentials ENABLE ROW LEVEL SECURITY;

-- Create policies for x_credentials
CREATE POLICY "Users can view their own x_credentials" 
  ON public.x_credentials 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own x_credentials" 
  ON public.x_credentials 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own x_credentials" 
  ON public.x_credentials 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own x_credentials" 
  ON public.x_credentials 
  FOR DELETE 
  USING (auth.uid() = user_id);
