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

export default function FAQ({ faqs = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const displayFaqs = faqs.length > 0
    ? faqs.map(f => ({ question: f.question, answer: f.answer, category: '' }))
    : faqData;

  return (
    <div id="faq" className="relative w-full bg-gray-50 dark:bg-black md:py-24 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#f89f29]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-[#15c8fb]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter dark:text-white text-gray-900 mb-2">
            Got <span className="text-[#f89f29]">QUESTIONS?</span>
          </h2>
          <p className="text-gray-500 dark:text-white/60 text-sm">Find answers to common questions about our platform.</p>
        </div>

        {/* --- ACCORDION SECTION --- */}
        <div className="space-y-3">
          {displayFaqs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group overflow-hidden border transition-all duration-300 ${
                activeIndex === index 
                ? 'bg-gray-100 dark:bg-white/5 border-[#fea305] shadow-xl shadow-[#15c8fb]/10' 
                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left outline-none"
              >
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-black px-3 py-1 rounded-lg transition-colors ${
                    activeIndex === index ? 'bg-[#fea305] text-white shadow-lg' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/70'
                  }`}>
                    0{index + 1}
                  </span>
                  <span className="text-base md:text-lg font-bold dark:text-white text-gray-900">
                    {item.question}
                  </span>
                </div>
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                  activeIndex === index ? 'rotate-180 bg-[#fea305] text-white shadow-lg' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/70'
                }`}>
                  {activeIndex === index ? <Minus size={18} /> : <Plus size={18} />}
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
                    <div className="px-6 pb-6 ml-16">
                      <p className="text-gray-500 dark:text-white/80 leading-relaxed text-sm">
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
          className="mt-16 p-8 md:p-12 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center relative overflow-hidden group shadow-2xl shadow-black/5 dark:shadow-white/5"
        >
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#15c8fb]/10 blur-[80px] group-hover:bg-[#f89f29]/10 transition-colors duration-700" />
          
          <div className="relative z-10">
            <h4 className="text-2xl md:text-3xl font-black dark:text-white text-gray-900 mb-2">
              Still have a question?
            </h4>
            <p className="text-gray-500 dark:text-white/80 text-sm mb-8 max-w-md mx-auto">
              Our support team is available 24/7 to help you.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-[#f89f29] text-white font-black text-xs tracking-widest uppercase shadow-xl"
              >
                <MessageCircle size={18} /> Support Chat
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white font-black text-xs tracking-widest rounded-2xl uppercase border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-xl"
              >
                Join Community
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}