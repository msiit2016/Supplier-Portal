-- USP Platform Schema (Supabase / PostgreSQL)

-- 1. Tenants Table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('BUYER', 'SUPPLIER')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users Profile Table (Linked to Supabase Auth)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT CHECK (role IN ('ADMIN', 'USER')) DEFAULT 'USER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Connections (Buyer-Supplier relationships)
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('PENDING', 'ACTIVE', 'REJECTED')) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(buyer_id, supplier_id)
);

-- 4. Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE, -- Buyer tenant
    supplier_tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    po_number TEXT NOT NULL UNIQUE,
    status TEXT CHECK (status IN ('DRAFT', 'SENT', 'ACCEPTED', 'COMPLETED', 'CANCELLED')) DEFAULT 'DRAFT',
    total_amount DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PO Items
CREATE TABLE po_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(12, 4) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_price DECIMAL(15, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- 6. Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE, -- Supplier tenant
    buyer_tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    po_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL UNIQUE,
    status TEXT CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'OVERDUE')) DEFAULT 'DRAFT',
    total_amount DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Invoice Items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(12, 4) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_price DECIMAL(15, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- Enable Row Level Security (RLS)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Will be refined later)
-- Note: Simplified for initial setup; usually linked to auth.uid() and user_profiles.tenant_id
-- Example: Policy for POs (only show to buyer or supplier)
-- CREATE POLICY po_tenant_policy ON purchase_orders
-- FOR ALL USING (
--   tenant_id = (SELECT tenant_id FROM user_profiles WHERE id = auth.uid()) OR
--   supplier_tenant_id = (SELECT tenant_id FROM user_profiles WHERE id = auth.uid())
-- );
