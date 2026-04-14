import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAccumulatorStore = create(
  persist(
    (set, get) => ({
      slip: [],
      stake: 1000, 
      bookingCode: null,
      isGenerating: false,
      
      addPrediction: (prediction) => set((state) => {
        // Prevent adding same match twice
        if (state.slip.some(item => item.matchApiId === prediction.matchApiId)) {
          return state;
        }
        return { slip: [...state.slip, prediction] };
      }),
      
      removePrediction: (matchApiId) => set((state) => ({
        slip: state.slip.filter(item => item.matchApiId !== matchApiId)
      })),
      
      clearSlip: () => set({ slip: [] }),
      
      setStake: (amount) => set({ stake: amount }),
      
      // Selectors for convenience
      getTotalOdds: () => {
        const state = get();
        if (state.slip.length === 0) return 0;
        // Mock odds generation if real 'odds' is missing (for now)
        const dummyOdds = 1.85;
        const total = state.slip.reduce((acc, item) => acc * (item.odds || dummyOdds), 1);
        return parseFloat(total.toFixed(2));
      },
      
      getPotentialReturn: () => {
        const state = get();
        const totalOdds = state.getTotalOdds();
        return parseFloat((totalOdds * state.stake).toFixed(2));
      },

      generateCode: async () => {
        set({ isGenerating: true, bookingCode: null });
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'BW-';
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        set({ bookingCode: code, isGenerating: false });
      },

      resetBooking: () => set({ bookingCode: null, isGenerating: false })
    }),
    {
      name: 'betwise-accumulator-storage',
    }
  )
);

export default useAccumulatorStore;
