import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Lightbulb, PenTool, Target, 
  Users, Star, ArrowRight, CheckCircle2, Sparkles
} from 'lucide-react';

const partners = [
  { 
    name: "Telebirr", 
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5QSx1OlYRx97RD-tL2RlsOEVH1cC03-FGRQ&s" 
  },
  { 
    name: "Ethio Telecom", 
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTDCFNUCLWzR6RnHyk5bOzGnzG_rcgwvaF7w&s" 
  },
  { 
    name: "INSA", 
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4J-NYGjwxfcd__QckqaNtiwfZqh0DjasONg&s" 
  },
  { 
    name: "ASTU", 
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFeqX05EIfOZcZQtK_ICejDFf2NA9owk1d_g&s" 
  },
  { 
    name: "MoI", 
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_jpQpNR1h27E-Hfe7XCdrMIdyPDZBED2WUw&s" 
  }
];

const mainServices = [
  {
    id: 1,
    title: "INSPIRATIONAL IDEAS",
    short: "Creative conceptualization for modern brands.",
    desc: "We dive deep into your brand's DNA to extract unique concepts that resonate with your target audience. Our brainstorming sessions are designed to break conventional boundaries.",
    icon: <Lightbulb size={32} />,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800",
  },
  {
    id: 2,
    title: "HANDCRAFTED & SELFMADE",
    short: "Bespoke digital assets built from scratch.",
    desc: "No templates. No shortcuts. Every line of code and every pixel is handcrafted by our elite team of developers and designers to ensure maximum performance and originality.",
    icon: <PenTool size={32} />,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800",
  },
  {
    id: 3,
    title: "PERFECTION ON TIME",
    short: "Strict deadlines with uncompromising quality.",
    desc: "We value your time as much as our craft. Our agile workflow ensures that complex milestones are met with precision, delivering 'ready-to-market' products exactly when promised.",
    icon: <Target size={32} />,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800",
  }
];

