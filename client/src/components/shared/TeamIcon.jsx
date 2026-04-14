import React, { useState } from 'react';
import { Shield } from 'lucide-react';

const TeamIcon = ({ src, name, size = "md" }) => {
  const [error, setError] = useState(false);
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';

  const sizeClasses = {
    sm: "w-6 h-6 text-[8px]",
    md: "w-12 h-12 md:w-14 md:h-14 text-xs",
    lg: "w-16 h-16 md:w-20 md:h-20 text-sm"
  };

  if (error || !src) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl glass-ultra flex flex-col items-center justify-center bg-white/5 border border-white/10 text-brand-primary font-black tracking-tighter`}>
         <Shield size={size === 'sm' ? 10 : 16} className="mb-0.5 opacity-40 text-text-muted" />
         {initials}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-2xl glass-ultra flex items-center justify-center p-2 bg-white/5 border border-white/5 overflow-hidden`}>
      <img 
        src={src} 
        alt={name} 
        className="w-full h-full object-contain filter drop-shadow-md" 
        onError={() => setError(true)}
      />
    </div>
  );
};

export default TeamIcon;
