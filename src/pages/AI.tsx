
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bot, Plus, Trash2, Edit3, Save, Sparkles, Brain } from 'lucide-react';

interface AIPrompt {
  id: string;
  name: string;
  prompt: string;
  created_at: string;
}

const AI = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    prompt: ''
  });

  const getPromptLimit = (accessLevel: string) => {
    switch (accessLevel) {
      case 'FREE': return 1;
      case 'BEGINNER': return 2;
      case 'PRO': return 5;
      case 'BUSINESS': return 10;
      default: return 1;
    }
  };

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      toast({
        title: "Error",
        description: "Failed to load AI prompts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    if (!formData.name.trim() || !formData.prompt.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and prompt fields",
        variant: "destructive"
      });
      return;
    }

    const limit = getPromptLimit(profile.access_level);
    if (prompts.length >= limit) {
      toast({
        title: "Limit Reached",
        description: `You can only save ${limit} AI prompt(s) with your ${profile.access_level} plan`,
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('ai_prompts')
        .insert({
          user_id: profile.id,
          name: formData.name.trim(),
          prompt: formData.prompt.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI prompt saved successfully"
      });

      setFormData({ name: '', prompt: '' });
      fetchPrompts();
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast({
        title: "Error",
        description: "Failed to save AI prompt",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI prompt deleted successfully"
      });

      fetchPrompts();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast({
        title: "Error",
        description: "Failed to delete AI prompt",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Prompts
              </h1>
              <p className="text-gray-600 text-lg">Loading your AI prompts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const promptLimit = profile ? getPromptLimit(profile.access_level) : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Prompts
            </h1>
            <p className="text-gray-600 text-lg">Create and manage your AI prompts for intelligent content generation</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Prompts</p>
                  <p className="text-2xl font-bold text-gray-900">{prompts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{promptLimit - prompts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan Limit</p>
                  <p className="text-2xl font-bold text-gray-900">{promptLimit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Prompt */}
        <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Create New AI Prompt</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs font-medium">
                    {prompts.length}/{promptLimit} prompts used
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {profile?.access_level || 'FREE'} Plan
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="prompt-name" className="text-sm font-semibold text-gray-700">
                  Prompt Name
                </Label>
                <Input
                  id="prompt-name"
                  placeholder="Enter a descriptive name for your AI prompt"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSave} 
                  disabled={saving || prompts.length >= promptLimit || !formData.name.trim() || !formData.prompt.trim()}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save AI Prompt'}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="ai-prompt" className="text-sm font-semibold text-gray-700">
                AI Prompt Content
              </Label>
              <Textarea
                id="ai-prompt"
                placeholder="Enter your detailed AI prompt instructions here..."
                value={formData.prompt}
                onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                className="min-h-[150px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Saved Prompts */}
        <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Saved AI Prompts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {prompts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No AI prompts yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">Create your first AI prompt to start generating intelligent content for your posts</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {prompts.map((prompt) => (
                  <Card key={prompt.id} className="border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold truncate">{prompt.name}</CardTitle>
                          <p className="text-xs text-gray-500 mt-1">
                            Created {new Date(prompt.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(prompt.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 line-clamp-4">
                          {prompt.prompt}
                        </p>
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

export default AI;
