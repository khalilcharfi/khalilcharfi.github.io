import React, { useEffect, useState, useRef } from 'react';
import './customCursor.css';

interface Position {
    x: number;
    y: number;
}

export const CustomCursor: React.FC = () => {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorOutlineRef = useRef<HTMLDivElement>(null);
    const trailRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();
    const trailPoints = useRef<Position[]>([]);
    
    // Smooth animation using lerp (linear interpolation)
    const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
    };

    // Track mouse movement
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            
            // Add point to trail
            const newPoint = { x: e.clientX, y: e.clientY };
            const updatedPoints = [...trailPoints.current, newPoint];
            if (updatedPoints.length > 20) {
                updatedPoints.shift();
            }
            trailPoints.current = updatedPoints;
        };

        const handleMouseEnter = () => setIsHidden(false);
        const handleMouseLeave = () => setIsHidden(true);

        // Detect if hovering over interactive elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const hasPointerCursor = window.getComputedStyle(target).cursor === 'pointer';
            const isInteractive = 
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.classList.contains('btn') ||
                target.classList.contains('nav-link') ||
                target.classList.contains('certificate-card') ||
                target.classList.contains('glass-panel') ||
                target.classList.contains('section-chip') ||
                target.classList.contains('skill-item') ||
                target.classList.contains('language-option') ||
                target.classList.contains('theme-toggle-btn') ||
                target.classList.contains('language-switcher-toggle') ||
                target.classList.contains('scroll-to-top') ||
                target.classList.contains('chatbot-fab') ||
                !!target.closest('a') ||
                !!target.closest('button') ||
                hasPointerCursor;
            
            setIsPointer(isInteractive);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Animate cursor with smooth follow
    useEffect(() => {
        let currentDotX = position.x;
        let currentDotY = position.y;
        let currentOutlineX = position.x;
        let currentOutlineY = position.y;

        const animate = (time: number) => {
            if (previousTimeRef.current !== undefined) {
                // Smooth following animation
                currentDotX = lerp(currentDotX, position.x, 0.3);
                currentDotY = lerp(currentDotY, position.y, 0.3);
                currentOutlineX = lerp(currentOutlineX, position.x, 0.15);
                currentOutlineY = lerp(currentOutlineY, position.y, 0.15);

                if (cursorDotRef.current) {
                    cursorDotRef.current.style.transform = `translate(-50%, -50%) translate(${currentDotX}px, ${currentDotY}px)`;
                }

                if (cursorOutlineRef.current) {
                    cursorOutlineRef.current.style.transform = `translate(-50%, -50%) translate(${currentOutlineX}px, ${currentOutlineY}px)`;
                }

                // Draw trail
                if (trailRef.current && trailPoints.current.length > 1) {
                    const canvas = trailRef.current;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        // Clear canvas
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        
                        // Get theme color
                        const computedStyle = getComputedStyle(document.documentElement);
                        const accentColor = computedStyle.getPropertyValue('--accent-color').trim();
                        
                        // Draw trail with gradient
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        
                        for (let i = 1; i < trailPoints.current.length; i++) {
                            const point = trailPoints.current[i];
                            const prevPoint = trailPoints.current[i - 1];
                            const opacity = (i / trailPoints.current.length) * 0.3;
                            const width = (i / trailPoints.current.length) * 2;
                            
                            ctx.beginPath();
                            ctx.strokeStyle = accentColor || '#00A6FF';
                            ctx.globalAlpha = opacity;
                            ctx.lineWidth = width;
                            ctx.moveTo(prevPoint.x, prevPoint.y);
                            ctx.lineTo(point.x, point.y);
                            ctx.stroke();
                        }
                    }
                }
            }
            previousTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [position]);

    // Set canvas size
    useEffect(() => {
        const handleResize = () => {
            if (trailRef.current) {
                trailRef.current.width = window.innerWidth;
                trailRef.current.height = window.innerHeight;
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check for touch device or preference for reduced motion
    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (isTouchDevice || prefersReducedMotion) {
            setIsHidden(true);
        }
    }, []);

    if (isHidden) return null;

    return (
        <>
            <canvas 
                ref={trailRef}
                className="cursor-trail"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    zIndex: 9997,
                    width: '100vw',
                    height: '100vh'
                }}
            />
            <div
                ref={cursorDotRef}
                className={`cursor-dot ${isPointer ? 'cursor-pointer' : ''}`}
            >
                <div className="cursor-dot-inner" />
            </div>
            <div
                ref={cursorOutlineRef}
                className={`cursor-outline ${isPointer ? 'cursor-pointer' : ''}`}
            />
        </>
    );
};

