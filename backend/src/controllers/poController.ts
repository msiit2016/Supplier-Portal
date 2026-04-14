import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const createPO = async (req: Request, res: Response) => {
  const { supplierTenantId, poNumber, items, totalAmount } = req.body;
  const buyerTenantId = req.tenantId;

  if (!supplierTenantId || !poNumber || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Missing required PO data' });
  }

  try {
    // 1. Create the PO header
    const { data: po, error: poError } = await supabase
      .from('purchase_orders')
      .insert([{
        tenant_id: buyerTenantId,
        supplier_tenant_id: supplierTenantId,
        po_number: poNumber,
        status: 'SENT',
        total_amount: totalAmount
      }])
      .select()
      .single();

    if (poError) return res.status(500).json({ error: poError.message });

    // 2. Create the PO items
    const poItems = items.map((item: { description: string, quantity: number, unit_price: number }) => ({
      po_id: po.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));

    const { error: itemsError } = await supabase
      .from('po_items')
      .insert(poItems);

    if (itemsError) return res.status(500).json({ error: itemsError.message });

    res.status(201).json(po);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPOs = async (req: Request, res: Response) => {
  const tenantId = req.tenantId;

  try {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        supplier:tenants!supplier_tenant_id(id, name),
        buyer:tenants!tenant_id(id, name),
        items:po_items(*)
      `)
      .or(`tenant_id.eq.${tenantId},supplier_tenant_id.eq.${tenantId}`)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePOStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const tenantId = req.tenantId;

  try {
    const { data, error } = await supabase
      .from('purchase_orders')
      .update({ status })
      .match({ id }) // Verification logic: only involved parties can update
      .or(`tenant_id.eq.${tenantId},supplier_tenant_id.eq.${tenantId}`)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
