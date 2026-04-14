import React, { useEffect } from 'react';
import { Star, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const NativeAdCard = ({ type = 'adsterra' }) => {
  useEffect(() => {
    // In a real Adsterra integration, you would insert the script tag here
    // For now, we render a "Native-Looking" Internal Ad Card to demo the placement
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full glass-ultra rounded-[32px] overflow-hidden relative border-brand-secondary/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)] group h-full flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/10 via-transparent to-transparent opacity-50" />
      
      {/* Ad Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-brand-secondary/20 text-brand-secondary text-[8px] font-black px-2 py-1 rounded border border-brand-secondary/30 uppercase tracking-widest">
          Sponsored
        </div>
      </div>

      <div className="p-6 flex flex-col items-center justify-center text-center flex-1 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-brand-secondary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,225,255,0.2)]">
          <Star className="text-brand-secondary fill-brand-secondary/20" size={32} />
        </div>

        <h3 className="text-2xl font-black text-white leading-tight mb-3">
          Double Your <span className="text-brand-secondary text-italic uppercase">Bankroll</span>
        </h3>
        
        <p className="text-sm text-text-secondary font-medium leading-relaxed mb-8 px-4">
          Exclusive allocation for BetWise elites. Sign up on our partner bookie and claim a 200% matched deposit block instantly.
        </p>

        <div className="w-full space-y-3">
           <button className="w-full py-4 bg-brand-secondary text-black rounded-2xl text-sm font-black shadow-[0_10px_20px_rgba(0,225,255,0.3)] hover:scale-[1.03] transition-transform flex items-center justify-center gap-2">
             CLAIM ALLOCATION <Zap size={16} fill="black" />
           </button>
           <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-text-muted uppercase">
             <ShieldCheck size={12} /> Verified Partner
           </div>
        </div>
      </div>
      
      {/* Decorative Progress Bar for "Native" look */}
      <div className="h-1.5 bg-white/5 w-full">
         <div className="h-full bg-brand-secondary w-3/4 shadow-[0_0_10px_#00e1ff]" />
      </div>
    </motion.div>
  );
};

export default NativeAdCard;
