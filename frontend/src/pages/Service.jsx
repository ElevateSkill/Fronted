import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, Lightbulb, PenTool, Target, 
  Users, Star, ArrowRight, CheckCircle2, Sparkles, GraduationCap
} from 'lucide-react';

// const partners = [
//   { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
//   { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
//   { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Stripe_Logo%2C_revised_2016.svg" },
//   { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
//   { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
//   { name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
//   { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
//   { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Logo.svg" },
// ];

const partners = [
  { 
    name: "Telebirr", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='%23F5F5F5' rx='8'/%3E%3Ctext x='100' y='38' font-family='Arial Black' font-size='24' fill='%23EE8433' text-anchor='middle' font-weight='900'%3ETelebirr%3C/text%3E%3C/svg%3E"
  },
  { 
    name: "Ethio Telecom", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='%23F5F5F5' rx='8'/%3E%3Ctext x='100' y='38' font-family='Arial' font-size='18' fill='%233A3992' text-anchor='middle' font-weight='bold'%3EEthio Telecom%3C/text%3E%3C/svg%3E"
  },
  { 
    name: "INSA", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='%23F5F5F5' rx='8'/%3E%3Ctext x='100' y='38' font-family='Arial Black' font-size='22' fill='%235A2DA8' text-anchor='middle' font-weight='900'%3EINSA%3C/text%3E%3C/svg%3E"
  },
  { 
    name: "ASTU", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='%23F5F5F5' rx='8'/%3E%3Ctext x='100' y='38' font-family='Arial Black' font-size='22' fill='%23EE8433' text-anchor='middle' font-weight='900'%3EASTU%3C/text%3E%3C/svg%3E"
  },
  { 
    name: "MoI", 
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='%23F5F5F5' rx='8'/%3E%3Ctext x='100' y='38' font-family='Arial Black' font-size='22' fill='%233A3992' text-anchor='middle' font-weight='900'%3EMoI%3C/text%3E%3C/svg%3E"
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
  const navigate = useNavigate();

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
                {/* <h3 className="text-3xl font-black text-slate-900  leading-tight mb-2">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900   ">Industry</span> Partners.
                </h3> */}
            </div>
            
            {/* The Animated Infinite Scroll */}
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
                        className="h-auto max-h-full max-w-full object-contain transition-all group-hover:brightness-110 group-hover:scale-110 opacity-80 group-hover:opacity-100 drop-shadow-lg" 
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
              className="flex items-center justify-center lg:justify-start gap-3 mb-4"
            >
              <span className="h-[2px] w-12 bg-[#3A3992]" />
              <span className="text-[#3A3992] font-black uppercase tracking-[0.3em] text-xs md:text-sm">Our Expertise</span>
            </motion.div>
            
            {/* <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900  leading-[1.1] tracking-tight"
            >
              Solutions For Growth.
            </motion.h2> */}
          </div>

          {/* Social Proof Join Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center lg:items-end gap-5 bg-white/50  p-6 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl shadow-black/5 "
          >
            <div className="flex justify-between">
                <div className="flex -space-x-3">
                {users.map((url, i) => (
                    <motion.img 
                        key={i} 
                        whileHover={{ y: -5, zIndex: 10 }}
                        src={url} 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white  shadow-xl cursor-pointer" 
                        alt="user" 
                    />
                ))}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#EE8433] to-[#5A2DA8] border-4 border-white  flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-xl">
                    24k+
                </div>
                </div>
            </div>
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-[#3A3992] hover:brightness-110 text-white font-bold rounded-2xl shadow-lg shadow-[#3A3992]/30 transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden relative hover:scale-105 active:scale-95"
            >
              <GraduationCap size={18} className="relative z-10" />
              <span className="relative z-10">ENROLL NOW</span>
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
                 ? 'bg-white border-[#EE8433] shadow-2xl shadow-[#EE8433]/10' 
                 : 'bg-white/70 border-transparent hover:border-slate-200 shadow-xl shadow-black/5'
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
                <h3 className="text-2xl font-black text-slate-900  mb-3 group-hover:text-[#EE8433] transition-colors tracking-tight">{service.title}</h3>
                <p className="text-slate-500  mb-8 text-sm leading-relaxed font-medium">
                  {service.short}
                </p>

                {/* Dropdown Button */}
                <button 
                  onClick={() => toggleService(service.id)}
                  className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all duration-300 ${
                    activeService === service.id 
                    ? 'bg-[#EE8433] text-white' 
                     : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                        <div className="relative p-4 rounded-2xl bg-slate-50  border border-slate-100 ">
                            <Sparkles className="absolute -top-3 -left-3 text-[#3A3992]" size={20} />
                            <p className="text-sm leading-relaxed text-slate-600  italic">
                            "{service.desc}"
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FEF0EE]  text-[10px] font-black text-[#3A3992] border border-[#D95C4A]/20 ">
                              24/7 PRIORITY
                           </div>
                           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEEFF8]  text-[10px] font-black text-[#EE8433] border border-[#EE8433]/20 ">
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
          className="mt-20 md:mt-32 p-[2px] bg-gradient-to-r from-transparent via-[#EE8433] to-transparent rounded-[3rem]"
        >
          <div className="bg-white  p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] ">
            <div className="text-center lg:text-left">
              {/* <h4 className="text-3xl md:text-5xl font-black text-slate-900  mb-4 tracking-tight">Ready to elevate?</h4> */}
              <p className="text-slate-500  text-lg max-w-md">Join 24,000+ visionaries scaling their digital presence today.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">              
              <button 
                onClick={() => navigate('/register')}
                className="group w-full sm:w-auto px-10 py-6 bg-[#3A3992] text-white rounded-2xl font-black text-sm tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-[#3A3992]/30 hover:scale-105"
              >
                <GraduationCap size={18} />
                ENROLL NOW
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