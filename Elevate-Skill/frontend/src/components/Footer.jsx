import React from 'react';
import { motion } from 'framer-motion';
import { 
  Github, Twitter, Linkedin, Instagram, 
  ArrowRight, Mail, Phone, LibraryBig 
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Services",
      links: ["Event", "Courses", "About Us", "Instructors"]
    },
    {
      title: "More",
      links: ["Blog", "About Us", "Homepage", "Reviews"]
    }
  ];

  return (
    <footer className="w-full bg-[#0f0f0f] text-[#a1a1a1] font-sans pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <LibraryBig size={28} className="text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight text-white">
                Elevate<span className="text-[#3b82f6]"></span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Education is the foundation of personal and societal growth, 
              empowering individuals with world-class technical skills.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-white hover:text-black transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-2 space-y-6">
              <h5 className="text-white font-semibold uppercase tracking-widest text-xs">
                {section.title}
              </h5>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors duration-200 text-[15px]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Help/Contact Section */}
          <div className="lg:col-span-2 space-y-6">
            <h5 className="text-white font-semibold uppercase tracking-widest text-xs">
              Need Help?
            </h5>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Phone size={16} className="text-white/50" />
                  <span className="text-xs uppercase font-medium">Call us directly</span>
                </div>
                <p className="text-lg font-bold text-white group-hover:text-[#3b82f6] transition-colors">
                  (+02) 0100-556-345
                </p>
              </div>
              <div className="group cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Mail size={16} className="text-white/50" />
                  <span className="text-xs uppercase font-medium">Mail us directly</span>
                </div>
                <p className="text-md font-semibold text-white group-hover:text-[#3b82f6] transition-colors">
                  help@elevate-skill.com
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3 space-y-6">
            <h5 className="text-white font-semibold uppercase tracking-widest text-xs">
              Keep in touch
            </h5>
            <div className="flex gap-4 items-start mb-4">
               <div className="bg-white/5 p-3 rounded-full">
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Mail size={20} className="text-white" />
                  </motion.div>
               </div>
               <p className="text-xs leading-relaxed">
                 Please sign up to follow the latest news and events from us.
               </p>
            </div>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter email address"
                className="w-full bg-white/5 border border-white/10 py-4 pl-5 pr-32 rounded-full text-sm text-white focus:outline-none focus:border-[#3b82f6] transition-all"
              />
              <button className="absolute right-1 top-1 bottom-1 px-6 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-full transition-all flex items-center gap-2">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px]">
            Copyright © {currentYear} <span className="text-white font-medium">Elevate-Skill</span>. 
            Designed & Developed by <span className="text-white">Lide-X</span>
          </p>
          <div className="flex gap-6 text-[13px]">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
          </div>
        </div>
      </div>

      {/* Floating Scroll Top Button (Optional - mimicking the blue circle in image) */}
      {/* <motion.button 
        whileHover={{ y: -5 }}
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#3b82f6]/10 border border-[#3b82f6]/40 rounded-full flex items-center justify-center text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white transition-all shadow-lg shadow-blue-500/20"
      >
        <ArrowRight className="-rotate-90" size={20} />
      </motion.button> */}
    </footer>
  );
}