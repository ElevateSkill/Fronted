import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, Maximize, Settings, 
  ExternalLink 
} from 'lucide-react';
import useBackendData from '../hooks/useBackendData';
import { testimonialsAPI, getMediaUrl } from '../services/api';

const safeStr = (v, fallback = '') => (v != null && typeof v !== 'object') ? String(v) : fallback;

const adaptAPIToStory = (t) => ({
  id: t.id || String(Math.random()),
  name: safeStr(t.student_name, '').toUpperCase(),
  role: safeStr(t.role, 'Graduate'),
  company: safeStr(t.company),
  video: safeStr(t.video),
  story: safeStr(t.message),
  image: getMediaUrl(t.student_image) || '',
  color: t.color || '#EE8433'
});

export default function VideoSuccessStories() {
  const { data: fetched } = useBackendData(testimonialsAPI.active);

  const stories = useMemo(() => {
    if (fetched && fetched.length) {
      const mapped = fetched.map(adaptAPIToStory);
      const withVideo = mapped.filter(s => s.video);
      if (withVideo.length) return withVideo;
    }
    return [];
  }, [fetched]);

  if (stories.length === 0) return null;

  return (
    <div className="relative bg-gray-50 py-16 md:py-24 px-6 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#EE8433]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#3A3992]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        


        {/* --- ZIG-ZAG LIST --- */}
        <div className="space-y-24 md:space-y-32">
          {stories.map((item, index) => (
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
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-gray-200 bg-gray-100 shadow-2xl">
                  <iframe 
                    className="w-full h-full"
                    src={item.video}
                    title="Success story video"
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
                           <div className="h-full w-2/3 bg-[#EE8433]" />
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
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[#3A3992] font-bold tracking-[0.2em] text-xs uppercase">
                    {item.role} {item.company && `· ${item.company}`}
                  </p>
                </div>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed italic">
                  "{item.story}"
                </p>

                <div className="flex items-center gap-2 pt-4">
                  <button 
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-xs tracking-widest text-white transition-all hover:brightness-110 shadow-xl"
                    style={{ backgroundColor: item.color }}
                  >
                    FULL CASE STUDY <ExternalLink size={14} />
                  </button>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-200 text-gray-500 font-bold text-[10px] uppercase tracking-wider border border-gray-200">
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
          className="mt-24 p-10 md:p-14 bg-gray-100 border border-gray-200 rounded-3xl text-center shadow-2xl shadow-black/5"
        >
          <h4 className="text-2xl md:text-4xl font-black text-gray-900 mb-3">Want to be our next story?</h4>
          <p className="text-gray-500 text-sm mb-8 max-w-xl mx-auto">
            Join our growing community of learners who have already transformed their careers.
          </p>
          <button className="px-10 py-4 bg-gradient-to-r from-[#3A3992] to-[#EE8433] text-white font-black text-xs rounded-2xl hover:brightness-110 transition-all uppercase tracking-wider shadow-2xl">
            Start Your Journey Now
          </button>
        </motion.div>

      </div>
    </div>
  );
}
