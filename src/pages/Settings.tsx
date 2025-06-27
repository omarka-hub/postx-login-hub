
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProfile } from '@/hooks/useProfile';
import { User, Crown, Calendar, Clock, Check, Star, Twitter, ExternalLink, Key, Shield, Globe, Code } from 'lucide-react';

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

      {/* X API Credentials Guide */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Twitter className="w-6 h-6 text-white" />
            </div>
            How to Get Your X (Twitter) API v2 Credentials
          </CardTitle>
          <p className="text-blue-100 text-lg">Follow this step-by-step guide to obtain your X API credentials for PostX integration</p>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Create a Developer Account
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Visit the <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-medium">X Developer Portal</a> and sign up for a developer account. You'll need to provide information about how you plan to use the API.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">2</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                Create a New App
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Once approved, create a new app in your developer dashboard. Give it a descriptive name like "PostX Integration" and provide a brief description of its purpose.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">3</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Configure App Settings
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  In your app settings, configure the following URLs:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                  <div>
                    <span className="font-semibold text-gray-900">Website URL:</span>
                    <code className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">https://app.postx.cloud</code>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Callback URL:</span>
                    <code className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">https://api.postx.cloud</code>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Important:</strong> Make sure to enable "Read and Write" permissions for your app to allow PostX to post tweets on your behalf.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">4</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                Generate Your API Keys
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  Navigate to the "Keys and tokens" tab in your app settings and generate the following credentials:
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Consumer Keys</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• API Key (Consumer Key)</li>
                      <li>• API Secret Key (Consumer Secret)</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Authentication Tokens</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Access Token</li>
                      <li>• Access Token Secret</li>
                      <li>• Bearer Token</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-green-600" />
                Add Credentials to PostX
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Copy all the generated credentials and add them to PostX through the X Credentials page. Make sure to keep these credentials secure and never share them publicly.
              </p>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Important Security Notes
            </h4>
            <ul className="text-yellow-700 space-y-2">
              <li>• Never share your API credentials with anyone</li>
              <li>• Store them securely and avoid committing them to version control</li>
              <li>• Regularly rotate your credentials for enhanced security</li>
              <li>• Monitor your API usage in the X Developer Portal</li>
              <li>• Only grant the minimum required permissions</li>
            </ul>
          </div>

          {/* Need Help Section */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-3">Need Help?</h4>
            <p className="text-blue-700 mb-3">
              If you encounter any issues while setting up your X API credentials, here are some helpful resources:
            </p>
            <div className="space-y-2">
              <a href="https://developer.twitter.com/en/docs/twitter-api" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline">
                <ExternalLink className="w-4 h-4" />
                X API Documentation
              </a>
              <a href="https://developer.twitter.com/en/support" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline">
                <ExternalLink className="w-4 h-4" />
                X Developer Support
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
