import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function Partners() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-[#f0f4f8] via-[#e6ebf3] to-[#d1d9e8]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-8 h-[2px] bg-[#EE8433]" />
          <span className="text-[#EE8433] font-bold uppercase tracking-widest text-xs">Our Partners</span>
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-6">
          Collaboration Network
        </h2>
        <p className="text-slate-500 max-w-2xl">
          We collaborate with organizations that share our vision for excellence in technology education.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
            <Building2 size={36} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Partners Coming Soon</h3>
          <p className="text-slate-500 text-sm text-center max-w-md">
            We are building our collaboration network. Partner information will be available here once confirmed by our team.
          </p>
        </motion.div>
      </div>

      <Link to="/" className="mt-8 flex items-center gap-2 text-sm font-bold text-[#3A3992] hover:underline">
        <ArrowLeft size={16} /> Back to Home
      </Link>
    </div>
  );
}