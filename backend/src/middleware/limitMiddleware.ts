import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export const checkSupplierLimit = async (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.tenantId;

  try {
    // 1. Get tenant's subscription plan and limit
    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('supplier_limit')
      .eq('tenant_id', tenantId)
      .single();

    if (subError && subError.code !== 'PGRST116') { // PGRST116 is empty result, which means default FREE
       // If no subscription record, assume FREE with limit 5
    }

    const limit = sub?.supplier_limit || 5;

    // 2. Count active connections
    const { count, error: countError } = await supabase
      .from('connections')
      .select('*', { count: 'exact', head: true })
      .eq('buyer_id', tenantId)
      .eq('status', 'ACTIVE');

    if (countError) return res.status(500).json({ error: 'Failed to verify limits' });

    if ((count || 0) >= limit) {
      return res.status(403).json({ 
        error: 'Limit Reached', 
        message: `Your current plan allows only ${limit} active supplier connections. Please upgrade to add more.` 
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
