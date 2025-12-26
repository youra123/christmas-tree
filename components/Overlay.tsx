
import React from 'react';
import { TreeMorphState } from '../types';
import { Sparkles, Trees, Share2, Info, Star } from 'lucide-react';

interface OverlayProps {
  state: TreeMorphState;
  onToggle: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({ state, onToggle }) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            ARIX SIGNATURE
          </h1>
          <p className="text-emerald-400 text-xs md:text-sm mt-3 uppercase tracking-[0.5em] font-semibold opacity-90 flex items-center gap-2">
            <Star className="w-3 h-3 fill-emerald-400" /> 
            Luxury Virtual Experience
            <Star className="w-3 h-3 fill-emerald-400" />
          </p>
        </div>
        <div className="flex gap-4">
          <button className="group p-3 rounded-full bg-emerald-900/20 hover:bg-emerald-900/40 backdrop-blur-xl border border-yellow-500/20 transition-all duration-300">
            <Info className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
          </button>
          <button className="group p-3 rounded-full bg-emerald-900/20 hover:bg-emerald-900/40 backdrop-blur-xl border border-yellow-500/20 transition-all duration-300">
            <Share2 className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-8 pointer-events-auto pb-8">
        <div className="text-center">
          <p className="text-emerald-200/60 text-[10px] uppercase tracking-[0.8em] mb-6">
            State of Genesis: <span className="text-yellow-400">{state.replace('_', ' ')}</span>
          </p>
          <button 
            onClick={onToggle}
            className="group relative px-10 py-5 bg-emerald-950/80 rounded-full border border-yellow-400/50 hover:border-yellow-200 transition-all duration-700 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.4)] overflow-hidden scale-110"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 via-yellow-400/20 to-yellow-600/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="relative flex items-center gap-4">
              {state === TreeMorphState.SCATTERED ? (
                <>
                  <Trees className="w-6 h-6 text-yellow-400" />
                  <span className="text-white font-serif italic text-2xl tracking-wide">Evoke the Majesty</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                  <span className="text-white font-serif italic text-2xl tracking-wide">Celestial Dissolve</span>
                </>
              )}
            </div>
          </button>
        </div>

        <div className="flex items-center gap-10 text-[9px] uppercase tracking-[0.6em] text-yellow-500/40">
          <span>Opulence</span>
          <div className="w-1 h-1 rounded-full bg-yellow-400 animate-ping" />
          <span>Excellence</span>
          <div className="w-1 h-1 rounded-full bg-yellow-400 animate-ping" />
          <span>Luminescence</span>
        </div>
      </div>
    </div>
  );
};
