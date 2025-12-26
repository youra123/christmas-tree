
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG, COLORS } from '../constants';
import { TreeMorphState, ParticleData } from '../types';
import { getTreePosition, getScatterPosition } from '../utils/math';

interface ChristmasTreeProps {
  state: TreeMorphState;
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export const ChristmasTree: React.FC<ChristmasTreeProps> = ({ state }) => {
  const needleRef = useRef<THREE.InstancedMesh>(null!);
  const ornamentRef = useRef<THREE.InstancedMesh>(null!);
  const cubeRef = useRef<THREE.InstancedMesh>(null!);
  const sparkRef = useRef<THREE.InstancedMesh>(null!);
  const starParticleRef = useRef<THREE.Points>(null!);
  const heroStarRef = useRef<THREE.Mesh>(null!);

  // Pine Needles
  const needles = useMemo(() => {
    const data: ParticleData[] = [];
    for (let i = 0; i < CONFIG.NEEDLE_COUNT; i++) {
      data.push({
        scatterPos: getScatterPosition(),
        treePos: getTreePosition(),
        rotation: [
          (Math.random() - 0.5) * 0.4, 
          Math.random() * Math.PI * 2, 
          (Math.random() - 0.5) * 0.4
        ],
        scale: 0.12 + Math.random() * 0.15,
      });
    }
    return data;
  }, []);

  // Gold Spheres
  const ornaments = useMemo(() => {
    const data: ParticleData[] = [];
    for (let i = 0; i < CONFIG.ORNAMENT_COUNT; i++) {
      data.push({
        scatterPos: getScatterPosition(),
        treePos: getTreePosition(),
        rotation: [0, 0, 0],
        scale: 0.22 + Math.random() * 0.18,
      });
    }
    return data;
  }, []);

  // Larger Cubes
  const cubes = useMemo(() => {
    const data: ParticleData[] = [];
    for (let i = 0; i < CONFIG.CUBE_COUNT; i++) {
      data.push({
        scatterPos: getScatterPosition(),
        treePos: getTreePosition(),
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.25 + Math.random() * 0.35, 
      });
    }
    return data;
  }, []);

  // Tiny Sparks (Bright Yellow Fillers)
  const sparks = useMemo(() => {
    const data: ParticleData[] = [];
    for (let i = 0; i < CONFIG.SPARK_COUNT; i++) {
      data.push({
        scatterPos: getScatterPosition(),
        treePos: getTreePosition(),
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.05 + Math.random() * 0.08, 
      });
    }
    return data;
  }, []);

  // Stardust
  const stardust = useMemo(() => {
    const data: ParticleData[] = [];
    const positions = new Float32Array(CONFIG.STAR_COUNT * 3);
    for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
      data.push({
        scatterPos: getScatterPosition(),
        treePos: getTreePosition(),
        rotation: [0, 0, 0],
        scale: Math.random(),
      });
      positions[i * 3] = data[i].scatterPos[0];
      positions[i * 3 + 1] = data[i].scatterPos[1];
      positions[i * 3 + 2] = data[i].scatterPos[2];
    }
    return { data, initialPositions: positions };
  }, []);

  // Hero Star Shape
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.5;
    const innerRadius = 0.2;
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const progressRef = useRef(0);
  const targetProgress = state === TreeMorphState.TREE_SHAPE ? 1 : 0;

