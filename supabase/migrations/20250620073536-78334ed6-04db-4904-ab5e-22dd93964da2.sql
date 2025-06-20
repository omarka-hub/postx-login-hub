
-- Create table for dashboard data
CREATE TABLE public.dashboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  current_credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add latest_post column to x_credentials table
ALTER TABLE public.x_credentials 
ADD COLUMN latest_post TEXT;

-- Add Row Level Security (RLS) for dashboard
ALTER TABLE public.dashboard ENABLE ROW LEVEL SECURITY;

-- Create policies for dashboard
CREATE POLICY "Users can view their own dashboard" 
  ON public.dashboard 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dashboard" 
  ON public.dashboard 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard" 
  ON public.dashboard 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to initialize dashboard when user is created
CREATE OR REPLACE FUNCTION initialize_user_dashboard()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.dashboard (user_id, current_credits)
  VALUES (NEW.id, 
    CASE 
      WHEN NEW.access_level = 'FREE' THEN 20
      WHEN NEW.access_level = 'BEGINNER' THEN 150
      WHEN NEW.access_level = 'PRO' THEN 300
      WHEN NEW.access_level = 'BUSINESS' THEN 500
      ELSE 20
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to initialize dashboard for new users
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION initialize_user_dashboard();
