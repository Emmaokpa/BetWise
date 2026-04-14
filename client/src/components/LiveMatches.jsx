import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MatchCard from "./MatchCard";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const LiveMatches = () => {
  const matches = useQuery(api.football.getMatches);

  if (matches === undefined) {
    return (
      <div className="flex flex-col gap-4 max-w-4xl mx-auto p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-bg-secondary animate-pulse rounded-2xl border border-border-color" />
        ))}
      </div>
    );
  }

  const liveMatches = matches.filter(m => ['LIVE', 'IN_PLAY', 'PAUSED'].includes(m.status));
  const scheduledMatches = matches.filter(m => m.status === 'SCHEDULED');

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Live Section */}
      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-brand-primary fill-brand-primary/20" size={20} />
            <h2 className="text-xl font-bold uppercase tracking-tight">Live Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Scheduled Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
          <h2 className="text-xl font-bold uppercase tracking-tight">Upcoming Fixtures</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduledMatches.length > 0 ? (
            scheduledMatches.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-bg-secondary rounded-2xl border border-dashed border-border-color">
              <p className="text-text-muted text-sm font-medium">No matches scheduled for today</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LiveMatches;
