import React from 'react';
import { motion } from 'framer-motion';
import { HiCheckCircle, HiExclamationCircle, HiShieldCheck } from 'react-icons/hi';

const cardVariants = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  })
};

const DosAndDonts = ({ dos = [], donts = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* ── DO's ── */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="flex items-center space-x-3 mb-6"
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-11 h-11 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200"
          >
            <HiCheckCircle className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-xl font-black text-gray-900">Recommended Actions</h3>
            <p className="text-xs text-green-600 font-bold uppercase tracking-widest">DO These Daily</p>
          </div>
        </motion.div>

        {dos.map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(34,197,94,0.12)' }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 space-y-4 group relative overflow-hidden"
          >
            {/* Green left accent bar */}
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300" />

            {/* Shimmer on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-50/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: [0, -15, 15, 0], scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                  className="w-9 h-9 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"
                >
                  {item.icon || '✅'}
                </motion.div>
                <h4 className="font-black text-gray-900 text-sm leading-tight">{item.action}</h4>
              </div>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 px-3 py-1 bg-green-100 text-green-700 text-[10px] uppercase font-black rounded-full"
              >
                {item.frequency}
              </motion.span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed italic relative z-10">{item.description || item.detail}</p>

            <div className="pt-4 border-t border-gray-50 flex items-start space-x-2 relative z-10">
              <HiShieldCheck className="text-green-400 w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Why It Helps</span>
                <p className="text-xs text-gray-600 font-medium mt-0.5">{item.scientific_reason}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── DON'Ts ── */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="flex items-center space-x-3 mb-6"
        >
          <motion.div
            whileHover={{ rotate: -10, scale: 1.1 }}
            className="w-11 h-11 bg-gradient-to-br from-red-400 to-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-200"
          >
            <HiExclamationCircle className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-xl font-black text-gray-900">Avoidance Guide</h3>
            <p className="text-xs text-red-500 font-bold uppercase tracking-widest">AVOID These Always</p>
          </div>
        </motion.div>

        {donts.map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(239,68,68,0.12)' }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 space-y-4 group relative overflow-hidden"
          >
            {/* Red left accent bar */}
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-red-400 to-rose-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300" />

            {/* Shimmer on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-50/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

            <div className="flex items-start space-x-3 relative z-10">
              <motion.div
                whileHover={{ rotate: [0, -15, 15, 0], scale: 1.15 }}
                transition={{ duration: 0.4 }}
                className="w-9 h-9 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-xl shadow-inner flex-shrink-0"
              >
                {item.icon || '🚫'}
              </motion.div>
              <h4 className="font-black text-gray-900 text-sm leading-tight">{item.action}</h4>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed italic relative z-10">{item.reason}</p>

            <div className="pt-4 border-t border-gray-50 flex items-start space-x-2 relative z-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
              >
                <HiExclamationCircle className="text-red-400 w-5 h-5 flex-shrink-0 mt-0.5" />
              </motion.div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Risk If Ignored</span>
                <p className="text-xs text-red-600 font-bold mt-0.5">{item.risk_if_ignored}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DosAndDonts;
