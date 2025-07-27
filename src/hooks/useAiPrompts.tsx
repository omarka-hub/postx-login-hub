
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
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
  const { profile } = useProfile();
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

  const createAiPrompt = async (promptData: Omit<AiPrompt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !profile) return;

    const limits = getAccessLimits(profile.access_level);
    if (aiPrompts.length >= limits.maxAiPrompts) {
      toast({
        title: "Limit Reached",
        description: `Your ${profile.access_level} plan allows only ${limits.maxAiPrompts} AI prompts`,
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('ai_prompts')
        .insert({
          ...promptData,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI prompt created successfully"
      });
      
      fetchAiPrompts();
    } catch (error) {
      console.error('Error creating AI prompt:', error);
      toast({
        title: "Error",
        description: "Failed to create AI prompt",
        variant: "destructive"
      });
    }
  };

  const deleteAiPrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI prompt deleted successfully"
      });
      
      fetchAiPrompts();
    } catch (error) {
      console.error('Error deleting AI prompt:', error);
      toast({
        title: "Error",
        description: "Failed to delete AI prompt",
        variant: "destructive"
      });
    }
  };

  const getAccessLimits = (accessLevel: string) => {
    switch (accessLevel) {
      case 'FREE':
        return { maxAiPrompts: 1 };
      case 'BEGINNER':
        return { maxAiPrompts: 3 };
      case 'PRO':
        return { maxAiPrompts: 10 };
      case 'BUSINESS':
        return { maxAiPrompts: 20 };
      case 'STUDENT':
        return { maxAiPrompts: 2 };
      default:
        return { maxAiPrompts: 1 };
    }
  };

  useEffect(() => {
    fetchAiPrompts();
  }, [user]);

  return { 
    aiPrompts, 
    loading, 
    createAiPrompt,
    deleteAiPrompt,
    refetch: fetchAiPrompts,
    getAccessLimits: () => getAccessLimits(profile?.access_level || 'FREE')
  };
};
