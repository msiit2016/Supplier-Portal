'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Send, X, MessageSquare, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface CommentSidebarProps {
  parentId: string;
  parentType: 'PO' | 'INVOICE';
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentSidebar({ parentId, parentType, isOpen, onClose }: CommentSidebarProps) {
  const { session } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/comments/${parentId}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  }, [parentId, session]);

  useEffect(() => {
    if (isOpen && session) {
      fetchComments();
    }
  }, [isOpen, session, fetchComments]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/comments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          parentId,
          parentType,
          content: newComment
        }),
      });
      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      console.error('Post comment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-300">
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
           <MessageSquare className="h-4 w-4 text-blue-600" />
           <h3 className="font-black text-slate-900 tracking-tight uppercase text-sm">Collaboration</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
           <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-10">
             <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-slate-200" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No messages yet</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-1">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{comment.author_name}</span>
                  <span className="text-[9px] text-slate-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100">
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">{comment.content}</p>
               </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/30">
        <form onSubmit={handlePostComment} className="relative">
           <textarea 
             rows={2}
             placeholder="Discuss this transaction..."
             className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-none"
             value={newComment}
             onChange={(e) => setNewComment(e.target.value)}
           />
           <button 
             type="submit"
             disabled={loading}
             className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
           >
             <Send className="h-4 w-4" />
           </button>
        </form>
      </div>
    </div>
  );
}
