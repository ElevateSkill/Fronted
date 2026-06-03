import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Volume2, Maximize, Settings, 
  CheckCircle2, Star, Quote, ExternalLink 
} from 'lucide-react';

const testimonials = [
  {
    id: "1",
    name: "DAWIT MEKONNEN",
    role: "Senior Fullstack Engineer",
    company: "Addis Tech Hub",
    video: "https://www.youtube.com/embed/aqz-KE-bpKQ", // Sample Coding/Tech Video
    story: "The transition from finance to tech seemed impossible until I joined. The project-based approach taught me how to architect complex systems. I doubled my salary in six months.",
    color: "#3C83F6"
  },
  {
    id: "2",
    name: "SELAWAWIT BEKELE",
    role: "UI/UX Lead",
    company: "Creative Flow Agency",
    video: "https://www.youtube.com/embed/c9Wg6A_9f4U", // Sample Design Video
    story: "Most courses focus on tools, but here I learned the psychology of design. The feedback from world-class mentors helped me build a portfolio that landed me a lead role.",
    color: "#f89f29"
  },
  {
    id: "3",
    name: "ABENEZER LEMMA",
    role: "AI Researcher",
    company: "Neural Systems",
    video: "https://www.youtube.com/embed/aircAruvnKk", // Sample AI Video
    story: "While others were talking about AI, we were building LLM integrations. The curriculum is consistently six months ahead of the industry standards.",
    color: "#3C83F6"
  }
];

export default function VideoSuccessStories() {
  return (
    <div className="relative bg-gray-50 dark:bg-[#050505] py-16 md:py-24 px-6 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3C83F6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#f89f29]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- SECTION HEADER --- */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-[2px] w-12 bg-[#f89f29]" />
            <span className="text-[#f89f29] font-black uppercase tracking-[0.3em] text-xs">Success Stories</span>
            <span className="h-[2px] w-12 bg-[#f89f29]" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-black dark:text-white text-gray-900 tracking-tight">
            Trusted by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f89f29] to-[#3C83F6]">Thousands</span>
          </h2>
          <p className="text-gray-500 dark:text-white/40 text-sm mt-3 max-w-xl mx-auto">
            Hear from our community of engineers and designers who transformed their careers.
          </p>
        </div>

        {/* --- ZIG-ZAG LIST --- */}
        <div className="space-y-24 md:space-y-32">
          {testimonials.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-20`}
            >
              
              {/* --- VIDEO PART --- */}
              <div className="w-full lg:w-1/2 relative group">
                {/* Decorative Background Glow */}
                <div 
                  className="absolute -inset-4 blur-3xl opacity-20 rounded-full transition-all group-hover:opacity-40" 
                  style={{ backgroundColor: item.color }}
                />
                
                {/* Video Frame */}
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-black/50 shadow-2xl">
                  <iframe 
                    className="w-full h-full"
                    src={item.video}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>

                  {/* Custom Interface Overlay (Visual Only) */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-start">
                      <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] text-white font-bold border border-white/10">
                         {item.company}
                      </div>
                      <Settings size={18} className="text-white/70" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-white/80">
                        <Volume2 size={18} />
                        <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
                           <div className="h-full w-2/3 bg-[#3C83F6]" />
                        </div>
                      </div>
                      <Maximize size={18} className="text-white/80" />
                    </div>
                  </div>
                </div>
                
              </div>

              {/* --- DESCRIPTION PART --- */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-3xl md:text-4xl font-black dark:text-white text-gray-900 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[#f89f29] font-bold tracking-[0.2em] text-xs uppercase">
                    {item.role} · {item.company}
                  </p>
                </div>
                <p className="text-base md:text-lg text-gray-600 dark:text-white/60 leading-relaxed italic">
                  "{item.story}"
                </p>

                <div className="flex items-center gap-2 pt-4">
                  <button 
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-xs tracking-widest text-white transition-all hover:brightness-110 shadow-xl"
                    style={{ backgroundColor: item.color }}
                  >
                    FULL CASE STUDY <ExternalLink size={14} />
                  </button>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-white/40 font-bold text-[10px] uppercase tracking-wider border border-gray-200 dark:border-white/10">
                    VERIFIED
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* --- BOTTOM CTA --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-10 md:p-14 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl text-center shadow-2xl shadow-black/5 dark:shadow-white/5"
        >
          <h4 className="text-2xl md:text-4xl font-black dark:text-white text-gray-900 mb-3">Want to be our next story?</h4>
          <p className="text-gray-500 dark:text-white/40 text-sm mb-8 max-w-xl mx-auto">
            Join 24,000+ engineers and designers who have already transformed their careers.
          </p>
          <button className="px-10 py-4 bg-gradient-to-r from-[#f89f29] to-[#3C83F6] text-white font-black text-xs rounded-2xl hover:brightness-110 transition-all uppercase tracking-wider shadow-2xl">
            Start Your Journey Now
          </button>
        </motion.div>

      </div>
    </div>
  );
}