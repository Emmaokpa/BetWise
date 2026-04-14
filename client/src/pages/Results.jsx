import { CheckCircle2, XCircle, TrendingUp, History, Filter, Target, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import SEO from "../components/shared/SEO";

const Results = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const predictions = useQuery(api.predictions?.getPredictions || (() => null));
  const stats = useQuery(api.stats?.getAccuracyStats || (() => null));

  const isLoading = predictions === undefined;
  const rawPredictions = predictions || [];

  
  const filteredPredictions = rawPredictions.filter(p => {
    if (p.isCorrect === undefined) return false;
    if (activeFilter === 'WINS') return p.isCorrect;
    if (activeFilter === 'LOSSES') return !p.isCorrect;
    return true;
  });

  const displayStats = stats || { total: 0, winRate: 0, wins: 0, losses: 0 };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 lg:gap-8 pb-10">
      <SEO 
        title="Today's Football Predictions"
        description="Browse the most accurate football predictions for today's matches. Filter by league and confidence to find the best banker tips."
      />
      
      {/* Header & Transparency KPI */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-2">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
                <History size={16} />
              </div>
              <span className="text-xs font-black tracking-[0.2em] uppercase text-brand-primary">Model Transparency</span>
           </div>
           <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Signal <span className="premium-gradient-text">Archive</span></h1>
           <p className="text-sm text-text-muted mt-1">Verification of past algorithmic performance and outcome logging.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
           {[
             { label: 'Success Rate', val: `${displayStats.winRate}%`, icon: Target, color: 'text-brand-primary' },
             { label: 'Total Tips', val: displayStats.total, icon: History, color: 'text-white' },
             { label: 'Verified Wins', val: displayStats.wins, icon: Award, color: 'text-brand-secondary' },
             { label: 'Net ROI', val: '+12.4%', icon: TrendingUp, color: 'text-brand-primary' },
           ].map((stat, i) => (
             <div key={i} className="glass-ultra p-4 rounded-2xl border-white/5 flex flex-col items-center text-center">
                <stat.icon size={14} className={`${stat.color} mb-2 opacity-80`} />
                <span className="text-xl font-black text-white leading-none mb-1">{stat.val}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 glass-ultra rounded-2xl w-max border-white/5">
        {['ALL', 'WINS', 'LOSSES'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
              activeFilter === tab 
              ? 'bg-brand-primary text-black shadow-[0_0_15px_rgba(0,255,156,0.3)]' 
              : 'text-text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Results Matrix */}
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="glass-ultra rounded-3xl p-8 h-32 border border-white/5 animate-pulse" />
            ))
          ) : filteredPredictions.length > 0 ? (
            filteredPredictions.map((p, index) => (
              <motion.div 
                key={p._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-ultra shimmer-effect group rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-6 flex-1">
                   {/* Result Indicator Badge */}
                   <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border ${p.isCorrect ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                      {p.isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                   </div>

                   <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{p.match.competition.name}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${p.isCorrect ? 'bg-brand-primary text-black' : 'bg-red-500 text-white'}`}>
                          {p.isCorrect ? 'WIN' : 'MISS'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white uppercase">{p.match.homeTeam.shortName}</h3>
                        <span className="text-[10px] font-black text-text-muted italic">VS</span>
                        <h3 className="text-base font-black text-white uppercase">{p.match.awayTeam.shortName}</h3>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-8 md:gap-12">
                   <div className="text-center md:text-right">
                      <span className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Prediction</span>
                      <span className="text-sm font-black text-white">{p.outcome} @{p.odds}</span>
                   </div>

                   <div className="text-center md:text-right">
                      <span className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Score</span>
                      <span className="text-xl font-black text-white italic tracking-tighter">{p.actualResult}</span>
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="py-20 text-center glass-ultra rounded-[40px] border-dashed border-white/10 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                 <Filter size={24} className="text-text-muted" />
              </div>
              <p className="text-text-secondary font-black tracking-widest uppercase">No outcomes found in this segment</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Results;
