import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const inviteSupplier = async (req: Request, res: Response) => {
  const { supplierTenantId } = req.body;
  const buyerTenantId = req.tenantId; // From authMiddleware

  if (!supplierTenantId) {
    return res.status(400).json({ error: 'Supplier Tenant ID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('connections')
      .insert([{
        buyer_id: buyerTenantId,
        supplier_id: supplierTenantId,
        status: 'PENDING'
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Connection already exists' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConnections = async (req: Request, res: Response) => {
  const tenantId = req.tenantId;

  try {
    // Fetch connections where the user is either the buyer or the supplier
    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        buyer:tenants!buyer_id(id, name, type),
        supplier:tenants!supplier_id(id, name, type)
      `)
      .or(`buyer_id.eq.${tenantId},supplier_id.eq.${tenantId}`);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateConnectionStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const tenantId = req.tenantId;

  if (!['ACTIVE', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const { data, error } = await supabase
      .from('connections')
      .update({ status })
      .match({ id, supplier_id: tenantId }) // Only supplier can accept/reject for now
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Connection not found or unauthorized' });

    res.json(data);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchSuppliers = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('id, name, type')
      .eq('type', 'SUPPLIER')
      .ilike('name', `%${query}%`)
      .limit(10);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
