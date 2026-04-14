import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MatchCard from "../components/MatchCard";
import SkeletonCard from "../components/shared/SkeletonCard";
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Target, TrendingUp, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SEO from "../components/shared/SEO";

const Home = () => {
  const predictions = useQuery(api.predictions?.getPredictions || (() => null));
  const stats = useQuery(api.stats?.getAccuracyStats || (() => null));

  const isLoading = predictions === undefined;
  const displayData = predictions || [];
  
  // Find the highest confidence prediction for the banker
  const bankerPrediction = predictions?.length ? [...predictions].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))[0] : null;

  const accuracyData = stats || { winRate: 0, total: 0 };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 lg:gap-10 pb-10">
      <SEO 
        title="Predict & Profit"
        description="Nigeria's premier free betting prediction platform. Get real-time data analysis, verified banker tips, and algorithmic football signals daily."
      />
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <motion.h1 variants={itemVariants} className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-1">
            Dashboard <span className="premium-gradient-text">Overview</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-sm text-text-muted">High-precision AI models active and monitoring.</motion.p>
        </div>
        
        <div className="flex items-center gap-2 bg-brand-primary/10 px-4 py-2 rounded-xl border border-brand-primary/20">
          <Activity size={16} className="text-brand-primary animate-pulse" />
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Global Scan Active</span>
        </div>
      </div>

      {/* KPI Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Win Rate', value: `${accuracyData.winRate}%`, icon: Target, color: 'text-brand-primary', bg: 'bg-brand-primary' },
          { title: 'Monthly ROI', value: '+124%', icon: TrendingUp, color: 'text-brand-accent', bg: 'bg-brand-accent' },
          { title: 'Verified Tips', value: accuracyData.total.toLocaleString(), icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-400' },
          { title: 'Active Models', value: 'Live 12', icon: Activity, color: 'text-brand-secondary', bg: 'bg-brand-secondary' },
        ].map((stat, i) => (
          <div key={i} className="glass-ultra p-5 rounded-2xl flex flex-col gap-3 group hover:border-white/20 transition-all">
            <div className={`w-8 h-8 rounded-lg ${stat.bg}/10 flex items-center justify-center`}>
              <stat.icon size={16} className={stat.color} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className={`text-2xl font-black text-white`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main Dashboard Section */}
      {bankerPrediction && bankerPrediction.match && (
        <div className="grid grid-cols-1 gap-6">
          {/* Proprietary Banker Feature */}
          <motion.div variants={itemVariants} className="w-full glass-ultra glow-border shimmer-effect rounded-[32px] p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary opacity-10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-brand-primary/20 p-2 rounded-lg"><Sparkles size={16} className="text-brand-primary" /></div>
              <span className="text-xs font-black text-brand-primary uppercase tracking-[0.2em] relative z-10">Algorithmic Banker</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
              <div className="flex-1">
                <h2 className="text-4xl lg:text-5xl font-black text-white leading-none tracking-tight mb-3 line-clamp-2">
                  {bankerPrediction.match.homeTeam?.shortName} vs {bankerPrediction.match.awayTeam?.shortName}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {bankerPrediction.reasoning || "Neural network detects a massive value disparity in the Asian Handicap market perfectly aligned with historical form."}
                </p>
                
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-brand-primary text-black font-black text-sm rounded-xl shadow-[0_0_20px_rgba(0,255,156,0.2)] hover:scale-105 transition-transform">
                    View Deep Analysis
                  </button>
                </div>
              </div>

              <div className="w-full md:w-64 glass-ultra p-5 rounded-2xl border-white/10 shrink-0 shadow-2xl">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Premium Signal</p>
                <h3 className="text-xl font-black text-brand-primary text-glow mb-4 uppercase">{bankerPrediction.outcome}</h3>
                
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-text-muted">Edge Value</span>
                  <span className="text-2xl font-black text-white">{bankerPrediction.odds || "Val+"}</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-brand-primary rounded-full shadow-[0_0_10px_#00FF9C]" style={{ width: `${bankerPrediction.confidence}%` }} />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  <span>Confidence</span>
                  <span className="text-white">{bankerPrediction.confidence}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Live / Feed List */}
      <motion.div variants={itemVariants} className="flex flex-col gap-6 mt-4">
        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-1">
              <Zap size={20} className="text-brand-primary" /> Algorithmic Selections
            </h4>
            <p className="text-xs text-text-muted">Top matches curated dynamically by AI.</p>
          </div>
          <button className="text-xs font-bold text-text-muted hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
            View All <ChevronRight size={14} />
          </button>
        </div>

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              displayData.slice(0, 8).map((match, idx) => (
                <motion.div key={match._id || idx} variants={itemVariants} className="w-full h-full">
                  <MatchCard match={match} />
                </motion.div>
              ))
            )}
          </div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Home;


