import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ChevronUp, ChevronDown, CheckCircle2, TrendingUp } from 'lucide-react';
import useAccumulatorStore from '../../store/useAccumulatorStore';

const BetSlip = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    slip, 
    stake, 
    setStake, 
    removePrediction, 
    clearSlip, 
    getTotalOdds, 
    getPotentialReturn,
    bookingCode,
    isGenerating,
    generateCode,
    resetBooking
  } = useAccumulatorStore();

  if (slip.length === 0) return null;

  const totalOdds = getTotalOdds();
  const potentialReturn = getPotentialReturn();

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 md:p-6 w-full md:w-96 pointer-events-none">
      <motion.div 
        layout
        className="pointer-events-auto bg-[#1a1a24] border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Header (Clickable to toggle) */}
        <div 
          className="bg-brand-primary/10 p-4 flex justify-between items-center cursor-pointer hover:bg-brand-primary/20 transition-colors border-b border-white/5"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary text-black w-6 h-6 rounded-full flex items-center justify-center font-black text-xs">
              {slip.length}
            </div>
            <h3 className="font-bold text-white tracking-wide">Bet Slip</h3>
          </div>
          <div className="flex items-center gap-3">
            {!isOpen && (
              <span className="text-brand-primary font-black text-sm">
                {(totalOdds).toFixed(2)} Odds
              </span>
            )}
            {isOpen ? <ChevronDown size={20} className="text-text-muted" /> : <ChevronUp size={20} className="text-text-muted" />}
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden flex flex-col max-h-[60vh] bg-[#121218]"
            >
              {/* Slip Items */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
                {slip.map((item) => (
                  <div key={item.matchApiId} className="bg-white/5 border border-white/5 rounded-xl p-3 relative group">
                    <button 
                      onClick={() => removePrediction(item.matchApiId)}
                      className="absolute top-2 right-2 text-text-muted hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    
                    <div className="pr-6">
                      <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-1">
                        {item.match?.competition?.name || 'Tournament'}
                      </p>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {item.match?.homeTeam?.shortName} <span className="text-text-muted text-xs mx-1">v</span> {item.match?.awayTeam?.shortName}
                        </h4>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-secondary uppercase">{item.outcome || item.prediction}</span>
                        <span className="text-sm font-black text-white">{item.odds || 1.85}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer / Actions */}
              <div className="p-4 border-t border-white/5 bg-[#1a1a24]">
                <div className="flex justify-between mb-4 items-center">
                  <span className="text-sm text-text-muted">Total Odds</span>
                  <span className="text-xl font-black text-white">{totalOdds.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between mb-4 items-center">
                  <span className="text-sm text-text-muted">Stake (₦)</span>
                  <input 
                    type="number" 
                    value={stake} 
                    onChange={(e) => setStake(Number(e.target.value))}
                    className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right text-white font-bold focus:outline-none focus:border-brand-primary/50"
                  />
                </div>

                <div className="flex justify-between mb-4 items-center p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                  <span className="text-sm font-bold text-brand-primary/80">Est. Return:</span>
                  <span className="text-xl font-black text-brand-primary">₦ {potentialReturn.toLocaleString()}</span>
                </div>

                <div className="flex flex-col gap-2">
                  {bookingCode ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 text-center"
                    >
                      <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1 block">Your Booking Code</span>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-black text-white tracking-widest leading-none">{bookingCode}</span>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(bookingCode);
                            }}
                            className="p-1.5 bg-white/10 rounded-md text-white hover:bg-brand-primary hover:text-black transition-all"
                            title="Copy Code"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          </button>
                          <a 
                            href="https://www.bet9ja.com/?affid=YOUR_ID"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-brand-primary/20 rounded-md text-brand-primary hover:bg-brand-primary hover:text-black transition-all"
                            title="Stake on Bet9ja"
                          >
                            <TrendingUp size={14} />
                          </a>
                        </div>
                      </div>
                      <button 
                        onClick={resetBooking}
                        className="text-[10px] font-bold text-text-muted hover:text-white mt-3 underline uppercase tracking-tighter"
                      >
                        Reset & Edit Slip
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={clearSlip}
                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors shrink-0"
                        title="Clear Slip"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button 
                        onClick={generateCode}
                        disabled={isGenerating}
                        className="flex-1 py-3 bg-brand-primary text-black font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                          <><CheckCircle2 size={18} /> Generate Booking Code</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BetSlip;
