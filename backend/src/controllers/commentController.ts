import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const postComment = async (req: Request, res: Response) => {
  const { parentId, parentType, content } = req.body;
  const userId = req.user!.id; // From authMiddleware

  if (!parentId || !parentType || !content) {
    return res.status(400).json({ error: 'Missing comment data' });
  }

  try {
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    const { data, error } = await supabase
      .from('comments')
      .insert([{
        parent_id: parentId,
        parent_type: parentType,
        author_id: userId,
        author_name: userProfile?.full_name || 'System User',
        content
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  const { parentId } = req.params;

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
};
