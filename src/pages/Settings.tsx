
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Crown } from 'lucide-react';

const Settings = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || ''
  });

  React.useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || ''
      });
    }
  }, [profile]);

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'FREE': return 'bg-gray-100 text-gray-800';
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'PRO': return 'bg-blue-100 text-blue-800';
      case 'BUSINESS': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProfileUpdate = async () => {
    setIsUpdating(true);
    await updateProfile(profileData);
    setIsUpdating(false);
  };

  const handlePasswordReset = async () => {
    if (!profile?.email) {
      toast({
        title: "Error",
        description: "Email address not found",
        variant: "destructive"
      });
      return;
    }

    setIsSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${window.location.origin}/settings`
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a password reset link"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive"
      });
    } finally {
      setIsSendingReset(false);
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

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {profile.full_name?.charAt(0) || profile.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{profile.full_name || 'No name set'}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {profile.email}
              </p>
            </div>
            <Badge className={getAccessLevelColor(profile.access_level)}>
              <Crown className="w-3 h-3 mr-1" />
              {profile.access_level}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profileData.full_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                value={profile.email || ''}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed for security reasons
              </p>
            </div>
          </div>

          <Button 
            onClick={handleProfileUpdate} 
            disabled={isUpdating}
            className="w-full md:w-auto"
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">
                Send a secure password reset link to your email
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handlePasswordReset}
              disabled={isSendingReset}
            >
              {isSendingReset ? 'Sending...' : 'Reset Password'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Account Created</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Last Updated</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(profile.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-2">
            <Label>Access Level</Label>
            <div className="flex items-center gap-2">
              <Badge className={getAccessLevelColor(profile.access_level)}>
                <Crown className="w-3 h-3 mr-1" />
                {profile.access_level}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {profile.access_level === 'FREE' && 'Basic features available'}
                {profile.access_level === 'BEGINNER' && 'Enhanced features available'}
                {profile.access_level === 'PRO' && 'Advanced features available'}
                {profile.access_level === 'BUSINESS' && 'All features available'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
