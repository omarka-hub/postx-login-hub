
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProfile } from '@/hooks/useProfile';
import { User, Crown, Calendar, Clock, Check, Star } from 'lucide-react';

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

  const getPlanFeatures = (accessLevel: string) => {
    switch (accessLevel) {
      case 'FREE':
        return {
          credits: 20,
          aiPrompts: 1,
          xAccounts: 1,
          features: [
            'Basic automation features',
            'Standard posting schedules',
            'Community support',
            'Basic analytics'
          ]
        };
      case 'BEGINNER':
        return {
          credits: 150,
          aiPrompts: 2,
          xAccounts: 2,
          features: [
            'Enhanced automation features',
            'Advanced posting schedules',
            'Email support',
            'Detailed analytics',
            'Custom post templates',
            'RSS feed integration'
          ]
        };
      case 'PRO':
        return {
          credits: 300,
          aiPrompts: 5,
          xAccounts: 5,
          features: [
            'Professional automation suite',
            'Advanced AI post generation',
            'Priority support',
            'Advanced analytics dashboard',
            'Custom branding options',
            'Multiple RSS feeds',
            'Bulk operations',
            'API access'
          ]
        };
      case 'BUSINESS':
        return {
          credits: 500,
          aiPrompts: 10,
          xAccounts: 10,
          features: [
            'Enterprise automation suite',
            'Advanced AI with custom models',
            'Dedicated account manager',
            'Enterprise analytics',
            'White-label options',
            'Unlimited RSS feeds',
            'Advanced API access',
            'Custom integrations',
            'Team collaboration tools',
            'Priority feature requests'
          ]
        };
      default:
        return {
          credits: 20,
          aiPrompts: 1,
          xAccounts: 1,
          features: ['Basic features access']
        };
    }
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

  const planFeatures = getPlanFeatures(profile.access_level);

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Account Settings</h1>
        <p className="text-lg text-gray-600">Manage your account information and subscription preferences</p>
      </div>

      {/* Profile Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-4 text-xl">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{profile.full_name || 'User Account'}</h2>
              <p className="text-lg text-muted-foreground font-normal">{profile.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Badge className={`${getAccessLevelColor(profile.access_level)} text-lg px-4 py-2 font-bold`}>
              <Crown className="w-5 h-5 mr-2" />
              {profile.access_level} PLAN
            </Badge>
            <span className="text-base text-muted-foreground">
              {profile.access_level === 'FREE' && 'Perfect for getting started with automation'}
              {profile.access_level === 'BEGINNER' && 'Great for growing your social presence'}
              {profile.access_level === 'PRO' && 'Ideal for professional content creators'}
              {profile.access_level === 'BUSINESS' && 'Enterprise-grade automation solution'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-6 h-6 text-blue-600" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                <Calendar className="w-4 h-4" />
                Account Created
              </div>
              <p className="text-xl font-bold text-blue-900">
                {formatDate(profile.created_at)}
              </p>
            </div>
            <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
                <Clock className="w-4 h-4" />
                Last Updated
              </div>
              <p className="text-xl font-bold text-purple-900">
                {formatDate(profile.updated_at)}
              </p>
            </div>
          </div>

          <Separator />
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h3 className="font-bold text-2xl text-gray-900">Subscription Benefits</h3>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">Plan Limits</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{planFeatures.credits} API Credits per month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{planFeatures.aiPrompts} AI Prompt storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{planFeatures.xAccounts} X Account credentials</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">Features Included</h4>
                  <div className="space-y-2">
                    {planFeatures.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
