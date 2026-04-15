'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ArrowRight, 
  CheckCircle2,
  Package,
  FileText,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">USP<span className="text-blue-600">.</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">Platform</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 px-4 transition-colors">
              Log In
            </Link>
            <Link 
              href="/auth/signup" 
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Next-Generation Procurement</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Unified Collaboration for <span className="text-blue-600">Global Supply Chains.</span>
              </h1>
              
              <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                The ultimate platform for buyers and suppliers to synchronize purchase orders, 
                streamline invoicing, and manage product catalogs in a single, secure environment.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <Link 
                  href="/auth/signup" 
                  className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 group"
                >
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/auth/login" 
                  className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-bold text-lg hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center dark:border-slate-800 active:scale-95"
                >
                  Explore Platform
                </Link>
              </div>
            </div>

            {/* Platform Snapshot */}
            <div className="mt-24 relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
              <div className="bg-slate-900 rounded-[3rem] p-4 shadow-3xl shadow-slate-200 overflow-hidden aspect-[16/9] flex items-center justify-center text-slate-500 border-8 border-slate-100">
                <div className="flex flex-col items-center">
                   <div className="h-20 w-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6">
                      <Zap className="h-10 w-10 text-blue-400" />
                   </div>
                   <p className="text-xl font-black text-white uppercase tracking-widest">Unified Dashboard</p>
                   <p className="text-sm text-slate-400 mt-2 font-medium italic">High-Performance Visualization</p>
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-12 -left-12 hidden lg:block animate-bounce-slow">
                 <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 w-64">
                    <div className="flex items-center gap-3 mb-4">
                       <Package className="h-5 w-5 text-blue-600" />
                       <span className="text-xs font-black uppercase tracking-widest">Catalog Sync</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full mb-2">
                       <div className="h-2 w-[85%] bg-blue-600 rounded-full"></div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">85% Automation Rate</p>
                 </div>
              </div>

              <div className="absolute -bottom-10 -right-10 hidden lg:block animate-bounce-slower">
                 <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl border border-white/10 w-64 text-white">
                    <div className="flex items-center gap-3 mb-4">
                       <FileText className="h-5 w-5 text-blue-400" />
                       <span className="text-xs font-black uppercase tracking-widest">Invoice Flip</span>
                    </div>
                    <div className="flex items-end justify-between">
                       <span className="text-2xl font-black">$42,800</span>
                       <span className="text-[9px] font-black text-emerald-400 uppercase">Paid Fast</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-3xl opacity-50"></div>
        </section>

        {/* Stats Bar */}
        <section className="bg-slate-50 border-y border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900">10k+</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Partners Connected</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900">$2.4B</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">GTV Processed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900">0.02s</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Platform Latency</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900">99.9%</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">System Uptime</p>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Built for Efficiency.</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Every tool you need to manage your business relationships, from discovery to payment fulfillment.</p>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group">
              <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 duration-300">
                <Globe className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Connectivity</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">Search and connect with thousands of supplier partners across the globe in seconds.</p>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group">
              <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 duration-300">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant PO Flipping</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">Turn purchase orders into invoices with a single click, eliminating manual data entry.</p>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group">
              <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-6 duration-300">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Security & RLS</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">Enterprise-grade Row Level Security ensures only the right parties see sensitive data.</p>
            </div>
          </div>
        </section>

        {/* Newsletter/CTA */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">Ready to unify your procurement?</h2>
              <p className="text-slate-400 font-medium text-lg mb-10 max-w-xl mx-auto leading-relaxed">Join the world's most advanced businesses and transform your supply chain today.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/auth/signup" 
                  className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest pl-4 pr-4">
                   <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                   Forever Free for Suppliers
                </div>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">USP Platform</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2026 Unified Supplier Collaboration Platform. State of the Art. Premium built.</p>
          <div className="flex items-center gap-6">
             <BarChart3 className="h-5 w-5 text-slate-200" />
             <Link href="/auth/login" className="text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Launch App</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
