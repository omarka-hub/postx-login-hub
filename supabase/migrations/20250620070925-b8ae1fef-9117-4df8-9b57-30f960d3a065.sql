
-- Create table for schedules
CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  rss_feed_id UUID REFERENCES public.rss_feeds(id) NOT NULL,
  ai_prompt_id UUID REFERENCES public.ai_prompts(id) NOT NULL,
  x_account_id UUID REFERENCES public.x_credentials(id) NOT NULL,
  monday BOOLEAN NOT NULL DEFAULT false,
  tuesday BOOLEAN NOT NULL DEFAULT false,
  wednesday BOOLEAN NOT NULL DEFAULT false,
  thursday BOOLEAN NOT NULL DEFAULT false,
  friday BOOLEAN NOT NULL DEFAULT false,
  saturday BOOLEAN NOT NULL DEFAULT false,
  sunday BOOLEAN NOT NULL DEFAULT false,
  image_option BOOLEAN NOT NULL DEFAULT false,
  video_option BOOLEAN NOT NULL DEFAULT false,
  start_time_utc TIME NOT NULL,
  end_time_utc TIME NOT NULL,
  timezone TEXT NOT NULL,
  minute_intervals INTEGER NOT NULL CHECK (minute_intervals > 0),
  last_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for schedules
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for schedules
CREATE POLICY "Users can view their own schedules" 
  ON public.schedules 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedules" 
  ON public.schedules 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules" 
  ON public.schedules 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules" 
  ON public.schedules 
  FOR DELETE 
  USING (auth.uid() = user_id);
