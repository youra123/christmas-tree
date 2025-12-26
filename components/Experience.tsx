
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ToneMapping, ChromaticAberration } from '@react-three/postprocessing';
import { TreeMorphState } from '../types';
import { ChristmasTree } from './ChristmasTree';
import { COLORS } from '../constants';

interface ExperienceProps {
  state: TreeMorphState;
}

export const Experience: React.FC<ExperienceProps> = ({ state }) => {
  return (
    <Canvas shadows gl={{ antialias: true, stencil: false }}>
      <color attach="background" args={[COLORS.BG_DARK]} />
      <PerspectiveCamera makeDefault position={[0, 4, 22]} fov={35} />
      <OrbitControls 
        enablePan={false} 
        maxDistance={40} 
        minDistance={8} 
        autoRotate={state === TreeMorphState.TREE_SHAPE}
        autoRotateSpeed={0.3}
      />

      <Suspense fallback={null}>
        {/* Brighter Ambient and Fill Lighting */}
        <ambientLight intensity={1.2} />
        <spotLight 
          position={[20, 30, 15]} 
          angle={0.3} 
          penumbra={1} 
          intensity={4} 
          castShadow 
          color={COLORS.GOLD_BRIGHT} 
        />
        <pointLight position={[-15, 10, -10]} intensity={3} color={COLORS.EMERALD_LIGHT} />
        <pointLight position={[0, 15, 0]} intensity={2.5} color={COLORS.GOLD_BRIGHT} />
        
        <Environment preset="forest" blur={0.6} />

        {/* Thinned out stars for less distraction */}
        <Stars radius={100} depth={50} count={3000} factor={2} saturation={0} fade speed={0.5} />

        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
          <ChristmasTree state={state} />
        </Float>

        <ContactShadows 
          opacity={0.25} 
          scale={30} 
          blur={3} 
          far={15} 
          resolution={512} 
          color="#001a14" 
        />

        {/* Toned down Bloom to reduce excessive flickering/glow */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.7} 
            mipmapBlur 
            intensity={1.0} 
            radius={0.3} 
          />
          <ChromaticAberration offset={[0.0003, 0.0003]} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
          <ToneMapping />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
};
