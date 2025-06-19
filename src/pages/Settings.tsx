
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProfile } from '@/hooks/useProfile';
import { User, Crown, Calendar, Clock } from 'lucide-react';

const Settings = () => {
  const { profile, loading } = useProfile();

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'FREE': return 'bg-gray-100 text-gray-800';
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'PRO': return 'bg-blue-100 text-blue-800';
      case 'BUSINESS': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Loading your account settings...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Unable to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account information and preferences</p>
      </div>

      {/* Profile Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{profile.full_name || 'User Account'}</h2>
              <p className="text-sm text-muted-foreground font-normal">{profile.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge className={`${getAccessLevelColor(profile.access_level)} text-sm px-3 py-1`}>
              <Crown className="w-4 h-4 mr-2" />
              {profile.access_level} PLAN
            </Badge>
            <span className="text-sm text-muted-foreground">
              {profile.access_level === 'FREE' && 'Basic features available'}
              {profile.access_level === 'BEGINNER' && 'Enhanced features available'}
              {profile.access_level === 'PRO' && 'Advanced features available'}
              {profile.access_level === 'BUSINESS' && 'All features available'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-blue-600" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Calendar className="w-4 h-4" />
                Account Created
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(profile.created_at)}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Clock className="w-4 h-4" />
                Last Updated
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(profile.updated_at)}
              </p>
            </div>
          </div>

          <Separator />
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-lg mb-2">Subscription Benefits</h3>
            <div className="grid gap-3 text-sm">
              {profile.access_level === 'FREE' && (
                <ul className="space-y-1 text-gray-600">
                  <li>• 1 AI Prompt storage</li>
                  <li>• 1 X Account credential</li>
                  <li>• Basic features access</li>
                </ul>
              )}
              {profile.access_level === 'BEGINNER' && (
                <ul className="space-y-1 text-gray-600">
                  <li>• 2 AI Prompt storage</li>
                  <li>• 2 X Account credentials</li>
                  <li>• Enhanced features access</li>
                </ul>
              )}
              {profile.access_level === 'PRO' && (
                <ul className="space-y-1 text-gray-600">
                  <li>• 5 AI Prompt storage</li>
                  <li>• 5 X Account credentials</li>
                  <li>• Advanced features access</li>
                  <li>• Priority support</li>
                </ul>
              )}
              {profile.access_level === 'BUSINESS' && (
                <ul className="space-y-1 text-gray-600">
                  <li>• 10 AI Prompt storage</li>
                  <li>• 10 X Account credentials</li>
                  <li>• All features access</li>
                  <li>• Priority support</li>
                  <li>• Advanced analytics</li>
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
