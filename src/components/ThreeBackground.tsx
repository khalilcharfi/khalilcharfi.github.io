import React, { useRef, useState, useEffect, useMemo, Component } from 'react';
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
  AdditiveBlending,
  NoToneMapping,
  LinearToneMapping,
  SRGBColorSpace
} from 'three';
import { createNoise3D } from 'simplex-noise';
import { useAnimationPause } from '../context';

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

interface WebGLErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: () => void;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('WebGL Error caught by ErrorBoundary:', error, errorInfo);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Performance Monitor (simplified version for the component)
interface AdaptiveSettings {
  renderQuality: number;
  animationComplexity: number;
  noiseComplexity: number;
  interactionEnabled: boolean;
}

class PerformanceMonitor {
  private settings: AdaptiveSettings = {
    renderQuality: 1.0,
    animationComplexity: 1.0,
    noiseComplexity: 1.0,
    interactionEnabled: true
  };

  getCurrentSettings(): AdaptiveSettings {
    return { ...this.settings };
  }

  subscribe(callback: (settings: AdaptiveSettings) => void) {
    // Simplified - in production, this would monitor FPS and adjust
  }
}

const performanceMonitor = new PerformanceMonitor();

function FractalParticles({ count = 5000, theme }: { count?: number; theme: string }) {
  const ref = useRef<Points>(null!);
  const { viewport, mouse, camera } = useThree();
  const frameCount = useRef(0);

  const [adaptiveSettings, setAdaptiveSettings] = useState<AdaptiveSettings>(() =>
    performanceMonitor.getCurrentSettings()
  );

  useEffect(() => {
    performanceMonitor.subscribe(setAdaptiveSettings);
  }, []);

  const mouseTarget = useRef(new Vector3());
  const currentMouse = useRef(new Vector3());
  const mouseVelocity = useRef(new Vector3());
  const lastMousePosition = useRef(new Vector3());
  const mouseHistory = useRef<Vector3[]>([]);
  const mouseInfluenceRadius = useRef(0);
  const isMouseMoving = useRef(false);
  const lastMouseMoveTime = useRef(0);

  const mouseTrail = useRef<Vector3[]>([]);
  const maxTrailLength = 20;
  const attractionStrength = useRef(0);
  const repulsionStrength = useRef(0);
  const colorInfluence = useRef(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!ref.current) return;
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const mousePos = new Vector3(x, y, 0);
      mousePos.unproject(camera);

      mouseTrail.current.push(mousePos.clone());
      if (mouseTrail.current.length > maxTrailLength) {
        mouseTrail.current.shift();
      }

      mouseTarget.current.copy(mousePos);
      isMouseMoving.current = true;
      lastMouseMoveTime.current = Date.now();
      mouseInfluenceRadius.current = 5.0;
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }
  }, [camera]);

  const optimizedCount = useMemo(() => {
    const baseCount = Math.min(count, 5000);
    return Math.floor(baseCount * adaptiveSettings.renderQuality);
  }, [count, adaptiveSettings.renderQuality]);

  const themeConfig = useMemo(() => {
    const qualityMultiplier = Math.max(adaptiveSettings.renderQuality, 0.7);
    const complexityMultiplier = Math.max(adaptiveSettings.animationComplexity, 0.8);

    const lightConfig = {
      baseColor: new Color('#5B21B6'),
      highlightColor: new Color('#7C3AED'),
      attractColor: new Color('#DC2626'),
      repelColor: new Color('#EA580C'),
      accentColor: new Color('#6366F1'),
      secondaryColor: new Color('#059669'),
      tertiaryColor: new Color('#0891B2'),
      particleSize: {
        min: Math.max(0.028 * qualityMultiplier, 0.025),
        max: Math.max(0.055 * qualityMultiplier, 0.048)
      },
      animationSpeed: {
        base: 0.35 * complexityMultiplier,
        max: 0.7 * complexityMultiplier
      },
      noiseIntensity: Math.max(2.2 * adaptiveSettings.noiseComplexity, 1.5),
      interactionRadius: adaptiveSettings.interactionEnabled ? 6.5 : 0,
      bloomIntensity: Math.max(0.5 * qualityMultiplier, 0.35),
      opacity: 0.75,
      blending: NormalBlending,
      distribution: 'organic' as const,
      colorVariation: Math.max(0.8 * qualityMultiplier, 0.6),
      waveAmplitude: 3.5,
      spiralTightness: 0.8
    };

    const darkConfig = {
      baseColor: new Color('#00D9FF'),
      highlightColor: new Color('#FFFFFF'),
      attractColor: new Color('#FF6B9D'),
      repelColor: new Color('#FFE066'),
      accentColor: new Color('#B794F6'),
      secondaryColor: new Color('#F59E0B'),
      tertiaryColor: new Color('#34D399'),
      particleSize: {
        min: 0.012 * qualityMultiplier,
        max: 0.028 * qualityMultiplier
      },
      animationSpeed: {
        base: 0.5 * complexityMultiplier,
        max: 1.0 * complexityMultiplier
      },
      noiseIntensity: 2.0 * adaptiveSettings.noiseComplexity,
      interactionRadius: adaptiveSettings.interactionEnabled ? 7.0 : 0,
      bloomIntensity: 0.8 * qualityMultiplier,
      opacity: 0.9,
      blending: AdditiveBlending,
      distribution: 'galaxy' as const,
      colorVariation: 0.8 * qualityMultiplier,
      waveAmplitude: 3.0,
      spiralTightness: 1.2
    };

    return theme === 'light' ? lightConfig : darkConfig;
  }, [theme, adaptiveSettings]);

  const { positions, velocities, colors, originalPositions, rand, sizes } = useMemo(() => {
    const orig = new Float32Array(optimizedCount * 3);
    const vel = new Float32Array(optimizedCount * 3);
    const col = new Float32Array(optimizedCount * 3);
    const rand = new Float32Array(optimizedCount * 3);
    const sizeArray = new Float32Array(optimizedCount);
    const initialColor = new Color();

    for (let i = 0; i < optimizedCount; i++) {
      const i3 = i * 3;

      const spherical = new Vector3();
      let radius, phi, theta;

      if (themeConfig.distribution === 'organic') {
        const layer = Math.floor(Math.random() * 4);
        const layerRadius = 2 + layer * 2.5;
        const angle = (i / optimizedCount) * Math.PI * 2 * 3;
        const spiral = Math.sqrt(i / optimizedCount) * themeConfig.spiralTightness;

        radius = layerRadius + Math.random() * 1.5;
        phi = angle + spiral;
        theta = Math.acos(2 * Math.random() - 1);

        spherical.x = radius * Math.sin(theta) * Math.cos(phi);
        spherical.y = radius * Math.sin(theta) * Math.sin(phi);
        spherical.z = radius * Math.cos(theta);

        const waveAmplitude = themeConfig.waveAmplitude;
        const waveFrequency = 0.5;
        spherical.y += Math.sin(angle * waveFrequency) * waveAmplitude;
        spherical.x += Math.cos(angle * waveFrequency * 0.7) * waveAmplitude * 0.5;
      } else {
        const arm = Math.floor(Math.random() * 5);
        const armAngle = (arm / 5) * Math.PI * 2;
        const armOffset = (i / optimizedCount) * Math.PI * 8;

        radius = 2 + Math.random() * 8 * themeConfig.spiralTightness;
        phi = armAngle + armOffset + Math.random() * 0.5;
        theta = Math.PI / 2 + (Math.random() - 0.5) * 0.5;

        spherical.x = radius * Math.sin(theta) * Math.cos(phi);
        spherical.y = (Math.random() - 0.5) * 3;
        spherical.z = radius * Math.sin(theta) * Math.sin(phi);
      }

      orig[i3] = spherical.x;
      orig[i3 + 1] = spherical.y;
      orig[i3 + 2] = spherical.z;

      vel[i3] = 0;
      vel[i3 + 1] = 0;
      vel[i3 + 2] = 0;

      rand[i3] = MathUtils.randFloat(0.3, 1.8);
      rand[i3 + 1] = MathUtils.randFloat(0.5, 2.0);
      rand[i3 + 2] = Math.random();

      const sizeRange = themeConfig.particleSize.max - themeConfig.particleSize.min;
      sizeArray[i] = themeConfig.particleSize.min + rand[i3 + 1] * sizeRange;

      initialColor.copy(themeConfig.baseColor);
      col[i3] = initialColor.r;
      col[i3 + 1] = initialColor.g;
      col[i3 + 2] = initialColor.b;
    }

    return {
      positions: orig,
      velocities: vel,
      colors: col,
      originalPositions: orig.slice(),
      rand: rand,
      sizes: sizeArray
    };
  }, [optimizedCount, themeConfig]);

  const tempColor = useMemo(() => new Color(), []);
  const tempVector = useMemo(() => new Vector3(), []);
  const tempDisplacement = useMemo(() => new Vector3(), []);
  const tempParticlePos = useMemo(() => new Vector3(), []);
  const tempDirection = useMemo(() => new Vector3(), []);
  const tempTrailDirection = useMemo(() => new Vector3(), []);
  const tempExplosionDirection = useMemo(() => new Vector3(), []);

  const paused = useAnimationPause();

  useEffect(() => {
    if (ref.current) {
      ref.current.frustumCulled = true;
    }
  }, []);

  const noise = useMemo(() => createNoise3D(), []);

  useFrame((state) => {
    if (paused || !ref.current) return;

    frameCount.current += 1;
    if (frameCount.current % 2 !== 0 && adaptiveSettings.renderQuality < 1) return;

    const time = state.clock.getElapsedTime();
    const positionsArray = ref.current.geometry.attributes.position.array as Float32Array;
    const colorsArray = ref.current.geometry.attributes.color.array as Float32Array;
    const sizesArray = ref.current.geometry.attributes.size?.array as Float32Array;

    currentMouse.current.lerp(mouseTarget.current, 0.1);
    mouseVelocity.current.subVectors(currentMouse.current, lastMousePosition.current);
    lastMousePosition.current.copy(currentMouse.current);

    if (Date.now() - lastMouseMoveTime.current > 100) {
      isMouseMoving.current = false;
      mouseInfluenceRadius.current *= 0.95;
    }

    const baseAnimSpeed = themeConfig.animationSpeed.base;
    const animationIntensity = adaptiveSettings.animationComplexity;

    for (let i = 0; i < optimizedCount; i++) {
      const i3 = i * 3;

      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];

      const speedFactor = rand[i3];
      const sizeFactor = rand[i3 + 1];
      const colorVariation = rand[i3 + 2];

      const noiseX = noise(origX * 0.5, origY * 0.5, time * baseAnimSpeed * speedFactor) * themeConfig.noiseIntensity * animationIntensity;
      const noiseY = noise(origX * 0.5 + 100, origY * 0.5, time * baseAnimSpeed * speedFactor) * themeConfig.noiseIntensity * animationIntensity;
      const noiseZ = noise(origX * 0.5, origY * 0.5 + 100, time * baseAnimSpeed * speedFactor) * themeConfig.noiseIntensity * animationIntensity;

      tempParticlePos.set(positionsArray[i3], positionsArray[i3 + 1], positionsArray[i3 + 2]);
      const distanceToMouse = tempParticlePos.distanceTo(currentMouse.current);
      const effectiveRadius = mouseInfluenceRadius.current;

      let mouseInfluence = 0;
      let isAttracting = true;

      if (isMouseMoving.current && distanceToMouse < effectiveRadius) {
        mouseInfluence = 1 - distanceToMouse / effectiveRadius;
        mouseInfluence = Math.pow(mouseInfluence, 2);
      }

      tempDisplacement.set(noiseX, noiseY, noiseZ);
      let currentX = origX + tempDisplacement.x;
      let currentY = origY + tempDisplacement.y;
      let currentZ = origZ + tempDisplacement.z;

      positionsArray[i3] = currentX;
      positionsArray[i3 + 1] = currentY;
      positionsArray[i3 + 2] = currentZ;

      tempColor.copy(themeConfig.baseColor);

      if (theme === 'light') {
        const primaryMix = colorVariation * 0.4 * adaptiveSettings.renderQuality;
        const accentMix = colorVariation * 0.3 * adaptiveSettings.renderQuality;
        const secondaryMix = Math.sin(time * 0.15 + i * 0.02) * 0.2 + 0.2;

        tempColor.lerp(themeConfig.highlightColor, primaryMix);
        tempColor.lerp(themeConfig.accentColor, accentMix);
        tempColor.lerp(themeConfig.secondaryColor, secondaryMix * adaptiveSettings.renderQuality);

        const tertiaryMix = Math.cos(time * 0.12 + i * 0.015) * 0.15 + 0.15;
        tempColor.lerp(themeConfig.tertiaryColor, tertiaryMix * adaptiveSettings.renderQuality);
      } else {
        const energyMix = Math.sin(time * 0.3 + i * 0.05) * 0.3 + 0.3;
        const accentMix = colorVariation * 0.4;

        tempColor.lerp(themeConfig.highlightColor, energyMix * adaptiveSettings.renderQuality);
        tempColor.lerp(themeConfig.accentColor, accentMix * adaptiveSettings.renderQuality);

        const pulseMix = Math.sin(time * 0.2 + i * 0.01) * 0.2 + 0.2;
        tempColor.lerp(themeConfig.tertiaryColor, pulseMix * adaptiveSettings.renderQuality);

        if (mouseInfluence > 0) {
          const interactionColor = isAttracting ? themeConfig.attractColor : themeConfig.repelColor;
          tempColor.lerp(interactionColor, mouseInfluence * 0.4);
        }
      }

      colorsArray[i3] = tempColor.r;
      colorsArray[i3 + 1] = tempColor.g;
      colorsArray[i3 + 2] = tempColor.b;

      if (sizesArray) {
        const baseSizeVariation = Math.sin(time * 0.5 + i * 0.02) * 0.2 + 1;
        const mouseSizeBoost = 1 + mouseInfluence * 0.8;
        const baseSize = themeConfig.particleSize.min + sizeFactor * (themeConfig.particleSize.max - themeConfig.particleSize.min);
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
    { ref, key: optimizedCount },
    React.createElement(
      'bufferGeometry',
      { key: optimizedCount },
      React.createElement('bufferAttribute', {
        attach: 'attributes-position',
        count: positions.length / 3,
        array: positions,
        itemSize: 3
      }),
      React.createElement('bufferAttribute', {
        attach: 'attributes-color',
        count: colors.length / 3,
        array: colors,
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
      size: (theme === 'light' ? 0.038 : 0.022) * adaptiveSettings.renderQuality,
      sizeAttenuation: true,
      depthWrite: false,
      depthTest: true,
      vertexColors: true,
      opacity: themeConfig.opacity,
      blending: themeConfig.blending,
      alphaTest: theme === 'light' ? 0.02 : 0.01
    })
  );
}

interface ThreeBackgroundProps {
  theme: string;
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousTheme = useRef(theme);

  const bgColor = theme === 'light' ? '#F3F4F6' : '#0D1117';

  // Handle smooth theme transitions
  useEffect(() => {
    if (previousTheme.current !== theme) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Match CSS transition duration
      previousTheme.current = theme;
      return () => clearTimeout(timer);
    }
  }, [theme]);

  const bloomConfig = useMemo(() => {
    if (theme === 'light') {
      return {
        luminanceThreshold: 0.45,
        intensity: 0.7,
        levels: 8,
        mipmapBlur: true,
        radius: 0.9
      };
    } else {
      return {
        luminanceThreshold: 0.1,
        intensity: 1.2,
        levels: 9,
        mipmapBlur: true,
        radius: 0.9
      };
    }
  }, [theme]);

  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => setHasError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [hasError]);

  useEffect(() => {
    const canvas = canvasRef.current?.parentElement?.querySelector('canvas');
    if (!canvas) return;

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', handleTouch, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
      canvas.removeEventListener('touchend', handleTouch);
    };
  }, []);

  if (hasError) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: bgColor,
          transition: 'background-color 0.3s ease'
        }}
      />
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: -1,
      transition: 'opacity 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
      opacity: isTransitioning ? 0.6 : 1
    }}>
      <WebGLErrorBoundary
        fallback={
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: bgColor,
              transition: 'background-color 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
          />
        }
        onError={() => setHasError(true)}
      >
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 0, 12], fov: theme === 'light' ? 60 : 75 }}
          dpr={Math.min(window.devicePixelRatio, 2)}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            const handleContextLoss = () => setHasError(true);
            gl.domElement.addEventListener('webglcontextlost', handleContextLoss);
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: bgColor,
            transition: 'background-color 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)'
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: theme === 'light' ? NoToneMapping : LinearToneMapping,
            toneMappingExposure: 1.0,
            outputColorSpace: SRGBColorSpace,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false
          }}
        >
          {/* Set scene background color */}
          {React.createElement('color', { attach: "background", args: [bgColor] })}
          
          {/* Ambient light for scene */}
          {React.createElement('ambientLight', { intensity: theme === 'light' ? 0.5 : 0.5 })}
          {theme === 'light' && (
            <>
              {React.createElement('directionalLight', { position: [5, 5, 5], intensity: 0.2 })}
              {React.createElement('pointLight', { position: [-5, -5, -5], intensity: 0.15, color: '#6366F1' })}
            </>
          )}
          <FractalParticles theme={theme} />
          <React.Suspense fallback={null}>
            <EffectComposer>
              <Bloom
                luminanceThreshold={bloomConfig.luminanceThreshold}
                intensity={bloomConfig.intensity}
                levels={bloomConfig.levels}
                mipmapBlur={bloomConfig.mipmapBlur}
                radius={bloomConfig.radius}
              />
            </EffectComposer>
          </React.Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};

export default ThreeBackground;

