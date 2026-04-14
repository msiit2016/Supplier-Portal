import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const getDashboardStats = async (req: Request, res: Response) => {
  const tenantId = req.tenantId;

  try {
    // 1. PO Count
    const { count: poCount, error: poError } = await supabase
      .from('purchase_orders')
      .select('*', { count: 'exact', head: true })
      .or(`tenant_id.eq.${tenantId},supplier_tenant_id.eq.${tenantId}`);

    // 2. Pending Invoices (SENT but not PAID)
    const { count: pendingInvoices, error: invError } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'SENT')
      .or(`tenant_id.eq.${tenantId},buyer_tenant_id.eq.${tenantId}`);

    // 3. Active Connections
    const { count: activeConnections, error: connError } = await supabase
      .from('connections')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ACTIVE')
      .or(`buyer_id.eq.${tenantId},supplier_id.eq.${tenantId}`);

    if (poError || invError || connError) {
      return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }

    res.json({
      poCount: poCount || 0,
      pendingInvoices: pendingInvoices || 0,
      activeConnections: activeConnections || 0,
      completionRate: '98%' // Static for now or calculated from COMPLETED POs
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
