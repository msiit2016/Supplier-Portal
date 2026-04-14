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
  FileDown,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CommentSidebar from '../components/CommentSidebar';

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
  tenant_id: string;
  supplier_tenant_id: string;
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
  const [activePO, setActivePO] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<{id: string, name: string}[]>([]);
  const [formData, setFormData] = useState({
    supplierId: '',
    poNumber: `PO-${Date.now().toString().slice(-4)}`,
    items: [{ description: '', quantity: 1, unit_price: 0 }]
  });

  const fetchSuppliers = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/connections', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        // Filter for active suppliers where the user is the buyer
        const activeSuppliers = data
          .filter(c => c.status === 'ACTIVE' && c.buyer_id === tenantId)
          .map(c => ({ id: c.supplier_id, name: c.supplier.name }));
        setSuppliers(activeSuppliers);
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  }, [session, tenantId]);

  const fetchPOs = React.useCallback(async () => {
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
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchPOs();
      fetchSuppliers();
    }
  }, [session, fetchPOs, fetchSuppliers]);

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

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    
    try {
      const response = await fetch('http://localhost:3001/api/pos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          supplierTenantId: formData.supplierId,
          poNumber: formData.poNumber,
          totalAmount,
          items: formData.items
        }),
      });
      if (response.ok) {
        setIsCreateModalOpen(false);
        fetchPOs();
        setFormData({
          supplierId: '',
          poNumber: `PO-${Date.now().toString().slice(-4)}`,
          items: [{ description: '', quantity: 1, unit_price: 0 }]
        });
      }
    } catch (err) {
      console.error('Create PO error:', err);
    }
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unit_price: 0 }]
    });
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
                          <button 
                            onClick={() => setActivePO(po.id)}
                            className="p-2 rounded-xl text-slate-400 hover:bg-white hover:shadow-sm hover:text-blue-600 transition-all border border-transparent hover:border-slate-100"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
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

      <CommentSidebar 
        parentId={activePO || ''}
        parentType="PO"
        isOpen={!!activePO}
        onClose={() => setActivePO(null)}
      />

      {/* Create PO Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
             <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create Purchase Order</h3>
                   <p className="text-sm text-slate-500 font-medium">Issue a formal procurement request to your supplier.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                   <XCircle className="h-6 w-6 text-slate-400 hover:text-red-500" />
                </button>
             </div>
             
             <form onSubmit={handleCreatePO} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Supplier Partner</label>
                      <select 
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                        value={formData.supplierId}
                        onChange={e => setFormData({...formData, supplierId: e.target.value})}
                      >
                         <option value="">Select a supplier...</option>
                         {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Order Number</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono"
                        value={formData.poNumber}
                        onChange={e => setFormData({...formData, poNumber: e.target.value})}
                      />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Line Items</label>
                      <button 
                        type="button"
                        onClick={addItemRow}
                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 underline"
                      >
                        + Add Item
                      </button>
                   </div>
                   
                   {formData.items.map((item, idx) => (
                     <div key={idx} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-1 duration-300">
                        <div className="flex-[3]">
                           <input 
                              placeholder="Description"
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                              value={item.description}
                              onChange={e => {
                                const newItems = [...formData.items];
                                newItems[idx].description = e.target.value;
                                setFormData({...formData, items: newItems});
                              }}
                           />
                        </div>
                        <div className="flex-1">
                           <input 
                              type="number"
                              placeholder="Qty"
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                              value={item.quantity}
                              onChange={e => {
                                const newItems = [...formData.items];
                                newItems[idx].quantity = parseInt(e.target.value);
                                setFormData({...formData, items: newItems});
                              }}
                           />
                        </div>
                        <div className="flex-1">
                           <input 
                              type="number"
                              placeholder="Price"
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                              value={item.unit_price}
                              onChange={e => {
                                const newItems = [...formData.items];
                                newItems[idx].unit_price = parseFloat(e.target.value);
                                setFormData({...formData, items: newItems});
                              }}
                           />
                        </div>
                     </div>
                   ))}
                </div>

                <div className="pt-10 flex items-center justify-between border-t border-slate-100">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Total</p>
                      <p className="text-3xl font-black text-slate-900">
                         ${formData.items.reduce((sum, i) => sum + (i.quantity * i.unit_price), 0).toLocaleString()}
                      </p>
                   </div>
                   <div className="flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="px-8 py-4 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                      >
                        Issue Purchase Order
                      </button>
                   </div>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
