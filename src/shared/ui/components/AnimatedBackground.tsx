import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend, type ThreeElements } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import {
  Points,
  BufferGeometry,
  BufferAttribute,
  Vector3,
  Color,
  MathUtils,
  NormalBlending,
  NoToneMapping,
  LinearToneMapping,
  SRGBColorSpace
} from 'three';
import { createNoise3D } from 'simplex-noise';

extend({ Points, BufferGeometry, BufferAttribute });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: ThreeElements['points'];
      bufferGeometry: ThreeElements['bufferGeometry'];
      bufferAttribute: ThreeElements['bufferAttribute'];
    }
  }
}

export interface ParticleConfig {
  count?: number;
  particleSize?: { min: number; max: number };
  animationSpeed?: { base: number; max: number };
  noiseIntensity?: number;
  interactionRadius?: number;
  bloomIntensity?: number;
  opacity?: number;
  colorVariation?: number;
  waveAmplitude?: number;
  spiralTightness?: number;
}

export interface ColorScheme {
  baseColor: string;
  highlightColor: string;
  attractColor: string;
  repelColor: string;
  accentColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  backgroundColor: string;
}

export interface AnimatedBackgroundProps {
  colorScheme?: ColorScheme;
  particleConfig?: ParticleConfig;
  enableInteraction?: boolean;
  enableBloom?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onError?: () => void;
}

const defaultLightColors: ColorScheme = {
  baseColor: '#5B21B6',
  highlightColor: '#7C3AED',
  attractColor: '#DC2626',
  repelColor: '#EA580C',
  accentColor: '#6366F1',
  secondaryColor: '#059669',
  tertiaryColor: '#0891B2',
  backgroundColor: '#F3F4F6'
};

const defaultDarkColors: ColorScheme = {
  baseColor: '#5B21B6',
  highlightColor: '#7C3AED',
  attractColor: '#DC2626',
  repelColor: '#EA580C',
  accentColor: '#6366F1',
  secondaryColor: '#059669',
  tertiaryColor: '#0891B2',
  backgroundColor: '#0D1117'
};

const defaultParticleConfig: Required<ParticleConfig> = {
  count: 5000,
  particleSize: { min: 0.028, max: 0.055 },
  animationSpeed: { base: 0.15, max: 0.3 },
  noiseIntensity: 1.2,
  interactionRadius: 6.5,
  bloomIntensity: 0.5,
  opacity: 0.75,
  colorVariation: 0.8,
  waveAmplitude: 3.5,
  spiralTightness: 0.8
};

interface ParticleSystemProps {
  colorScheme: ColorScheme;
  config: Required<ParticleConfig>;
  enableInteraction: boolean;
  paused?: boolean;
}

