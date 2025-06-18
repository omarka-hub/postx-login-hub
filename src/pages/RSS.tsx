
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RSS = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">RSS</h1>
        <p className="text-muted-foreground">Manage your RSS feeds</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>RSS Feed Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">RSS feed functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RSS;
