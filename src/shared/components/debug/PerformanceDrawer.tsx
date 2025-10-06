import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/features/i18n';
import { analytics } from '@/features/analytics';
import './performanceDrawer.css';

interface PerformanceMetrics {
    fps: number;
    memory: {
        used: number;
        limit: number;
        percentage: number;
    };
    timing: {
        domContentLoaded: number;
        load: number;
        firstPaint: number;
        firstContentfulPaint: number;
    };
    resources: {
        scripts: number;
        stylesheets: number;
        images: number;
        fonts: number;
        total: number;
    };
    network: {
        totalSize: number;
        totalRequests: number;
    };
    threeJs: {
        geometries: number;
        textures: number;
        programs: number;
        calls: number;
        triangles: number;
        points: number;
    };
    userInfo: {
        language: string;
        profile: string;
        source: string;
        referrer: string;
        theme: string;
    };
}

interface GeminiStatus {
    connectionStatus: string;
    errorMessage?: string;
    retryCount: number;
    retryConnection: () => void;
}

interface PerformanceDrawerProps {
    geminiStatus?: GeminiStatus;
}

export const PerformanceDrawer: React.FC<PerformanceDrawerProps> = ({ geminiStatus }) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 0,
        memory: { used: 0, limit: 0, percentage: 0 },
        timing: { domContentLoaded: 0, load: 0, firstPaint: 0, firstContentfulPaint: 0 },
        resources: { scripts: 0, stylesheets: 0, images: 0, fonts: 0, total: 0 },
        network: { totalSize: 0, totalRequests: 0 },
        threeJs: { geometries: 0, textures: 0, programs: 0, calls: 0, triangles: 0, points: 0 },
        userInfo: { language: '', profile: '', source: '', referrer: '', theme: '' }
    });
    const [logs, setLogs] = useState<Array<{ type: string; message: string; timestamp: string }>>([]);
    const [activeTab, setActiveTab] = useState<'metrics' | 'resources' | 'console' | 'user' | 'api'>('metrics');
    
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const fpsHistoryRef = useRef<number[]>([]);
    const maxLogsRef = useRef(50);

    // FPS Calculation
    useEffect(() => {
        let animationFrameId: number;
        
        const calculateFPS = () => {
            const now = performance.now();
            const delta = now - lastTimeRef.current;
            
            if (delta >= 1000) {
                const fps = Math.round((frameCountRef.current * 1000) / delta);
                fpsHistoryRef.current.push(fps);
                if (fpsHistoryRef.current.length > 60) {
                    fpsHistoryRef.current.shift();
                }
                
                setMetrics(prev => ({ ...prev, fps }));
                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }
            
            frameCountRef.current++;
            animationFrameId = requestAnimationFrame(calculateFPS);
        };
        
        animationFrameId = requestAnimationFrame(calculateFPS);
        
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Memory Usage
    useEffect(() => {
        const updateMemory = () => {
            if ('memory' in performance && (performance as any).memory) {
                const memory = (performance as any).memory;
                const used = Math.round(memory.usedJSHeapSize / 1048576); // Convert to MB
                const limit = Math.round(memory.jsHeapSizeLimit / 1048576);
                const percentage = Math.round((used / limit) * 100);
                
                setMetrics(prev => ({
                    ...prev,
                    memory: { used, limit, percentage }
                }));
            }
        };
        
        updateMemory();
        const interval = setInterval(updateMemory, 2000);
        
        return () => clearInterval(interval);
    }, []);

    // Performance Timing
    useEffect(() => {
        const updateTiming = () => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const paint = performance.getEntriesByType('paint');
            
            if (navigation) {
                const timing = {
                    domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
                    load: Math.round(navigation.loadEventEnd - navigation.fetchStart),
                    firstPaint: 0,
                    firstContentfulPaint: 0
                };
                
                paint.forEach(entry => {
                    if (entry.name === 'first-paint') {
                        timing.firstPaint = Math.round(entry.startTime);
                    } else if (entry.name === 'first-contentful-paint') {
                        timing.firstContentfulPaint = Math.round(entry.startTime);
                    }
                });
                
                setMetrics(prev => ({ ...prev, timing }));
            }
        };
        
        // Wait for load event
        if (document.readyState === 'complete') {
            updateTiming();
        } else {
            window.addEventListener('load', updateTiming);
        }
        
        return () => window.removeEventListener('load', updateTiming);
    }, []);

    // Resource Tracking
    useEffect(() => {
        const updateResources = () => {
            const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
            
            const counts = {
                scripts: 0,
                stylesheets: 0,
                images: 0,
                fonts: 0,
                total: resources.length
            };
            
            let totalSize = 0;
            
            resources.forEach(resource => {
                totalSize += resource.transferSize || 0;
                
                if (resource.initiatorType === 'script') counts.scripts++;
                else if (resource.initiatorType === 'link' || resource.initiatorType === 'css') counts.stylesheets++;
                else if (resource.initiatorType === 'img') counts.images++;
                else if (resource.name.includes('.woff') || resource.name.includes('.ttf')) counts.fonts++;
            });
            
            setMetrics(prev => ({
                ...prev,
                resources: counts,
                network: {
                    totalSize: Math.round(totalSize / 1024), // KB
                    totalRequests: resources.length
                }
            }));
        };
        
        if (document.readyState === 'complete') {
            updateResources();
        } else {
            window.addEventListener('load', updateResources);
        }
        
        return () => window.removeEventListener('load', updateResources);
    }, []);

    // User Info Tracking
    useEffect(() => {
        const updateUserInfo = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const source = urlParams.get('source') || urlParams.get('utm_source') || 'direct';
            const referrer = document.referrer || 'none';
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            const language = i18n.language || 'en';
            
            // Get profile from analytics if available
            let profile = 'general_visitor';
            try {
                const analyticsProfile = analytics?.getProfile?.();
                if (analyticsProfile) {
                    profile = analyticsProfile.visitorType || profile;
                }
            } catch (e) {
                // Analytics not available
            }
            
            setMetrics(prev => ({
                ...prev,
                userInfo: { language, profile, source, referrer, theme }
            }));
        };
        
        updateUserInfo();
        
        // Update on language or theme change
        const interval = setInterval(updateUserInfo, 3000);
        
        // Observer for theme changes
        const themeObserver = new MutationObserver(updateUserInfo);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        return () => {
            clearInterval(interval);
            themeObserver.disconnect();
        };
    }, [i18n.language]);

    // Three.js Performance Tracking
    useEffect(() => {
        const updateThreeJsMetrics = () => {
            let threeJsInfo = {
                geometries: 0,
                textures: 0,
                programs: 0,
                calls: 0,
                triangles: 0,
                points: 0
            };
            
            // Only check for Three.js devtools without trying to create contexts
            // This avoids the "Canvas has an existing context of a different type" error
            if (typeof window !== 'undefined' && (window as any).__THREE_DEVTOOLS__) {
                const devtools = (window as any).__THREE_DEVTOOLS__;
                if (devtools) {
                    threeJsInfo = { ...threeJsInfo, ...devtools };
                }
            }
            
            // Count canvas elements without trying to get their contexts
            const canvases = document.querySelectorAll('canvas');
            threeJsInfo.calls = canvases.length;
            
            setMetrics(prev => ({
                ...prev,
                threeJs: threeJsInfo
            }));
        };
        
        updateThreeJsMetrics();
        const interval = setInterval(updateThreeJsMetrics, 2000);
        
        return () => clearInterval(interval);
    }, []);

    // Console Interception
    useEffect(() => {
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info
        };
        
        const addLog = (type: string, args: any[]) => {
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            
            const timestamp = new Date().toLocaleTimeString();
            
            setLogs(prev => {
                const newLogs = [...prev, { type, message, timestamp }];
                return newLogs.slice(-maxLogsRef.current);
            });
        };
        
        console.log = (...args: any[]) => {
            originalConsole.log(...args);
            addLog('log', args);
        };
        
        console.warn = (...args: any[]) => {
            originalConsole.warn(...args);
            addLog('warn', args);
        };
        
        console.error = (...args: any[]) => {
            originalConsole.error(...args);
            addLog('error', args);
        };
        
        console.info = (...args: any[]) => {
            originalConsole.info(...args);
            addLog('info', args);
        };
        
        return () => {
            console.log = originalConsole.log;
            console.warn = originalConsole.warn;
            console.error = originalConsole.error;
            console.info = originalConsole.info;
        };
    }, []);

    const clearLogs = () => setLogs([]);
    
    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    
    const getFPSColor = (fps: number) => {
        if (isLightMode) {
            // Darker colors for light mode with better contrast
            if (fps >= 55) return 'rgb(0, 170, 85)';      // Green - Excellent
            if (fps >= 30) return 'rgb(204, 119, 0)';     // Orange - Good
            return 'rgb(204, 0, 0)';                       // Red - Poor
        }
        
        // Bright colors for dark mode
        if (fps >= 55) return 'rgb(0, 255, 136)';         // Bright Green - Excellent
        if (fps >= 30) return 'rgb(255, 170, 0)';         // Bright Orange - Good
        return 'rgb(255, 68, 68)';                         // Bright Red - Poor
    };
    
    const getGeminiStatusColor = (status: string) => {
        if (isLightMode) {
            // Darker colors for light mode
            if (status === 'connected') return 'rgb(0, 170, 85)';
            if (status === 'failed') return 'rgb(204, 0, 0)';
            if (status === 'checking') return 'rgb(204, 119, 0)';
            return 'rgb(102, 102, 102)';
        }
        
        // Bright colors for dark mode
        if (status === 'connected') return 'rgb(0, 255, 136)';
        if (status === 'failed') return 'rgb(255, 68, 68)';
        if (status === 'checking') return 'rgb(255, 170, 0)';
        return 'rgb(136, 136, 136)';
    };
    
    const getMemoryColor = (percentage: number) => {
        if (isLightMode) {
            // Darker colors for light mode with better contrast
            if (percentage < 50) return 'rgb(0, 170, 85)';    // Green - Healthy
            if (percentage < 80) return 'rgb(204, 119, 0)';   // Orange - Moderate
            return 'rgb(204, 0, 0)';                           // Red - Critical
        }
        
        // Bright colors for dark mode
        if (percentage < 50) return 'rgb(0, 255, 136)';       // Bright Green - Healthy
        if (percentage < 80) return 'rgb(255, 170, 0)';       // Bright Orange - Moderate
        return 'rgb(255, 68, 68)';                             // Bright Red - Critical
    };
    
    const getFPSStatus = (fps: number) => {
        if (fps >= 55) return '● Excellent';
        if (fps >= 30) return '● Good';
        return '● Poor';
    };
    
    const getMemoryStatus = (percentage: number) => {
        if (percentage < 50) return '● Healthy';
        if (percentage < 80) return '● Moderate';
        return '● Critical';
    };
    
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                className="perf-drawer-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Performance Drawer"
                title="Performance Monitor"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="perf-drawer-fps-badge" style={{ color: getFPSColor(metrics.fps) }}>
                    {metrics.fps}
                </span>
            </button>

            {/* Drawer */}
            <div className={`perf-drawer ${isOpen ? 'open' : ''}`}>
                <div className="perf-drawer-header">
                    <h3>Performance Monitor</h3>
                    <button
                        className="perf-drawer-close"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Tabs */}
                <div className="perf-drawer-tabs">
                    <button
                        className={`perf-drawer-tab ${activeTab === 'metrics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('metrics')}
                    >
                        Metrics
                    </button>
                    <button
                        className={`perf-drawer-tab ${activeTab === 'user' ? 'active' : ''}`}
                        onClick={() => setActiveTab('user')}
                    >
                        User
                    </button>
                    <button
                        className={`perf-drawer-tab ${activeTab === 'api' ? 'active' : ''}`}
                        onClick={() => setActiveTab('api')}
                    >
                        API
                    </button>
                    <button
                        className={`perf-drawer-tab ${activeTab === 'resources' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resources')}
                    >
                        Resources
                    </button>
                    <button
                        className={`perf-drawer-tab ${activeTab === 'console' ? 'active' : ''}`}
                        onClick={() => setActiveTab('console')}
                    >
                        Console ({logs.length})
                    </button>
                </div>

                {/* Content */}
                <div className="perf-drawer-content">
                    {/* Metrics Tab */}
                    {activeTab === 'metrics' && (
                        <div className="perf-metrics">
                            <div className="perf-metric-card">
                                <div className="perf-metric-header">
                                    <span className="perf-metric-label">⚡ Frames Per Second</span>
                                    <span className="perf-metric-value" style={{ color: getFPSColor(metrics.fps) }}>
                                        {metrics.fps}
                                    </span>
                                </div>
                                <div className="perf-metric-detail" style={{ 
                                    textAlign: 'left', 
                                    marginBottom: '8px',
                                    color: getFPSColor(metrics.fps),
                                    fontWeight: 600
                                }}>
                                    {getFPSStatus(metrics.fps)}
                                </div>
                                <div className="perf-metric-chart">
                                    {fpsHistoryRef.current.map((fps, i) => (
                                        <div
                                            key={i}
                                            className="perf-metric-bar"
                                            title={`${fps} FPS`}
                                            style={{
                                                height: `${Math.min((fps / 60) * 100, 100)}%`,
                                                backgroundColor: getFPSColor(fps)
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="perf-metric-detail">
                                    Last 60 frames • Target: 60 FPS
                                </div>
                            </div>

                            <div className="perf-metric-card">
                                <div className="perf-metric-header">
                                    <span className="perf-metric-label">💾 Memory Usage</span>
                                    <span className="perf-metric-value" style={{ color: getMemoryColor(metrics.memory.percentage) }}>
                                        {metrics.memory.used}MB
                                    </span>
                                </div>
                                <div className="perf-metric-detail" style={{ 
                                    textAlign: 'left', 
                                    marginBottom: '8px',
                                    color: getMemoryColor(metrics.memory.percentage),
                                    fontWeight: 600
                                }}>
                                    {getMemoryStatus(metrics.memory.percentage)}
                                </div>
                                <div className="perf-metric-bar-container">
                                    <div
                                        className="perf-metric-bar-fill"
                                        style={{
                                            width: `${metrics.memory.percentage}%`,
                                            backgroundColor: getMemoryColor(metrics.memory.percentage)
                                        }}
                                    />
                                </div>
                                <div className="perf-metric-detail">
                                    {metrics.memory.percentage}% of {metrics.memory.limit}MB limit
                                </div>
                            </div>

                            <div className="perf-metric-card">
                                <div className="perf-metric-label">⏱️ Page Load Performance</div>
                                <div className="perf-metric-list">
                                    <div className="perf-metric-item">
                                        <span>📄 DOM Content Loaded</span>
                                        <span>{metrics.timing.domContentLoaded}ms</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>✅ Full Page Load</span>
                                        <span>{metrics.timing.load}ms</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>🎨 First Paint</span>
                                        <span>{metrics.timing.firstPaint}ms</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>🖼️ First Contentful Paint</span>
                                        <span>{metrics.timing.firstContentfulPaint}ms</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Tab */}
                    {activeTab === 'user' && (
                        <div className="perf-user">
                            <div className="perf-metric-card">
                                <div className="perf-metric-label">User Context</div>
                                <div className="perf-metric-list">
                                    <div className="perf-metric-item">
                                        <span>🌍 Language</span>
                                        <span>{metrics.userInfo.language}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>👤 Profile</span>
                                        <span>{metrics.userInfo.profile}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>🎨 Theme</span>
                                        <span>{metrics.userInfo.theme}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>📍 Source</span>
                                        <span>{metrics.userInfo.source}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>🔗 Referrer</span>
                                        <span style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                                            {metrics.userInfo.referrer}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="perf-metric-card">
                                <div className="perf-metric-label">Browser Info</div>
                                <div className="perf-metric-list">
                                    <div className="perf-metric-item">
                                        <span>User Agent</span>
                                        <span style={{ fontSize: '10px', wordBreak: 'break-all' }}>
                                            {navigator.userAgent}
                                        </span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>Platform</span>
                                        <span>{navigator.platform}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>Screen</span>
                                        <span>{window.screen.width}×{window.screen.height}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>Viewport</span>
                                        <span>{window.innerWidth}×{window.innerHeight}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>Pixel Ratio</span>
                                        <span>{window.devicePixelRatio}x</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* API Tab */}
                    {activeTab === 'api' && (
                        <div className="perf-api">
                            <div className="perf-metric-card">
                                <div className="perf-metric-label">🤖 Gemini API Status</div>
                                {geminiStatus ? (
                                    <>
                                        <div className="perf-metric-list">
                                            <div className="perf-metric-item">
                                                <span>Connection Status</span>
                                                <span style={{
                                                    color: getGeminiStatusColor(geminiStatus.connectionStatus),
                                                    fontWeight: 'bold'
                                                }}>
                                                    {geminiStatus.connectionStatus.toUpperCase()}
                                                </span>
                                            </div>
                                            {geminiStatus.retryCount > 0 && (
                                                <div className="perf-metric-item">
                                                    <span>Retry Count</span>
                                                    <span>{geminiStatus.retryCount}</span>
                                                </div>
                                            )}
                                        </div>
                                        {geminiStatus.errorMessage && (
                                            <div style={{
                                                marginTop: '12px',
                                                padding: '12px',
                                                background: isLightMode ? 'rgba(204, 0, 0, 0.1)' : 'rgba(255, 68, 68, 0.15)',
                                                border: isLightMode ? '1px solid rgba(204, 0, 0, 0.3)' : '1px solid rgba(255, 68, 68, 0.4)',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                color: isLightMode ? 'rgb(153, 0, 0)' : 'rgb(255, 136, 136)',
                                                wordBreak: 'break-word'
                                            }}>
                                                <div style={{ 
                                                    fontWeight: 'bold', 
                                                    marginBottom: '4px', 
                                                    color: isLightMode ? 'rgb(204, 0, 0)' : 'rgb(255, 68, 68)' 
                                                }}>
                                                    ⚠️ Error:
                                                </div>
                                                {geminiStatus.errorMessage}
                                            </div>
                                        )}
                                        {geminiStatus.connectionStatus === 'failed' && (
                                            <button
                                                onClick={geminiStatus.retryConnection}
                                                style={{
                                                    marginTop: '12px',
                                                    width: '100%',
                                                    padding: '10px',
                                                    background: isLightMode 
                                                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
                                                        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                                                    border: isLightMode 
                                                        ? '1px solid rgba(102, 126, 234, 0.4)'
                                                        : '1px solid rgba(102, 126, 234, 0.5)',
                                                    borderRadius: '6px',
                                                    color: isLightMode ? 'rgb(82, 106, 214)' : 'rgb(102, 126, 234)',
                                                    fontSize: '13px',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = isLightMode
                                                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%)'
                                                        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)';
                                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                                    e.currentTarget.style.boxShadow = isLightMode
                                                        ? '0 4px 12px rgba(102, 126, 234, 0.2)'
                                                        : '0 4px 12px rgba(102, 126, 234, 0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = isLightMode
                                                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
                                                        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                🔄 Retry Connection
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div style={{
                                        padding: '20px',
                                        textAlign: 'center',
                                        color: '#888',
                                        fontSize: '13px'
                                    }}>
                                        No API status available
                                    </div>
                                )}
                            </div>

                            <div className="perf-metric-card">
                                <div className="perf-metric-label">📊 Google Analytics Status</div>
                                {(() => {
                                    const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
                                    const isGAConfigured = gaMeasurementId && gaMeasurementId !== 'G-XXXXXXXXXX';
                                    const hasValidFormat = gaMeasurementId.startsWith('G-');
                                    const isGtagLoaded = typeof window !== 'undefined' && typeof window.gtag === 'function';
                                    const hasDataLayer = typeof window !== 'undefined' && Array.isArray(window.dataLayer);
                                    
                                    return (
                                        <>
                                            <div className="perf-metric-list">
                                                <div className="perf-metric-item">
                                                    <span>Measurement ID</span>
                                                    <span style={{
                                                        color: isGAConfigured ? (isLightMode ? 'rgb(0, 170, 85)' : 'rgb(0, 255, 136)') : (isLightMode ? 'rgb(204, 0, 0)' : 'rgb(255, 68, 68)'),
                                                        fontWeight: 'bold',
                                                        fontSize: '11px'
                                                    }}>
                                                        {gaMeasurementId ? (hasValidFormat ? gaMeasurementId : 'INVALID FORMAT') : 'NOT SET'}
                                                    </span>
                                                </div>
                                                <div className="perf-metric-item">
                                                    <span>gtag.js Loaded</span>
                                                    <span style={{
                                                        color: isGtagLoaded ? getGeminiStatusColor('connected') : getGeminiStatusColor('failed'),
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {isGtagLoaded ? 'YES' : 'NO'}
                                                    </span>
                                                </div>
                                                <div className="perf-metric-item">
                                                    <span>DataLayer Active</span>
                                                    <span style={{
                                                        color: hasDataLayer ? getGeminiStatusColor('connected') : getGeminiStatusColor('failed'),
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {hasDataLayer ? 'YES' : 'NO'}
                                                    </span>
                                                </div>
                                                {hasDataLayer && (
                                                    <div className="perf-metric-item">
                                                        <span>Events in Queue</span>
                                                        <span style={{ fontSize: '11px', opacity: 0.8 }}>
                                                            {window.dataLayer?.length || 0}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="perf-metric-item">
                                                    <span>User Analytics</span>
                                                    <span style={{
                                                        color: analytics ? getGeminiStatusColor('connected') : getGeminiStatusColor('failed'),
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {analytics ? 'ACTIVE' : 'INACTIVE'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {!isGAConfigured && (
                                                <div style={{
                                                    marginTop: '12px',
                                                    padding: '12px',
                                                    background: isLightMode ? 'rgba(204, 119, 0, 0.1)' : 'rgba(255, 170, 0, 0.15)',
                                                    border: isLightMode ? '1px solid rgba(204, 119, 0, 0.3)' : '1px solid rgba(255, 170, 0, 0.4)',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    color: isLightMode ? 'rgb(153, 89, 0)' : 'rgb(255, 170, 0)',
                                                    wordBreak: 'break-word'
                                                }}>
                                                    <div style={{ 
                                                        fontWeight: 'bold', 
                                                        marginBottom: '4px', 
                                                        color: isLightMode ? 'rgb(204, 119, 0)' : 'rgb(255, 170, 0)' 
                                                    }}>
                                                        ⚠️ Configuration Required:
                                                    </div>
                                                    Set VITE_GA_MEASUREMENT_ID in your .env file with a valid Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX)
                                                </div>
                                            )}
                                            
                                            {isGAConfigured && !hasValidFormat && (
                                                <div style={{
                                                    marginTop: '12px',
                                                    padding: '12px',
                                                    background: isLightMode ? 'rgba(204, 0, 0, 0.1)' : 'rgba(255, 68, 68, 0.15)',
                                                    border: isLightMode ? '1px solid rgba(204, 0, 0, 0.3)' : '1px solid rgba(255, 68, 68, 0.4)',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    color: isLightMode ? 'rgb(153, 0, 0)' : 'rgb(255, 136, 136)',
                                                    wordBreak: 'break-word'
                                                }}>
                                                    <div style={{ 
                                                        fontWeight: 'bold', 
                                                        marginBottom: '4px', 
                                                        color: isLightMode ? 'rgb(204, 0, 0)' : 'rgb(255, 68, 68)' 
                                                    }}>
                                                        ⚠️ Invalid Format:
                                                    </div>
                                                    GA4 Measurement IDs must start with "G-" followed by alphanumeric characters. Current value: {gaMeasurementId}
                                                </div>
                                            )}
                                            
                                            {isGAConfigured && hasValidFormat && !isGtagLoaded && (
                                                <div style={{
                                                    marginTop: '12px',
                                                    padding: '12px',
                                                    background: isLightMode ? 'rgba(204, 0, 0, 0.1)' : 'rgba(255, 68, 68, 0.15)',
                                                    border: isLightMode ? '1px solid rgba(204, 0, 0, 0.3)' : '1px solid rgba(255, 68, 68, 0.4)',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    color: isLightMode ? 'rgb(153, 0, 0)' : 'rgb(255, 136, 136)',
                                                    wordBreak: 'break-word'
                                                }}>
                                                    <div style={{ 
                                                        fontWeight: 'bold', 
                                                        marginBottom: '4px', 
                                                        color: isLightMode ? 'rgb(204, 0, 0)' : 'rgb(255, 68, 68)' 
                                                    }}>
                                                        ⚠️ Script Not Loaded:
                                                    </div>
                                                    Google Analytics script failed to load. Check your internet connection or verify the Measurement ID is correct.
                                                </div>
                                            )}
                                            
                                            {isGAConfigured && hasValidFormat && isGtagLoaded && (
                                                <div style={{
                                                    marginTop: '12px',
                                                    padding: '12px',
                                                    background: isLightMode ? 'rgba(0, 170, 85, 0.1)' : 'rgba(0, 255, 136, 0.15)',
                                                    border: isLightMode ? '1px solid rgba(0, 170, 85, 0.3)' : '1px solid rgba(0, 255, 136, 0.4)',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    color: isLightMode ? 'rgb(0, 120, 60)' : 'rgb(0, 255, 136)',
                                                    wordBreak: 'break-word'
                                                }}>
                                                    <div style={{ 
                                                        fontWeight: 'bold', 
                                                        marginBottom: '4px', 
                                                        color: isLightMode ? 'rgb(0, 170, 85)' : 'rgb(0, 255, 136)' 
                                                    }}>
                                                        ✅ Analytics Active:
                                                    </div>
                                                    Google Analytics is properly configured and sending events. View your data at analytics.google.com
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Resources Tab */}
                    {activeTab === 'resources' && (
                        <div className="perf-resources">
                            <div className="perf-metric-card">
                                <div className="perf-metric-label">🌐 Network Performance</div>
                                <div className="perf-metric-list">
                                    <div className="perf-metric-item">
                                        <span>📊 Total Requests</span>
                                        <span>{metrics.network.totalRequests}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>📦 Total Transfer Size</span>
                                        <span>{formatBytes(metrics.network.totalSize * 1024)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="perf-metric-card">
                                <div className="perf-metric-label">📁 Resource Breakdown</div>
                                <div className="perf-metric-list">
                                    <div className="perf-metric-item">
                                        <span>⚙️ JavaScript Files</span>
                                        <span>{metrics.resources.scripts}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>🎨 Stylesheets</span>
                                        <span>{metrics.resources.stylesheets}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>🖼️ Images</span>
                                        <span>{metrics.resources.images}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>🔤 Fonts</span>
                                        <span>{metrics.resources.fonts}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>📚 Total Assets</span>
                                        <span>{metrics.resources.total}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="perf-metric-card">
                                <div className="perf-metric-label">🎮 Three.js Rendering</div>
                                <div className="perf-metric-list">
                                    <div className="perf-metric-item">
                                        <span>🔷 Geometries</span>
                                        <span>{metrics.threeJs.geometries}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>🖼️ Textures</span>
                                        <span>{metrics.threeJs.textures}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>📋 Programs</span>
                                        <span>{metrics.threeJs.programs}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>🎯 Draw Calls</span>
                                        <span>{metrics.threeJs.calls}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>🔺 Triangles</span>
                                        <span>{metrics.threeJs.triangles.toLocaleString()}</span>
                                    </div>
                                    <div className="perf-metric-item">
                                        <span>⚫ Points</span>
                                        <span>{metrics.threeJs.points.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Console Tab */}
                    {activeTab === 'console' && (
                        <div className="perf-console">
                            <div className="perf-console-header">
                                <button className="perf-console-clear" onClick={clearLogs}>
                                    Clear
                                </button>
                            </div>
                            <div className="perf-console-logs">
                                {logs.length === 0 ? (
                                    <div className="perf-console-empty">No console logs</div>
                                ) : (
                                    logs.map((log, i) => (
                                        <div key={i} className={`perf-console-log perf-console-${log.type}`}>
                                            <span className="perf-console-time">{log.timestamp}</span>
                                            <span className="perf-console-type">{log.type}</span>
                                            <span className="perf-console-message">{log.message}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && <div className="perf-drawer-backdrop" onClick={() => setIsOpen(false)} />}
        </>
    );
};
