import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './customCursor.css';

export const CustomCursor: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const prevMousePos = useRef({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    useEffect(() => {
        // Check for touch device or preference for reduced motion
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (isTouchDevice || prefersReducedMotion) {
            setIsHidden(true);
            return;
        }

        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        // Renderer setup with optimizations
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false, // Disable stencil buffer if not needed
            depth: false // Disable depth buffer for 2D overlay
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for performance
        renderer.setClearColor(0x000000, 0); // Transparent background
        renderer.sortObjects = false; // Disable sorting for performance (manual z-order)
        
        // Style the canvas element for proper positioning
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.pointerEvents = 'none';
        
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Get theme colors
        const getThemeColors = () => {
            const computedStyle = getComputedStyle(document.documentElement);
            const theme = document.documentElement.getAttribute('data-theme');
            const accentColor = computedStyle.getPropertyValue('--accent-color').trim();
            
            // Parse hex color to THREE.Color
            const parseColor = (colorStr: string): number => {
                // If it's a hex color
                if (colorStr.startsWith('#')) {
                    return parseInt(colorStr.slice(1), 16);
                }
                return theme === 'light' ? 0x4F46E5 : 0x00A6FF;
            };

            const mainColor = parseColor(accentColor);
            const glowColor = theme === 'light' ? 0x7C3AED : 0x52C5FF;
            
            return { mainColor, glowColor, theme };
        };

        let colors = getThemeColors();

        // Create shooting star cursor
        const cursorGroup = new THREE.Group();
        cursorGroup.frustumCulled = false; // Always render cursor

        // Star head (bright sphere) - Reduced segments for better performance
        const starGeom = new THREE.SphereGeometry(0.08, 8, 8);
        const starMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1,
            depthWrite: false // Optimization for transparent objects
        });
        const star = new THREE.Mesh(starGeom, starMat);
        cursorGroup.add(star);

        // Inner glow - Reduced segments
        const glowGeom = new THREE.SphereGeometry(0.15, 8, 8);
        const glowMat = new THREE.MeshBasicMaterial({
            color: colors.mainColor,
            transparent: true,
            opacity: 0.5,
            depthWrite: false
        });
        const glow = new THREE.Mesh(glowGeom, glowMat);
        cursorGroup.add(glow);

        // Outer glow - Reduced segments
        const outerGlowGeom = new THREE.SphereGeometry(0.25, 8, 8);
        const outerGlowMat = new THREE.MeshBasicMaterial({
            color: colors.glowColor,
            transparent: true,
            opacity: 0.25,
            depthWrite: false
        });
        const outerGlow = new THREE.Mesh(outerGlowGeom, outerGlowMat);
        cursorGroup.add(outerGlow);

        // Hover ring indicator - Reduced segments
        const hoverRingGeom = new THREE.RingGeometry(0.3, 0.35, 16);
        const hoverRingMat = new THREE.MeshBasicMaterial({
            color: colors.glowColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0,
            depthWrite: false
        });
        const hoverRing = new THREE.Mesh(hoverRingGeom, hoverRingMat);
        cursorGroup.add(hoverRing);

        scene.add(cursorGroup);

        // Trail system - Optimized length
        const trailPositions: THREE.Vector3[] = [];
        const maxTrailLength = 15; // Reduced from 25 for better performance
        
        for (let i = 0; i < maxTrailLength; i++) {
            trailPositions.push(new THREE.Vector3(0, 0, 0));
        }

        const trailGeom = new THREE.BufferGeometry();
        const positions = new Float32Array(maxTrailLength * 3);
        const colorsArray = new Float32Array(maxTrailLength * 3);
        
        trailGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        trailGeom.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

        const trailMat = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            linewidth: 2,
            depthWrite: false,
            depthTest: false // Better rendering for overlay effect
        });

        const trail = new THREE.Line(trailGeom, trailMat);
        scene.add(trail);

        // Sparkle particles - Optimized count and shared geometry
        interface Sparkle {
            mesh: THREE.Mesh;
            life: number;
            velocity: THREE.Vector3;
        }
        
        const sparkles: Sparkle[] = [];
        const sparkleGeom = new THREE.SphereGeometry(0.025, 6, 6); // Reduced segments
        
        // Reduced from 15 to 8 particles for better performance
        for (let i = 0; i < 8; i++) {
            const sparkleMat = new THREE.MeshBasicMaterial({
                color: colors.glowColor,
                transparent: true,
                opacity: 0,
                depthWrite: false,
                depthTest: false
            });
            const sparkle = new THREE.Mesh(sparkleGeom, sparkleMat);
            sparkle.frustumCulled = false; // Prevent flickering when off-screen
            sparkles.push({
                mesh: sparkle,
                life: 0,
                velocity: new THREE.Vector3()
            });
            scene.add(sparkle);
        }

        // Click burst particles - Optimized
        interface BurstParticle {
            mesh: THREE.Mesh;
            life: number;
            velocity: THREE.Vector3;
            angle: number;
        }
        
        const burstParticles: BurstParticle[] = [];
        const burstGeom = new THREE.SphereGeometry(0.035, 6, 6); // Reduced segments
        
        // Reduced from 12 to 8 particles
        for (let i = 0; i < 8; i++) {
            const burstMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0,
                depthWrite: false,
                depthTest: false
            });
            const particle = new THREE.Mesh(burstGeom, burstMat);
            particle.frustumCulled = false;
            burstParticles.push({
                mesh: particle,
                life: 0,
                velocity: new THREE.Vector3(),
                angle: (i / 8) * Math.PI * 2 // Adjusted for 8 particles
            });
            scene.add(particle);
        }

        // State tracking
        let isClicking = false;
        let clickScale = 1;
        let hoverIntensity = 0;
        
        // Reusable color object to reduce garbage collection
        const tempColor = new THREE.Color();

        // Mouse move handler with improved accuracy
        const onMouseMove = (e: MouseEvent) => {
            prevMousePos.current.x = mousePos.current.x;
            prevMousePos.current.y = mousePos.current.y;
            
            // More accurate normalized device coordinates
            const rect = renderer.domElement.getBoundingClientRect();
            mousePos.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mousePos.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            // Check if hovering over interactive elements (including SVG icons in nav)
            const target = e.target as HTMLElement;
            
            // Check if it's an SVG or path element inside a button/link (common in nav icons)
            const isSvgInInteractive = (target.tagName === 'svg' || target.tagName === 'path' || target.tagName === 'SVG' || target.tagName === 'PATH') && 
                                       !!target.closest('button, a, .nav-toggle, .theme-toggle-btn, .language-switcher-toggle');
            
            const isInteractive = 
                target.tagName === 'BUTTON' || 
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT' ||
                isSvgInInteractive ||
                target.classList.contains('btn') ||
                target.classList.contains('nav-link') ||
                target.classList.contains('nav-links') ||
                target.classList.contains('nav-toggle') ||
                target.classList.contains('nav-logo') ||
                target.classList.contains('navbar') ||
                target.classList.contains('certificate-card') ||
                target.classList.contains('glass-panel') ||
                target.classList.contains('section-chip') ||
                target.classList.contains('skill-item') ||
                target.classList.contains('language-option') ||
                target.classList.contains('theme-toggle-btn') ||
                target.classList.contains('scroll-to-top') ||
                target.classList.contains('chatbot-fab') ||
                target.classList.contains('language-switcher-toggle') ||
                target.classList.contains('header-controls') ||
                target.classList.contains('desktop-controls') ||
                target.role === 'button' ||
                target.role === 'link' ||
                target.role === 'navigation' ||
                target.role === 'menuitem' ||
                !!target.closest('button, a, [role="button"], [role="link"], [role="navigation"], [role="menuitem"], nav, header, input, textarea, select, .navbar, .nav-link, .nav-links, .nav-toggle, .nav-logo');
            setIsHovering(!!isInteractive);
        };

        // Mouse down handler
        const onMouseDown = () => {
            isClicking = true;
            clickScale = 0.5;

            // Trigger burst effect
            burstParticles.forEach((particle) => {
                particle.life = 1;
                particle.mesh.position.copy(cursorGroup.position);
                const speed = 0.12;
                particle.velocity.set(
                    Math.cos(particle.angle) * speed,
                    Math.sin(particle.angle) * speed,
                    0
                );
            });
        };

        // Mouse up handler
        const onMouseUp = () => {
            isClicking = false;
        };

        // Mouse enter/leave handlers
        const onMouseEnter = () => setIsHidden(false);
        const onMouseLeave = () => setIsHidden(true);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mouseenter', onMouseEnter);
        window.addEventListener('mouseleave', onMouseLeave);

        // Handle window resize with proper throttling
        let resizeTimeout: NodeJS.Timeout;
        const onWindowResize = () => {
            // Clear existing timeout
            clearTimeout(resizeTimeout);
            
            // Immediate update for better UX
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // Additional delayed update to catch any final adjustments
            resizeTimeout = setTimeout(() => {
                const finalWidth = window.innerWidth;
                const finalHeight = window.innerHeight;
                camera.aspect = finalWidth / finalHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(finalWidth, finalHeight);
            }, 100);
        };

        window.addEventListener('resize', onWindowResize, { passive: true });

        // Handle scroll to keep cursor accurate
        const onScroll = () => {
            // Cursor position is already handled by mousemove with getBoundingClientRect
            // This ensures the position stays accurate during scroll events
            // No additional action needed as mousemove handles it
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        // Theme change observer
        const themeObserver = new MutationObserver(() => {
            colors = getThemeColors();
            glowMat.color.setHex(colors.mainColor);
            outerGlowMat.color.setHex(colors.glowColor);
            hoverRingMat.color.setHex(colors.glowColor);
            sparkles.forEach(s => (s.mesh.material as THREE.MeshBasicMaterial).color.setHex(colors.glowColor));
        });

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Animation loop with performance optimizations
        let time = 0;
        let sparkleIndex = 0;
        let lastTime = performance.now();
        let frameCount = 0;
        
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Calculate delta time for frame-rate independent animation
            const currentTime = performance.now();
            const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to 60fps
            lastTime = currentTime;
            frameCount++;
            
            time += 0.016;

            // Update cursor position with improved smooth interpolation
            const targetX = mousePos.current.x * 4;
            const targetY = mousePos.current.y * 4;
            
            // More responsive lerp with delta time compensation
            const lerpFactor = Math.min(0.25 * deltaTime, 1);
            cursorGroup.position.x += (targetX - cursorGroup.position.x) * lerpFactor;
            cursorGroup.position.y += (targetY - cursorGroup.position.y) * lerpFactor;

            // Click animation
            if (isClicking) {
                clickScale = Math.min(clickScale + 0.15, 1.5);
            } else {
                clickScale += (1 - clickScale) * 0.2;
            }
            star.scale.setScalar(clickScale);

            // Hover animation
            const targetHover = isHovering ? 1 : 0;
            hoverIntensity += (targetHover - hoverIntensity) * 0.1;
            
            hoverRing.material.opacity = hoverIntensity * 0.8;
            hoverRing.rotation.z += 0.03;
            hoverRing.scale.setScalar(1 + hoverIntensity * 0.2);

            // Enhanced glow - Update every 2 frames for performance
            if (frameCount % 2 === 0) {
                const glowScale = (1 + Math.sin(time * 8) * 0.2) * (1 + hoverIntensity * 0.3);
                const outerGlowScale = (1 + Math.sin(time * 6) * 0.3) * (1 + hoverIntensity * 0.5);
                glow.scale.setScalar(glowScale);
                outerGlow.scale.setScalar(outerGlowScale);
            }

            // Update trail - Optimized with reusable color object
            // Only update trail every frame (always for smooth appearance)
            trailPositions.unshift(cursorGroup.position.clone());
            if (trailPositions.length > maxTrailLength) {
                trailPositions.pop();
            }

            const pos = trail.geometry.attributes.position.array as Float32Array;
            const col = trail.geometry.attributes.color.array as Float32Array;
            
            // Reuse tempColor to reduce object creation
            tempColor.setHex(hoverIntensity > 0.1 ? colors.glowColor : colors.mainColor);
            
            // Unrolled loop for better performance on small arrays
            const trailLen = trailPositions.length;
            for (let i = 0; i < trailLen; i++) {
                const idx = i * 3;
                const trailPos = trailPositions[i];
                pos[idx] = trailPos.x;
                pos[idx + 1] = trailPos.y;
                pos[idx + 2] = trailPos.z;
                
                const alpha = 1 - (i / trailLen);
                col[idx] = tempColor.r * alpha;
                col[idx + 1] = tempColor.g * alpha;
                col[idx + 2] = tempColor.b * alpha;
            }
            
            trail.geometry.attributes.position.needsUpdate = true;
            trail.geometry.attributes.color.needsUpdate = true;

            // Emit sparkles when moving - Optimized frequency
            const deltaX = mousePos.current.x - prevMousePos.current.x;
            const deltaY = mousePos.current.y - prevMousePos.current.y;
            const movementSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Emit sparkles based on actual mouse movement - reduced frequency
            if (movementSpeed > 0.02 && Math.random() > 0.8 && frameCount % 3 === 0) {
                const sparkle = sparkles[sparkleIndex];
                sparkle.mesh.position.copy(cursorGroup.position);
                sparkle.life = 1;
                
                // Add slight perpendicular velocity for more dynamic effect
                sparkle.velocity.set(
                    (Math.random() - 0.5) * 0.08 - deltaX * 0.5,
                    (Math.random() - 0.5) * 0.08 - deltaY * 0.5,
                    0
                );
                sparkleIndex = (sparkleIndex + 1) % sparkles.length;
            }

            // Update sparkles
            sparkles.forEach(sparkle => {
                if (sparkle.life > 0) {
                    sparkle.mesh.position.add(sparkle.velocity);
                    sparkle.life -= 0.02;
                    (sparkle.mesh.material as THREE.MeshBasicMaterial).opacity = sparkle.life;
                    sparkle.mesh.scale.setScalar(sparkle.life);
                }
            });

            // Update burst particles
            burstParticles.forEach(particle => {
                if (particle.life > 0) {
                    particle.mesh.position.add(particle.velocity);
                    particle.velocity.multiplyScalar(0.95);
                    particle.life -= 0.03;
                    (particle.mesh.material as THREE.MeshBasicMaterial).opacity = particle.life;
                    particle.mesh.scale.setScalar(particle.life * 1.5);
                }
            });

            // Update previous mouse position for next frame
            prevMousePos.current.x = mousePos.current.x;
            prevMousePos.current.y = mousePos.current.y;

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            themeObserver.disconnect();
            clearTimeout(resizeTimeout);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mouseenter', onMouseEnter);
            window.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('scroll', onScroll);
            
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            
            // Proper Three.js cleanup
            renderer.dispose();
            
            // Dispose geometries and materials
            starGeom.dispose();
            starMat.dispose();
            glowGeom.dispose();
            glowMat.dispose();
            outerGlowGeom.dispose();
            outerGlowMat.dispose();
            hoverRingGeom.dispose();
            hoverRingMat.dispose();
            trailGeom.dispose();
            trailMat.dispose();
            sparkleGeom.dispose();
            burstGeom.dispose();
            
            sparkles.forEach(s => {
                if (s.mesh.material) {
                    if (Array.isArray(s.mesh.material)) {
                        s.mesh.material.forEach(m => m.dispose());
                    } else {
                        s.mesh.material.dispose();
                    }
                }
            });
            burstParticles.forEach(p => {
                if (p.mesh.material) {
                    if (Array.isArray(p.mesh.material)) {
                        p.mesh.material.forEach(m => m.dispose());
                    } else {
                        p.mesh.material.dispose();
                    }
                }
            });
            
            scene.clear();
        };
    }, [isHovering]);

    if (isHidden) return null;

    return (
        <div 
            ref={containerRef} 
            style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw', 
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 99999, // Very high z-index to ensure it's always on top of all elements
                overflow: 'hidden',
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }} 
        />
    );
};

