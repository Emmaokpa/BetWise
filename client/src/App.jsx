import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, BarChart2, Plane, Lightbulb, Search, Bell, Menu, X, TrendingUp, History } from 'lucide-react';
import { useState } from 'react';
import Home from './pages/Home';
import Predictions from './pages/Predictions';
import MatchDetail from './pages/MatchDetail';
import Results from './pages/Results';
import Stats from './pages/Stats';


import Profile from './pages/Profile';

// Placeholder pages for next steps
import LiveScores from './pages/LiveScores';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/' },
    { name: 'Predictions', icon: Lightbulb, path: '/predictions' },
    { name: 'Statistics', icon: BarChart2, path: '/stats' },
    { name: 'Results', icon: BarChart2, path: '/results' },

  ];

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-transparent border-r border-white/5 p-6 z-50">
      <div className="flex items-center gap-3 mb-12 select-none">
        <img src="/logo.png" className="w-10 h-10 rounded-xl" alt="BetWise Logo" />
        <span className="text-2xl font-black font-display text-white tracking-tight">BetWise <span className="text-brand-primary">NG</span></span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 px-3">Main Menu</span>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'glass-ultra text-brand-primary shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-brand-primary/20 bg-brand-primary/5' : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'}`}
            >
              <item.icon size={20} className={`${isActive ? 'text-brand-primary' : 'text-text-muted transition-transform group-hover:scale-110'}`} />
              <span className={`font-semibold text-sm ${isActive ? 'text-white' : ''}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="p-5 rounded-2xl glass-ultra border-brand-primary/20 bg-gradient-to-tr from-brand-primary/5 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary opacity-20 blur-2xl rounded-full pointer-events-none" />
          <p className="text-xs font-bold text-white mb-1 relative z-10">Pro Intelligence</p>
          <p className="text-[10px] text-text-secondary mb-3 relative z-10">Access advanced data models.</p>
          <button className="w-full py-2.5 bg-brand-primary text-black rounded-xl text-sm font-black shadow-[0_0_15px_rgba(0,255,156,0.3)] hover:scale-105 transition-transform flex items-center justify-center gap-2 relative z-10">
            Upgrade <TrendingUp size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

const Topbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full h-[76px] bg-bg-primary/50 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4 md:hidden">
        <img src="/logo.png" className="w-8 h-8 rounded-lg" alt="BetWise" />
        <span className="text-lg font-black font-display text-white">BetWise</span>
      </div>
      
      <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 w-[400px] focus-within:border-brand-primary/30 transition-colors group">
        <Search size={16} className="text-text-muted group-focus-within:text-brand-primary transition-colors" />
        <input type="text" placeholder="Search matches, predictions, stats..." className="bg-transparent border-none outline-none text-sm text-text-primary ml-3 w-full placeholder:text-text-muted/60 font-medium" />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative p-2 text-text-secondary hover:text-white transition-colors bg-white/5 rounded-xl hover:bg-white/10 hidden md:block">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_8px_#00FF9C]" />
        </button>
        
        <Link to="/profile">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-brand-primary border-2 border-white/10 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:scale-105 transition-transform cursor-pointer overflow-hidden flex items-center justify-center">
              <span className="text-black font-black text-xs uppercase">Me</span>
           </div>
        </Link>
      </div>
    </header>
  );
};

const MobileNav = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'Tips', icon: Lightbulb, path: '/predictions' },
    { name: 'Stats', icon: BarChart2, path: '/stats' },
    { name: 'Results', icon: History, path: '/results' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <nav className="glass-ultra rounded-full px-2 py-2 flex justify-around items-center border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] pointer-events-auto w-full max-w-sm">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl gap-1 transition-all duration-300 ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-muted hover:text-white'}`}
            >
              <item.icon size={20} className={isActive ? 'text-brand-primary drop-shadow-[0_0_8px_rgba(0,255,156,0.5)]' : ''} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-white' : ''}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

import BetSlip from './components/Accumulator/BetSlip';
import PushPrompt from './components/notifications/PushPrompt';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-bg-primary text-text-primary overflow-hidden relative">
        <Sidebar />
        
        <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden no-scrollbar relative z-10">
          <Topbar />
          
          <main className="flex-1 p-5 pt-8 md:p-8 md:pt-10 pb-32 md:pb-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/results" element={<Results />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/scores" element={<LiveScores />} />
              <Route path="/match/:id" element={<MatchDetail />} />

              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>

        <MobileNav />
        <BetSlip />
        <PushPrompt />
      </div>
    </BrowserRouter>
  );
}

export default App;
