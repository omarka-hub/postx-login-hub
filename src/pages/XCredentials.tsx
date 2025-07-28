
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useXCredentials } from '@/hooks/useXCredentials';
import { useProfile } from '@/hooks/useProfile';
import { Trash2, Key, Twitter, Plus, Calendar, Activity } from 'lucide-react';

interface XCredential {
  id: string;
  account_name: string;
  created_at: string;
}

const XCredentials = () => {
  const { xCredentials, loading, createXCredential, deleteXCredential, getAccessLimits } = useXCredentials();
  const { profile } = useProfile();

  const [formData, setFormData] = useState({
    account_name: '',
    api_key: '',
    api_secret: '',
    access_token: '',
    access_token_secret: '',
    bearer_token: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleSaveCredentials = async () => {
    if (!formData.account_name.trim() || !formData.api_key.trim() || 
        !formData.api_secret.trim() || !formData.access_token.trim() || 
        !formData.access_token_secret.trim() || !formData.bearer_token.trim()) {
      return;
    }

    setIsCreating(true);
    await createXCredential({
      account_name: formData.account_name.trim(),
      api_key: formData.api_key.trim(),
      api_secret_key: formData.api_secret.trim(),
      access_token: formData.access_token.trim(),
      access_token_secret: formData.access_token_secret.trim(),
      bearer_token: formData.bearer_token.trim(),
      latest_post: null
    });
    setFormData({
      account_name: '',
      api_key: '',
      api_secret: '',
      access_token: '',
      access_token_secret: '',
      bearer_token: ''
    });
    setIsCreating(false);
  };

  const handleDeleteCredentials = async (credentialId: string) => {
    setIsDeleting(credentialId);
    await deleteXCredential(credentialId);
    setIsDeleting(null);
  };

  const limits = getAccessLimits();
  const isLoading = loading;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
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
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">X Credentials</h1>
        <p className="text-lg text-gray-600">Manage your X (Twitter) API credentials for automated posting</p>
        <p className="text-sm text-gray-500 mt-2">
          {xCredentials.length}/{limits.maxXAccounts} X account{limits.maxXAccounts === 1 ? '' : 's'} used ({profile?.access_level || 'FREE'} plan)
        </p>
      </div>

      {/* Add X Credentials Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 animate-slide-in-right">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            Add X Credentials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="account-name" className="text-sm font-semibold text-gray-700">Account Name</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="account-name"
                  placeholder="Enter account name"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-sm font-semibold text-gray-700">API Key</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter API key"
                  value={formData.api_key}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-secret" className="text-sm font-semibold text-gray-700">API Secret</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="api-secret"
                  type="password"
                  placeholder="Enter API secret"
                  value={formData.api_secret}
                  onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-token" className="text-sm font-semibold text-gray-700">Access Token</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="access-token"
                  type="password"
                  placeholder="Enter access token"
                  value={formData.access_token}
                  onChange={(e) => setFormData({ ...formData, access_token: e.target.value })}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-token-secret" className="text-sm font-semibold text-gray-700">Access Token Secret</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="access-token-secret"
                  type="password"
                  placeholder="Enter access token secret"
                  value={formData.access_token_secret}
                  onChange={(e) => setFormData({ ...formData, access_token_secret: e.target.value })}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bearer-token" className="text-sm font-semibold text-gray-700">Bearer Token</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="bearer-token"
                  type="password"
                  placeholder="Enter bearer token"
                  value={formData.bearer_token}
                  onChange={(e) => setFormData({ ...formData, bearer_token: e.target.value })}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
          <Button 
            onClick={handleSaveCredentials}
            disabled={isCreating || Object.values(formData).some(val => !val.trim()) || xCredentials.length >= limits.maxXAccounts}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : xCredentials.length >= limits.maxXAccounts ? (
              `Limit Reached (${limits.maxXAccounts})`
            ) : (
              'Save X Credentials'
            )}
          </Button>
          {xCredentials.length >= limits.maxXAccounts && (
            <p className="text-sm text-red-600">
              You've reached the maximum number of X accounts for your {profile?.access_level || 'FREE'} plan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Saved X Credentials */}
      <Card className="border-0 shadow-lg animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            Saved X Credentials ({xCredentials.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {xCredentials.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Twitter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No X credentials yet</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Add your first X API credentials above to start posting automatically to your X accounts.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {xCredentials.map((credential, index) => (
                <div
                  key={credential.id}
                  className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 shadow-sm hover:shadow-md animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Twitter className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{credential.account_name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Added on {formatDate(credential.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCredentials(credential.id)}
                    disabled={isDeleting === credential.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-3 rounded-lg transition-colors"
                  >
                    {isDeleting === credential.id ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default XCredentials;
