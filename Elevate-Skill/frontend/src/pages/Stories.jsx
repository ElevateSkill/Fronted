import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Volume2, Maximize, Settings, 
  CheckCircle2, Star, Quote, ExternalLink, Award
} from 'lucide-react';
import { loadData } from '../data/dataStore';

const defaultTestimonials = [
  {
    id: "1", name: "DAWIT MEKONNEN", role: "Senior Fullstack Engineer",
    company: "Addis Tech Hub", video: "https://www.youtube.com/embed/aqz-KE-bpKQ",
    story: "The transition from finance to tech seemed impossible until I joined. The project-based approach taught me how to architect complex systems. I doubled my salary in six months.",
    rating: 5
  },
  {
    id: "2", name: "SELAMAWIT BEKELE", role: "UI/UX Lead",
    company: "Creative Flow Agency", video: "https://www.youtube.com/embed/c9Wg6A_9f4U",
    story: "Most courses focus on tools, but here I learned the psychology of design. The feedback from world-class mentors helped me build a portfolio that landed me a lead role.",
    rating: 5
  },
  {
    id: "3", name: "ABENEZER LEMMA", role: "AI Researcher",
    company: "Neural Systems", video: "https://www.youtube.com/embed/aircAruvnKk",
    story: "While others were talking about AI, we were building LLM integrations. The curriculum is consistently six months ahead of the industry standards.",
    rating: 5
  }
];

const stored = loadData('testimonials');
const testimonials = stored.length ? stored : defaultTestimonials;

export default function VideoSuccessStories() {
  return (
    <div className="relative bg-black py-20 md:py-32 px-6 overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#15c8fb]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-[#f89f29]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-[#15c8fb]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[250px] h-[250px] bg-[#f89f29]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* --- ZIG-ZAG LIST --- */}
        <div className="space-y-20 md:space-y-28">
          {testimonials.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-16`}
            >
              
              {/* --- VIDEO --- */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-3 bg-gradient-to-br from-[#15c8fb]/20 to-[#f89f29]/20 blur-3xl opacity-30 group-hover:opacity-60 transition-all duration-700 rounded-full" />
                
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/80 shadow-2xl shadow-black/50">
                  <iframe 
                    className="w-full h-full"
                    src={item.video}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />

                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[10px] text-white/60 font-mono">LIVE</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/60">
                        <Volume2 size={14} />
                        <Maximize size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- CONTENT --- */}
              <div className="w-full lg:w-1/2 space-y-5">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < item.rating ? 'fill-[#f89f29] text-[#f89f29]' : 'text-white/20'} />
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15c8fb]" />
                    <p className="text-[#f89f29] font-bold tracking-[0.15em] text-xs uppercase">
                      {item.role}
                    </p>
                    <span className="text-white/40">·</span>
                    <p className="text-white/60 font-medium text-xs">
                      {item.company}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <Quote size={24} className="absolute -top-2 -left-1 text-[#15c8fb]/20" />
                  <p className="text-base md:text-lg text-white/80 leading-relaxed pl-6 border-l-2 border-[#15c8fb]/50">
                    "{item.story}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs tracking-widest text-white bg-gradient-to-r from-[#15c8fb] to-[#0fa3d4] hover:brightness-110 transition-all shadow-lg shadow-[#15c8fb]/20">
                    <Play size={14} /> WATCH FULL STORY
                  </button>
                  <div className="flex items-center gap-1.5 px-3 py-3 rounded-xl bg-white/[0.07] text-white/60 font-bold text-[10px] uppercase tracking-wider border border-white/10">
                    <Award size={12} className="text-[#f89f29]" /> Verified Graduate
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
          className="relative mt-24 p-10 md:p-14 rounded-3xl text-center overflow-hidden border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#15c8fb]/10 via-black to-[#f89f29]/10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#15c8fb]/20 rounded-full blur-[100px]" />
          
          <div className="relative z-10">
            <h4 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight">Ready to write your story?</h4>
            <p className="text-white/60 text-sm mb-8 max-w-xl mx-auto">
              Join 24,000+ engineers and designers who already transformed their careers through project-based learning.
            </p>
            <button className="px-10 py-4 bg-gradient-to-r from-[#f89f29] to-[#e88a1a] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider shadow-2xl shadow-[#f89f29]/20">
              Start Your Journey
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}