import React from 'react';
import { motion } from 'framer-motion';

export const ProgressRing = ({ score = 0, size = 180, strokeWidth = 14, title = "Readiness Score" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "#4F46E5"; // Indigo
  if (score >= 80) colorClass = "#10B981"; // Emerald
  else if (score >= 60) colorClass = "#F59E0B"; // Amber
  else colorClass = "#EF4444"; // Red

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold text-white tracking-tight">{score}%</span>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{title}</span>
      </div>
    </div>
  );
};
