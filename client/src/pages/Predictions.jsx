import React, { useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MatchCard from "../components/MatchCard";
import NativeAdCard from "../components/ads/NativeAdCard";
import SkeletonCard from "../components/shared/SkeletonCard";
import { motion } from 'framer-motion';
import { Target, Filter, Star, Zap } from 'lucide-react';
import SEO from "../components/shared/SEO";

const Predictions = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [limit, setLimit] = useState(12);
  const rawPredictions = useQuery(api.predictions?.getPredictions || (() => null));

  const filteredData = (rawPredictions || []).filter(p => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'HIGH_CONFIDENCE') return (p.confidence || 0) >= 70;
    const compName = (p.match?.competition?.name || "").toUpperCase();
    return compName.includes(activeFilter.toUpperCase());
  });

  const displayData = filteredData.slice(0, limit);
  const isLoading = rawPredictions === undefined;
  const hasMore = filteredData.length > limit;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 lg:gap-8 pb-10">
      <SEO 
        title="Today's Football Predictions"
        description="Browse the most accurate football predictions for today's matches. Filter by league and confidence to find the best banker tips."
      />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-1">
            Global <span className="premium-gradient-text">Signals</span> Feed
          </h1>
          <p className="text-sm text-text-muted">Live algorithmic predictions curated across all tracked leagues.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2 rounded-xl border border-white/10 text-white font-bold text-sm">
          <Filter size={16} /> Filter Signals
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        <button 
          onClick={() => setActiveFilter('ALL')}
          className={`glass-ultra text-white px-5 py-2.5 rounded-xl font-bold text-xs tracking-widest flex items-center gap-2 border-brand-primary/30 shadow-[0_0_15px_rgba(0,255,156,0.1)] shrink-0 transition-all ${activeFilter === 'ALL' ? 'bg-brand-primary shadow-[0_0_15px_#00FF9C]' : 'bg-white/5'}`}
        >
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_#00FF9C]" />
          ALL ACTIVE
        </button>
        {['PREMIER LEAGUE', 'LA LIGA', 'SERIE A', 'BUNDESLIGA', 'HIGH_CONFIDENCE'].map(league => (
          <button 
            key={league} 
            onClick={() => setActiveFilter(league)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-widest border shrink-0 transition-all ${activeFilter === league ? 'bg-brand-primary text-black border-brand-primary' : 'bg-white/5 border-white/5 text-text-muted hover:text-white'}`}
          >
            {league}
          </button>
        ))}
      </div>

      {/* Predictions Feed Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          displayData.map((match, index) => (
            <React.Fragment key={match._id || index}>
              {/* Insert an Ad Card seamlessly into the flow every 4th item */}
              {index > 0 && index % 4 === 0 && (
                <div className="w-full flex">
                  <NativeAdCard />
                </div>
              )}
              <div className="w-full flex">
                <MatchCard match={match} />
              </div>
            </React.Fragment>
          ))
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12 pb-10">
          <button 
            onClick={() => setLimit(prev => prev + 12)}
            className="glass-ultra px-12 py-4 rounded-2xl text-brand-primary font-black text-sm uppercase tracking-[0.2em] border border-brand-primary/20 shadow-[0_0_30px_rgba(0,255,156,0.1)] hover:bg-brand-primary hover:text-black transition-all"
          >
            Load More Signals
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Predictions;
