
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRssFeeds } from '@/hooks/useRssFeeds';
import { useProfile } from '@/hooks/useProfile';
import { Trash2, ExternalLink, Rss, Plus, Globe, Database, Calendar, Activity } from 'lucide-react';

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  is_x_source: boolean;
  feed_type: string;
  created_at: string;
}

const RSS = () => {
  const { rssFeeds, loading, createRssFeed, deleteRssFeed, getAccessLimits } = useRssFeeds();
  const { profile } = useProfile();

  // Form states for creating RSS feed
  const [createFeedName, setCreateFeedName] = useState('');
  const [createSourceUrl, setCreateSourceUrl] = useState('');
  const [createIsXSource, setCreateIsXSource] = useState(false);

  // Form states for existing RSS feed
  const [existingFeedName, setExistingFeedName] = useState('');
  const [existingRssUrl, setExistingRssUrl] = useState('');
  const [existingIsXSource, setExistingIsXSource] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleSaveExistingFeed = async () => {
    if (!existingFeedName.trim() || !existingRssUrl.trim()) {
      return;
    }

    setIsCreating(true);
    await createRssFeed({
      name: existingFeedName.trim(),
      url: existingRssUrl.trim(),
      is_x_source: existingIsXSource,
      feed_type: 'existing'
    });
    setExistingFeedName('');
    setExistingRssUrl('');
    setExistingIsXSource(false);
    setIsCreating(false);
  };

  const handleDeleteFeed = async (feedId: string) => {
    setIsDeleting(feedId);
    await deleteRssFeed(feedId);
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
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border animate-scale-in">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">RSS Feeds</h1>
        <p className="text-lg text-gray-600">Create and manage your RSS feeds for automated content sourcing</p>
        <p className="text-sm text-gray-500 mt-2">
          {rssFeeds.length}/{limits.maxRssFeeds} RSS feeds used ({profile?.access_level || 'FREE'} plan)
        </p>
      </div>

      {/* Create RSS Feed Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 animate-slide-in-right">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-orange-600" />
            </div>
            Create RSS Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="create-feed-name" className="text-sm font-semibold text-gray-700">Feed Name</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="create-feed-name"
                  placeholder="Enter feed name"
                  value={createFeedName}
                  onChange={(e) => setCreateFeedName(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="create-source-url" className="text-sm font-semibold text-gray-700">Source URL</Label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="create-source-url"
                  placeholder="Enter source URL"
                  value={createSourceUrl}
                  onChange={(e) => setCreateSourceUrl(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Switch
              id="create-x-source"
              checked={createIsXSource}
              onCheckedChange={setCreateIsXSource}
            />
            <Label htmlFor="create-x-source" className="text-sm font-medium text-gray-700">X (Twitter) Source</Label>
          </div>
          <Button disabled className="opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 px-6 py-3 rounded-lg">
            Coming Soon...
          </Button>
        </CardContent>
      </Card>

      {/* Add Existing RSS Feed Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            Add Existing RSS Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="existing-feed-name" className="text-sm font-semibold text-gray-700">Feed Name</Label>
              <div className="relative">
                <Rss className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="existing-feed-name"
                  placeholder="Enter feed name"
                  value={existingFeedName}
                  onChange={(e) => setExistingFeedName(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="existing-rss-url" className="text-sm font-semibold text-gray-700">RSS URL</Label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="existing-rss-url"
                  placeholder="Enter RSS URL"
                  value={existingRssUrl}
                  onChange={(e) => setExistingRssUrl(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Switch
              id="existing-x-source"
              checked={existingIsXSource}
              onCheckedChange={setExistingIsXSource}
            />
            <Label htmlFor="existing-x-source" className="text-sm font-medium text-gray-700">X (Twitter) Source</Label>
          </div>
          <Button 
            onClick={handleSaveExistingFeed}
            disabled={isCreating || !existingFeedName.trim() || !existingRssUrl.trim() || rssFeeds.length >= limits.maxRssFeeds}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : rssFeeds.length >= limits.maxRssFeeds ? (
              `Limit Reached (${limits.maxRssFeeds})`
            ) : (
              'Save RSS Feed'
            )}
          </Button>
          {rssFeeds.length >= limits.maxRssFeeds && (
            <p className="text-sm text-red-600">
              You've reached the maximum number of RSS feeds for your {profile?.access_level || 'FREE'} plan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Saved RSS Feeds */}
      <Card className="border-0 shadow-lg animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            Saved RSS Feeds ({rssFeeds.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rssFeeds.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rss className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No RSS feeds yet</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Add your first RSS feed above to start sourcing content automatically for your posts.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rssFeeds.map((feed, index) => (
                <div
                  key={feed.id}
                  className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 shadow-sm hover:shadow-md animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Rss className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900">{feed.name}</h3>
                      {feed.is_x_source && (
                        <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                          X (Twitter)
                        </span>
                      )}
                      <span className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full font-medium">
                        {feed.feed_type === 'created' ? 'Created' : 'Existing'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ExternalLink className="w-4 h-4" />
                      <span className="truncate max-w-md font-mono bg-gray-100 px-2 py-1 rounded">{feed.url}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Added on {formatDate(feed.created_at)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFeed(feed.id)}
                    disabled={isDeleting === feed.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-3 rounded-lg transition-colors"
                  >
                    {isDeleting === feed.id ? (
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

export default RSS;
