import React from 'react';
import { motion } from 'framer-motion';
import { 
  Github, Twitter, Linkedin, Instagram, 
  Mail, Phone, ArrowUp
} from 'lucide-react';
import logoJpg from '../assets/logo.jpg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: ["Courses", "Services", "About Us", "Instructors"]
    },
    {
      title: "Resources",
      links: ["Blog", "FAQ", "Reviews", "Contact"]
    }
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="w-full bg-[#0f0f0f] text-[#a1a1a1] font-sans pt-20 pb-10 relative">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3A3992]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={logoJpg} 
                  alt="Elevate Skill" 
                  className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-black/20" 
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#3A3992] rounded-full border-2 border-[#0f0f0f]" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">Elevate</span>
                <span className="text-xl font-black tracking-tight text-[#3A3992]">Skill</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-white/50">
              Project-based learning platform designed for the modern engineer. Build real systems, not just tutorials.
            </p>
           <div className="flex gap-3">
               {[Github, Twitter, Instagram, Linkedin].map((Icon, i) => (
                 <a
                   key={i}
                   href="#"
                   className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-[#3A3992]/50 hover:text-[#3A3992] hover:bg-[#3A3992]/10 transition-all duration-300"
                 >
                   <Icon size={16} />
                 </a>
               ))}
               <a href="https://t.me/elevateskill" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-[#0088cc]/50 hover:text-[#0088cc] hover:bg-[#0088cc]/10 transition-all duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.9A9 9 0 1 1 11.2 2a8.52 8.52 0 0 0 6.3 7.4c-1.3.3-2.6.6-3.8 1l-.3.1c-.3 0-.5.1-.7.2-.1.1-.1.2-.2.3l-.2.2-.1-.1c0-.1-.1-.2-.2-.2-.2 0-.4.1-.6.2l-.4.2-.1-.1c0-.1-.1-.2-.2-.1-.1.1-.2.2-.3.3l-.2.2-.1.1c-.1.1-.2.1-.3.2-.1.1-.2.2-.2.3l-.1.2c0 .1-.1.2-.2.2l-.2.1-.1.1c-.1.1-.2.1-.3.2l-.2.2c-.1.1-.2.2-.2.3l-.1.2c0 .1-.1.1-.2.2l-.2.1c-.1 0-.2.1-.2.2l0 .2-.1.1c-.1.1-.1.2-.1.3l0 .2c0 .1.1.2.2.2l.2 0c.1 0 .2-.1.3-.2l.2-.2c.1-.1.2-.2.3-.3l.2-.2c.1-.1.2-.2.3-.2l.2.1c.1 0 .2-.1.3-.2l.2-.2c.1-.1.2-.2.3-.2l.2.1c.1 0 .2-.1.3-.1l.2 0c.1 0 .2.1.3.2l.2.2c.1.1.2.2.2.3l-.1.2c-.1.1-.2.2-.3.3l-.2.2c-.1.1-.2.2-.3.3l-.2.2c-.1.1-.3.2-.4.3l-.2.2c-.1.1-.2.2-.3.3l-.2.2c-.1.1-.2.2-.3.3l-.2.2c-.1.1-.2.2-.3.3l-.2.1c-.1 0-.3-.1-.4-.1l-.2 0c-.1 0-.2-.1-.3-.2l-.2-.2c-.1-.1-.2-.2-.3-.3l-.2-.2c-.1-.1-.2-.2-.3-.3l-.1-.2c0-.1-.1-.2-.2-.2l0-.2c0-.1-.1-.2-.2-.2l-.1-.1c0-.1-.1-.1-.2-.2l-.1-.2c0-.1-.1-.2-.2-.2l-.1-.2c0-.1-.1-.2-.2-.2l0-.2c0-.1.1-.2.2-.2l.2 0c.1 0 .2-.1.3-.2l.2-.2c.1-.1.2-.2.3-.3l.2-.2c.1-.1.2-.2.3-.3l.2-.1c.1 0 .2-.1.3-.2l.2-.2c.1-.1.2-.2.3-.3l.1-.2c0-.1.1-.2.2-.2l.2 0c.1 0 .2-.1.3-.2l.2-.2c.1-.1.2-.2.3-.3l.2-.1c.1 0 .2-.1.3-.2l.2-.2c.1-.1.2-.2.3-.3z"/></svg>
               </a>
             </div>
          </div>

          {/* Navigation Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-2 space-y-5">
              <h5 className="text-white font-bold uppercase tracking-widest text-[10px]">
                {section.title}
              </h5>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/40 hover:text-[#3A3992] transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

           {/* Contact Section */}
           <div className="lg:col-span-2 space-y-5">
             <h5 className="text-white font-bold uppercase tracking-widest text-[10px]">
               Contact
             </h5>
             <div className="space-y-5">
               <div className="group cursor-pointer">
                 <div className="flex items-center gap-2 mb-1">
                   <Phone size={13} className="text-[#3A3992]" />
                   <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Call us</span>
                 </div>
                 <p className="text-sm font-bold text-white/80 group-hover:text-[#3A3992] transition-colors">
                   +251981807055
                 </p>
               </div>
               <div className="group cursor-pointer">
                 <div className="flex items-center gap-2 mb-1">
                   <Mail size={13} className="text-[#3A3992]" />
                   <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Email</span>
                 </div>
                 <p className="text-sm font-semibold text-white/80 group-hover:text-[#3A3992] transition-colors">
                   elevateskill369@gmail.com
                 </p>
               </div>
               <div className="group cursor-pointer">
                 <div className="flex items-center gap-2 mb-1">
                   <Mail size={13} className="text-[#3A3992]" />
                   <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Telegram</span>
                 </div>
                 <p className="text-sm font-bold text-white/80 group-hover:text-[#0088cc] transition-colors">
                   @elevateskill
                 </p>
               </div>
               <div className="group cursor-pointer">
                 <div className="flex items-center gap-2 mb-1">
                   <Mail size={13} className="text-[#3A3992]" />
                   <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Telegram Support</span>
                 </div>
                 <p className="text-sm font-bold text-white/80 group-hover:text-[#0088cc] transition-colors">
                   @Elevateskillsupport
                 </p>
               </div>
             </div>
           </div>

          {/* Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <h5 className="text-white font-bold uppercase tracking-widest text-[10px]">
              Newsletter
            </h5>
            <p className="text-xs text-white/40 leading-relaxed">
              Follow the latest news and updates from us.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 py-3 pl-4 pr-28 rounded-xl text-sm text-white focus:outline-none focus:border-[#3A3992]/50 transition-all placeholder:text-white/20"
              />
              <button className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-[#EE8433] to-[#5A2DA8] hover:brightness-110 text-white text-[10px] font-black rounded-lg transition-all uppercase tracking-wider">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-white/30">
            Copyright © {currentYear} <span className="text-white font-medium">Elevate Skill</span>. 
            Designed & Developed by <span className="text-white/60">Lide-X</span>
          </p>
          <div className="flex gap-6 text-[12px]">
            <a href="#" className="text-white/30 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/30 hover:text-white transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <motion.button 
        onClick={scrollToTop}
        whileHover={{ y: -3 }}
        className="fixed bottom-8 right-8 w-11 h-11 bg-gradient-to-br from-[#EE8433]/20 to-[#5A2DA8]/20 border border-[#3A3992]/30 rounded-xl flex items-center justify-center text-[#3A3992] hover:bg-[#3A3992] hover:text-white transition-all shadow-lg shadow-[#3A3992]/10 backdrop-blur"
      >
        <ArrowUp size={18} />
      </motion.button>
    </footer>
  );
}