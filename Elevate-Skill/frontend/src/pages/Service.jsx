import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, BrainCircuit, Rocket, BarChart3, 
  Fingerprint, Globe2, Users, Lightbulb, 
  PenTool, Target 
} from 'lucide-react';

const mainServices = [
  {
    title: "Inspirational Ideas",
    desc: "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
    icon: <Lightbulb className="text-[#15c8fb]" size={40} />
  },
  {
    title: "Handcrafted & Selfmade",
    desc: "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
    icon: <PenTool className="text-[#15c8fb]" size={40} />
  },
  {
    title: "Perfection on time",
    desc: "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
    icon: <Target className="text-[#15c8fb]" size={40} />
  }
];

const courses = [
  {
    title: "Content-Management-Systems (CMS)",
    category: "IT-Service for CMS like WordPress",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800",
  },
  {
    title: "User Experience / UX Design",
    category: "Workshop for UX Design",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800",
  },
  {
    title: "Typography & Writing",
    category: "Work with InDesign",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800",
  }
];

export default function Services() {
  return (
    <div className="w-full transition-colors duration-500 dark:bg-charcoal bg-white">
      
      {/* --- TOP SERVICES SECTION (Screenshot 2 Style) --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight dark:text-white text-slate-900 uppercase mb-16">
            Our Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {mainServices.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm dark:bg-white/5 bg-white">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white text-slate-800">
                {service.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base px-4">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- MIDDLE CTA SECTION --- */}
      <section className="w-full py-20 border-t dark:border-white/5 border-slate-100 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-slate-900 mb-6">
            Explore Bromine Video Platform
          </h2>
          <div className="w-20 h-1 bg-[#15c8fb] mx-auto mb-8" />
          <p className="text-slate-500 dark:text-slate-400 text-lg italic leading-relaxed">
            "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, 
            no sea takimata sanctus est Lorem ipsum dolor sit amet."
          </p>
        </div>
      </section>

      {/* --- COURSE CARDS SECTION (Bottom of Screenshot 2) --- */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="relative group overflow-hidden rounded-lg cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full text-center">
                <h4 className="text-white text-xl font-bold mb-2">
                  {course.title}
                </h4>
                {/* <p className="text-[#17c966] text-sm font-bold tracking-wider uppercase">
                  {course.category}
                </p> */}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- BENTO STATS (Keeping your previous logic but styled better) --- */}
      {/* <section className="dark:bg-surface bg-slate-50 border-y dark:border-white/5 border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
             {[
               { label: "Active Learners", value: "24k+", icon: <Users size={24}/> },
               { label: "Completion Rate", value: "94%", icon: <BarChart3 size={24}/> },
               { label: "Partner Companies", value: "180+", icon: <Globe2 size={24}/> },
               { label: "Skill Badges", value: "12k", icon: <Fingerprint size={24}/> }
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center md:items-start">
                 <div className="dark:text-[#15c8fb]/60 text-[#15c8fb] mb-3">{stat.icon}</div>
                 <div className="text-4xl font-black dark:text-white text-slate-900">{stat.value}</div>
                 <div className="text-xs font-bold tracking-[0.2em] uppercase mt-1">
                   {stat.label}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section> */}

    </div>
  );
}