import { motion } from 'framer-motion';
import { Image, Edit3, Trash2, Plus, ChevronRight } from 'lucide-react';
import EmptyState from '../../../components/dashboard/EmptyState';

export default function Gallery({ albums, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-brand-text tracking-tight">Gallery</h2>
          <p className="text-sm text-brand-muted font-medium mt-1">{albums.length} albums</p>
        </div>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider cursor-pointer">
          <Plus size={16} /> New Album
        </button>
      </div>

      {albums.length === 0 ? (
        <EmptyState icon={Image} title="No albums yet" description="Create your first gallery album." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album, i) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-brand-border bg-brand-card overflow-hidden hover:border-brand-orange/30 hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={album.cover} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg">{album.name}</h3>
                  <p className="text-white/70 text-xs">{album.count} photos</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-xs font-bold text-brand-primary flex items-center gap-1">
                  View Album <ChevronRight size={14} />
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(album); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-brand-muted transition-all cursor-pointer"><Edit3 size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(album.id); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-brand-muted transition-all cursor-pointer"><Trash2 size={14} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
