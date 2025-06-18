
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const System = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System</h1>
        <p className="text-muted-foreground">System monitoring and configuration</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">System functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default System;
