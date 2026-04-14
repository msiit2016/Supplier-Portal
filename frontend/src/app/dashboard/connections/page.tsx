'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2,
  ExternalLink,
  ChevronRight,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/supabase';

interface Tenant {
  id: string;
  name: string;
  type: string;
}

interface Connection {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
  buyer_id: string;
  supplier_id: string;
  buyer: Tenant;
  supplier: Tenant;
  created_at: string;
}

export default function ConnectionsPage() {
  const { tenantId, session } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchResults, setSearchResults] = useState<Tenant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [invitingId, setInvitingId] = useState<string | null>(null);

  const fetchConnections = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/connections`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) setConnections(data);
    } catch (err) {
      console.error('Error fetching connections:', err);
    }
  }, [session]);

  useEffect(() => {
    if (session) fetchConnections();
  }, [session, fetchConnections]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/connections/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const inviteSupplier = async (supplierId: string) => {
    setInvitingId(supplierId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/connections/invite`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ supplierTenantId: supplierId }),
      });
      
      if (response.ok) {
        fetchConnections();
        setSearchResults(searchResults.filter(s => s.id !== supplierId));
      }
    } catch (err) {
      console.error('Invite error:', err);
    } finally {
      setInvitingId(null);
    }
  };

  const updateStatus = async (connectionId: string, status: 'ACTIVE' | 'REJECTED') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/connections/${connectionId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) fetchConnections();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Connections</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage your buyer and supplier network</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Connection Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-bold text-slate-900 text-sm">Active & Pending Network</span>
              </div>
              <button className="p-1 px-2 rounded-lg hover:bg-slate-100 text-slate-400">
                <Filter className="h-4 w-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {connections.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                    <Users className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No connections found yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Start by searching for suppliers on the right.</p>
                </div>
              ) : (
                connections.map((conn) => {
                  const isSupplier = tenantId === conn.supplier_id;
                  const partner = isSupplier ? conn.buyer : conn.supplier;
                  
                  return (
                    <div key={conn.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200 uppercase group-hover:scale-110 transition-transform">
                          {partner?.name?.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900">{partner?.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter uppercase ${
                              conn.status === 'ACTIVE' 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : conn.status === 'REJECTED' 
                                ? 'bg-red-50 text-red-700' 
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {conn.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="h-3 w-3 text-slate-400" />
                            <p className="text-xs text-slate-500 font-semibold uppercase">{partner?.type}</p>
                            <span className="text-slate-300">•</span>
                            <Clock className="h-3 w-3 text-slate-400" />
                            <p className="text-xs text-slate-400">{new Date(conn.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {conn.status === 'PENDING' && isSupplier && (
                          <>
                            <button 
                              onClick={() => updateStatus(conn.id, 'REJECTED')}
                              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => updateStatus(conn.id, 'ACTIVE')}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Accept
                            </button>
                          </>
                        )}
                        <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Supplier Search Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-slate-900">Grow Your Network</h3>
            <p className="text-xs text-slate-500 font-medium mt-2 mb-6">Connect with new suppliers to start transacting and collaborating efficiently.</p>
            
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Search by company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </form>

            <div className="w-full mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {loading && <div className="text-center py-4 text-slate-400 text-xs animate-pulse font-bold">Searching for companies...</div>}
              {searchResults.length === 0 && searchQuery && !loading && (
                <div className="text-center py-4 text-slate-400 text-xs font-bold">No companies found</div>
              )}
              {searchResults.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                  <div className="text-left truncate flex-1 mr-2">
                    <p className="text-xs font-black text-slate-900 truncate">{tenant.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{tenant.type}</p>
                  </div>
                  <button
                    onClick={() => inviteSupplier(tenant.id)}
                    disabled={invitingId === tenant.id}
                    className="flex-shrink-0 h-8 w-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 w-full">
               <button className="flex items-center justify-center w-full gap-2 text-xs font-bold text-slate-400 hover:text-slate-600">
                  <ExternalLink className="h-3 w-3" />
                  Request new directory listing
               </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
             <div className="relative z-10">
                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                   <Users className="h-5 w-5 text-blue-400" />
                </div>
                <h4 className="font-bold mb-2">Multi-portal fatigue?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Invite your favorite suppliers for free and manage everything from a single dashboard. No more duplicate data entry.</p>
             </div>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600/20 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
