import { motion } from 'framer-motion';
import { Newspaper, Edit3, Trash2, Plus, CheckCircle, XCircle, Calendar, User } from 'lucide-react';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import EmptyState from '../../../components/dashboard/EmptyState';

export default function Posts({ posts, onAdd, onEdit, onDelete, onToggleStatus }) {
  const published = posts.filter(p => p.status === 'Published').length;
  const drafts = posts.filter(p => p.status === 'Draft').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-brand-text tracking-tight">Posts</h2>
          <p className="text-sm text-brand-muted font-medium mt-1">
            {published} published{published > 0 && ` · ${drafts} drafts`}
          </p>
        </div>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider cursor-pointer">
          <Plus size={16} /> New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" description="Create your first blog post." action={
          <button onClick={onAdd} className="px-4 py-2 bg-brand-primary text-white font-bold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer">Create Post</button>
        } />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 200, damping: 20 }}
              className="rounded-2xl border border-brand-border bg-brand-card overflow-hidden hover:border-brand-primary/30 hover:shadow-sm transition-all group"
            >
              <div className="h-44 overflow-hidden relative bg-black/40">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper size={40} className="text-brand-muted/30" />
                  </div>
                )}
                <div className="absolute top-3 right-3 z-10">
                  <StatusBadge status={post.status} />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-[10px] text-brand-muted mb-2">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {post.date || '—'}</span>
                  <span className="flex items-center gap-1"><User size={10} /> {post.author || '—'}</span>
                </div>
                <h3 className="font-bold text-brand-text mb-1 group-hover:text-brand-primary transition-colors leading-tight">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-xs text-brand-muted mb-4 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-2 pt-2 border-t border-brand-border/50">
                  <button onClick={() => onEdit(post)} className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all cursor-pointer" title="Edit">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => onDelete(post.id)} className="p-2 rounded-lg bg-brand-red/20 text-brand-red hover:bg-brand-red/30 transition-all cursor-pointer" title="Delete">
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => onToggleStatus(post)}
                    className={`ml-auto p-2 rounded-lg transition-all cursor-pointer ${
                      post.status === 'Published'
                        ? 'bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30'
                        : 'bg-brand-violet/20 text-brand-violet hover:bg-brand-violet/30'
                    }`}
                    title={post.status === 'Published' ? 'Set as Draft' : 'Publish'}
                  >
                    {post.status === 'Published' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
