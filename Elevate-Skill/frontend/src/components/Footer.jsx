import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Github, Twitter, Linkedin, 
  Instagram, ArrowRight, Mail, ShieldCheck 
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: ["Browse Courses", "Learning Paths", "Certifications", "Success Stories"]
    },
    {
      title: "Company",
      links: ["About Us", "Our Engineering", "Careers", "Newsroom"]
    },
    {
      title: "Resources",
      links: ["Documentation", "Community Forum", "Help Center", "Partners"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Data Safety"]
    }
  ];

  return (
    <footer className="w-full transition-colors duration-500 dark:bg-charcoal bg-white border-t dark:border-white/5 border-slate-200">
      
      {/* --- TOP SECTION: NEWSLETTER & BRAND --- */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              {/* <Zap size={32} className="text-[#15c8fb] fill-[#15c8fb]/20" /> */}
              <span className="text-3xl font-black tracking-tighter dark:text-white text-slate-900">
                ELEVATE<span className="text-[#17c966]">.</span>
              </span>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              We are building the future of technical education. Join 24k+ engineers mastering 
              fullstack systems and AI architecture.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, color: "#15c8fb" }}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-7">
            <div className="relative p-8 md:p-10 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden group">
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#17c966]/10 blur-[80px] rounded-full" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-xl font-bold dark:text-white text-slate-900 mb-2">Weekly Tech Insights</h4>
                  <p className="text-sm dark:text-slate-400 text-slate-500">Get curriculum updates and industry trends.</p>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter email"
                    className="px-6 py-4 rounded-xl bg-white dark:bg-charcoal border border-slate-200 dark:border-white/10 dark:text-white outline-none focus:border-[#15c8fb] transition-all min-w-[240px]"
                  />
                  <button className="px-8 py-4 bg-[#15c8fb] text-white font-black rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                    JOIN <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MIDDLE SECTION: LINKS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-t dark:border-white/5 border-slate-200">
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-6">
              <h5 className="text-xs font-black uppercase tracking-[0.2em] dark:text-white/40 text-slate-400">
                {section.title}
              </h5>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm font-bold dark:text-white/60 text-slate-600 dark:hover:text-[#17c966] hover:text-[#17c966] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT & TRUST --- */}
        <div className="pt-12 border-t dark:border-white/5 border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xs font-bold dark:text-white/30 text-slate-400 tracking-widest uppercase">
            © {currentYear} ELEVATE EDUCATION INC. ALL RIGHTS RESERVED.
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-xs font-black dark:text-white/40 text-slate-400">
              <ShieldCheck size={16} className="text-[#17c966]" />
              SOC2 TYPE II CERTIFIED
            </div>
            <div className="flex items-center gap-2 text-xs font-black dark:text-white/40 text-slate-400">
              <div className="w-2 h-2 rounded-full bg-[#17c966] animate-pulse" />
              SYSTEMS OPERATIONAL
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}