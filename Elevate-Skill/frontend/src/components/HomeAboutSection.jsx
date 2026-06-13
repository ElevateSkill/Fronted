import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { getMediaUrl } from '../services/api';
import aboutFallback from '../assets/grad2.jpg';

const fallbackContent = {
  title: 'About Elevate Skill',
  content: 'Elevate Skill is a project-based learning platform focused on real outcomes, practical systems, and career-ready digital skills.',
};

export default function HomeAboutSection({ aboutData }) {
  const title = aboutData?.title?.trim() || fallbackContent.title;
  const content = aboutData?.content?.trim() || fallbackContent.content;
  const image = getMediaUrl(aboutData?.image) || aboutFallback;

  return (
    <section className="relative w-full overflow-hidden bg-black px-6 py-14 md:py-16">
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-[#15c8fb]/10 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#f89f29]/10 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/20 md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#15c8fb]/35 bg-[#15c8fb]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#15c8fb]">
            <FileText size={12} />
            About
          </span>
          <h3 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">{title}</h3>
          <p className="mt-4 text-sm leading-7 text-white/70">{content}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="overflow-hidden rounded-xl border border-white/10"
        >
          <img src={image} alt={title} className="h-full min-h-[220px] w-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}
