import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo', trend }) => {
  const colorMap = {
    indigo: 'from-indigo-600/20 to-purple-600/10 border-indigo-500/30 text-indigo-400',
    emerald: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-600/20 to-orange-600/10 border-amber-500/30 text-amber-400',
    purple: 'from-purple-600/20 to-pink-600/10 border-purple-500/30 text-purple-400',
    rose: 'from-rose-600/20 to-pink-600/10 border-rose-500/30 text-rose-400',
  };

  const currentStyle = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`p-6 rounded-2xl bg-gradient-to-br ${currentStyle} border backdrop-blur-xl shadow-xl relative overflow-hidden group`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1.5">{subtitle}</p>}
        </div>

        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Icon className={`w-6 h-6 ${currentStyle.split(' ').pop()}`} />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
          <span>Target Standard</span>
          <span className="font-bold text-slate-200">{trend}</span>
        </div>
      )}
    </motion.div>
  );
};
