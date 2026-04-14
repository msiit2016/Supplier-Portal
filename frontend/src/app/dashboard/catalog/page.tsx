'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Columns
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  unit_price: number;
  currency: string;
  is_active: boolean;
}

export default function CatalogPage() {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    unitPrice: 0,
    currency: 'USD'
  });

  useEffect(() => {
    if (session) fetchProducts();
  }, [session]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        fetchProducts();
        setShowAddModal(false);
        setNewProduct({ name: '', description: '', sku: '', category: '', unitPrice: 0, currency: 'USD' });
      }
    } catch (err) {
      console.error('Add product error:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in mt-2 fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Catalog</h2>
          <p className="text-slate-500 mt-1 font-medium italic">Manage your marketplace offerings and pricing</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setShowAddModal(true)}
             className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-[0.98]"
           >
             <Plus className="h-4 w-4 mr-2" />
             Add Product
           </button>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search catalog..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
           </div>
           <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50"><Filter className="h-5 w-5" /></button>
              <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50"><Columns className="h-5 w-5" /></button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-slate-100 border-t border-slate-100">
          {loading ? (
             <div className="col-span-full py-20 text-center text-slate-400 font-black tracking-widest uppercase animate-pulse">
                Synchronizing catalog...
             </div>
          ) : products.length === 0 ? (
             <div className="col-span-full py-20 text-center">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Package className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Your catalog is empty</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 text-blue-600 font-bold text-xs hover:underline uppercase"
                >
                  Create your first listing
                </button>
             </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="p-6 hover:bg-slate-50/50 transition-all group">
                <div className="flex items-start justify-between mb-4">
                   <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <Package className="h-6 w-6" />
                   </div>
                   <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-slate-300 hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all"><Edit3 className="h-4 w-4" /></button>
                      <button className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-white hover:shadow-sm transition-all"><Trash2 className="h-4 w-4" /></button>
                   </div>
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate">{product.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium">{product.description || 'No description provided.'}</p>
                
                <div className="mt-6 flex items-center justify-between">
                   <div>
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Pricing</p>
                      <p className="text-lg font-black text-slate-900 mt-0.5 whitespace-nowrap">
                         {product.unit_price} <span className="text-[10px] text-slate-400 font-bold ml-0.5">{product.currency}</span>
                      </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">SKU: {product.sku || 'N/A'}</p>
                      <span className="inline-flex mt-2 items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                         {product.is_active ? 'In Stock' : 'Out of Stock'}
                      </span>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Product Modal (Simple overlay) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-8 border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Add New Product</h3>
                <p className="text-sm text-slate-500 font-medium">Create a new listing in your global catalog.</p>
             </div>
             <form onSubmit={handleAddProduct} className="p-8 space-y-4">
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Product Name</label>
                   <input 
                     type="text" 
                     required
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                     value={newProduct.name}
                     onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Unit Price (USD)</label>
                   <input 
                     type="number" 
                     step="0.01"
                     required
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                     value={newProduct.unitPrice}
                     onChange={e => setNewProduct({...newProduct, unitPrice: parseFloat(e.target.value)})}
                   />
                </div>
                <div className="pt-6 flex items-center gap-3">
                   <button 
                     type="button"
                     onClick={() => setShowAddModal(false)}
                     className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                   >
                     Save Listing
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
