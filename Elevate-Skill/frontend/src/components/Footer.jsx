import React from 'react';
import { motion } from 'framer-motion';
import { 
   Linkedin, Instagram,
  Mail, Phone, ArrowUp
} from 'lucide-react';

// import { Telegram } from 'lucide-react'

const logoJpg = '/logo.jpg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // const footerSections = [
  //   {
  //     title: "Platform",
  //     links: ["Courses", "Services", "About Us", "Instructors"]
  //   },
  //   {
  //     title: "Resources",
  //     links: ["Blog", "FAQ", "Reviews", "Contact"]
  //   }
  // ];

  // const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="w-full bg-[#08070b] text-[#c7c7c7] font-sans py-10 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 items-start">

          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img src={logoJpg} alt="logo" className="h-10 w-10 rounded-lg object-cover shadow-sm" />
              <div>
                <div className="text-lg font-black text-white leading-none">ELEVATE SKILL</div>
                <div className="text-[11px] text-white/60">Project-based learning for modern engineers</div>
              </div>
              
            </div>
            <p className="text-xs text-white/60 max-w-xs">Project-based learning platform designed for the modern engineer. Build real systems, not just tutorials.</p>
            <div className="flex items-center gap-2 mt-2">
              {[Instagram,  Mail, Phone, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-md bg-white/3 hover:bg-[#dc2626]/10 transition-colors text-white/70">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter compact */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <div>
              <h6 className="text-xs font-bold uppercase text-white/80 tracking-wider mb-2">Contact</h6>
              <div className="text-sm text-white/70">+251 981 80 7055</div>
              <a href="mailto:help@elevate-skill.com" className="block text-sm text-white/70 hover:text-white mt-1">elevateskill369@gmail.com</a>
            </div>
          </div>
          
          
        </div>
        

        <div className="mt-6 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/60">
          <div>© {currentYear} 
            <span className="text-white font-medium">Elevate Skill</span>. 
            {/* Designed by <span className="text-white/80">Lide-X</span> */}
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}