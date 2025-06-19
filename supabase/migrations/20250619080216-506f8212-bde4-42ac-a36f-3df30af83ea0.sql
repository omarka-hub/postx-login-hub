
-- Create table for RSS feeds
CREATE TABLE public.rss_feeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  is_x_source BOOLEAN NOT NULL DEFAULT false,
  feed_type TEXT NOT NULL CHECK (feed_type IN ('created', 'existing')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for rss_feeds
ALTER TABLE public.rss_feeds ENABLE ROW LEVEL SECURITY;

-- Create policies for rss_feeds
CREATE POLICY "Users can view their own rss_feeds" 
  ON public.rss_feeds 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rss_feeds" 
  ON public.rss_feeds 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rss_feeds" 
  ON public.rss_feeds 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rss_feeds" 
  ON public.rss_feeds 
  FOR DELETE 
  USING (auth.uid() = user_id);
