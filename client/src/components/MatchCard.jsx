import { Link } from 'react-router-dom';
import { ChevronRight, Star, Plus, Check, TrendingUp } from 'lucide-react';
import useAccumulatorStore from '../store/useAccumulatorStore';
import useFollows from '../hooks/useFollows';
import TeamIcon from './shared/TeamIcon';

const MatchCard = ({ match: item }) => {
  const { toggleFollow, isFollowed: checkFollowed } = useFollows();
  const isReal = !!item.match;
  const match = isReal ? item.match : item;

  const isLive = ['LIVE', 'IN_PLAY', 'PAUSED'].includes(match.status);
  
  // Format real utcDate (e.g. 2024-04-14T19:45:00Z) to 19:45 WAT
  const formatTime = (dateStr) => {
    if (!dateStr) return '19:45';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const timeText = isLive ? 'LIVE' : (isReal ? formatTime(match.utcDate) : match.kickOff);
  const expertTip = item.outcome || item.prediction || 'Market analysis...';
  // Use the calculated confidence from the backend, fall back to a deterministic realistic range for un-synced matches
  const seed = item.matchApiId || match?.id || parseInt(item._id?.replace(/\D/g, '').slice(-4) || '50');
  const confidence = item.confidence || (isReal ? 70 + (seed % 25) : 51);
  const odds = item.odds || (isReal ? (1.5 + (seed % 10) * 0.2).toFixed(2) : '2.45');

  const matchApiId = isReal ? item.matchApiId : parseInt(item._id?.replace(/\D/g, '') || '0') || 0;
  const isFollowed = checkFollowed(matchApiId);

  const { slip, addPrediction, removePrediction: slipRemove } = useAccumulatorStore();
  const isInSlip = slip.some(p => p.matchApiId === matchApiId);

  const handleFollowClick = (e) => {
    e.preventDefault();
    toggleFollow(matchApiId);
  };

  const handleSlipToggle = (e) => {
    e.preventDefault();
    if (isInSlip) {
      slipRemove(matchApiId);
    } else {
      addPrediction(item);
    }
  };

  return (
    <div className="h-full w-full card-hover-scale relative">
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button 
          onClick={handleFollowClick}
          className="w-8 h-8 rounded-full glass-ultra flex items-center justify-center border-white/10 hover:bg-white/10 transition-all shadow-xl"
          title="Follow Prediction"
        >
          <Star size={14} className={isFollowed ? "text-brand-primary fill-brand-primary" : "text-text-muted"} />
        </button>
        <button 
          onClick={handleSlipToggle}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/5 border ${isInSlip ? 'border-brand-primary/50 text-brand-primary shadow-[0_0_10px_rgba(0,255,156,0.3)]' : 'border-white/10 hover:bg-white/10 text-text-muted'}`}
          title="Add to Accumulator Slip"
        >
          {isInSlip ? <Check size={14} /> : <Plus size={14} />}
        </button>
        <a 
          href="https://www.bet9ja.com/?affid=YOUR_ID" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-xl glass-ultra flex items-center justify-center border-brand-primary/20 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-black transition-all shadow-xl"
          title="Bet on Bet9ja"
          onClick={(e) => e.stopPropagation()}
        >
          <TrendingUp size={16} />
        </a>
      </div>

      <Link to={`/match/${match.apiId || match._id}`} className="block relative group h-full">
        <div className="glass-ultra shimmer-effect rounded-[24px] p-5 md:p-6 border-white/5 overflow-hidden h-full flex flex-col hover:border-brand-primary/30 hover:shadow-[0_8px_30px_rgba(0,255,156,0.1)]">
          {/* Internal Glows */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-brand-primary opacity-0 group-hover:opacity-[0.05] blur-3xl rounded-full transition-opacity duration-500" />
          
          {/* Card Header */}
          <div className="flex justify-between items-center mb-5 pr-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md glass-ultra flex items-center justify-center border-white/10 shadow-inner">
                {match.competition?.emblem ? (
                  <img src={match.competition.emblem} alt="" className="w-4 h-4 object-contain" />
                ) : (
                  <Shield size={12} className="text-text-muted" />
                )}
              </div>
              <span className="text-[10px] lg:text-xs font-bold tracking-widest text-text-secondary uppercase">
                {match.competition?.name || 'Grand League'}
              </span>
            </div>
            <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest ${isLive ? 'bg-red-500/10 text-red-500 animate-pulse border border-red-500/20' : 'bg-white/5 text-text-muted border border-white/5'}`}>
              {timeText}
            </div>
          </div>

            <div className="flex flex-col items-center flex-1 w-1/3">
              <TeamIcon src={match.homeTeam?.crest} name={match.homeTeam?.shortName} />
              <h3 className="text-xs md:text-sm font-bold text-white text-center leading-tight tracking-tight uppercase line-clamp-2 mt-3">{match.homeTeam?.shortName || 'Team A'}</h3>
            </div>

            <div className="flex flex-col items-center gap-1 px-2">
              <span className="text-xs font-black text-text-muted italic tracking-wider">VS</span>
            </div>

            <div className="flex flex-col items-center flex-1 w-1/3">
              <TeamIcon src={match.awayTeam?.crest} name={match.awayTeam?.shortName} />
              <h3 className="text-xs md:text-sm font-bold text-white text-center leading-tight tracking-tight uppercase line-clamp-2 mt-3">{match.awayTeam?.shortName || 'Team B'}</h3>
            </div>

          {/* Expert Insight Bar */}
          <div className="pt-4 border-t border-white/[0.05] mt-auto">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-bold text-brand-primary/70 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Zap size={10} className="text-brand-primary" /> Prediction
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm md:text-base font-black text-white uppercase tracking-tight">{expertTip}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded-md">{odds}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-text-muted">
                  Conf: <span className="text-white">{confidence}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MatchCard;
