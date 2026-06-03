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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#15c8fb]/50 to-transparent" />

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
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#f89f29] rounded-full border-2 border-[#0f0f0f]" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">Elevate</span>
                <span className="text-xl font-black tracking-tight text-[#15c8fb]">Skill</span>
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
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-[#15c8fb]/50 hover:text-[#15c8fb] hover:bg-[#15c8fb]/10 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
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
                    <a href="#" className="text-sm text-white/40 hover:text-[#15c8fb] transition-colors duration-200">
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
                  <Phone size={13} className="text-[#15c8fb]" />
                  <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Call us</span>
                </div>
                <p className="text-sm font-bold text-white/80 group-hover:text-[#15c8fb] transition-colors">
                  (+02) 0100-556-345
                </p>
              </div>
              <div className="group cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Mail size={13} className="text-[#f89f29]" />
                  <span className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Email</span>
                </div>
                <p className="text-sm font-semibold text-white/80 group-hover:text-[#f89f29] transition-colors">
                  help@elevate-skill.com
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
                className="w-full bg-white/5 border border-white/10 py-3 pl-4 pr-28 rounded-xl text-sm text-white focus:outline-none focus:border-[#15c8fb]/50 transition-all placeholder:text-white/20"
              />
              <button className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-[#15c8fb] to-[#f89f29] hover:brightness-110 text-white text-[10px] font-black rounded-lg transition-all uppercase tracking-wider">
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
        className="fixed bottom-8 right-8 w-11 h-11 bg-gradient-to-br from-[#15c8fb]/20 to-[#f89f29]/20 border border-[#15c8fb]/30 rounded-xl flex items-center justify-center text-[#15c8fb] hover:bg-[#15c8fb] hover:text-white transition-all shadow-lg shadow-[#15c8fb]/10 backdrop-blur"
      >
        <ArrowUp size={18} />
      </motion.button>
    </footer>
  );
}