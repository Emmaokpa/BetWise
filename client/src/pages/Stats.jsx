import React, { useState, useEffect } from "react";
import { ChevronLeft, BarChart2, Activity, PieChart, Shield, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from 'framer-motion';
import SEO from "../components/shared/SEO";

const LEAGUES = [
  { name: 'Premier League', code: 'PL', icon: 'https://crests.football-data.org/PL.png' },
  { name: 'La Liga', code: 'PD', icon: 'https://crests.football-data.org/PD.png' },
  { name: 'Serie A', code: 'SA', icon: 'https://crests.football-data.org/SA.png' },
  { name: 'Bundesliga', code: 'BL1', icon: 'https://crests.football-data.org/BL1.png' },
  { name: 'Champions League', code: 'CL', icon: 'https://crests.football-data.org/CL.png' },
];

const Stats = () => {
  const [activeLeague, setActiveLeague] = useState(LEAGUES[0]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const standings = useQuery(api.football.getStandings, { competitionCode: activeLeague.code });
  const fetchStandingsAction = useAction(api.football.fetchStandings);

  const filteredTable = standings?.table.filter(row => 
    row.team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    row.team.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await fetchStandingsAction({ competitionCode: activeLeague.code });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (standings === null && !isSyncing) {
      handleSync();
    }
  }, [standings, activeLeague.code]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 lg:gap-8 pb-10">
      <SEO 
        title="League Tables & H2H Stats"
        description="Deep dive into football statistics. View real-time league standings, team form, and head-to-head records for the world's top leagues."
      />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
           <Link to="/" className="flex items-center gap-1 text-text-muted hover:text-white transition-colors mb-2">
              <ChevronLeft size={16} />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">Global Analytics</span>
           </Link>
           <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Statistical <span className="premium-gradient-text">Diagnostics</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-brand-primary/10 px-4 py-2 rounded-xl border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            <span className="text-[10px] font-black uppercase tracking-widest">Update Data</span>
          </button>
          <div className="hidden md:flex items-center gap-2 bg-text-muted/10 px-4 py-2 rounded-xl border border-white/10">
            <PieChart size={14} className="text-text-secondary" />
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Real-Time Standings</span>
          </div>
        </div>
      </div>

      {/* League Selector */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        {LEAGUES.map((league) => (
          <button
            key={league.code}
            onClick={() => setActiveLeague(league)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all shrink-0 ${
              activeLeague.code === league.code 
              ? 'bg-brand-primary border-brand-primary text-black font-black shadow-[0_0_20px_rgba(0,255,156,0.3)]' 
              : 'bg-white/5 border-white/5 text-text-muted hover:border-white/20'
            }`}
          >
            <img src={league.icon} alt="" className="w-5 h-5 object-contain" />
            <span className="text-xs uppercase tracking-tight">{league.name}</span>
          </button>
        ))}
      </div>

      {/* Standings Table */}
      <div className="glass-ultra rounded-[32px] overflow-hidden border-white/5">
        <div className="p-6 md:p-8 bg-white/5 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <BarChart2 size={16} className="text-brand-primary" /> {activeLeague.name} Table
          </h2>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Search team..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-primary/50 transition-all"
              />
            </div>

            {standings && (
              <span className="hidden lg:block text-[10px] font-bold text-text-muted uppercase tracking-widest shrink-0">
                Refreshed: {new Date(standings.lastUpdated).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Pos</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Team</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-center">P</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-center">W</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-center">D</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-center">L</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-center">GD</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {standings ? (
                  filteredTable.map((row, i) => (
                    <motion.tr 
                      key={row.team.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.05, 0.5) }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4 font-black text-text-secondary text-sm">
                        <span className={`w-6 h-6 rounded flex items-center justify-center ${
                          row.position <= 4 ? 'bg-brand-primary/20 text-brand-primary' : 
                          row.position > 17 ? 'bg-red-500/20 text-red-500' : ''
                        }`}>
                          {row.position}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={row.team.crest || '/placeholder.png'} alt="" className="w-6 h-6 object-contain" />
                          <span className="text-sm font-black text-white group-hover:text-brand-primary transition-colors uppercase">{row.team.shortName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-white">{row.playedGames}</td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-white/70">{row.won}</td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-white/70">{row.draw}</td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-white/70">{row.lost}</td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-text-muted">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-black text-white">{row.points}</span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-white/5 animate-pulse">
                      <td className="px-6 py-4"><div className="w-6 h-6 bg-white/5 rounded mx-auto" /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-white/5 rounded" />
                          <div className="w-24 h-4 bg-white/5 rounded" />
                        </div>
                      </td>
                      <td colSpan="6" className="px-6 py-4">
                         <div className="h-4 w-full bg-white/5 rounded" />
                      </td>
                    </tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Advisory Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-ultra rounded-[32px] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary opacity-5 blur-[60px] rounded-full" />
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-brand-primary" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Model Significance</h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed font-medium">
            League standings represent the primary structural variable in our prediction engine. A position gap of 5+ ranks triggers a weighting adjustment toward the superior seed, adjusted for home advantage and current scoring momentum.
          </p>
        </div>

        <div className="glass-ultra rounded-[32px] p-8 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <Activity size={20} className="text-brand-accent" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Real-Time Refresh</h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed font-medium">
            Data is strictly synchronized with world-leading football feeds. During live match-weeks, standings are updated every 6 hours to ensure your accumulator builds are based on the latest seasonal trajectories.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Stats;
