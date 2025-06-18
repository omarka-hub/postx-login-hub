
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AI = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI</h1>
        <p className="text-muted-foreground">AI-powered content generation</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Features</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">AI functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AI;
