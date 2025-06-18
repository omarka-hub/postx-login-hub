
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const XCredentials = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">X Credentials</h1>
        <p className="text-muted-foreground">Manage your X (Twitter) API credentials</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>X API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">X credentials management will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default XCredentials;
