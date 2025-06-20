
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import ScheduleForm from '@/components/ScheduleForm';
import SchedulesList from '@/components/SchedulesList';
import { useProfile } from '@/hooks/useProfile';
import { useRssFeeds } from '@/hooks/useRssFeeds';
import { useAiPrompts } from '@/hooks/useAiPrompts';
import { useXCredentials } from '@/hooks/useXCredentials';

const System = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { profile } = useProfile();
  const { rssFeeds } = useRssFeeds();
  const { aiPrompts } = useAiPrompts();
  const { xCredentials } = useXCredentials();

  const handleScheduleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const hasRequiredData = rssFeeds.length > 0 && aiPrompts.length > 0 && xCredentials.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System</h1>
        <p className="text-muted-foreground">Create and manage your automated posting schedules</p>
      </div>

      {!hasRequiredData && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            To create schedules, you need at least one RSS feed, AI prompt, and X account configured. 
            Please set these up in their respective pages first.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {hasRequiredData && (
          <ScheduleForm onSuccess={handleScheduleSuccess} />
        )}
        
        <SchedulesList key={refreshKey} onRefresh={handleScheduleSuccess} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Level Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-green-600">FREE</h3>
              <p className="text-sm text-muted-foreground mt-1">
                • 1 schedule<br/>
                • 60+ minute intervals
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-blue-600">BEGINNER</h3>
              <p className="text-sm text-muted-foreground mt-1">
                • 2 schedules<br/>
                • 30+ minute intervals
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-purple-600">PRO</h3>
              <p className="text-sm text-muted-foreground mt-1">
                • 5 schedules<br/>
                • 15+ minute intervals
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-orange-600">BUSINESS</h3>
              <p className="text-sm text-muted-foreground mt-1">
                • 10 schedules<br/>
                • 5+ minute intervals
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Your current plan: <span className="font-semibold">{profile?.access_level || 'FREE'}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default System;
