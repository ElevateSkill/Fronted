import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle, Github, Twitter as Discord, HelpCircle } from 'lucide-react';

const faqData = [
  {
    question: "How long do I have access to the courses?",
    answer: "You get lifetime access to all purchased courses. This includes all future updates, new modules, and downloadable resources added to the curriculum.",
    category: "Access"
  },
  {
    question: "Do I receive a certificate after completion?",
    answer: "Yes! Upon finishing all modules and passing the final project, you will receive a verified digital certificate that you can add to your LinkedIn profile.",
    category: "Benefits"
  },
  {
    question: "Can I switch learning paths later?",
    answer: "Absolutely. Our flexible system allows you to pivot between Web Dev, AI, and Design paths at any time. Your progress in foundational modules will be saved.",
    category: "Curriculum"
  },
  {
    question: "Is there a community for support?",
    answer: "You'll be invited to our private Discord community where 20,000+ students and industry mentors provide 24/7 technical support and code reviews.",
    category: "Support"
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div id="faq" className="min-h-screen py-32 px-6 transition-colors duration-500 dark:bg-charcoal bg-slate-50">
      <div className="px-4 py-12 rounded-[3rem] dark:bg-white/5 bg-white border border-slate-200 dark:border-white/10 max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#15c8fb]/10 text-[#15c8fb] text-xs font-black tracking-widest uppercase mb-6"
          >
            <HelpCircle size={16} /> Knowledge Base
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter dark:text-white text-slate-900 mb-6">
            GOT <span className="text-[#17c966]">QUESTIONS?</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Everything you need to know about the platform and your learning journey.
          </p>
        </div>

        {/* --- ACCORDION SECTION --- */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group overflow-hidden rounded-3xl border transition-all duration-300 ${
                activeIndex === index 
                ? 'dark:bg-white/5 bg-white border-[#15c8fb] shadow-2xl shadow-[#15c8fb]/10' 
                : 'dark:bg-white/[0.02] bg-white border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
              >
                <div className="flex items-center gap-6">
                  <span className={`text-xs font-black px-3 py-1 rounded-lg transition-colors ${
                    activeIndex === index ? 'bg-[#15c8fb] text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400'
                  }`}>
                    0{index + 1}
                  </span>
                  <span className="text-lg md:text-xl font-bold dark:text-white text-slate-800">
                    {item.question}
                  </span>
                </div>
                <div className={`p-2 rounded-full transition-transform duration-300 ${
                  activeIndex === index ? 'rotate-180 bg-[#15c8fb] text-white' : 'dark:bg-white/5 bg-slate-100 dark:text-white text-slate-900'
                }`}>
                  {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 md:px-8 pb-8 ml-16 md:ml-20">
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* --- BOTTOM SUPPORT CTA --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-24 p-12 rounded-[3rem] dark:bg-white/5 bg-white border border-slate-200 dark:border-white/10 text-center relative overflow-hidden group"
        >
          {/* Background Decorative Glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#17c966]/10 blur-[80px] rounded-full group-hover:bg-[#15c8fb]/10 transition-colors duration-700" />
          
          <div className="relative z-10">
            <h4 className="text-3xl font-black dark:text-white text-slate-900 mb-4 uppercase italic">
              Still have a question?
            </h4>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto font-medium">
              Our support team and community are online 24/7 to help you move forward.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-[#15c8fb] text-white font-black text-xs tracking-widest rounded-2xl uppercase shadow-lg shadow-[#15c8fb]/20"
              >
                <MessageCircle size={18} /> Support Chat
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 dark:bg-white/10 bg-slate-100 dark:text-white text-slate-900 font-black text-xs tracking-widest rounded-2xl uppercase border border-transparent dark:hover:border-white/20 hover:border-slate-300 transition-all"
              >
                <Discord size={18} /> Join Discord
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 dark:bg-white/10 bg-slate-100 dark:text-white text-slate-900 font-black text-xs tracking-widest rounded-2xl uppercase border border-transparent dark:hover:border-white/20 hover:border-slate-300 transition-all"
              >
                <Github size={18} /> Documentation
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}