export default function Services() {
  const [activeService, setActiveService] = useState(null);

  const toggleService = (id) => {
    setActiveService(activeService === id ? null : id);
  };

  const users = [
    "https://i.pravatar.cc/150?u=1",
    "https://i.pravatar.cc/150?u=2",
    "https://i.pravatar.cc/150?u=3",
    "https://i.pravatar.cc/150?u=4"
  ];

  return (
    <div id="services" className="relative w-full bg-[#f8fafc] dark:bg-[#050505] py-16 md:py-24 sm:px-6 overflow-hidden transition-colors duration-500 font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* --- PARTNERS SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 md:mb-24 text-center lg:text-left"
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 p-10 bg-white dark:bg-white/[0.04] border border-slate-100 dark:border-white/5 backdrop-blur-3xl shadow-xl shadow-slate-500/5">
            <div className="flex-none max-w-xs">
                <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                    <span className="w-8 h-[2px] bg-[#3C83F6]" />
                    <span className="text-[#3C83F6] font-bold uppercase tracking-widest text-xs">Collaboration Network</span>
                </div>
                <p className="mt-2 text-sm text-slate-400 max-w-[200px] text-center lg:text-left">
                  Trusted by leading organizations across Ethiopia
                </p>
            </div>
            
            {/* The Animated Infinite Scroll with Logos */}
            <div className="flex-grow w-full lg:w-auto relative group">
              <div className="overflow-hidden relative mask-image-gradient">
                <div className="animate-loop-partners flex space-x-12 md:space-x-16 py-4">
                  {[...partners, ...partners].map((partner, index) => (
                    <motion.div 
                      key={`${partner.name}-${index}`} 
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="flex-none flex items-center justify-center h-16 w-24 md:w-44 group-hover:cursor-pointer transition-transform"
                    >
                      <img 
                        src={partner.logo} 
                        alt={`${partner.name} logo`} 
                        className="h-auto max-h-full max-w-full object-contain filter dark:brightness-75 transition-all group-hover:brightness-100 opacity-40 dark:opacity-30 group-hover:opacity-100 drop-shadow-lg" 
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </motion.div>


        {/* --- EXPERTISE SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mx-2 gap-10 mb-16 md:mb-24">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-[#f89f29]/25 bg-[#f89f29]/10 px-4 py-2 backdrop-blur mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-[#f89f29]" />
              <span className="text-[#f89f29] font-black uppercase tracking-[0.28em] text-[10px]">Our Expertise</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              What We{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f89f29] via-[#D95C4A] to-[#3C83F6]">
                Do Best
              </span>
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto lg:mx-0">
              From concept to launch — we deliver digital excellence every step of the way.
            </p>
          </div>

          {/* Social Proof Join Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center lg:items-end gap-5 bg-white/50 dark:bg-white/5 p-6 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl shadow-black/5 dark:shadow-white/5"
          >
            <div className="flex justify-between">
                <div className="flex -space-x-3">
                {users.map((url, i) => (
                    <motion.img 
                        key={i} 
                        whileHover={{ y: -5, zIndex: 10 }}
                        src={url} 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white dark:border-[#0a0a0a] shadow-xl cursor-pointer" 
                        alt="user" 
                    />
                ))}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#3C83F6] to-blue-700 border-4 border-white dark:border-[#0a0a0a] flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-xl">
                    24k+
                </div>
                </div>
            </div>
            <button className="w-full sm:w-auto px-8 py-4 bg-[#3C83F6] hover:bg-[#2563eb] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden relative">
              <span className="relative z-10">JOIN PLATFORM</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </motion.div>
        </div>

        {/* --- SERVICES INTERACTIVE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative">
          
          {mainServices.map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              layout
               className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-500 border-2 ${
                activeService === service.id 
                ? 'bg-white dark:bg-[#111] border-[#3C83F6] shadow-2xl shadow-blue-500/10' 
                : 'bg-white/70 dark:bg-white/[0.03] border-transparent hover:border-slate-200 dark:hover:border-white/10 shadow-xl shadow-black/5 dark:shadow-white/5'
              }`}
            >
              {/* Image Header */}
              <div className="h-52 w-full overflow-hidden relative">
                <img 
                    src={service.image} 
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                    alt={service.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className={`absolute top-6 right-6 p-3 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-white`}>
                    {React.cloneElement(service.icon, { size: 24 })}
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-black mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFC107] via-[#F59E0B] to-[#1E40AF]">{service.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed font-medium">
                  {service.short}
                </p>

                {/* Dropdown Button */}
                <button 
                  onClick={() => toggleService(service.id)}
                  className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all duration-300 ${
                    activeService === service.id 
                    ? 'bg-[#3C83F6] text-white' 
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold text-xs uppercase tracking-[0.2em]">Explore Service</span>
                  <motion.div
                    animate={{ rotate: activeService === service.id ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {activeService === service.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 space-y-6 relative z-10">
                        <div className="relative p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5">
                            <Sparkles className="absolute -top-3 -left-3 text-[#f89f29]" size={20} />
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 italic">
                            "{service.desc}"
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-[10px] font-black text-[#f89f29] border border-red-100 dark:border-red-500/20">
                              24/7 PRIORITY
                           </div>
                           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-[10px] font-black text-[#3C83F6] border border-blue-100 dark:border-blue-500/20">
                              ELITE RATING
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-32 p-[2px] bg-gradient-to-r from-transparent via-[#3C83F6] to-transparent rounded-[3rem]"
        >
          <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-slate-900/20">
            <div className="text-center lg:text-left">
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md">Join 24,000+ visionaries scaling their digital presence today.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">              
              <button className="group w-full sm:w-auto px-10 py-6 bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] rounded-2xl font-black text-sm tracking-[0.2em] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl">
                GET STARTED NOW
                <ArrowRight className="group-hover:rotate-[-45deg] transition-transform" />
              </button>
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
        .mask-image-gradient {
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}</style>
    </div>
  );
}