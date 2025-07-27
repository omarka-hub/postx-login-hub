
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
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
  const { profile } = useProfile();
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

  const createXCredential = async (credentialData: Omit<XCredential, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !profile) return;

    const limits = getAccessLimits(profile.access_level);
    if (xCredentials.length >= limits.maxXAccounts) {
      toast({
        title: "Limit Reached",
        description: `Your ${profile.access_level} plan allows only ${limits.maxXAccounts} X account${limits.maxXAccounts === 1 ? '' : 's'}`,
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('x_credentials')
        .insert({
          ...credentialData,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "X credentials saved successfully"
      });
      
      fetchXCredentials();
    } catch (error) {
      console.error('Error creating X credentials:', error);
      toast({
        title: "Error",
        description: "Failed to save X credentials",
        variant: "destructive"
      });
    }
  };

  const deleteXCredential = async (id: string) => {
    try {
      const { error } = await supabase
        .from('x_credentials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "X credentials deleted successfully"
      });
      
      fetchXCredentials();
    } catch (error) {
      console.error('Error deleting X credentials:', error);
      toast({
        title: "Error",
        description: "Failed to delete X credentials",
        variant: "destructive"
      });
    }
  };

  const getAccessLimits = (accessLevel: string) => {
    switch (accessLevel) {
      case 'FREE':
        return { maxXAccounts: 1 };
      case 'BEGINNER':
        return { maxXAccounts: 1 };
      case 'PRO':
        return { maxXAccounts: 3 };
      case 'BUSINESS':
        return { maxXAccounts: 5 };
      case 'STUDENT':
        return { maxXAccounts: 1 };
      default:
        return { maxXAccounts: 1 };
    }
  };

  useEffect(() => {
    fetchXCredentials();
  }, [user]);

  return { 
    xCredentials, 
    loading, 
    createXCredential,
    deleteXCredential,
    refetch: fetchXCredentials,
    getAccessLimits: () => getAccessLimits(profile?.access_level || 'FREE')
  };
};
