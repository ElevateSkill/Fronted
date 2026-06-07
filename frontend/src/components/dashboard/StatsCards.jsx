import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function StatsCards({ cards, onCardClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="relative overflow-hidden rounded-2xl bg-brand-card border border-brand-border p-5 group hover:border-brand-primary/30 hover:shadow-sm transition-all cursor-pointer"
          onClick={() => onCardClick?.(card)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 to-brand-orange/0 group-hover:from-brand-primary/[0.03] group-hover:to-brand-orange/[0.03] transition-all" />
          <div className="flex items-center justify-between mb-4 relative">
            <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
              {card.icon}
            </div>
            <TrendingUp size={16} className="text-brand-violet/50" />
          </div>
          <p className="text-2xl font-black text-brand-text tracking-tight relative">{card.value}</p>
          <p className="text-[11px] text-brand-muted font-medium mt-1 tracking-wide relative">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
