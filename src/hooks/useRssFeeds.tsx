
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
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
  const { profile } = useProfile();
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

  const createRssFeed = async (feedData: Omit<RssFeed, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !profile) return;

    const limits = getAccessLimits(profile.access_level);
    if (rssFeeds.length >= limits.maxRssFeeds) {
      toast({
        title: "Limit Reached",
        description: `Your ${profile.access_level} plan allows only ${limits.maxRssFeeds} RSS feeds`,
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('rss_feeds')
        .insert({
          ...feedData,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "RSS feed created successfully"
      });
      
      fetchRssFeeds();
    } catch (error) {
      console.error('Error creating RSS feed:', error);
      toast({
        title: "Error",
        description: "Failed to create RSS feed",
        variant: "destructive"
      });
    }
  };

  const deleteRssFeed = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rss_feeds')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "RSS feed deleted successfully"
      });
      
      fetchRssFeeds();
    } catch (error) {
      console.error('Error deleting RSS feed:', error);
      toast({
        title: "Error",
        description: "Failed to delete RSS feed",
        variant: "destructive"
      });
    }
  };

  const getAccessLimits = (accessLevel: string) => {
    switch (accessLevel) {
      case 'FREE':
        return { maxRssFeeds: 1 };
      case 'BEGINNER':
        return { maxRssFeeds: 2 };
      case 'PRO':
        return { maxRssFeeds: 5 };
      case 'BUSINESS':
        return { maxRssFeeds: 10 };
      case 'STUDENT':
        return { maxRssFeeds: 2 };
      default:
        return { maxRssFeeds: 1 };
    }
  };

  useEffect(() => {
    fetchRssFeeds();
  }, [user]);

  return { 
    rssFeeds, 
    loading, 
    createRssFeed,
    deleteRssFeed,
    refetch: fetchRssFeeds,
    getAccessLimits: () => getAccessLimits(profile?.access_level || 'FREE')
  };
};
