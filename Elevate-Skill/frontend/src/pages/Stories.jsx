import React, { useState } from 'react';
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
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- SECTION HEADER --- */}
        <div className="text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="w-12 h-[2px] bg-[#f89f29]" />
            <span className="text-[#f89f29] font-black uppercase tracking-[0.3em] text-sm">Testimonials</span>
            <span className="w-12 h-[2px] bg-[#f89f29]" />
          </motion.div>
        </div>

        {/* --- ZIG-ZAG LIST --- */}
        <div className="space-y-40">
          {testimonials.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
            >
              
              {/* --- VIDEO PART --- */}
              <div className="w-full lg:w-1/2 relative group">
                {/* Decorative Background Glow */}
                <div 
                  className="absolute -inset-4 blur-3xl opacity-20 rounded-full transition-all group-hover:opacity-40" 
                  style={{ backgroundColor: item.color }}
                />
                
                {/* Video Frame */}
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
                  <iframe 
                    className="w-full h-full"
                    src={`${item.video}?controls=0&rel=0&modestbranding=1`}
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
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[#f89f29] font-bold tracking-[0.2em] text-sm uppercase">
                    {item.role}
                  </p>
                </div>
                      {/* color = #2c67b6,  #f89f29, #944063, #3d208e */}
                <p className="text-xl md:text-2xl text-white/60 leading-relaxed italic">
                  "{item.story}"
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center pt-6">
                  <button 
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-black text-xs tracking-widest text-white transition-all hover:scale-105"
                    style={{ backgroundColor: item.color }}
                  >
                    FULL CASE STUDY <ExternalLink size={16} />
                  </button>
                  <div className="flex items-center gap-3 px-6 text-white/40 font-bold text-xs">
                    VERIFIED TESTIMONIAL
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* --- BOTTOM CTA --- */}
        <div className="mt-40 p-12 bg-gradient-to-br from-[#3C83F6]/20 to-[#f89f29]/20 border border-white/10 text-center">
          <h4 className="text-3xl md:text-5xl font-black text-white mb-6">Want to be our next story?</h4>
          <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
            Join 24,000+ engineers and designers who have already transformed their careers through our elite curriculum.
          </p>
          <button className="px-12 py-6 bg-white text-black font-black rounded-full hover:bg-[#3C83F6] hover:text-white transition-all tracking-tighter text-lg">
            START YOUR JOURNEY NOW
          </button>
        </div>

      </div>

      {/* Decorative Accents */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#3C83F6]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-[#f89f29]/10 blur-[150px] rounded-full" />
      </div>
    </div>
  );
}