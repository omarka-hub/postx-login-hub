
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/hooks/useDashboard';
import { useProfile } from '@/hooks/useProfile';
import { useXCredentials } from '@/hooks/useXCredentials';
import CreditsBar from '@/components/CreditsBar';
import LatestPosts from '@/components/LatestPosts';
import { Bot, Rss, Settings as SettingsIcon, Twitter } from 'lucide-react';

const Dashboard = () => {
  const { dashboard, loading: dashboardLoading } = useDashboard();
  const { profile } = useProfile();
  const { xCredentials } = useXCredentials();

  if (dashboardLoading || !profile || !dashboard) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your PostX dashboard</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Credits Bar */}
        <div className="lg:col-span-2">
          <CreditsBar 
            currentCredits={dashboard.current_credits}
            maxCredits={profile.access_level === 'FREE' ? 20 : 
                        profile.access_level === 'BEGINNER' ? 150 :
                        profile.access_level === 'PRO' ? 300 : 500}
            accessLevel={profile.access_level}
          />
        </div>
        
        {/* Quick Stats */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Twitter className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-600">X Accounts</span>
              </div>
              <span className="font-semibold">{xCredentials.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">AI Prompts</span>
              </div>
              <span className="font-semibold">-</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rss className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-600">RSS Feeds</span>
              </div>
              <span className="font-semibold">-</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Posts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LatestPosts xCredentials={xCredentials} />
        </div>
        
        {/* System Status */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <SettingsIcon className="w-5 h-5 text-gray-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Schedules</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">RSS Feeds</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Syncing</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