  useFrame((stateObj, delta) => {
    const time = stateObj.clock.getElapsedTime();
    progressRef.current = THREE.MathUtils.lerp(
      progressRef.current,
      targetProgress,
      CONFIG.TRANSITION_SPEED
    );

    const t = progressRef.current;
    const easedT = THREE.MathUtils.smoothstep(t, 0, 1);

    const updateInstance = (ref: React.RefObject<THREE.InstancedMesh>, items: ParticleData[], isSpark = false) => {
      if (!ref.current) return;
      items.forEach((data, i) => {
        const x = THREE.MathUtils.lerp(data.scatterPos[0], data.treePos[0], easedT);
        const y = THREE.MathUtils.lerp(data.scatterPos[1], data.treePos[1], easedT);
        const z = THREE.MathUtils.lerp(data.scatterPos[2], data.treePos[2], easedT);

        tempObject.position.set(x, y, z);
        tempObject.rotation.set(
          data.rotation[0] + (isSpark ? time : time * 0.1),
          data.rotation[1] + (isSpark ? time * 1.5 : (1 - easedT) * Math.sin(time + i) * 0.2),
          data.rotation[2] + (isSpark ? time * 0.5 : 0)
        );
        tempObject.scale.setScalar(data.scale * (1 + Math.sin(time * (isSpark ? 4 : 1.5) + i) * 0.05));
        tempObject.updateMatrix();
        ref.current!.setMatrixAt(i, tempObject.matrix);
      });
      ref.current!.instanceMatrix.needsUpdate = true;
    };

    updateInstance(needleRef, needles);
    updateInstance(ornamentRef, ornaments);
    updateInstance(cubeRef, cubes);
    updateInstance(sparkRef, sparks, true);

    // Update Stardust
    if (starParticleRef.current) {
      const positions = starParticleRef.current.geometry.attributes.position.array as Float32Array;
      stardust.data.forEach((data, i) => {
        const drift = Math.sin(time * 0.3 + i) * 0.08;
        positions[i * 3] = THREE.MathUtils.lerp(data.scatterPos[0], data.treePos[0], easedT) + drift;
        positions[i * 3 + 1] = THREE.MathUtils.lerp(data.scatterPos[1], data.treePos[1], easedT) + drift;
        positions[i * 3 + 2] = THREE.MathUtils.lerp(data.scatterPos[2], data.treePos[2], easedT) + drift;
      });
      starParticleRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Hero Star
    if (heroStarRef.current) {
      const starTargetY = CONFIG.TREE_HEIGHT - CONFIG.TREE_HEIGHT / 2.5 + 0.8;
      heroStarRef.current.position.y = THREE.MathUtils.lerp(18, starTargetY, easedT);
      heroStarRef.current.scale.setScalar(THREE.MathUtils.lerp(0, 1.8, easedT) * (1 + Math.sin(time * 3) * 0.05));
      heroStarRef.current.rotation.y += delta * 1.2;
    }
  });

  useEffect(() => {
    for (let i = 0; i < CONFIG.NEEDLE_COUNT; i++) {
      needleRef.current.setColorAt(i, tempColor.set(Math.random() > 0.4 ? COLORS.EMERALD : COLORS.EMERALD_LIGHT));
    }
    for (let i = 0; i < CONFIG.ORNAMENT_COUNT; i++) {
      ornamentRef.current.setColorAt(i, tempColor.set(COLORS.GOLD_BRIGHT));
    }
    for (let i = 0; i < CONFIG.CUBE_COUNT; i++) {
      cubeRef.current.setColorAt(i, tempColor.set(Math.random() > 0.5 ? COLORS.GOLD : COLORS.EMERALD_LIGHT));
    }
    for (let i = 0; i < CONFIG.SPARK_COUNT; i++) {
      sparkRef.current.setColorAt(i, tempColor.set(COLORS.GOLD));
    }
  }, []);

  return (
    <group>
      {/* Pine Needles */}
      <instancedMesh ref={needleRef} args={[undefined, undefined, CONFIG.NEEDLE_COUNT]}>
        <coneGeometry args={[0.04, 0.75, 3]} />
        <meshStandardMaterial 
          roughness={0.4} 
          metalness={0.6} 
          emissive={COLORS.EMERALD} 
          emissiveIntensity={0.5} 
        />
      </instancedMesh>

      {/* Small Ornaments */}
      <instancedMesh ref={ornamentRef} args={[undefined, undefined, CONFIG.ORNAMENT_COUNT]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          roughness={0.05} 
          metalness={1.0} 
          color={COLORS.GOLD_BRIGHT} 
          emissive={COLORS.GOLD_METAL}
          emissiveIntensity={0.1}
        />
      </instancedMesh>

      {/* Large Decorative Cubes */}
      <instancedMesh ref={cubeRef} args={[undefined, undefined, CONFIG.CUBE_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          roughness={0.1} 
          metalness={0.9}
          emissiveIntensity={0.3}
        />
      </instancedMesh>

      {/* Tiny Filler Sparks (Bright Yellow) */}
      <instancedMesh ref={sparkRef} args={[undefined, undefined, CONFIG.SPARK_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={COLORS.GOLD}
          emissive={COLORS.GOLD}
          emissiveIntensity={2.0}
          roughness={0}
          metalness={1}
        />
      </instancedMesh>

      {/* Stardust */}
      <points ref={starParticleRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={CONFIG.STAR_COUNT}
            array={stardust.initialPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.08} 
          color={COLORS.GOLD_BRIGHT} 
          transparent 
          opacity={0.6} 
          sizeAttenuation={true} 
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Hero Star - Now a 3D Star Shape */}
      <mesh ref={heroStarRef}>
        <extrudeGeometry args={[starShape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 }]} />
        <meshStandardMaterial 
          emissive={COLORS.GOLD} 
          emissiveIntensity={15} 
          color={COLORS.GOLD_BRIGHT} 
          metalness={1}
          roughness={0.1}
        />
        <pointLight intensity={15} distance={12} color={COLORS.GOLD_BRIGHT} />
      </mesh>
    </group>
  );
};
