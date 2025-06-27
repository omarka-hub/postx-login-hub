
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Trash2, Plus, Bot, Sparkles, Calendar, Activity } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AIPrompt {
  id: string;
  name: string;
  prompt: string;
  created_at: string;
}

const AI = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [promptName, setPromptName] = useState('');
  const [promptText, setPromptText] = useState('');

  // Fetch AI prompts
  const { data: aiPrompts = [], isLoading } = useQuery({
    queryKey: ['ai-prompts'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching AI prompts:', error);
        throw error;
      }

      return data as AIPrompt[];
    },
    enabled: !!user,
  });

  // Save AI prompt mutation
  const savePromptMutation = useMutation({
    mutationFn: async () => {
      if (!user || !promptName.trim() || !promptText.trim()) {
        throw new Error('Please fill in all fields');
      }

      const { error } = await supabase
        .from('ai_prompts')
        .insert({
          user_id: user.id,
          name: promptName.trim(),
          prompt: promptText.trim()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "AI prompt saved successfully!",
      });
      setPromptName('');
      setPromptText('');
      queryClient.invalidateQueries({ queryKey: ['ai-prompts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save AI prompt",
        variant: "destructive",
      });
    },
  });

  // Delete AI prompt mutation
  const deletePromptMutation = useMutation({
    mutationFn: async (promptId: string) => {
      const { error } = await supabase
        .from('ai_prompts')
        .delete()
        .eq('id', promptId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "AI prompt deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['ai-prompts'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete AI prompt",
        variant: "destructive",
      });
    },
  });

  const handleSavePrompt = () => {
    savePromptMutation.mutate();
  };

  const handleDeletePrompt = (promptId: string) => {
    deletePromptMutation.mutate(promptId);
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
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">AI Prompts</h1>
        <p className="text-lg text-gray-600">Create and manage your AI prompts for automated content generation</p>
      </div>

      {/* Create AI Prompt Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 animate-slide-in-right">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            Create AI Prompt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="prompt-name" className="text-sm font-semibold text-gray-700">Prompt Name</Label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="prompt-name"
                placeholder="Enter prompt name"
                value={promptName}
                onChange={(e) => setPromptName(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="prompt-text" className="text-sm font-semibold text-gray-700">Prompt Text</Label>
            <div className="relative">
              <Bot className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <Textarea
                id="prompt-text"
                placeholder="Enter your AI prompt..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="pl-10 min-h-32 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm resize-none"
              />
            </div>
          </div>
          <Button 
            onClick={handleSavePrompt}
            disabled={savePromptMutation.isPending || !promptName.trim() || !promptText.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {savePromptMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              'Save AI Prompt'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Saved AI Prompts */}
      <Card className="border-0 shadow-lg animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            Saved AI Prompts ({aiPrompts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aiPrompts.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No AI prompts yet</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Create your first AI prompt above to start generating automated content for your posts.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {aiPrompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  className="border border-gray-200 rounded-xl p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 transition-all duration-200 shadow-sm hover:shadow-md animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">{prompt.name}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePrompt(prompt.id)}
                      disabled={deletePromptMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-3 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-3">
                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{prompt.prompt}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Created on {formatDate(prompt.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AI;
