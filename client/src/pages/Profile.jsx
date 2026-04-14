import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { User, Activity, Target, Trophy, Zap, ChevronRight, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "../components/shared/SEO";
import useFollows from "../hooks/useFollows";
import MatchCard from "../components/MatchCard";
import { Link } from "react-router-dom";

const Profile = () => {
  const { follows } = useFollows();
  const predictions = useQuery(api.predictions?.getPredictions || (() => null));
  
  const followedPicks = (predictions || []).filter(p => follows.includes(p.matchApiId));
  
  // Calculate local stats
  const resolved = followedPicks.filter(p => p.isCorrect !== undefined);
  const wins = resolved.filter(p => p.isCorrect === true).length;
  const losses = resolved.filter(p => p.isCorrect === false).length;
  const winRate = resolved.length > 0 ? Math.round((wins / resolved.length) * 100) : 0;

  const stats = {
    winRate: `${winRate}%`,
    totalFollowed: followedPicks.length,
    wins,
    losses
  };

  const isLoading = predictions === undefined;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="flex items-center gap-4 mb-4">
           <div className="w-12 h-12 rounded-xl bg-white/5" />
           <div className="h-6 w-48 bg-white/5 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="h-32 glass-ultra rounded-3xl" />
           <div className="h-32 glass-ultra rounded-3xl" />
           <div className="h-32 glass-ultra rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 lg:gap-8 pb-32">
      <SEO 
        title="Intelligence Ops Dashboard"
        description="Track your personal betting predictions and analyze your win rate using our local data engine."
      />

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-brand-primary/20 text-brand-primary">
              <BarChart3 size={16} />
            </div>
            <span className="text-xs font-black tracking-[0.2em] uppercase text-brand-primary">Intelligence Ops</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Personal <span className="premium-gradient-text">Tracker</span></h1>
          <p className="text-sm text-text-muted mt-1">Real-time performance metrics stored securely on your device.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass-ultra rounded-3xl p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Target className="text-text-muted mb-2 group-hover:text-brand-primary transition-colors" size={24} />
          <span className="text-sm font-bold text-text-secondary uppercase tracking-widest">Win Rate</span>
          <span className="text-4xl font-black text-white">{stats.winRate}</span>
        </div>
        
        <div className="glass-ultra rounded-3xl p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Activity className="text-text-muted mb-2 group-hover:text-brand-accent transition-colors" size={24} />
          <span className="text-sm font-bold text-text-secondary uppercase tracking-widest">Followed Tips</span>
          <span className="text-4xl font-black text-white">{stats.totalFollowed}</span>
        </div>

        <div className="glass-ultra rounded-3xl p-6 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#eaff00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Trophy className="text-text-muted mb-2 group-hover:text-[#eaff00] transition-colors" size={24} />
          <span className="text-sm font-bold text-text-secondary uppercase tracking-widest">Verified Wins</span>
          <span className="text-4xl font-black text-white">{stats.wins}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Zap size={20} className="text-brand-primary fill-brand-primary/20" /> Active Surveillance
          </h2>
          {followedPicks.length > 0 && (
             <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{followedPicks.length} Signals Tracked</span>
          )}
        </div>

        {followedPicks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {followedPicks.map((match, i) => (
              <div key={match._id || i} className="w-full">
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-ultra rounded-[40px] p-20 text-center flex flex-col items-center justify-center border-dashed border-white/10">
             <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-6">
               <Zap size={32} className="text-text-muted" />
             </div>
             <h3 className="text-2xl font-black text-white mb-3">No Signals Synchronized</h3>
             <p className="text-sm text-text-secondary max-w-sm mb-8 leading-relaxed">
               You haven't followed any algorithmic predictions yet. Browsing the feed and clicking the star icon will sync signals to your personal dashboard.
             </p>
             <Link to="/predictions" className="px-8 py-3 bg-brand-primary text-black font-black text-xs uppercase rounded-xl flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,156,0.3)]">
               Explore Intelligence <ChevronRight size={16} />
             </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
