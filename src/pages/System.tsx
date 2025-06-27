
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScheduleForm from '@/components/ScheduleForm';
import SchedulesList from '@/components/SchedulesList';
import { useSchedules } from '@/hooks/useSchedules';
import { Settings, Calendar, Activity } from 'lucide-react';

const System = () => {
  const { schedules, loading, refetch } = useSchedules();

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96"></div>
        </div>
        
        <div className="space-y-6">
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border animate-scale-in">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">System Schedules</h1>
        <p className="text-lg text-gray-600">Create and manage your automated posting schedules</p>
      </div>

      <div className="animate-slide-in-right">
        <ScheduleForm onSuccess={refetch} />
      </div>

      <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
        <SchedulesList schedules={schedules} />
      </div>
    </div>
  );
};

export default System;
