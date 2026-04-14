-- USP Platform: Comprehensive Row-Level Security (RLS) Policies

-- 1. Tenants Table
CREATE POLICY "Users can view their own tenant" ON tenants
FOR SELECT USING (
    id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
);

-- 2. User Profiles Table
CREATE POLICY "Users can view profiles in their own tenant" ON user_profiles
FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can update their own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

-- 3. Connections Table
CREATE POLICY "Users can view connections for their tenant" ON connections
FOR SELECT USING (
    buyer_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()) OR
    supplier_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
);

CREATE POLICY "Buyers can invite suppliers" ON connections
FOR INSERT WITH CHECK (
    buyer_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
);

-- 4. Purchase Orders Table
CREATE POLICY "Users can view POs they are part of" ON purchase_orders
FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()) OR
    supplier_tenant_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
);

CREATE POLICY "Buyers can create POs" ON purchase_orders
FOR INSERT WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
);

-- 5. Invoices Table
CREATE POLICY "Users can view Invoices they are part of" ON invoices
FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()) OR
    buyer_tenant_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
);

CREATE POLICY "Suppliers can create Invoices" ON invoices
FOR INSERT WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
);

-- 6. Products Table
CREATE POLICY "Suppliers can manage their own products" ON products
FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
);

CREATE POLICY "Connected buyers can view supplier products" ON products
FOR SELECT USING (
    tenant_id IN (
        SELECT supplier_id FROM connections 
        WHERE buyer_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
        AND status = 'ACTIVE'
    )
);

-- 7. Comments Table
CREATE POLICY "Users can view comments on accessible parent objects" ON comments
FOR SELECT USING (
    parent_id IN (SELECT id FROM purchase_orders) OR
    parent_id IN (SELECT id FROM invoices)
);
-- Note: Further refinement of comments RLS might be needed based on parent object accessibility.

-- 8. Subscriptions Table
CREATE POLICY "Users can view their own tenant subscription" ON subscriptions
FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
);
