
import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface XCredential {
  id: string;
  user_id: string;
  account_name: string;
  api_key: string;
  api_secret_key: string;
  access_token: string;
  access_token_secret: string;
  bearer_token: string;
  latest_post: string | null;
  created_at: string;
  updated_at: string;
}

export const useXCredentials = () => {
  const [xCredentials, setXCredentials] = useState<XCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchXCredentials = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('x_credentials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setXCredentials(data || []);
    } catch (error) {
      console.error('Error fetching X credentials:', error);
      toast({
        title: "Error",
        description: "Failed to load X credentials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchXCredentials();
  }, [user]);

  return { xCredentials, loading, refetch: fetchXCredentials };
};
