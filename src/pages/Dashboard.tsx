
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/hooks/useDashboard';
import { useProfile } from '@/hooks/useProfile';
import { useXCredentials } from '@/hooks/useXCredentials';
import CreditsBar from '@/components/CreditsBar';
import LatestPosts from '@/components/LatestPosts';
import { Bot, Rss, Twitter, Activity } from 'lucide-react';

const Dashboard = () => {
  const { dashboard, loading: dashboardLoading } = useDashboard();
  const { profile } = useProfile();
  const { xCredentials } = useXCredentials();

  if (dashboardLoading || !profile || !dashboard) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96"></div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  const getMaxCredits = (accessLevel: string) => {
    switch (accessLevel) {
      case 'FREE': return 20;
      case 'BEGINNER': return 150;
      case 'PRO': return 300;
      case 'BUSINESS': return 5000;
      case 'STUDENT': return 500;
      default: return 20;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border animate-scale-in">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
        <p className="text-lg text-blue-600">Welcome back! Here's what's happening with your PostX account</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-in-right">
        {/* Credits Bar */}
        <div className="lg:col-span-2">
          <CreditsBar 
            currentCredits={dashboard.current_credits}
            maxCredits={getMaxCredits(profile.access_level)}
            accessLevel={profile.access_level}
          />
        </div>
        
        {/* Quick Stats */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover-scale">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700">X Accounts</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{xCredentials.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-medium text-gray-700">Current Credits</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">{dashboard.current_credits}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Rss className="w-5 h-5 text-orange-600" />
                </div>
                <span className="font-medium text-gray-700">Plan Level</span>
              </div>
              <span className="text-lg font-bold text-orange-600">{profile.access_level}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Posts */}
      <div className="w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <LatestPosts xCredentials={xCredentials} />
      </div>
    </div>
  );
};

export default Dashboard;
