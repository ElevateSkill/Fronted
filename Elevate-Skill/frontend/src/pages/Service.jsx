import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown, Lightbulb, PenTool, Target,
  Users, Star, ArrowRight, CheckCircle2, Sparkles
} from 'lucide-react';


import mentorship from '../assets/service/mentorship.jpg'
import online_class from '../assets/service/online-class.jpg'
import elevate_training from '../assets/service/elevate-training.jpg'
import charity from '../assets/service/charity.jpg'

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
    image: mentorship,
  },
  {
    id: 2,
    title: "PREFECT ONLINE CLASS",
    short: "Bespoke digital assets built from scratch.",
    desc: "No templates. No shortcuts. Every line of code and every pixel is handcrafted by our elite team of developers and designers to ensure maximum performance and originality.",
    icon: <PenTool size={32} />,
    image: online_class,
  },
  {
    id: 3,
    title: "ELEVATE TRAINING & COACH",
    short: "Strict deadlines with uncompromising quality.",
    desc: "We value your time as much as our craft. Our agile workflow ensures that complex milestones are met with precision, delivering 'ready-to-market' products exactly when promised.",
    icon: <Target size={32} />,
    image: elevate_training,
  },
  {
    id: 4,
    title: "HELP FOR THE NEEDS",
    short: "Strict deadlines with uncompromising quality.",
    desc: "We value your time as much as our craft. Our agile workflow ensures that complex milestones are met with precision, delivering 'ready-to-market' products exactly when promised.",
    icon: <Target size={32} />,
    image: charity,
  }
];

export default function Services() {
  const [activeService] = useState();

  const users = [
    "https://i.pravatar.cc/150?u=1",
    "https://i.pravatar.cc/150?u=2",
    "https://i.pravatar.cc/150?u=3",
    "https://i.pravatar.cc/150?u=4"
  ];

  return (
    <div id="services" className="relative w-full bg-[#f8fafc] dark:bg-black py-16 md:py-24 sm:px-6 overflow-hidden transition-colors duration-500 font-sans">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#15c8fb]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f89f29]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 md:mb-24 text-center lg:text-left"
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 p-10 bg-white/95 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] backdrop-blur-3xl shadow-2xl shadow-slate-900/5 dark:shadow-[#15c8fb]/5">
            <div className="flex-none max-w-xs">
              <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start">
                <span className="w-8 h-[2px] bg-[#fba613]" />
                <span className="text-[#fba613] font-bold uppercase tracking-widest text-xs">Collaboration Network</span>
              </div>
            </div>

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
                        className="h-auto max-h-full max-w-full object-contain filter dark:brightness-75 transition-all group-hover:brightness-100 opacity-80 dark:opacity-70 group-hover:opacity-100 drop-shadow-lg"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between mx-2 gap-10 mb-16 md:mb-24">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight"
            >
              Solutions For GROWTH
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center lg:items-end gap-5 bg-white/95 dark:bg-white/[0.06] p-6 backdrop-blur-md border border-slate-200 dark:border-white/[0.08] shadow-2xl shadow-slate-900/5 dark:shadow-[#15c8fb]/5"
          >
            <div className="flex justify-between">
              <div className="flex -space-x-3">
                {users.map((url, i) => (
                  <motion.img
                    key={i}
                    whileHover={{ y: -5, zIndex: 10 }}
                    src={url}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white dark:border-black shadow-xl cursor-pointer"
                    alt="user"
                  />
                ))}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#2c2260] to-[#291850] border-4 border-white dark:border-black flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-xl">
                  24k+
                </div>
              </div>
            </div>
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#f9a215] to-[#f15805] hover:brightness-110 text-white font-bold shadow-lg shadow-[#15c8fb]/30 transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden relative">
              <span className="relative z-10">JOIN PLATFORM</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 relative">
          {mainServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              layout
              className={`group relative overflow-hidden rounded-[0rem] transition-all duration-500 border ${
                activeService === service.id
                  ? 'bg-white dark:bg-black/60 border-[#15c8fb] shadow-2xl shadow-[#15c8fb]/10'
                  : 'bg-white/95 dark:bg-white/[0.06] border-transparent hover:border-slate-200 dark:hover:border-white/[0.12] shadow-xl shadow-slate-900/5 dark:shadow-white/5'
              }`}
            >
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  src={service.image}
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  alt={service.title}
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" /> */}
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-[#15c8fb] transition-colors tracking-tight">
                  {service.title}
                </h3>

                {/* <button
                  onClick={() => toggleService(service.id)}
                  className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all duration-300 ${
                    activeService === service.id
                      ? 'bg-gradient-to-r from-[#15c8fb] to-[#f89f29] text-white shadow-lg shadow-[#15c8fb]/20'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/15'
                  }`}
                >
                  <span className="font-bold text-xs uppercase tracking-[0.2em]">
                    {activeService === service.id ? 'Active Service' : 'Explore Service'}
                  </span>
                  <motion.div
                    animate={{ rotate: activeService === service.id ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button> */}

                <motion.div
                  initial={false}
                  animate={{ opacity: activeService === service.id ? 1 : 0.7 }}
                  transition={{ duration: 0.25 }}
                  className="pt-8 space-y-6 relative z-10"
                >
                  <div className="relative p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-white/5 dark:to-black/40 border border-slate-200 dark:border-white/[0.06]">
                    {/* <Sparkles className="absolute -top-3 -left-3 text-[#f89f29]" size={20} /> */}
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-300 italic font-medium">
                      "{service.desc}"
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-32 p-[2px] bg-gradient-to-r from-transparent via-[#f44c04] to-transparent rounded-[3rem]"
        >
          <div className="bg-white dark:bg-black p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-slate-900/20">
            <div className="text-center lg:text-left">
              <p className="text-slate-600 dark:text-gray-300 text-lg max-w-md">JOIN 1000+ visionaries scaling their digital presence today.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">
              <button  
              // onClick={}
              className="group w-full sm:w-auto px-10 py-6 bg-gradient-to-r from-[#f9a215] to-[#f15805] text-[white] font-black text-sm tracking-[0.2em] hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-[#15c8fb]/20 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl">
                GET STARTED NOW
                <ArrowRight className="group-hover:rotate-[-45deg] transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
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
