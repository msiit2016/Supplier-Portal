import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase';

export const registerTenant = async (req: Request, res: Response) => {
  const { email, password, fullName, tenantName, tenantType } = req.body;

  if (!email || !password || !fullName || !tenantName || !tenantType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      return res.status(400).json({ error: authError?.message || 'Auth registration failed' });
    }

    const userId = authData.user.id;

    // 2. Create the Tenant (Using Admin client to bypass RLS during initial setup)
    const { data: tenantData, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert([{ name: tenantName, type: tenantType }])
      .select()
      .single();

    if (tenantError) {
      // Cleanup auth user if tenant creation fails? (Advanced logic)
      return res.status(500).json({ error: 'Failed to create tenant organization' });
    }

    // 3. Create the User Profile linked to the Tenant
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert([{
        id: userId,
        tenant_id: tenantData.id,
        full_name: fullName,
        role: 'ADMIN'
      }]);

    if (profileError) {
      return res.status(500).json({ error: 'Failed to create user profile' });
    }

    res.status(201).json({
      message: 'Registration successful',
      // Explicitly only return public data
      user: { id: authData.user.id, email: authData.user.email },
      tenant: { id: tenantData.id, name: tenantData.name, type: tenantData.type }
    });

  } catch (error) {
    // Audit check: Never log req.body here to protect PII
    console.error('[auth]: Registration caught a general exception.');
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  // Uses middleware data
  res.json({
    user: req.user,
    tenantId: req.tenantId
  });
};
