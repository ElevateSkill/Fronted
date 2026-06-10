import React from 'react';
import { 
  Github, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowUp, MessageCircle, Send 
} from 'lucide-react';
import logoJpg from '../assets/logo.jpg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#08070b] text-[#c7c7c7] font-sans py-16 relative">
      {/* Glow accents */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#15c8fb]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#f89f29]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={logoJpg} alt="logo" className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-[#15c8fb]/10" />
              </div>
              <div>
                <div className="text-lg font-black text-white leading-none">ELEVATE SKILL</div>
                <div className="text-[11px] text-white/50">Project-based learning platform</div>
              </div>
            </div>
            <p className="text-sm text-white/60 max-w-xs leading-relaxed">
              Project-based learning platform designed for the modern engineer. Build real systems, not just tutorials. Elevate your skills with industry-driven curriculum.
            </p>
            <div className="flex items-center gap-2 mt-1">
              {[
                { icon: Instagram, href: 'https://instagram.com/elevateskill.1', label: 'Instagram' },
                { icon: MessageCircle, href: 'https://t.me/elevateskill', label: 'Telegram' },
                { icon: Twitter, href: 'https://x.com/elevateskill', label: 'Twitter' },
                { icon: Mail, href: 'mailto:elevateskill369@gmail.com', label: 'Email' },
              ].map(({ icon: Icon, href, label }, i) => (
                <a 
                  key={i} 
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  title={label}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-gradient-to-br hover:from-[#15c8fb]/20 hover:to-[#f89f29]/20 transition-all duration-300 text-white/60 hover:text-white border border-white/5 hover:border-[#15c8fb]/20"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h6 className="text-xs font-bold uppercase text-white/80 tracking-wider mb-1">Quick Links</h6>
            {['Home', 'Courses', 'Services', 'About', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={item === 'About' ? '/about' : `#${item.toLowerCase()}`}
                className="text-sm text-white/60 hover:text-[#15c8fb] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Contact - with user's social media */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h6 className="text-xs font-bold uppercase text-white/80 tracking-wider mb-1">Get In Touch</h6>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone size={13} className="text-[#15c8fb]" />
                <a href="tel:+251981807055" className="hover:text-white transition-colors">+251 981 807 055</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Mail size={13} className="text-[#f89f29]" />
                <a href="mailto:elevateskill369@gmail.com" className="hover:text-white transition-colors">elevateskill369@gmail.com</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MessageCircle size={13} className="text-[#15c8fb]" />
                <a href="https://t.me/elevateskill" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">@elevateskill</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Send size={13} className="text-[#f89f29]" />
                <a href="https://t.me/Elevateskillsupport" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">@Elevateskillsupport</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Instagram size={13} className="text-[#15c8fb]" />
                <a href="https://instagram.com/elevateskill.1" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">@elevateskill.1</a>
              </div>
            </div>
          </div>

          {/* Newsletter / CTA */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h6 className="text-xs font-bold uppercase text-white/80 tracking-wider mb-1">Stay Updated</h6>
            <p className="text-sm text-white/60">Get the latest updates on courses and features.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="flex-1 rounded-lg bg-white/10 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-[#15c8fb]/50 transition-all placeholder:text-white/30"
              />
              <button className="rounded-lg bg-gradient-to-r from-[#15c8fb] to-[#0e9ec9] px-4 py-2.5 text-xs font-bold text-white hover:brightness-110 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <div>
            &copy; {currentYear} <span className="text-white font-semibold">Elevate Skill</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <button 
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/10 hover:bg-gradient-to-br hover:from-[#15c8fb] hover:to-[#f89f29] text-white/70 hover:text-white transition-all duration-300"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
