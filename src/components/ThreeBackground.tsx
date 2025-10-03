import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import type { ThreeBackgroundProps } from '../types/components';

// Particle system component
const ParticleSystem: React.FC = () => {
  const points = useRef<THREE.Points>(null);
  const noise3D = useMemo(() => createNoise3D(), []);

  // Generate particles
  const particles = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Color
      colors[i3] = Math.random() * 0.5 + 0.5; // R
      colors[i3 + 1] = Math.random() * 0.3 + 0.7; // G
      colors[i3 + 2] = Math.random() * 0.5 + 0.5; // B
    }
    
    return { positions, colors };
  }, []);

  // Animation frame
  useFrame((state) => {
    if (!points.current) return;
    
    const time = state.clock.getElapsedTime() * 0.1;
    const positions = points.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Add noise-based movement
      positions[i] += noise3D(x * 0.01 + time, y * 0.01, z * 0.01) * 0.01;
      positions[i + 1] += noise3D(x * 0.01, y * 0.01 + time, z * 0.01) * 0.01;
      positions[i + 2] += noise3D(x * 0.01, y * 0.01, z * 0.01 + time) * 0.01;
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Main background component
export const ThreeBackground: React.FC<ThreeBackgroundProps> = () => {
  return (
    <div className="three-background" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)'
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ParticleSystem />
      </Canvas>
    </div>
  );
};

export { ThreeBackground as default }; 