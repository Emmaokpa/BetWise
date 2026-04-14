import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Plane, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'HOME', icon: Home, path: '/' },
    { name: 'STATS', icon: BarChart2, path: '/stats' },
    { name: 'AVIATOR', icon: Plane, path: '/aviator' },
    { name: 'TIPS', icon: Lightbulb, path: '/predictions' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
      <nav className="glass-premium rounded-[32px] px-2 py-2 flex justify-around items-center border-white/10 shadow-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className="relative flex flex-col items-center justify-center p-3 transition-colors"
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 bg-brand-primary/10 rounded-2xl border border-brand-primary/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon 
                size={22} 
                className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-brand-primary' : 'text-text-muted hover:text-white'}`} 
              />
              <span className={`relative z-10 text-[8px] font-black tracking-widest mt-1 transition-colors duration-300 ${isActive ? 'text-brand-primary' : 'text-text-muted italic'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;

