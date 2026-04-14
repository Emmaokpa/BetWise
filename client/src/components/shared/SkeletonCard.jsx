import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="w-full glass-ultra rounded-[32px] p-6 border border-white/5 animate-pulse flex flex-col gap-6 h-[280px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/5" />
          <div className="h-4 w-24 bg-white/5 rounded-md" />
        </div>
        <div className="h-4 w-12 bg-white/5 rounded-md" />
      </div>

      <div className="flex justify-between items-center px-2">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/5" />
          <div className="h-3 w-16 bg-white/5 rounded-md" />
        </div>
        <div className="h-4 w-8 bg-white/5 rounded-md" />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-white/5" />
          <div className="h-3 w-16 bg-white/5 rounded-md" />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <div className="h-8 w-full bg-white/5 rounded-xl" />
        <div className="flex gap-2">
           <div className="h-8 w-1/3 bg-white/5 rounded-xl" />
           <div className="h-8 w-1/3 bg-white/5 rounded-xl" />
           <div className="h-8 w-1/3 bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
