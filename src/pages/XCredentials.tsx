
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Twitter, Plus, Trash2, Key, Shield, Eye, EyeOff } from 'lucide-react';

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">X Credentials</h1>
          <p className="text-muted-foreground">Loading your X credentials...</p>
        </div>
      </div>
    );
  }

  const credentialLimit = profile ? getCredentialLimit(profile.access_level) : 1;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Twitter className="w-8 h-8 text-blue-400" />
          X API Credentials
        </h1>
        <p className="text-muted-foreground mt-2">Manage your X (Twitter) API credentials securely</p>
      </div>

      {/* Add New Credentials */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Add X Account Credentials
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {credentials.length}/{credentialLimit} accounts used
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="account-name" className="text-sm font-medium">Account Name</Label>
            <Input
              id="account-name"
              placeholder="Enter a name for this X account"
              value={formData.account_name}
              onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
              className="h-12"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bearer-token" className="text-sm font-medium">Bearer Token</Label>
              <Input
                id="bearer-token"
                type="password"
                placeholder="Enter bearer token"
                value={formData.bearer_token}
                onChange={(e) => setFormData(prev => ({ ...prev, bearer_token: e.target.value }))}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-sm font-medium">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter API key"
                value={formData.api_key}
                onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-secret" className="text-sm font-medium">API Secret Key</Label>
              <Input
                id="api-secret"
                type="password"
                placeholder="Enter API secret key"
                value={formData.api_secret_key}
                onChange={(e) => setFormData(prev => ({ ...prev, api_secret_key: e.target.value }))}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="access-token" className="text-sm font-medium">Access Token</Label>
              <Input
                id="access-token"
                type="password"
                placeholder="Enter access token"
                value={formData.access_token}
                onChange={(e) => setFormData(prev => ({ ...prev, access_token: e.target.value }))}
                className="h-12"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="access-token-secret" className="text-sm font-medium">Access Token Secret</Label>
              <Input
                id="access-token-secret"
                type="password"
                placeholder="Enter access token secret"
                value={formData.access_token_secret}
                onChange={(e) => setFormData(prev => ({ ...prev, access_token_secret: e.target.value }))}
                className="h-12"
              />
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving || credentials.length >= credentialLimit}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save X Credentials'}
          </Button>
        </CardContent>
      </Card>

      {/* Saved Credentials */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-600" />
            Saved X Credentials
          </CardTitle>
        </CardHeader>
        <CardContent>
          {credentials.length === 0 ? (
            <div className="text-center py-12">
              <Twitter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No X credentials yet</h3>
              <p className="text-gray-500">Add your first X account credentials to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {credentials.map((credential) => (
                <Card key={credential.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{credential.account_name}</CardTitle>
                        <p className="text-xs text-gray-500">
                          Added {new Date(credential.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(credential.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid gap-3 text-xs">
                      {[
                        { label: 'Bearer Token', value: credential.bearer_token, field: 'bearer_token' },
                        { label: 'API Key', value: credential.api_key, field: 'api_key' },
                        { label: 'API Secret', value: credential.api_secret_key, field: 'api_secret_key' },
                        { label: 'Access Token', value: credential.access_token, field: 'access_token' },
                        { label: 'Access Token Secret', value: credential.access_token_secret, field: 'access_token_secret' }
                      ].map(({ label, value, field }) => {
                        const key = `${credential.id}-${field}`;
                        const isVisible = showSecrets[key];
                        return (
                          <div key={field} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="font-medium text-gray-600">{label}:</span>
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-white px-2 py-1 rounded border">
                                {isVisible ? value : maskSecret(value)}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleShowSecret(credential.id, field)}
                                className="h-6 w-6 p-0"
                              >
                                {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </Button>
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
  );
};

export default XCredentials;
