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
    <footer className="w-full bg-[#08070b] text-[#c7c7c7] font-sans py-10 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 items-start">

          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img src={logoJpg} alt="logo" className="h-10 w-10 rounded-lg object-cover shadow-sm" />
              <div>
                <div className="text-lg font-black text-white leading-none">Elevate <span className="text-cyan-primary">Skill</span></div>
                <div className="text-[11px] text-white/60">Project-based learning for modern engineers</div>
              </div>
            </div>
            <p className="text-xs text-white/60 max-w-xs">Project-based learning platform designed for the modern engineer. Build real systems, not just tutorials.</p>
            <div className="flex items-center gap-2 mt-2">
              {[Github, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-md bg-white/3 hover:bg-cyan-primary/10 transition-colors text-white/70">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
            {footerSections.map(section => (
              <div key={section.title}>
                <h6 className="text-xs font-bold uppercase text-white/80 tracking-wider mb-3">{section.title}</h6>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link}><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact & Newsletter compact */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <div>
              <h6 className="text-xs font-bold uppercase text-white/80 tracking-wider mb-2">Contact</h6>
              <div className="text-sm text-white/70">(+02) 0100-556-345</div>
              <a href="mailto:help@elevate-skill.com" className="block text-sm text-white/70 hover:text-white mt-1">help@elevate-skill.com</a>
            </div>

            <div className="mt-2">
              <h6 className="text-xs font-bold uppercase text-white/80 tracking-wider mb-2">Newsletter</h6>
              <div className="flex w-full rounded-lg overflow-hidden bg-white/5 border border-white/6">
                <input type="email" placeholder="Your email" className="flex-1 bg-transparent px-3 py-2 text-sm text-white/70 placeholder:text-white/40 focus:outline-none" />
                <button className="px-3 bg-linear-to-r from-cyan-primary to-[#f89f29] text-white text-sm font-bold">Join</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/60">
          <div>© {currentYear} <span className="text-white font-medium">Elevate Skill</span>. Designed by <span className="text-white/80">Lide-X</span></div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>

      <motion.button onClick={scrollToTop} whileHover={{ y: -3 }} className="fixed bottom-6 right-6 w-10 h-10 rounded-lg bg-white/6 flex items-center justify-center text-cyan-primary hover:bg-cyan-primary hover:text-white transition-colors shadow-md">
        <ArrowUp size={16} />
      </motion.button>
    </footer>
  );
}