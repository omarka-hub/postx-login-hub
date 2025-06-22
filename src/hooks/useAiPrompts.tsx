
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface AiPrompt {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  created_at: string;
  updated_at: string;
}

export const useAiPrompts = () => {
  const [aiPrompts, setAiPrompts] = useState<AiPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAiPrompts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAiPrompts(data || []);
    } catch (error) {
      console.error('Error fetching AI prompts:', error);
      toast({
        title: "Error",
        description: "Failed to load AI prompts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiPrompts();
  }, [user]);

  return { aiPrompts, loading, refetch: fetchAiPrompts };
};
