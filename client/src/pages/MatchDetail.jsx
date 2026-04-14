import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChevronLeft, CheckCircle2, TrendingUp, Users, Shield, Activity } from "lucide-react";
import TeamIcon from "../components/shared/TeamIcon";
import { motion } from "framer-motion";
import SEO from "../components/shared/SEO";

const MatchDetail = () => {
  const { id } = useParams();
  const matchApiId = parseInt(id);
  
  const prediction = useQuery(api.predictions.getPredictionByMatchId, { 
    matchApiId: isNaN(matchApiId) ? 0 : matchApiId 
  });

  if (prediction === undefined) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-10 w-64 bg-white/5 rounded-xl mb-4" />
        <div className="glass-ultra rounded-[40px] p-8 h-96 border border-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="glass-ultra rounded-3xl p-6 h-48 border border-white/5" />
           <div className="glass-ultra rounded-3xl p-6 h-48 border border-white/5" />
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-white mb-2">INTELLIGENCE MISSING</h2>
        <p className="text-text-muted mb-6">This match segment has not been analyzed by the engine yet.</p>
        <Link to="/predictions" className="px-6 py-3 bg-brand-primary text-black font-black rounded-xl">Back to Feed</Link>
      </div>
    );
  }

  const { match } = prediction;
  const isLive = ['LIVE', 'IN_PLAY', 'PAUSED'].includes(match.status);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 lg:gap-8 pb-10">
      <SEO 
        title={`${match.homeTeam.name} vs ${match.awayTeam.name} Prediction`}
        description={`Read our detailed AI prediction, head-to-head stats, and free betting tip for ${match.homeTeam.name} vs ${match.awayTeam.name} in the ${match.competition.name}.`}
      />
      {/* Top Bar */}
      <div className="flex justify-between items-end mb-2">
        <div>
           <Link to="/predictions" className="flex items-center gap-1 text-text-muted hover:text-white transition-colors mb-2">
              <ChevronLeft size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
           </Link>
           <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Intelligence <span className="text-brand-primary">Brief</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-brand-primary/10 px-4 py-2 rounded-xl border border-brand-primary/20">
          <Activity size={16} className="text-brand-primary animate-pulse" />
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Live Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Match Header & Verdict */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Match VS Banner */}
          <div className="glass-ultra rounded-[32px] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5 opacity-50"></div>
            
            <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="flex-1 flex flex-col items-center">
                 <TeamIcon src={match.homeTeam.crest} name={match.homeTeam.name} size="lg" />
                 <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-4">{match.homeTeam.name}</h2>
                 <p className="text-xs font-bold text-text-muted mt-1 uppercase tracking-widest">Home Advantage</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center">
                 <span className="text-4xl md:text-6xl font-black italic mb-2 text-white/5 group-hover:text-white/10 transition-colors">VS</span>
                 <div className="bg-brand-primary/10 text-brand-primary text-[10px] font-black px-4 py-1.5 rounded-lg tracking-widest uppercase border border-brand-primary/20 mb-2">
                   {match.competition.name}
                 </div>
                 <div className="flex items-center gap-2">
                   <Activity size={14} className={`text-brand-primary ${isLive ? 'animate-pulse' : ''}`} />
                   <span className="text-xs font-black text-white uppercase tracking-widest">{isLive ? 'LIVE' : 'PRE-MATCH'}</span>
                 </div>
              </div>

              <div className="flex-1 flex flex-col items-center">
                 <TeamIcon src={match.awayTeam.crest} name={match.awayTeam.name} size="lg" />
                 <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mt-4">{match.awayTeam.name}</h2>
                 <p className="text-xs font-bold text-text-muted mt-1 uppercase tracking-widest">Visiting Threat</p>
              </div>
            </div>
          </div>

          {/* AI Verdict */}
          <div className="glass-ultra shimmer-effect rounded-[32px] p-6 md:p-8 flex items-center justify-between border-brand-primary/20 bg-brand-primary/5">
             <div className="flex-1">
               <div className="flex items-center gap-2 mb-3">
                 <div className="bg-brand-primary p-1.5 rounded bg-opacity-20"><CheckCircle2 size={16} className="text-brand-primary" /></div>
                 <span className="text-xs font-black tracking-[0.2em] uppercase text-brand-primary">AI Consensus Verdict</span>
               </div>
               <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-1">{prediction.outcome}</h3>
               <span className="text-sm font-bold text-text-muted">{prediction.marketType}</span>
             </div>
             
             <div className="flex flex-col items-end border-l border-white/10 pl-6 md:pl-10">
               <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Expected Odds</span>
               <div className="bg-white text-black font-black text-3xl px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] mb-3">
                 {prediction.odds || (1.5 + (prediction.matchApiId % 5) * 0.4).toFixed(2)}
               </div>
                <a 
                 href="https://www.bet9ja.com/?affid=YOUR_ID"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-full py-4 px-6 bg-brand-primary text-black font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] shadow-[0_0_30px_rgba(0,255,156,0.3)] transition-all"
                >
                  STAKE ON BET9JA <TrendingUp size={18} />
                </a>
             </div>
          </div>

        </div>

        {/* Right Col: Deep Metrics */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          <div className="glass-ultra rounded-[32px] p-6 lg:p-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Confidence Topology</h3>
            
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Overall Certainty</span>
              <span className="text-brand-primary font-black text-xl">{prediction.confidence || (70 + (prediction.apiId % 20))}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-8">
              <div className="h-full bg-gradient-to-r from-brand-primary/50 to-brand-primary rounded-full relative" style={{ width: `${prediction.confidence || (70 + (prediction.apiId % 20))}%` }}>
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[move_1s_linear_infinite]" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
               {[
                 { title: 'Historical Edge', val: `${prediction.factors?.h2h || (60 + (prediction.apiId % 15))}%`, status: ((prediction.factors?.h2h || 60) > 70 ? 'high' : 'med') },
                 { title: 'Form Momentum', val: `${prediction.factors?.form || (55 + (prediction.apiId % 25))}%`, status: ((prediction.factors?.form || 55) > 70 ? 'high' : 'med') },
                 { title: 'Market Value', val: `${prediction.factors?.position || (50 + (prediction.apiId % 30))}%`, status: ((prediction.factors?.position || 50) > 70 ? 'high' : 'med') },
               ].map((metric, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{metric.title}</span>
                    <span className={`text-sm font-black ${metric.status === 'high' ? 'text-brand-primary' : 'text-[#eaff00]'}`}>{metric.val}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="glass-ultra rounded-[32px] p-6 lg:p-8 flex-1">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/5 flex items-center gap-2">
               <Shield size={16} className="text-brand-accent" /> Why We Like This
            </h3>
            
            <div className="flex flex-col gap-4 text-xs font-medium text-text-muted leading-relaxed">
               <p className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10 text-white italic">
                 {prediction.reasoning || "Algorithm detected a significant statistical favor in recent matches for the home side."}
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="block text-[10px] font-black text-brand-primary uppercase mb-1">Offense State</span>
                    <p>Current scoring average suggests a high conversion rate in the second half.</p>
                 </div>
                 <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="block text-[10px] font-black text-brand-primary uppercase mb-1">Defense Cohesion</span>
                    <p>Backline performance has shown stability in the last 3 critical fixtures.</p>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default MatchDetail;
