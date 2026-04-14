'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  FileDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface POItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  total_amount: number;
  created_at: string;
  supplier: { name: string };
  buyer: { name: string };
  items: POItem[];
}

export default function POSPage() {
  const { session, tenantId } = useAuth();
  const [pos, setPOs] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) fetchPOs();
  }, [session]);

  const fetchPOs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pos', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) setPOs(data);
    } catch (err) {
      console.error('Error fetching POs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/pos/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) fetchPOs();
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleFlipToInvoice = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/invoices/flip/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (response.ok) fetchPOs();
    } catch (err) {
      console.error('Flip error:', err);
    }
  };

  const statusColors = {
    DRAFT: 'bg-slate-100 text-slate-700',
    SENT: 'bg-blue-100 text-blue-700 border border-blue-200',
    ACCEPTED: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    COMPLETED: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Purchase Orders</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage and track all procurement transactions</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
             <Filter className="h-4 w-4 mr-2" />
             Filter
           </button>
           <button className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-[0.98]">
             <Plus className="h-4 w-4 mr-2" />
             Create PO
           </button>
        </div>
      </div>

      {/* PO Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search POs..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
           </div>
           <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Sort by: Date</span>
              <FileDown className="h-4 w-4 cursor-pointer hover:text-slate-600" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">PO Number</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">
                    Fetching your transactions...
                  </td>
                </tr>
              ) : pos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    No purchase orders found.
                  </td>
                </tr>
              ) : (
                pos.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                           <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-bold text-slate-900">{po.po_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-900">
                        {tenantId === po.tenant_id ? po.supplier?.name : po.buyer?.name}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {tenantId === po.tenant_id ? 'Supplier' : 'Buyer'}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-500/80">
                      {new Date(po.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900">
                      ${po.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border tracking-widest uppercase ${statusColors[po.status]}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                          {po.status === 'SENT' && tenantId === po.supplier_tenant_id && (
                            <button 
                              onClick={() => handleUpdateStatus(po.id, 'ACCEPTED')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm"
                            >
                              Accept
                            </button>
                          )}
                          {po.status === 'ACCEPTED' && tenantId === po.supplier_tenant_id && (
                            <button 
                              onClick={() => handleFlipToInvoice(po.id)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1"
                            >
                              <ArrowUpRight className="h-3 w-3" />
                              Flip to Invoice
                            </button>
                          )}
                          <button className="p-2 rounded-xl text-slate-400 hover:bg-white hover:shadow-sm hover:text-blue-600 transition-all border border-transparent hover:border-slate-100">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 rounded-xl text-slate-400 hover:bg-white hover:shadow-sm hover:text-slate-900 transition-all border border-transparent hover:border-slate-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Mini-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-900 rounded-3xl p-6 text-white group cursor-pointer overflow-hidden relative">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 relative z-10">Monthly Spending</h4>
            <div className="flex items-end justify-between relative z-10">
               <p className="text-3xl font-black">$42,920</p>
               <div className="flex items-center text-emerald-400 text-xs font-bold leading-none mb-1">
                  <ArrowUpRight className="h-4 w-4 mr-0.5" />
                  +8.4%
               </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
         </div>
         <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
               <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-900 truncate">4 Awaiting Acceptance</p>
               <p className="text-xs text-slate-500 font-medium tracking-tight">Requires supplier confirmation</p>
            </div>
         </div>
         <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
               <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-900 truncate">12 Fulfilled this week</p>
               <p className="text-xs text-slate-500 font-medium tracking-tight">On-time delivery rate: 98%</p>
            </div>
         </div>
      </div>
    </div>
  );
}
