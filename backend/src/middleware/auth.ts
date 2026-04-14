import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

// Extend Express Request type to include user data
declare global {
  namespace Express {
    interface Request {
      user?: import('@supabase/supabase-js').User;
      tenantId?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Malformed authorization header' });
  }

  try {
    // 1. Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 2. Fetch tenant_id from user_profiles
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('tenant_id, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ error: 'User profile or tenant not found' });
    }

    // 3. Inject into request
    req.user = user;
    req.tenantId = profile.tenant_id;

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
