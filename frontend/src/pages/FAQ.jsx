import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useBackendData from '../hooks/useBackendData';
import { faqsAPI } from '../services/api';

export default function FAQ() {
  const { data: faqData, loading, source } = useBackendData(
    () => faqsAPI.active(),
    []
  );
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div id="faq" className="relative w-full bg-gray-50  py-16 md:py-24 px-6 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#5A2DA8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-[#5A2DA8]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-[2px] w-12 bg-[#3A3992]" />
            <span className="text-[#3A3992] font-black uppercase tracking-[0.3em] text-xs">FAQ</span>
            <span className="h-[2px] w-12 bg-[#3A3992]" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter  text-gray-900 mb-2">
            Got <span className="text-[#3A3992]">Questions?</span>
          </h2>
          <p className="text-gray-500  text-sm">Find answers to common questions about our platform.</p>
          {source === 'api' && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 ">Live from backend</span>
            </div>
          )}
        </div>

        {loading && faqData.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-[#EE8433] animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {faqData.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
                  activeIndex === index
                    ? 'bg-gray-100  border-[#EE8433] shadow-xl shadow-[#EE8433]/10'
                    : 'bg-gray-100  border-gray-200  hover:border-gray-300 :border-white/20'
                }`}
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-black px-3 py-1 rounded-lg transition-colors ${
                      activeIndex === index ? 'bg-[#EE8433] text-white shadow-lg' : 'bg-gray-200  text-gray-500 '
                    }`}>
                      0{index + 1}
                    </span>
                    <span className="text-base md:text-lg font-bold  text-gray-900">
                      {item.question}
                    </span>
                  </div>
                  <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                    activeIndex === index ? 'rotate-180 bg-[#EE8433] text-white shadow-lg' : 'bg-gray-200  text-gray-500 '
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
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 ml-16">
                        <p className="text-gray-500  leading-relaxed text-sm">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 p-8 md:p-12 bg-gray-100  border border-gray-200  rounded-3xl text-center relative overflow-hidden group shadow-2xl shadow-black/5 "
        >
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#EE8433]/10 blur-[80px] group-hover:bg-[#3A3992]/10 transition-colors duration-700" />

          <div className="relative z-10">
            <h4 className="text-2xl md:text-3xl font-black  text-gray-900 mb-2">
              Still have a question?
            </h4>
            <p className="text-gray-500  text-sm mb-8 max-w-md mx-auto">
              Our support team is available 24/7 to help you.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/#contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-8 py-4 bg-[#3A3992] text-white font-black text-xs tracking-widest rounded-2xl uppercase shadow-xl"
                >
                  <MessageCircle size={18} /> Support Chat
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
