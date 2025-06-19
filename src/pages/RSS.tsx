
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Trash2, ExternalLink } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  is_x_source: boolean;
  feed_type: string;
  created_at: string;
}

const RSS = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form states for creating RSS feed
  const [createFeedName, setCreateFeedName] = useState('');
  const [createSourceUrl, setCreateSourceUrl] = useState('');
  const [createIsXSource, setCreateIsXSource] = useState(false);

  // Form states for existing RSS feed
  const [existingFeedName, setExistingFeedName] = useState('');
  const [existingRssUrl, setExistingRssUrl] = useState('');
  const [existingIsXSource, setExistingIsXSource] = useState(false);

  // Fetch RSS feeds
  const { data: rssFeeds = [], isLoading } = useQuery({
    queryKey: ['rss-feeds'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('rss_feeds')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching RSS feeds:', error);
        throw error;
      }

      return data as RSSFeed[];
    },
    enabled: !!user,
  });

  // Save existing RSS feed mutation
  const saveExistingFeedMutation = useMutation({
    mutationFn: async () => {
      if (!user || !existingFeedName.trim() || !existingRssUrl.trim()) {
        throw new Error('Please fill in all required fields');
      }

      const { error } = await supabase
        .from('rss_feeds')
        .insert({
          user_id: user.id,
          name: existingFeedName.trim(),
          url: existingRssUrl.trim(),
          is_x_source: existingIsXSource,
          feed_type: 'existing'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "RSS feed saved successfully!",
      });
      setExistingFeedName('');
      setExistingRssUrl('');
      setExistingIsXSource(false);
      queryClient.invalidateQueries({ queryKey: ['rss-feeds'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save RSS feed",
        variant: "destructive",
      });
    },
  });

  // Delete RSS feed mutation
  const deleteFeedMutation = useMutation({
    mutationFn: async (feedId: string) => {
      const { error } = await supabase
        .from('rss_feeds')
        .delete()
        .eq('id', feedId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "RSS feed deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['rss-feeds'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete RSS feed",
        variant: "destructive",
      });
    },
  });

  const handleSaveExistingFeed = () => {
    saveExistingFeedMutation.mutate();
  };

  const handleDeleteFeed = (feedId: string) => {
    deleteFeedMutation.mutate(feedId);
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RSS Feeds</h1>
          <p className="text-muted-foreground">Manage your RSS feeds</p>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">RSS Feeds</h1>
        <p className="text-muted-foreground">Create and manage your RSS feeds</p>
      </div>

      {/* Create RSS Feed Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Create RSS Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="create-feed-name">Feed Name</Label>
              <Input
                id="create-feed-name"
                placeholder="Enter feed name"
                value={createFeedName}
                onChange={(e) => setCreateFeedName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-source-url">Source URL</Label>
              <Input
                id="create-source-url"
                placeholder="Enter source URL"
                value={createSourceUrl}
                onChange={(e) => setCreateSourceUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="create-x-source"
              checked={createIsXSource}
              onCheckedChange={setCreateIsXSource}
            />
            <Label htmlFor="create-x-source">X (Twitter) Source</Label>
          </div>
          <Button disabled className="opacity-50 cursor-not-allowed">
            Coming Soon...
          </Button>
        </CardContent>
      </Card>

      {/* Add Existing RSS Feed Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Add Existing RSS Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="existing-feed-name">Feed Name</Label>
              <Input
                id="existing-feed-name"
                placeholder="Enter feed name"
                value={existingFeedName}
                onChange={(e) => setExistingFeedName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="existing-rss-url">RSS URL</Label>
              <Input
                id="existing-rss-url"
                placeholder="Enter RSS URL"
                value={existingRssUrl}
                onChange={(e) => setExistingRssUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="existing-x-source"
              checked={existingIsXSource}
              onCheckedChange={setExistingIsXSource}
            />
            <Label htmlFor="existing-x-source">X (Twitter) Source</Label>
          </div>
          <Button 
            onClick={handleSaveExistingFeed}
            disabled={saveExistingFeedMutation.isPending || !existingFeedName.trim() || !existingRssUrl.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saveExistingFeedMutation.isPending ? 'Saving...' : 'Save RSS Feed'}
          </Button>
        </CardContent>
      </Card>

      {/* Saved RSS Feeds */}
      <Card>
        <CardHeader>
          <CardTitle>Saved RSS Feeds ({rssFeeds.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {rssFeeds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No RSS feeds saved yet. Add your first RSS feed above.
            </div>
          ) : (
            <div className="space-y-4">
              {rssFeeds.map((feed) => (
                <div
                  key={feed.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{feed.name}</h3>
                      {feed.is_x_source && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          X (Twitter)
                        </span>
                      )}
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {feed.feed_type === 'created' ? 'Created' : 'Existing'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate max-w-md">{feed.url}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Added on {formatDate(feed.created_at)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFeed(feed.id)}
                    disabled={deleteFeedMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
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

export default RSS;
