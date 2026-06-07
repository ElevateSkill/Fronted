import { motion } from 'framer-motion';
import { SlidersHorizontal, Edit3, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

export default function HeroSlides({ slides, onAdd, onEdit, onDelete, onToggleActive }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-brand-text tracking-tight">Hero Slides</h2>
          <p className="text-sm text-brand-muted font-medium mt-1">{slides.length} slides · Manage your landing page hero slider</p>
        </div>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-orange to-brand-primary text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider cursor-pointer">
          <Plus size={16} /> Add Slide
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {slides.map((slide, i) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-brand-border bg-brand-card overflow-hidden hover:border-brand-primary/30 transition-all group"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-72 h-48 md:h-auto relative shrink-0">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${slide.active ? 'bg-brand-violet text-white' : 'bg-gray-700 text-gray-300'}`}>
                    {slide.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </div>
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-brand-muted font-bold">Slide {i + 1}</span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: slide.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-brand-text mb-1">
                    {slide.title}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-primary">
                      {slide.highlight}
                    </span>
                  </h3>
                  <p className="text-sm text-brand-muted mb-3">{slide.subtitle}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="px-3 py-1 rounded-lg bg-brand-card text-brand-text font-bold">{slide.cta}</span>
                    <span className="flex items-center gap-1 text-brand-muted">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: slide.color }} /> {slide.color}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-brand-border">
                  <button onClick={() => onEdit(slide)} className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all cursor-pointer"><Edit3 size={14} /></button>
                  <button onClick={() => onToggleActive(slide)} className="p-2 rounded-lg bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30 transition-all cursor-pointer">
                    {slide.active ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => onDelete(slide.id)} className="p-2 rounded-lg bg-brand-red/20 text-brand-red hover:bg-brand-red/30 transition-all cursor-pointer"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
