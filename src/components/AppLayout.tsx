import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Bot, Rss, Settings as SettingsIcon, Twitter, Cpu, LogOut, User, Crown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useDashboard } from '@/hooks/useDashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AppLayout = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { dashboard } = useDashboard();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: Bot,
      label: 'AI',
      path: '/ai'
    },
    {
      icon: Rss,
      label: 'RSS',
      path: '/rss'
    },
    {
      icon: Cpu,
      label: 'System',
      path: '/system'
    },
    {
      icon: Twitter,
      label: 'X Credentials',
      path: '/x-credentials'
    },
    {
      icon: SettingsIcon,
      label: 'Settings',
      path: '/settings'
    }
  ];

  const getPlanColor = (level: string) => {
    switch (level) {
      case 'FREE': return 'bg-green-100 text-green-800';
      case 'BEGINNER': return 'bg-blue-100 text-blue-800';
      case 'PRO': return 'bg-purple-100 text-purple-800';
      case 'BUSINESS': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PostX
              </h1>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="flex flex-col h-full">
            <div className="flex-1">
              <SidebarMenu className="p-2">
                {menuItems.map(item => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                      <Link to={item.path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>

            {/* Profile Section */}
            <div className="mt-auto p-4 border-t">
              {profile && (
                <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {profile.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs font-medium ${getPlanColor(profile.access_level)}`}>
                      {profile.access_level} Plan
                    </Badge>
                    <div className="text-xs text-gray-600">
                      {dashboard?.current_credits || 0} credits
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                variant="outline" 
                onClick={signOut} 
                className="w-full flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
