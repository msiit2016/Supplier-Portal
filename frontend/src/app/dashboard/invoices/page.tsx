'use client';

import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CommentSidebar from '../components/CommentSidebar';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  tenant_id: string;
  buyer_tenant_id: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
  total_amount: number;
  created_at: string;
  supplier: { name: string };
  buyer: { name: string };
  items: InvoiceItem[];
}

export default function InvoicesPage() {
  const { session, tenantId } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInvoice, setActiveInvoice] = useState<string | null>(null);

  useEffect(() => {
    if (session) fetchInvoices();
  }, [session]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/invoices', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) setInvoices(data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/invoices/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) fetchInvoices();
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const statusColors = {
    DRAFT: 'bg-slate-100 text-slate-700',
    SENT: 'bg-blue-100 text-blue-700 border border-blue-200',
    PAID: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    OVERDUE: 'bg-red-100 text-red-700 border border-red-200',
  };

  return (
    <div className="space-y-8 animate-in mt-2 fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Invoices</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage receivables and track billing status</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
             <Download className="h-4 w-4 mr-2" />
             Export
           </button>
           <button className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-[0.98]">
             <CreditCard className="h-4 w-4 mr-2" />
             New Invoice
           </button>
        </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                 <Clock className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Outstanding</span>
           </div>
           <p className="text-2xl font-black text-slate-900">$12,450.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                 <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Paid</span>
           </div>
           <p className="text-2xl font-black text-slate-900">$48,200.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                 <AlertCircle className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overdue</span>
           </div>
           <p className="text-2xl font-black text-slate-900">$2,100.00</p>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Invoices..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
           </div>
           <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
              <Filter className="h-5 w-5" />
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Partner</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold animate-pulse text-xs tracking-widest uppercase">
                    Loading your invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold text-xs tracking-widest uppercase">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center">
                           <Receipt className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-bold text-slate-900">{inv.invoice_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-900">
                        {tenantId === inv.tenant_id ? inv.buyer?.name : inv.supplier?.name}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {tenantId === inv.tenant_id ? 'Issuer' : 'Recieved'}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-500/80">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900">
                      ${inv.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border tracking-widest uppercase ${statusColors[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                          {inv.status === 'SENT' && tenantId === inv.buyer_tenant_id && (
                            <button 
                              onClick={() => handleUpdateStatus(inv.id, 'PAID')}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                            >
                              Pay Now
                            </button>
                          )}
                          <button 
                            onClick={() => setActiveInvoice(inv.id)}
                            className="p-2 rounded-xl text-slate-400 hover:bg-white hover:shadow-sm hover:text-blue-600 transition-all border border-transparent hover:border-slate-100"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button className="p-2 rounded-xl text-slate-400 hover:bg-white hover:shadow-sm hover:text-slate-900 transition-all border border-transparent hover:border-slate-100">
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

      <CommentSidebar 
        parentId={activeInvoice || ''}
        parentType="INVOICE"
        isOpen={!!activeInvoice}
        onClose={() => setActiveInvoice(null)}
      />
    </div>
  );
}
