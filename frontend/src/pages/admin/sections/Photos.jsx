import { motion } from 'framer-motion';
import { Upload, Download, Trash2, Camera } from 'lucide-react';
import EmptyState from '../../../components/dashboard/EmptyState';

export default function Photos({ photos, onUpload, onDelete }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-brand-text tracking-tight">Photos</h2>
          <p className="text-sm text-brand-muted font-medium mt-1">{photos.length} photos uploaded</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider cursor-pointer">
          <Upload size={16} /> Upload
          <input type="file" multiple accept="image/*" className="hidden" onChange={onUpload} />
        </label>
      </div>

      {photos.length === 0 ? (
        <EmptyState icon={Camera} title="No photos yet" description="Upload photos to build your media library." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="relative group aspect-square rounded-xl overflow-hidden border border-brand-border bg-brand-card"
            >
              <img src={photo.url} alt={photo.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <a href={photo.url} download className="p-2 rounded-lg bg-white/20 backdrop-blur text-white hover:bg-white/40 transition-all"><Download size={16} /></a>
                <button onClick={() => onDelete(photo.id)} className="p-2 rounded-lg bg-white/20 backdrop-blur text-white hover:bg-brand-red/60 transition-all cursor-pointer"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
