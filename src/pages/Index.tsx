
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Index = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
              <span className="text-xl font-bold text-white">P</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PostX</h1>
              <p className="text-sm text-gray-600">Welcome back!</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-5 w-5" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to PostX
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your professional SaaS platform is ready to go!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-blue-800">
                🎉 Authentication is fully set up and working! You can now build the rest of your application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
