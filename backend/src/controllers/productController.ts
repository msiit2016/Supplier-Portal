import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, sku, category, unitPrice, currency } = req.body;
  const tenantId = req.tenantId;

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        tenant_id: tenantId,
        name,
        description,
        sku,
        category,
        unit_price: unitPrice,
        currency
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const { supplierId } = req.query; // If provided, fetch for that supplier (Buyer view)
  const tenantId = req.tenantId;

  try {
    const targetTenantId = supplierId || tenantId;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', targetTenantId)
      .eq('is_active', true)
      .order('name');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const tenantId = req.tenantId;

  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .match({ id, tenant_id: tenantId })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
