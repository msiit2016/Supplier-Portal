import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const flipPOToInvoice = async (req: Request, res: Response) => {
  const { poId } = req.params;
  const supplierTenantId = req.tenantId;

  try {
    // 1. Fetch PO and its items
    const { data: po, error: poError } = await supabase
      .from('purchase_orders')
      .select('*, items:po_items(*)')
      .eq('id', poId)
      .eq('supplier_tenant_id', supplierTenantId)
      .single();

    if (poError || !po) {
      return res.status(404).json({ error: 'Purchase Order not found or unauthorized' });
    }

    if (po.status !== 'ACCEPTED') {
      return res.status(400).json({ error: 'Only accepted POs can be flipped to invoices' });
    }

    // 2. Generate Invoice Number (Simple implementation for MVP)
    const invoiceNumber = `INV-${po.po_number.split('-').pop()}-${Date.now().toString().slice(-4)}`;

    // 3. Create Invoice Header
    const { data: invoice, error: invError } = await supabase
      .from('invoices')
      .insert([{
        tenant_id: supplierTenantId, // Supplier is the issuer
        buyer_tenant_id: po.tenant_id,
        po_id: po.id,
        invoice_number: invoiceNumber,
        status: 'SENT',
        total_amount: po.total_amount
      }])
      .select()
      .single();

    if (invError) return res.status(500).json({ error: invError.message });

    // 4. Copy PO items to Invoice items
    const invoiceItems = po.items.map((item: any) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) return res.status(500).json({ error: itemsError.message });

    // 5. Update PO status to COMPLETED
    await supabase
      .from('purchase_orders')
      .update({ status: 'COMPLETED' })
      .eq('id', po.id);

    res.status(201).json(invoice);
  } catch (err) {
    console.error('Flip Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  const tenantId = req.tenantId;

  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        buyer:tenants!buyer_tenant_id(id, name),
        supplier:tenants!tenant_id(id, name),
        items:invoice_items(*)
      `)
      .or(`tenant_id.eq.${tenantId},buyer_tenant_id.eq.${tenantId}`)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateInvoiceStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const tenantId = req.tenantId;

  try {
    const { data, error } = await supabase
      .from('invoices')
      .update({ status })
      .match({ id })
      .or(`tenant_id.eq.${tenantId},buyer_tenant_id.eq.${tenantId}`)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