function ParticleSystem({ colorScheme, config, enableInteraction, paused = false }: ParticleSystemProps) {
  const ref = useRef<Points>(null!);
  const { camera } = useThree();
  const frameCount = useRef(0);

  const mouseTarget = useRef(new Vector3());
  const currentMouse = useRef(new Vector3());
  const lastMousePosition = useRef(new Vector3());
  const mouseInfluenceRadius = useRef(0);
  const isMouseMoving = useRef(false);
  const lastMouseMoveTime = useRef(0);

  useEffect(() => {
    if (!enableInteraction) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!ref.current) return;
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const mousePos = new Vector3(x, y, 0);
      mousePos.unproject(camera);

      mouseTarget.current.copy(mousePos);
      isMouseMoving.current = true;
      lastMouseMoveTime.current = Date.now();
      mouseInfluenceRadius.current = config.interactionRadius;
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }
  }, [camera, enableInteraction, config.interactionRadius]);

  const colors = useMemo(() => ({
    base: new Color(colorScheme.baseColor),
    highlight: new Color(colorScheme.highlightColor),
    accent: new Color(colorScheme.accentColor),
    secondary: new Color(colorScheme.secondaryColor),
    tertiary: new Color(colorScheme.tertiaryColor)
  }), [colorScheme]);

  const { positions, colors: colorArray, originalPositions, rand, sizes } = useMemo(() => {
    const count = config.count;
    const orig = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const randArray = new Float32Array(count * 3);
    const sizeArray = new Float32Array(count);
    const initialColor = new Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const spherical = new Vector3();
      const layer = Math.floor(Math.random() * 4);
      const layerRadius = 2 + layer * 2.5;
      const angle = (i / count) * Math.PI * 2 * 3;
      const spiral = Math.sqrt(i / count) * config.spiralTightness;

      const radius = layerRadius + Math.random() * 1.5;
      const phi = angle + spiral;
      const theta = Math.acos(2 * Math.random() - 1);

      spherical.x = radius * Math.sin(theta) * Math.cos(phi);
      spherical.y = radius * Math.sin(theta) * Math.sin(phi);
      spherical.z = radius * Math.cos(theta);

      const waveFrequency = 0.5;
      spherical.y += Math.sin(angle * waveFrequency) * config.waveAmplitude;
      spherical.x += Math.cos(angle * waveFrequency * 0.7) * config.waveAmplitude * 0.5;

      orig[i3] = spherical.x;
      orig[i3 + 1] = spherical.y;
      orig[i3 + 2] = spherical.z;

      randArray[i3] = MathUtils.randFloat(0.3, 1.8);
      randArray[i3 + 1] = MathUtils.randFloat(0.5, 2.0);
      randArray[i3 + 2] = Math.random();

      const sizeRange = config.particleSize.max - config.particleSize.min;
      sizeArray[i] = config.particleSize.min + randArray[i3 + 1] * sizeRange;

      initialColor.copy(colors.base);
      col[i3] = initialColor.r;
      col[i3 + 1] = initialColor.g;
      col[i3 + 2] = initialColor.b;
    }

    return {
      positions: orig,
      colors: col,
      originalPositions: orig.slice(),
      rand: randArray,
      sizes: sizeArray
    };
  }, [config, colors]);

  const tempColor = useMemo(() => new Color(), []);
  const tempParticlePos = useMemo(() => new Vector3(), []);

  const noise = useMemo(() => createNoise3D(), []);

  useFrame((state) => {
    if (paused || !ref.current) return;

    frameCount.current += 1;
    const time = state.clock.getElapsedTime();
    const positionsArray = ref.current.geometry.attributes.position.array as Float32Array;
    const colorsArray = ref.current.geometry.attributes.color.array as Float32Array;
    const sizesArray = ref.current.geometry.attributes.size?.array as Float32Array;

    currentMouse.current.lerp(mouseTarget.current, 0.1);
    lastMousePosition.current.copy(currentMouse.current);

    if (Date.now() - lastMouseMoveTime.current > 100) {
      isMouseMoving.current = false;
      mouseInfluenceRadius.current *= 0.95;
    }

    const baseAnimSpeed = config.animationSpeed.base;

    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;

      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];

      const speedFactor = rand[i3];
      const sizeFactor = rand[i3 + 1];
      const colorVariation = rand[i3 + 2];

      const noiseX = noise(origX * 0.5, origY * 0.5, time * baseAnimSpeed * speedFactor) * config.noiseIntensity;
      const noiseY = noise(origX * 0.5 + 100, origY * 0.5, time * baseAnimSpeed * speedFactor) * config.noiseIntensity;
      const noiseZ = noise(origX * 0.5, origY * 0.5 + 100, time * baseAnimSpeed * speedFactor) * config.noiseIntensity;

      tempParticlePos.set(positionsArray[i3], positionsArray[i3 + 1], positionsArray[i3 + 2]);
      const distanceToMouse = tempParticlePos.distanceTo(currentMouse.current);
      const effectiveRadius = mouseInfluenceRadius.current;

      let mouseInfluence = 0;

      if (enableInteraction && isMouseMoving.current && distanceToMouse < effectiveRadius) {
        mouseInfluence = 1 - distanceToMouse / effectiveRadius;
        mouseInfluence = Math.pow(mouseInfluence, 2);
      }

      positionsArray[i3] = origX + noiseX;
      positionsArray[i3 + 1] = origY + noiseY;
      positionsArray[i3 + 2] = origZ + noiseZ;

      tempColor.copy(colors.base);

      const primaryMix = colorVariation * 0.4;
      const accentMix = colorVariation * 0.3;
      const secondaryMix = Math.sin(time * 0.08 + i * 0.01) * 0.2 + 0.2;

      tempColor.lerp(colors.highlight, primaryMix);
      tempColor.lerp(colors.accent, accentMix);
      tempColor.lerp(colors.secondary, secondaryMix);

      const tertiaryMix = Math.cos(time * 0.06 + i * 0.008) * 0.15 + 0.15;
      tempColor.lerp(colors.tertiary, tertiaryMix);

      colorsArray[i3] = tempColor.r;
      colorsArray[i3 + 1] = tempColor.g;
      colorsArray[i3 + 2] = tempColor.b;

      if (sizesArray) {
        const baseSizeVariation = Math.sin(time * 0.25 + i * 0.01) * 0.15 + 1;
        const mouseSizeBoost = 1 + mouseInfluence * 0.8;
        const baseSize = config.particleSize.min + sizeFactor * (config.particleSize.max - config.particleSize.min);
        sizesArray[i] = baseSize * baseSizeVariation * mouseSizeBoost;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.geometry.attributes.color.needsUpdate = true;
    if (ref.current.geometry.attributes.size) {
      ref.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  return React.createElement(
    'points',
    { ref },
    React.createElement(
      'bufferGeometry',
      {},
      React.createElement('bufferAttribute', {
        attach: 'attributes-position',
        count: positions.length / 3,
        array: positions,
        itemSize: 3
      }),
      React.createElement('bufferAttribute', {
        attach: 'attributes-color',
        count: colorArray.length / 3,
        array: colorArray,
        itemSize: 3
      }),
      React.createElement('bufferAttribute', {
        attach: 'attributes-size',
        count: sizes.length,
        array: sizes,
        itemSize: 1
      })
    ),
    React.createElement(PointMaterial, {
      transparent: true,
      size: 0.038,
      sizeAttenuation: true,
      depthWrite: false,
      depthTest: true,
      vertexColors: true,
      opacity: config.opacity,
      blending: NormalBlending,
      alphaTest: 0.02
    })
  );
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  colorScheme,
  particleConfig,
  enableInteraction = true,
  enableBloom = true,
  className = '',
  style,
  onError
}) => {
  const [hasError, setHasError] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const finalColorScheme = useMemo(() => {
    return colorScheme || (isDark ? defaultDarkColors : defaultLightColors);
  }, [colorScheme, isDark]);

  const finalConfig = useMemo(() => {
    return { ...defaultParticleConfig, ...particleConfig };
  }, [particleConfig]);

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme === 'dark');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={className}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: finalColorScheme.backgroundColor,
          transition: 'background-color 0.3s ease',
          ...style
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        ...style
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: isDark ? 75 : 60 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', handleError);
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: finalColorScheme.backgroundColor,
          transition: 'background-color 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)'
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: isDark ? LinearToneMapping : NoToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: SRGBColorSpace,
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
      >
        {React.createElement('color', { attach: 'background', args: [finalColorScheme.backgroundColor] })}
        {React.createElement('ambientLight', { intensity: 0.5 })}
        {!isDark && (
          <>
            {React.createElement('directionalLight', { position: [5, 5, 5], intensity: 0.2 })}
            {React.createElement('pointLight', { position: [-5, -5, -5], intensity: 0.15, color: '#6366F1' })}
          </>
        )}
        <ParticleSystem
          colorScheme={finalColorScheme}
          config={finalConfig}
          enableInteraction={enableInteraction}
        />
        {enableBloom && (
          <React.Suspense fallback={null}>
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.45}
                intensity={finalConfig.bloomIntensity}
                levels={8}
                mipmapBlur
                radius={0.9}
              />
            </EffectComposer>
          </React.Suspense>
        )}
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;
