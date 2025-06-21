
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, Cpu, Clock, Users, Zap, Star, Crown } from 'lucide-react';
import ScheduleForm from '@/components/ScheduleForm';
import SchedulesList from '@/components/SchedulesList';
import { useProfile } from '@/hooks/useProfile';
import { useRssFeeds } from '@/hooks/useRssFeeds';
import { useAiPrompts } from '@/hooks/useAiPrompts';
import { useXCredentials } from '@/hooks/useXCredentials';
import { useSchedules } from '@/hooks/useSchedules';

const System = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { profile } = useProfile();
  const { rssFeeds } = useRssFeeds();
  const { aiPrompts } = useAiPrompts();
  const { xCredentials } = useXCredentials();
  const { schedules } = useSchedules();

  const handleScheduleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const hasRequiredData = rssFeeds.length > 0 && aiPrompts.length > 0 && xCredentials.length > 0;

  const getPlanIcon = (level: string) => {
    switch (level) {
      case 'FREE': return <Users className="w-5 h-5" />;
      case 'BEGINNER': return <Zap className="w-5 h-5" />;
      case 'PRO': return <Star className="w-5 h-5" />;
      case 'BUSINESS': return <Crown className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getPlanColor = (level: string) => {
    switch (level) {
      case 'FREE': return 'from-green-500 to-emerald-500';
      case 'BEGINNER': return 'from-blue-500 to-cyan-500';
      case 'PRO': return 'from-purple-500 to-violet-500';
      case 'BUSINESS': return 'from-orange-500 to-amber-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              System Control
            </h1>
            <p className="text-gray-600 text-lg">Create and manage your automated posting schedules</p>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Schedules</p>
                  <p className="text-2xl font-bold text-gray-900">{schedules?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <InfoIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">RSS Feeds</p>
                  <p className="text-2xl font-bold text-gray-900">{rssFeeds.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">X Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{xCredentials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Prompts</p>
                  <p className="text-2xl font-bold text-gray-900">{aiPrompts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requirements Alert */}
        {!hasRequiredData && (
          <Alert className="border-0 shadow-lg bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-500">
            <InfoIcon className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-800 font-medium">
              To create schedules, you need at least one RSS feed, AI prompt, and X account configured. 
              Please set these up in their respective pages first.
            </AlertDescription>
          </Alert>
        )}

        {/* Schedule Management */}
        <div className="grid gap-8">
          {hasRequiredData && (
            <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-xl">Create New Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <ScheduleForm onSuccess={handleScheduleSuccess} />
              </CardContent>
            </Card>
          )}
          
          <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardTitle className="text-xl">Active Schedules</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <SchedulesList key={refreshKey} onRefresh={handleScheduleSuccess} />
            </CardContent>
          </Card>
        </div>

        {/* Plan Information */}
        <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <CardTitle className="text-xl">Access Level Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { level: 'FREE', schedules: 1, interval: '60+ minutes', color: 'from-green-500 to-emerald-500' },
                { level: 'BEGINNER', schedules: 2, interval: '30+ minutes', color: 'from-blue-500 to-cyan-500' },
                { level: 'PRO', schedules: 5, interval: '15+ minutes', color: 'from-purple-500 to-violet-500' },
                { level: 'BUSINESS', schedules: 10, interval: '5+ minutes', color: 'from-orange-500 to-amber-500' }
              ].map(({ level, schedules, interval, color }) => (
                <Card key={level} className={`border-2 ${profile?.access_level === level ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-200'} hover:shadow-lg transition-all duration-200`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white`}>
                        {getPlanIcon(level)}
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                          {level}
                        </h3>
                        {profile?.access_level === level && (
                          <Badge className="text-xs">Current Plan</Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• {schedules} schedule{schedules > 1 ? 's' : ''}</p>
                      <p>• {interval} intervals</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800 font-medium">
                Your current plan: <span className="font-bold">{profile?.access_level || 'FREE'}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default System;
