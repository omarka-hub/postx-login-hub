
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Schedule {
  id: string;
  user_id: string;
  name: string;
  rss_feed_id: string;
  ai_prompt_id: string;
  x_account_id: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  image_option: boolean;
  video_option: boolean;
  start_time_utc: string;
  end_time_utc: string;
  timezone: string;
  minute_intervals: number;
  last_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();

  const fetchSchedules = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        title: "Error",
        description: "Failed to load schedules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (scheduleData: Omit<Schedule, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_url'>) => {
    if (!user) return;

    // Check access level limits
    const limits = getAccessLimits(profile?.access_level || 'FREE');
    
    if (schedules.length >= limits.maxSchedules) {
      toast({
        title: "Limit Reached",
        description: `${profile?.access_level} accounts can only create ${limits.maxSchedules} schedule(s)`,
        variant: "destructive"
      });
      return;
    }

    if (scheduleData.minute_intervals < limits.minInterval) {
      toast({
        title: "Invalid Interval",
        description: `${profile?.access_level} accounts require minimum ${limits.minInterval} minute intervals`,
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('schedules')
        .insert([{ 
          ...scheduleData, 
          user_id: user.id,
          last_url: null
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Schedule created successfully"
      });
      
      fetchSchedules();
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast({
        title: "Error",
        description: "Failed to create schedule",
        variant: "destructive"
      });
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Schedule deleted successfully"
      });
      
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Error",
        description: "Failed to delete schedule",
        variant: "destructive"
      });
    }
  };

  const getAccessLimits = (accessLevel: string) => {
    switch (accessLevel) {
      case 'FREE':
        return { maxSchedules: 1, minInterval: 60 };
      case 'BEGINNER':
        return { maxSchedules: 2, minInterval: 30 };
      case 'PRO':
        return { maxSchedules: 5, minInterval: 15 };
      case 'BUSINESS':
        return { maxSchedules: 10, minInterval: 5 };
      case 'STUDENT':
        return { maxSchedules: 2, minInterval: 30 };
      default:
        return { maxSchedules: 1, minInterval: 60 };
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [user]);

  return { 
    schedules, 
    loading, 
    createSchedule, 
    deleteSchedule, 
    refetch: fetchSchedules,
    getAccessLimits: () => getAccessLimits(profile?.access_level || 'FREE')
  };
};
