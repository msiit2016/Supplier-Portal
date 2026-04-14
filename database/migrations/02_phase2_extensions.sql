-- USP Platform Phase 2 Extensions

-- 1. Product Catalog
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT,
    category TEXT,
    unit_price DECIMAL(15, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Collaboration (Comments)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL, -- PO ID or Invoice ID
    parent_type TEXT CHECK (parent_type IN ('PO', 'INVOICE')) NOT NULL,
    author_id UUID REFERENCES auth.users ON DELETE CASCADE,
    author_name TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Subscriptions & Limits
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    plan_type TEXT CHECK (plan_type IN ('FREE', 'BASIC', 'PRO', 'ENTERPRISE')) DEFAULT 'FREE',
    status TEXT DEFAULT 'ACTIVE',
    supplier_limit INTEGER DEFAULT 5,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Note: Policies will be added in backend logic or via Supabase dashboard
