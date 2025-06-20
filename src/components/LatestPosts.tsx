
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Twitter, MessageSquare, Calendar } from 'lucide-react';
import { XCredential } from '@/hooks/useXCredentials';

interface LatestPostsProps {
  xCredentials: XCredential[];
}

const LatestPosts: React.FC<LatestPostsProps> = ({ xCredentials }) => {
  const accountsWithPosts = xCredentials.filter(account => account.latest_post);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Twitter className="w-6 h-6 text-blue-400" />
          Latest Posts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {accountsWithPosts.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent posts</h3>
            <p className="text-gray-500 text-sm">
              Your automated posts will appear here once they start running
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {accountsWithPosts.map((account) => (
              <div key={account.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-gray-900">{account.account_name}</span>
                    <Badge variant="outline" className="text-xs">
                      Latest
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(account.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 rounded p-3">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {account.latest_post}
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
