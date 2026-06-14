import { motion } from 'framer-motion';
import { Calendar, Newspaper, Clock, ChevronRight } from 'lucide-react';
import { getMediaUrl } from '../services/api';
import photo1 from '../assets/photo1.jpg';
import photo2 from '../assets/photo2.jpg';
import gr1 from '../assets/gr1.jpg';
import grad2 from '../assets/grad2.jpg';
import elevate1 from '../assets/people/elevate1.jpg';

const fallbackImages = [photo1, gr1, grad2, photo2, elevate1];

function formatDate(value) {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function timeAgo(value) {
  if (!value) return '';
  const now = new Date();
  const date = new Date(value);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(value);
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
            <div className="relative h-56 overflow-hidden sm:h-64">
              <img
                src={getMediaUrl(featured.image) || fallbackImages[0]}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f89f29]/40 bg-[#f89f29]/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#f89f29] backdrop-blur-sm mb-3">
                  <Clock size={10} />
                  {featured.created_at ? timeAgo(featured.created_at) : 'Recent'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-lg">{featured.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/80 line-clamp-2 drop-shadow">
                  {featured.excerpt || featured.content}
                </p>
              </div>
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
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm hover:border-[#15c8fb]/30 transition-all duration-300"
              >
                <div className="flex gap-3">
                  <div className="hidden sm:block w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={getMediaUrl(item.image) || fallbackImages[(index + 1) % fallbackImages.length]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-white/55 mb-1">
                      <Calendar size={10} />
                      {formatDate(item.created_at)}
                    </div>
                    <h4 className="text-sm font-black text-white line-clamp-2 group-hover:text-[#15c8fb] transition-colors">{item.title}</h4>
                    <p className="mt-1 text-xs leading-5 text-white/65 line-clamp-1">
                      {item.excerpt || item.content}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#15c8fb] opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more <ChevronRight size={10} />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
