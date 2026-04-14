'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Package
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Catalog', href: '/dashboard/catalog', icon: Package },
  { name: 'Purchase Orders', href: '/dashboard/pos', icon: FileText },
  { name: 'Invoices', href: '/dashboard/invoices', icon: Receipt },
  { name: 'Connections', href: '/dashboard/connections', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut, tenantId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          {isSidebarOpen && (
            <span className="ml-3 font-bold text-slate-900 truncate">USP Platform</span>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="ml-3 font-semibold text-sm">{item.name}</span>
                )}
                {isActive && isSidebarOpen && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 mb-2">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-700 transition-all"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && <span className="ml-3 font-semibold text-sm">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center space-x-4">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
             >
               <Menu className="h-5 w-5" />
             </button>
             <h1 className="text-xl font-bold text-slate-900">
                {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
             </h1>
          </div>

          <div className="flex items-center space-x-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user.email}</p>
                <p className="text-xs text-slate-500">Tenant: {tenantId || 'Loading...'}</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 uppercase">
                {user.email?.substring(0, 2)}
             </div>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-auto p-8">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </div>
      </main>
    </div>
  );
}
