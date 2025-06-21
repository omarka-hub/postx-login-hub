
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Twitter, MessageSquare, Calendar, Send } from 'lucide-react';
import { XCredential } from '@/hooks/useXCredentials';

interface LatestPostsProps {
  xCredentials: XCredential[];
}

const LatestPosts: React.FC<LatestPostsProps> = ({ xCredentials }) => {
  const accountsWithPosts = xCredentials.filter(account => account.latest_post);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Send className="w-6 h-6 text-blue-600" />
          </div>
          Latest Posts Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {accountsWithPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recent posts yet</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Your automated posts will appear here once you start creating content. Connect your X accounts and set up schedules to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {accountsWithPosts.map((account) => (
              <div key={account.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Twitter className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 text-lg">@{account.account_name}</span>
                      <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Latest
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    {new Date(account.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100 rounded-lg p-4">
                  <p className="text-gray-800 text-sm leading-relaxed font-medium">
                    "{account.latest_post}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestPosts;
