import { useEffect } from 'react';

const AdSlot = ({ id, format = 'rectangle', className = "" }) => {
  useEffect(() => {
    // This is where Monetag/Adsterra scripts would be initialized
    // console.log(`Initializing ad slot: ${id} with format: ${format}`);
  }, [id, format]);

  const getDimensions = () => {
    switch (format) {
      case 'banner': return 'h-24 w-full';
      case 'square': return 'h-64 w-64 mx-auto';
      default: return 'h-48 w-full';
    }
  };

  return (
    <div className={`my-8 bg-bg-secondary border border-border-color rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group ${getDimensions()} ${className}`}>
      {/* Decorative pulse for placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Advertisement</span>
        <div className="px-3 py-1 bg-bg-primary rounded-lg border border-border-color text-[8px] font-bold text-text-muted">
          ID: {id}
        </div>
      </div>

      {/* Actual Ad Script would load here */}
      <div id={`ad-container-${id}`} className="absolute inset-0 z-0 flex items-center justify-center">
        {/* Ad script content will be injected here */}
      </div>

      <div className="absolute bottom-2 right-4 text-[8px] font-bold text-text-muted uppercase opacity-30">
        BetWise NG Ads
      </div>
    </div>
  );
};

export default AdSlot;
