
import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface DashboardData {
  id: string;
  user_id: string;
  current_credits: number;
  created_at: string;
  updated_at: string;
}

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();

  const getMaxCredits = (accessLevel: string) => {
    switch (accessLevel) {
      case 'FREE': return 20;
      case 'BEGINNER': return 150;
      case 'PRO': return 300;
      case 'BUSINESS': return 500;
      default: return 20;
    }
  };

  const fetchDashboard = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('dashboard')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Dashboard doesn't exist, create it
        if (profile) {
          const maxCredits = getMaxCredits(profile.access_level);
          const { data: newDashboard, error: insertError } = await supabase
            .from('dashboard')
            .insert({
              user_id: user.id,
              current_credits: maxCredits
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setDashboard(newDashboard);
        }
      } else if (error) {
        throw error;
      } else {
        setDashboard(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchDashboard();
    }
  }, [user, profile]);

  return { 
    dashboard, 
    loading, 
    maxCredits: profile ? getMaxCredits(profile.access_level) : 20, 
    refetch: fetchDashboard 
  };
};
