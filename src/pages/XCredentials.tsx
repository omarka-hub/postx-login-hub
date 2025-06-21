import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Twitter, Plus, Trash2, Key, Shield, Eye, EyeOff, Lock, Users } from 'lucide-react';

interface XCredential {
  id: string;
  account_name: string;
  bearer_token: string;
  api_key: string;
  api_secret_key: string;
  access_token: string;
  access_token_secret: string;
  created_at: string;
}

const XCredentials = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<XCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});
  const [formData, setFormData] = useState({
    account_name: '',
    bearer_token: '',
    api_key: '',
    api_secret_key: '',
    access_token: '',
    access_token_secret: ''
  });

  const getCredentialLimit = (accessLevel: string) => {
    switch (accessLevel) {
      case 'FREE': return 1;
      case 'BEGINNER': return 2;
      case 'PRO': return 5;
      case 'BUSINESS': return 10;
      default: return 1;
    }
  };

  const fetchCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from('x_credentials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCredentials(data || []);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      toast({
        title: "Error",
        description: "Failed to load X credentials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    const requiredFields = ['account_name', 'bearer_token', 'api_key', 'api_secret_key', 'access_token', 'access_token_secret'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData].trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: "Please fill in all credential fields",
        variant: "destructive"
      });
      return;
    }

    const limit = getCredentialLimit(profile.access_level);
    if (credentials.length >= limit) {
      toast({
        title: "Limit Reached",
        description: `You can only save ${limit} X account(s) with your ${profile.access_level} plan`,
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('x_credentials')
        .insert({
          user_id: profile.id,
          account_name: formData.account_name.trim(),
          bearer_token: formData.bearer_token.trim(),
          api_key: formData.api_key.trim(),
          api_secret_key: formData.api_secret_key.trim(),
          access_token: formData.access_token.trim(),
          access_token_secret: formData.access_token_secret.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "X credentials saved successfully"
      });

      setFormData({
        account_name: '',
        bearer_token: '',
        api_key: '',
        api_secret_key: '',
        access_token: '',
        access_token_secret: ''
      });
      fetchCredentials();
    } catch (error) {
      console.error('Error saving credentials:', error);
      toast({
        title: "Error",
        description: "Failed to save X credentials",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('x_credentials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "X credentials deleted successfully"
      });

      fetchCredentials();
    } catch (error) {
      console.error('Error deleting credentials:', error);
      toast({
        title: "Error",
        description: "Failed to delete X credentials",
        variant: "destructive"
      });
    }
  };

  const toggleShowSecret = (credentialId: string, field: string) => {
    const key = `${credentialId}-${field}`;
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const maskSecret = (secret: string) => {
    return '*'.repeat(secret.length - 4) + secret.slice(-4);
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Twitter className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                X API Credentials
              </h1>
              <p className="text-gray-600 text-lg">Loading your X credentials...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const credentialLimit = profile ? getCredentialLimit(profile.access_level) : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Twitter className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              X API Credentials
            </h1>
            <p className="text-gray-600 text-lg">Manage your X (Twitter) API credentials securely</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Twitter className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{credentials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{credentialLimit - credentials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan Limit</p>
                  <p className="text-2xl font-bold text-gray-900">{credentialLimit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Credentials */}
        <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Add X Account Credentials</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs font-medium">
                    {credentials.length}/{credentialLimit} accounts used
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {profile?.access_level || 'FREE'} Plan
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="account-name" className="text-sm font-semibold text-gray-700">
                Account Name
              </Label>
              <Input
                id="account-name"
                placeholder="Enter a name for this X account"
                value={formData.account_name}
                onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="bearer-token" className="text-sm font-semibold text-gray-700">
                  Bearer Token
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="bearer-token"
                    type="password"
                    placeholder="Enter bearer token"
                    value={formData.bearer_token}
                    onChange={(e) => setFormData(prev => ({ ...prev, bearer_token: e.target.value }))}
                    className="h-12 pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="api-key" className="text-sm font-semibold text-gray-700">
                  API Key
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter API key"
                    value={formData.api_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                    className="h-12 pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="api-secret" className="text-sm font-semibold text-gray-700">
                  API Secret Key
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="api-secret"
                    type="password"
                    placeholder="Enter API secret key"
                    value={formData.api_secret_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, api_secret_key: e.target.value }))}
                    className="h-12 pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="access-token" className="text-sm font-semibold text-gray-700">
                  Access Token
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="access-token"
                    type="password"
                    placeholder="Enter access token"
                    value={formData.access_token}
                    onChange={(e) => setFormData(prev => ({ ...prev, access_token: e.target.value }))}
                    className="h-12 pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="access-token-secret" className="text-sm font-semibold text-gray-700">
                  Access Token Secret
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="access-token-secret"
                    type="password"
                    placeholder="Enter access token secret"
                    value={formData.access_token_secret}
                    onChange={(e) => setFormData(prev => ({ ...prev, access_token_secret: e.target.value }))}
                    className="h-12 pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={saving || credentials.length >= credentialLimit}
              className="w-full md:w-auto h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Shield className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save X Credentials'}
            </Button>
          </CardContent>
        </Card>

        {/* Saved Credentials */}
        <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Saved X Credentials</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {credentials.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Twitter className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No X credentials yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">Add your first X account credentials to start posting to Twitter</p>
              </div>
            ) : (
              <div className="space-y-6">
                {credentials.map((credential) => (
                  <Card key={credential.id} className="border border-gray-200 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-blue-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Twitter className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold">{credential.account_name}</CardTitle>
                            <p className="text-xs text-gray-500">
                              Added {new Date(credential.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(credential.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {[
                          { label: 'Bearer Token', value: credential.bearer_token, field: 'bearer_token', icon: Lock },
                          { label: 'API Key', value: credential.api_key, field: 'api_key', icon: Key },
                          { label: 'API Secret', value: credential.api_secret_key, field: 'api_secret_key', icon: Shield },
                          { label: 'Access Token', value: credential.access_token, field: 'access_token', icon: Key },
                          { label: 'Access Token Secret', value: credential.access_token_secret, field: 'access_token_secret', icon: Lock }
                        ].map(({ label, value, field, icon: Icon }) => {
                          const key = `${credential.id}-${field}`;
                          const isVisible = showSecrets[key];
                          return (
                            <div key={field} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-100">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4 text-gray-500" />
                                  <span className="font-semibold text-gray-700 text-sm">{label}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleShowSecret(credential.id, field)}
                                  className="h-6 w-6 p-0 hover:bg-white/50 rounded-lg"
                                >
                                  {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </Button>
                              </div>
                              <div className="bg-white p-3 rounded-lg border shadow-sm">
                                <code className="text-xs font-mono text-gray-800 break-all leading-relaxed">
                                  {isVisible ? value : maskSecret(value)}
                                </code>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default XCredentials;
