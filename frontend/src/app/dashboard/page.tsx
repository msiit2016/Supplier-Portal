'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Receipt, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  PlusCircle,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, session } = useAuth();
  const [stats, setStats] = useState({
    poCount: 0,
    pendingInvoices: 0,
    activeConnections: 0,
    completionRate: '0%'
  });

  useEffect(() => {
    if (session) {
      fetch(`${API_BASE_URL}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Stats fetch error:', err));
    }
  }, [session]);

  const statsDisplay = [
    { name: 'Total POs', value: stats.poCount.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Pending Invoices', value: stats.pendingInvoices.toString(), icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Active Connections', value: stats.activeConnections.toString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Completion Rate', value: stats.completionRate, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const recentActivity = [
    { id: 1, type: 'PO_CREATED', title: 'New PO #PO-2023-001 received', time: '2 hours ago', status: 'PENDING' },
    { id: 2, type: 'INV_PAID', title: 'Invoice #INV-992 marked as paid', time: '5 hours ago', status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-8 animate-in mt-2 fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight text-shadow-sm">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic">
            Welcome back, {user?.email?.split('@')[0]}
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Link 
            href="/dashboard/pos" 
            className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
           >
             View Transactions
           </Link>
           <button className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-[0.98]">
             <PlusCircle className="h-4 w-4 mr-2" />
             Create New
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl transition-all group-hover:bg-blue-600 group-hover:text-white duration-300`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Real-time</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">{stat.name}</p>
              </div>
              <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                ACTIVE
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-bold text-slate-900">Live Business Stream</h3>
            <button className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">Refresh</button>
          </div>
          <div className="divide-y divide-slate-50 px-8">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="py-6 flex items-start gap-5 hover:bg-slate-50/50 transition-all -mx-8 px-8 cursor-pointer group">
                <div className={`mt-1 p-2 rounded-xl transition-all group-hover:scale-110 ${
                  activity.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {activity.status === 'COMPLETED' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{activity.title}</p>
                  <p className="text-xs text-slate-400 mt-1 font-semibold flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                      activity.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                   }`}>
                     {activity.status}
                   </div>
                   <ArrowUpRight className="h-4 w-4 text-slate-200 group-hover:text-blue-600 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full">
            <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500">
               <TrendingUp className="h-7 w-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-black mb-4 leading-tight">Scale your <br />procurement.</h3>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
              Start by connecting with your regular suppliers and setting up your tax profiles to unlock the full potential of data-driven collaboration.
            </p>
            <div className="mt-auto space-y-3">
               <Link href="/dashboard/connections" className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black shadow-lg shadow-blue-500/20">1</div>
                  <span className="text-sm font-bold">Invite first Supplier</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-white/30" />
               </Link>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-1000"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
        </div>
      </div>
    </div>
  );
}
