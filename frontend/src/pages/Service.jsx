import { motion } from 'framer-motion';

const partners = [
  { name: "Telebirr", color: "#D42020", initials: "TB" },
  { name: "Ethio Telecom", color: "#0078D7", initials: "ET" },
  { name: "INSA", color: "#2E7D32", initials: "IN" },
  { name: "ASTU", color: "#6A1B9A", initials: "AS" },
  { name: "MoI", color: "#E65100", initials: "MI" }
];

export default function Services() {
  return (
    <div id="services" className="relative w-full bg-[#f8fafc]  py-16 md:py-24 sm:px-6 overflow-hidden transition-colors duration-500 font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#EEEFF8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FEF0EE]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- PARTNERS SECTION (The "Amazing View") --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 md:mb-24 text-center lg:text-left"
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 p-10 bg-white/5 border border-slate-100 backdrop-blur-3xl shadow-xl shadow-slate-500/5">
                <div className="flex-none max-w-xs">
                <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                    <span className="w-8 h-[2px] bg-[#EE8433]" />
                    <span className="text-[#EE8433] font-bold uppercase tracking-widest text-xs">Collaboration Network</span>
                </div>
                <p className="mt-2 text-sm text-slate-400 max-w-[200px] text-center lg:text-left">
                  Trusted by leading organizations across Ethiopia
                </p>
            </div>
            
                 {/* The Animated Infinite Scroll */}
             <div className="flex-grow w-full lg:w-auto relative group">
               <div className="overflow-hidden relative">
                 <div className="animate-loop-partners flex space-x-12 md:space-x-16 py-4">
                    {[...partners, ...partners].map((partner, index) => (
                      <motion.div 
                        key={`${partner.name}-${index}`} 
                        whileHover={{ scale: 1.08, y: -6 }}
                        className="flex-none flex items-center justify-center group-hover:cursor-pointer transition-transform"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div
                            className="h-16 w-16 md:h-20 md:w-20 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: partner.color }}
                          >
                            <span className="text-white text-xl md:text-2xl font-black tracking-tight drop-shadow-sm">
                              {partner.initials}
                            </span>
                          </div>
                          <span className="text-xs md:text-sm font-bold tracking-tight text-slate-700">
                            {partner.name}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                 </div>
               </div>
               
             </div>
          </div>
        </motion.div>

      </div>

      <style>{`
        @keyframes loop-partners {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-loop-partners {
          animation: loop-partners 20s linear infinite;
        }
        .animate-loop-partners:hover {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}