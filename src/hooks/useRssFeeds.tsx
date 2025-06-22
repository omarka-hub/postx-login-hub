
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface RssFeed {
  id: string;
  user_id: string;
  name: string;
  url: string;
  is_x_source: boolean;
  feed_type: string;
  created_at: string;
  updated_at: string;
}

export const useRssFeeds = () => {
  const [rssFeeds, setRssFeeds] = useState<RssFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRssFeeds = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('rss_feeds')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRssFeeds(data || []);
    } catch (error) {
      console.error('Error fetching RSS feeds:', error);
      toast({
        title: "Error",
        description: "Failed to load RSS feeds",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRssFeeds();
  }, [user]);

  return { rssFeeds, loading, refetch: fetchRssFeeds };
};
