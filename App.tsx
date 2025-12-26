
import React, { useState, useCallback } from 'react';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { TreeMorphState } from './types';

const App: React.FC = () => {
  const [morphState, setMorphState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);

  const toggleState = useCallback(() => {
    setMorphState((prev) => 
      prev === TreeMorphState.SCATTERED 
        ? TreeMorphState.TREE_SHAPE 
        : TreeMorphState.SCATTERED
    );
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#010a08]">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Experience state={morphState} />
      </div>

      {/* Decorative Overlays for extra depth */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-[#000000bb] z-1" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-emerald-950/20 via-transparent to-emerald-950/10 z-1" />
      
      {/* Interactive UI */}
      <Overlay state={morphState} onToggle={toggleState} />
      
      {/* Cinematic Borders */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#010a08] to-transparent opacity-90 z-2" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#010a08] to-transparent opacity-90 z-2" />
    </div>
  );
};

export default App;
