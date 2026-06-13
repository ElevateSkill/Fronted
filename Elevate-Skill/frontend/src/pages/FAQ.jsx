import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle, HelpCircle, Search } from 'lucide-react';

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
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Telebirr, bank transfers, and international payments via Chase. All transactions are encrypted and secure.",
    category: "Payments"
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "We offer a 14-day money-back guarantee. If the course doesn't meet your expectations, contact our support team for a full refund.",
    category: "Payments"
  }
];

const categories = ['All', 'Access', 'Benefits', 'Curriculum', 'Support', 'Payments'];

export default function FAQ({ faqs = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const displayFaqs = faqs.length > 0
    ? faqs.map(f => ({ question: f.question, answer: f.answer, category: f.category || 'General' }))
    : faqData;

  const filtered = useMemo(() => {
    return displayFaqs.filter(item => {
      const matchSearch = !search || item.question.toLowerCase().includes(search.toLowerCase()) || item.answer.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [displayFaqs, search, activeCategory]);

  return (
    <div id="faq" className="relative w-full bg-black py-16 md:py-24 px-6 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-[#f89f29]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#15c8fb]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f89f29] text-[10px] font-black uppercase tracking-widest mb-4"
          >
            <HelpCircle size={12} /> FAQ
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-3"
          >
            Got <span className="bg-gradient-to-r from-[#f89f29] to-[#fb7d15] bg-clip-text text-transparent">QUESTIONS?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-400 text-sm max-w-lg mx-auto"
          >
            Everything you need to know about the platform. Can't find what you're looking for? Drop us a message.
          </motion.p>
        </div>

        {/* Search + Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveIndex(null); }}
              placeholder="Search questions..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#f89f29]/40 focus:ring-2 focus:ring-[#f89f29]/10 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setActiveIndex(null); }}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#f89f29] to-[#fb7d15] text-white shadow-lg'
                    : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <HelpCircle size={40} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/40 text-sm">No questions match your search.</p>
          </motion.div>
        ) : (
          <motion.p className="text-[11px] text-white/30 mb-4 font-medium">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</motion.p>
        )}

        {/* Accordion */}
        <div className="space-y-3">
          {filtered.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.05 }}
              className={`group overflow-hidden border transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-white/[0.04] border-[#f89f29]/40 shadow-lg shadow-[#f89f29]/5'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left outline-none gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className={`hidden sm:inline-flex text-xs font-black px-2.5 py-1 rounded-md transition-colors shrink-0 ${
                    activeIndex === index ? 'bg-[#f89f29] text-white' : 'bg-white/10 text-white/40'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm md:text-base font-bold text-white leading-snug block">
                      {item.question}
                    </span>
                    {item.category && (
                      <span className="text-[10px] text-white/30 uppercase tracking-wider mt-1 block">{item.category}</span>
                    )}
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg transition-all duration-300 shrink-0 ${
                  activeIndex === index ? 'rotate-180 bg-[#f89f29] text-white shadow-lg' : 'bg-white/10 text-white/40'
                }`}>
                  {activeIndex === index ? <Minus size={16} /> : <Plus size={16} />}
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
                    <div className="px-6 pb-6 ml-0 sm:ml-12">
                      <div className="h-px bg-gradient-to-r from-[#f89f29]/30 via-[#15c8fb]/20 to-transparent mb-4" />
                      <p className="text-white/70 leading-relaxed text-sm">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 md:p-10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 text-center relative overflow-hidden group"
        >
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#15c8fb]/10 blur-[100px] group-hover:bg-[#f89f29]/10 transition-colors duration-700 rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#f89f29]/10 blur-[100px] rounded-full" />

          <div className="relative z-10">
            <HelpCircle size={32} className="mx-auto text-white/20 mb-3" />
            <h4 className="text-xl md:text-2xl font-black text-white mb-1">
              Still have a question?
            </h4>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              Our support team is available 24/7 to help you out.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <motion.a
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                href="mailto:elevateskill369@gmail.com"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#f89f29] to-[#fb7d15] text-white font-black text-xs tracking-widest uppercase shadow-xl hover:brightness-110 transition-all"
              >
                <MessageCircle size={16} /> Contact Support
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}