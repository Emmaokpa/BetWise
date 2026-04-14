import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Shield, ChevronRight, Filter, Calendar } from 'lucide-react';
import SEO from "../components/shared/SEO";

const LiveScores = () => {
  // Fetch all matches and filter for live ones for maximum flexibility
  const allMatches = useQuery(api.football.getMatches, {}) || [];
  
  const liveMatches = allMatches.filter(m => 
    ['LIVE', 'IN_PLAY', 'PAUSED'].includes(m.status)
  );

  const upcomingMatches = allMatches.filter(m => 
    ['SCHEDULED', 'TIMED'].includes(m.status)
  ).slice(0, 5); // Just show next 5

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 lg:gap-8 pb-10">
      <SEO 
        title="Live Football Scores"
        description="Real-time football scores and live match updates from all major leagues. Stay updated with BetWise NG."
      />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-red-500">Live Infrastructure Digital Feed</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Real-Time <span className="premium-gradient-text">Scores</span></h1>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <Activity size={16} className="text-brand-primary" />
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Auto-Sync Active</span>
        </div>
      </div>

      {/* Live Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-sm font-black text-white uppercase tracking-[0.1em] flex items-center gap-2">
             <Zap size={14} className="text-brand-primary fill-brand-primary" /> Active Battles ({liveMatches.length})
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {liveMatches.length > 0 ? (
              liveMatches.map((match) => (
                <motion.div 
                  key={match._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-ultra rounded-2xl p-5 border-white/5 flex flex-col gap-4 relative overflow-hidden group"
                >
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    <span>{match.competition.name}</span>
                    <span className="text-red-500 animate-pulse flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-red-500" /> LIVE
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2">
                    <div className="flex items-center gap-3 flex-1">
                      <img src={match.homeTeam.crest || '/placeholder.png'} alt="" className="w-8 h-8 object-contain" />
                      <span className="text-sm font-black text-white uppercase line-clamp-1">{match.homeTeam.shortName}</span>
                    </div>
                    <div className="flex flex-col items-center px-4 bg-white/5 rounded-lg py-1 border border-white/5">
                      <span className="text-lg font-black text-white italic">{match.score.fullTime.home ?? 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2">
                    <div className="flex items-center gap-3 flex-1">
                      <img src={match.awayTeam.crest || '/placeholder.png'} alt="" className="w-8 h-8 object-contain" />
                      <span className="text-sm font-black text-white uppercase line-clamp-1">{match.awayTeam.shortName}</span>
                    </div>
                    <div className="flex flex-col items-center px-4 bg-white/5 rounded-lg py-1 border border-white/5">
                      <span className="text-lg font-black text-white italic">{match.score.fullTime.away ?? 0}</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-3 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Matchday {match.matchday}</span>
                    <button className="text-[10px] font-black text-brand-primary hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
                      Intel <ChevronRight size={12} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center glass-ultra rounded-2xl border-dashed border-white/10 opacity-50">
                <Shield size={24} className="text-text-muted mb-2" />
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">No Matches Currently Live</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Upcoming Section */}
      <section className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-sm font-black text-text-muted uppercase tracking-[0.1em] flex items-center gap-2">
             <Calendar size={14} /> Scheduled Transitions
           </h2>
           <button className="text-[10px] font-black text-text-muted hover:text-white transition-all uppercase tracking-widest">View All Fixtures</button>
        </div>

        <div className="flex flex-col gap-2">
          {upcomingMatches.map((match) => (
            <div key={match._id} className="glass-ultra rounded-xl p-4 border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-6 flex-1">
                <span className="text-xs font-bold text-text-muted w-10">{new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-xs font-bold text-white uppercase">{match.homeTeam.shortName}</span>
                    <img src={match.homeTeam.crest} alt="" className="w-5 h-5 object-contain" />
                  </div>
                  <span className="text-[10px] font-black text-text-muted">VS</span>
                  <div className="flex items-center gap-2 flex-1">
                    <img src={match.awayTeam.crest} alt="" className="w-5 h-5 object-contain" />
                    <span className="text-xs font-bold text-white uppercase">{match.awayTeam.shortName}</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-4 hidden md:block">
                {match.competition.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default LiveScores;
