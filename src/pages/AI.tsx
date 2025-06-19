
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
import { Bot, Plus, Trash2, Edit3, Save } from 'lucide-react';

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Prompts</h1>
          <p className="text-muted-foreground">Loading your AI prompts...</p>
        </div>
      </div>
    );
  }

  const promptLimit = profile ? getPromptLimit(profile.access_level) : 1;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-600" />
          AI Prompts
        </h1>
        <p className="text-muted-foreground mt-2">Create and manage your AI prompts for content generation</p>
      </div>

      {/* Create New Prompt */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Create New AI Prompt
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {prompts.length}/{promptLimit} prompts used
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt-name" className="text-sm font-medium">Prompt Name</Label>
            <Input
              id="prompt-name"
              placeholder="Enter a name for your AI prompt"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-prompt" className="text-sm font-medium">AI Prompt</Label>
            <Textarea
              id="ai-prompt"
              placeholder="Enter your AI prompt here..."
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              className="min-h-[120px] resize-none"
            />
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving || prompts.length >= promptLimit}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save AI Prompt'}
          </Button>
        </CardContent>
      </Card>

      {/* Saved Prompts */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-purple-600" />
            Saved AI Prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prompts.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No AI prompts yet</h3>
              <p className="text-gray-500">Create your first AI prompt to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {prompts.map((prompt) => (
                <Card key={prompt.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg truncate">{prompt.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(prompt.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Created {new Date(prompt.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {prompt.prompt}
                    </p>
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

export default AI;
