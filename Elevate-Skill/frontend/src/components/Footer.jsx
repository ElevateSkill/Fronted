import React from 'react';
import { motion } from 'framer-motion';
import { 
  Linkedin, Instagram, Mail, Phone, ArrowUp,
  Youtube, Github, ChevronRight
} from 'lucide-react';

import logoJpg from '../assets/logo.jpg';

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: 'mailto:elevateskill369@gmail.com', label: 'Email' },
];

const quickLinks = [
  { label: 'Courses', href: '#' },
  { label: 'About Us', href: '#' },
  { label: 'FAQ', href: '#' },
  { label: 'Contact', href: '#' },
];

const resources = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Refund Policy', href: '#' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="w-full bg-[#08070b] text-[#c7c7c7] font-sans relative">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#15c8fb]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-white text-sm font-black shadow-lg shadow-[#15c8fb]/20">
                ES
              </div>
              <div>
                <div className="text-lg font-black text-white leading-none tracking-tight">ELEVATE SKILL</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Learn by building</div>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Project-based learning platform for modern engineers. Build real systems, ship real products, master your craft.
            </p>
            <div className="flex items-center gap-2 mt-1">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/50 hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/10 hover:text-[#15c8fb] transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h6 className="text-xs font-bold uppercase tracking-wider text-white/60">Quick Links</h6>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors group">
                    <ChevronRight size={12} className="text-white/20 group-hover:text-[#15c8fb] transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h6 className="text-xs font-bold uppercase tracking-wider text-white/60">Legal</h6>
            <ul className="space-y-2.5">
              {resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors group">
                    <ChevronRight size={12} className="text-white/20 group-hover:text-[#15c8fb] transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h6 className="text-xs font-bold uppercase tracking-wider text-white/60">Get in touch</h6>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/40">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">Phone</p>
                  <a href="tel:+251981807055" className="text-sm text-white/70 hover:text-white transition-colors">+251 981 80 7055</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/40">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">Email</p>
                  <a href="mailto:elevateskill369@gmail.com" className="text-sm text-white/70 hover:text-white transition-colors">elevateskill369@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/40">
          <p>© {currentYear} <span className="text-white font-semibold">Elevate Skill</span>. All rights reserved.</p>
          <p className="text-xs text-white/30">Built with passion for the next generation of engineers.</p>
        </div>
      </div>

      {/* Scroll to top */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ y: -3 }}
        className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0d1117] text-white/50 hover:bg-gradient-to-br hover:from-[#15c8fb] hover:to-[#f89f29] hover:text-white hover:border-transparent shadow-lg transition-all"
      >
        <ArrowUp size={16} />
      </motion.button>
    </footer>
  );
}