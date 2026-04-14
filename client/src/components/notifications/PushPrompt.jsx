import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, CheckCircle2, X } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const PushPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, asking, granted, denied
  const subscribe = useMutation(api.notifications.saveSubscription);

  useEffect(() => {
    // Check if supported and not already granted/denied
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'default') {
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOptIn = async () => {
    setStatus('asking');
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // In a real PWA, we would register service worker and get pushSubscription
        // For this MVP, we will simulate the success and save a dummy token to test the flow
        setStatus('granted');
        await subscribe({
          endpoint: "dummy_endpoint_" + Math.random(),
          auth: "dummy_auth",
          p256dh: "dummy_p256",
          createdAt: Date.now()
        });
        setTimeout(() => setIsVisible(false), 3000);
      } else {
        setStatus('denied');
        setTimeout(() => setIsVisible(false), 2000);
      }
    } catch (err) {
      console.error("Push Error:", err);
      setStatus('idle');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[60]"
        >
          <div className="glass-ultra rounded-3xl p-6 border border-brand-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-accent opacity-50" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center shrink-0">
                <Bell className="text-brand-primary animate-bounce" size={24} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-black text-white leading-tight mb-1">Never Miss a <span className="text-brand-primary">Banker</span> Pick</h3>
                <p className="text-xs text-text-secondary font-medium leading-relaxed mb-4">
                  Get instant push notifications when our AI engine publishes high-confidence signals and live score updates.
                </p>

                {status === 'granted' ? (
                  <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
                    <CheckCircle2 size={16} /> Notifications Active
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleOptIn}
                      className="flex-1 py-2.5 bg-brand-primary text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform"
                    >
                      {status === 'asking' ? 'Wait...' : 'Enable Alerts'}
                    </button>
                    <button 
                      onClick={() => setIsVisible(false)}
                      className="px-4 py-2.5 bg-white/5 text-text-muted font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10"
                    >
                      Later
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PushPrompt;
