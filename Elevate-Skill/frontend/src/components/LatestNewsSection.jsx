import { motion } from 'framer-motion';
import { Calendar, Newspaper } from 'lucide-react';
import { getMediaUrl } from '../services/api';

const fallbackImage = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900';

function formatDate(value) {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default function LatestNewsSection({ items = [] }) {
  if (!items.length) return null;

  const [featured, ...others] = items;
  const sideItems = others.slice(0, 3);

  return (
    <section className="relative w-full overflow-hidden bg-black px-6 py-14 md:py-16">
      <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#15c8fb]/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-[#f89f29]/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#15c8fb]/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#15c8fb]/35 bg-[#15c8fb]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#15c8fb]">
              <Newspaper size={12} />
              Latest News
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              New updates from admin are live on the homepage
            </h2>
          </div>
          <p className="max-w-lg text-sm text-white/60">
            The newest published posts appear here first, then continue in the full blog section below.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.35 }}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl shadow-black/25 lg:col-span-2"
          >
            <div className="relative h-56 overflow-hidden border-b border-white/10 sm:h-64">
              <img
                src={getMediaUrl(featured.image) || fallbackImage}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-[#f89f29]/40 bg-[#f89f29]/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#f89f29]">
                New
              </span>
            </div>
            <div className="p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2 text-xs text-white/60">
                <Calendar size={13} />
                {formatDate(featured.created_at)}
              </div>
              <h3 className="text-xl font-black leading-tight text-white">{featured.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/70 line-clamp-3">
                {featured.excerpt || featured.content}
              </p>
            </div>
          </motion.article>

          <div className="space-y-4">
            {sideItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
              >
                <div className="mb-2 flex items-center gap-2 text-[11px] text-white/55">
                  <Calendar size={12} />
                  {formatDate(item.created_at)}
                </div>
                <h4 className="text-sm font-black text-white line-clamp-2">{item.title}</h4>
                <p className="mt-2 text-xs leading-5 text-white/65 line-clamp-2">
                  {item.excerpt || item.content}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
