// Advanced Browser Fingerprinting System
// Using built-in browser APIs for comprehensive user profiling (no external dependencies)

// Enhanced fingerprint data structure
export interface AdvancedFingerprint {
  // Core identifiers
  fingerprintId: string;
  clientId: string;
  canvasFingerprint: string;
  webglFingerprint: string;
  audioFingerprint: string;
  
  // Device characteristics
  screen: {
    resolution: string;
    colorDepth: number;
    pixelRatio: number;
    orientation: string;
  };
  
  // Browser environment
  browser: {
    userAgent: string;
    language: string;
    languages: string[];
    plugins: string[];
    mimeTypes: string[];
    cookieEnabled: boolean;
    doNotTrack: string | null;
  };
  
  // Hardware capabilities
  hardware: {
    hardwareConcurrency: number;
    deviceMemory?: number;
    maxTouchPoints: number;
    platform: string;
    architecture?: string;
  };
  
  // Timing and performance
  performance: {
    timezone: string;
    timezoneOffset: number;
    performanceMemory?: any;
    renderingEngine: string;
  };
  
  // Feature detection
  features: {
    webgl: boolean;
    webrtc: boolean;
    webassembly: boolean;
    webworkers: boolean;
    indexeddb: boolean;
    websockets: boolean;
    geolocation: boolean;
    notification: boolean;
    vibration: boolean;
    touchscreen: boolean;
    speechRecognition: boolean;
    speechSynthesis: boolean;
  };
  
  // Network and connection
  network: {
    connectionType?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
  
  // Storage capabilities
  storage: {
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webSQL: boolean;
    quota?: number;
  };
  
  // Security and privacy
  privacy: {
    incognitoMode: boolean;
    adBlocker: boolean;
    jsEnabled: boolean;
    flashEnabled: boolean;
  };
  
  // Behavioral indicators
  behavioral: {
    mouseMovements: number[];
    keyboardDynamics: number[];
    scrollPattern: number[];
    clickTiming: number[];
  };
}

export class AdvancedFingerprintCollector {
  private fingerprint: Partial<AdvancedFingerprint> = {};
  
  constructor() {
    this.initializeFingerprinting();
  }
  
  private async initializeFingerprinting(): Promise<void> {
    await this.collectBasicFingerprint();
    await this.collectCanvasFingerprint();
    await this.collectWebGLFingerprint();
    await this.collectAudioFingerprint();
    await this.collectDeviceCharacteristics();
    await this.collectBrowserEnvironment();
    await this.collectHardwareInfo();
    await this.collectPerformanceData();
    await this.collectFeatureDetection();
    await this.collectNetworkInfo();
    await this.collectStorageInfo();
    await this.collectPrivacyIndicators();
    this.initializeBehavioralTracking();
  }
  
  private async collectBasicFingerprint(): Promise<void> {
    // Generate fingerprint using multiple browser characteristics
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      navigator.hardwareConcurrency,
      new Date().getTimezoneOffset(),
      navigator.platform
    ];
    
    this.fingerprint.fingerprintId = this.hashString(components.join('|'));
    this.fingerprint.clientId = this.generateClientId();
  }
  
  private async collectCanvasFingerprint(): Promise<void> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        this.fingerprint.canvasFingerprint = 'unsupported';
        return;
      }
      
      canvas.width = 200;
      canvas.height = 50;
      
      // Draw complex patterns for fingerprinting
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Canvas fingerprint 🎨', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Advanced tracking', 4, 35);
      
      // Add geometric shapes
      ctx.strokeStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(75, 25, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      this.fingerprint.canvasFingerprint = this.hashString(canvas.toDataURL());
    } catch (error) {
      this.fingerprint.canvasFingerprint = 'error';
    }
  }
  
  private async collectWebGLFingerprint(): Promise<void> {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
      
      if (!gl) {
        this.fingerprint.webglFingerprint = 'unsupported';
        return;
      }
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
      
      this.fingerprint.webglFingerprint = `${vendor}|${renderer}`;
    } catch (error) {
      this.fingerprint.webglFingerprint = 'error';
    }
  }
  
  private async collectAudioFingerprint(): Promise<void> {
    try {
      // Check if user gesture is required
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        // Audio context requires user gesture, skip audio fingerprinting
        this.fingerprint.audioFingerprint = 'suspended';
        return;
      }
      
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);
      
      // Set gain to 0 to avoid audio output
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      
      oscillator.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Use analyser instead of deprecated ScriptProcessorNode
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      oscillator.start(0);
      
      // Collect frequency data after a short delay
      setTimeout(() => {
        analyser.getByteFrequencyData(dataArray);
        const audioData = Array.from(dataArray.slice(0, 100));
        this.fingerprint.audioFingerprint = this.hashArray(audioData);
        
        oscillator.stop();
        audioContext.close();
      }, 100);
      
      // Fallback timeout
      setTimeout(() => {
        if (!this.fingerprint.audioFingerprint) {
          this.fingerprint.audioFingerprint = 'timeout';
          try {
            oscillator.stop();
            audioContext.close();
          } catch (e) {
            // Ignore cleanup errors
          }
        }
      }, 1000);
      
    } catch (error) {
      console.warn('Audio fingerprinting failed:', error);
      this.fingerprint.audioFingerprint = 'unsupported';
    }
  }
  
  private async collectDeviceCharacteristics(): Promise<void> {
    this.fingerprint.screen = {
      resolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      orientation: screen.orientation?.type || 'unknown'
    };
  }
  
  private async collectBrowserEnvironment(): Promise<void> {
    this.fingerprint.browser = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: Array.from(navigator.languages),
      plugins: Array.from(navigator.plugins).map(p => p.name),
      mimeTypes: Array.from(navigator.mimeTypes).map(m => m.type),
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack
    };
  }
  
  private async collectHardwareInfo(): Promise<void> {
    this.fingerprint.hardware = {
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      maxTouchPoints: navigator.maxTouchPoints,
      platform: navigator.platform,
      architecture: (navigator as any).userAgentData?.platform
    };
  }
  
  private async collectPerformanceData(): Promise<void> {
    this.fingerprint.performance = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      performanceMemory: (performance as any).memory,
      renderingEngine: this.detectRenderingEngine()
    };
  }
  
  private async collectFeatureDetection(): Promise<void> {
    this.fingerprint.features = {
      webgl: this.supportsWebGL(),
      webrtc: this.supportsWebRTC(),
      webassembly: this.supportsWebAssembly(),
      webworkers: typeof Worker !== 'undefined',
      indexeddb: 'indexedDB' in window,
      websockets: 'WebSocket' in window,
      geolocation: 'geolocation' in navigator,
      notification: 'Notification' in window,
      vibration: 'vibrate' in navigator,
      touchscreen: 'ontouchstart' in window,
      speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      speechSynthesis: 'speechSynthesis' in window
    };
  }
  
  private async collectNetworkInfo(): Promise<void> {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    this.fingerprint.network = {
      connectionType: connection?.type,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      saveData: connection?.saveData
    };
  }
  
  private async collectStorageInfo(): Promise<void> {
    this.fingerprint.storage = {
      localStorage: this.supportsLocalStorage(),
      sessionStorage: this.supportsSessionStorage(),
      indexedDB: 'indexedDB' in window,
      webSQL: 'openDatabase' in window,
      quota: await this.getStorageQuota()
    };
  }
  
  private async collectPrivacyIndicators(): Promise<void> {
    this.fingerprint.privacy = {
      incognitoMode: await this.detectIncognitoMode(),
      adBlocker: this.detectAdBlocker(),
      jsEnabled: true, // Obviously true if this runs
      flashEnabled: this.supportsFlash()
    };
  }
  
  private initializeBehavioralTracking(): void {
    this.fingerprint.behavioral = {
      mouseMovements: [],
      keyboardDynamics: [],
      scrollPattern: [],
      clickTiming: []
    };
    
    // Track mouse movements (limited for privacy)
    let mouseMovements: number[] = [];
    const mouseHandler = (e: MouseEvent) => {
      if (mouseMovements.length < 10) {
        mouseMovements.push(e.clientX, e.clientY);
      }
    };
    document.addEventListener('mousemove', mouseHandler, { passive: true });
    
    // Track scroll patterns
    let scrollTimes: number[] = [];
    const scrollHandler = () => {
      if (scrollTimes.length < 5) {
        scrollTimes.push(Date.now());
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Store behavioral data after 5 seconds
    setTimeout(() => {
      this.fingerprint.behavioral!.mouseMovements = mouseMovements;
      this.fingerprint.behavioral!.scrollPattern = scrollTimes;
      document.removeEventListener('mousemove', mouseHandler);
      window.removeEventListener('scroll', scrollHandler);
    }, 5000);
  }
  
  // Utility methods
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  private hashArray(arr: number[]): string {
    return this.hashString(arr.slice(0, 100).join(''));
  }
  
  private supportsWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }
  
  private supportsWebRTC(): boolean {
    return !!(window as any).RTCPeerConnection || !!(window as any).mozRTCPeerConnection || !!(window as any).webkitRTCPeerConnection;
  }
  
  private supportsWebAssembly(): boolean {
    return typeof WebAssembly === 'object';
  }
  
  private supportsLocalStorage(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
  
  private supportsSessionStorage(): boolean {
    try {
      const test = 'test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
  
  private async getStorageQuota(): Promise<number | undefined> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return estimate.quota;
      }
    } catch {
      // Ignore
    }
    return undefined;
  }
  
  private async detectIncognitoMode(): Promise<boolean> {
    try {
      // Multiple detection methods
      const methods = [
        this.detectIncognitoViaStorage(),
        this.detectIncognitoViaQuota(),
        this.detectIncognitoViaIndexedDB()
      ];
      
      const results = await Promise.all(methods);
      return results.some(result => result);
    } catch {
      return false;
    }
  }
  
  private async detectIncognitoViaStorage(): Promise<boolean> {
    try {
      const estimate = await navigator.storage.estimate();
      return estimate.quota !== undefined && estimate.quota < 120000000; // Less than ~120MB
    } catch {
      return false;
    }
  }
  
  private async detectIncognitoViaQuota(): Promise<boolean> {
    try {
      if ('webkitTemporaryStorage' in navigator) {
        return new Promise((resolve) => {
          (navigator as any).webkitTemporaryStorage.queryUsageAndQuota(
            (usage: number, quota: number) => resolve(quota < 120000000),
            () => resolve(false)
          );
        });
      }
    } catch {
      // Ignore
    }
    return false;
  }
  
  private async detectIncognitoViaIndexedDB(): Promise<boolean> {
    try {
      if (!('indexedDB' in window)) return false;
      
      return new Promise((resolve) => {
        const db = indexedDB.open('test');
        db.onerror = () => resolve(true); // Error suggests incognito
        db.onsuccess = () => {
          db.result.close();
          resolve(false);
        };
      });
    } catch {
      return true;
    }
  }
  
  private detectAdBlocker(): boolean {
    // Simple ad blocker detection
    const testElement = document.createElement('div');
    testElement.innerHTML = '&nbsp;';
    testElement.className = 'adsbox';
    testElement.style.position = 'absolute';
    testElement.style.left = '-999px';
    document.body.appendChild(testElement);
    
    const isBlocked = testElement.offsetHeight === 0;
    document.body.removeChild(testElement);
    
    return isBlocked;
  }
  
  private supportsFlash(): boolean {
    try {
      if (navigator.plugins) {
        for (let i = 0; i < navigator.plugins.length; i++) {
          if (navigator.plugins[i].name.includes('Flash')) {
            return true;
          }
        }
      }
      return false;
    } catch {
      return false;
    }
  }
  
  private detectRenderingEngine(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Gecko/')) return 'Gecko';
    if (ua.includes('WebKit/')) return 'WebKit';
    if (ua.includes('Presto/')) return 'Presto';
    if (ua.includes('Trident/')) return 'Trident';
    return 'Unknown';
  }
  
  public async getFingerprint(): Promise<AdvancedFingerprint> {
    // Wait for all fingerprinting to complete
    await new Promise(resolve => setTimeout(resolve, 6000));
    return this.fingerprint as AdvancedFingerprint;
  }
  
  public getFingerprintSync(): Partial<AdvancedFingerprint> {
    return { ...this.fingerprint };
  }
  
  public generateUniqueId(): string {
    const fp = this.getFingerprintSync();
    const components = [
      fp.fingerprintId || 'unknown',
      fp.canvasFingerprint || 'unknown',
      fp.webglFingerprint || 'unknown',
      fp.screen?.resolution || 'unknown',
      fp.browser?.userAgent || 'unknown',
      fp.hardware?.hardwareConcurrency || 'unknown'
    ];
    
    return this.hashString(components.join('|'));
  }
  
  // Enhanced user classification based on advanced fingerprinting
  public classifyUser(): {
    userType: 'developer' | 'recruiter' | 'client' | 'job_seeker' | 'bot' | 'unknown';
    confidence: number;
    indicators: string[];
  } {
    const fp = this.getFingerprintSync();
    const indicators: string[] = [];
    let score = { developer: 0, recruiter: 0, client: 0, job_seeker: 0, bot: 0 };
    
    // Developer indicators
    if (fp.features?.webgl && fp.features?.webassembly && fp.features?.webworkers) {
      score.developer += 0.3;
      indicators.push('Advanced browser features');
    }
    
    if (fp.hardware && fp.hardware.hardwareConcurrency > 4) {
      score.developer += 0.2;
      score.client += 0.1;
      indicators.push('High-performance hardware');
    }
    
    if (fp.privacy?.adBlocker) {
      score.developer += 0.2;
      indicators.push('Ad blocker detected');
    }
    
    // Bot indicators
    if (!fp.behavioral?.mouseMovements?.length && !fp.behavioral?.scrollPattern?.length) {
      score.bot += 0.5;
      indicators.push('No human behavior detected');
    }
    
    if (fp.browser?.plugins?.length === 0) {
      score.bot += 0.3;
      indicators.push('No browser plugins');
    }
    
    if (fp.features && !fp.features.touchscreen && !fp.features.notification) {
      score.bot += 0.2;
      indicators.push('Limited interaction features');
    }
    
    // Business/Client indicators
    if (fp.network?.effectiveType && ['4g', '5g'].includes(fp.network.effectiveType)) {
      score.client += 0.1;
      score.recruiter += 0.1;
      indicators.push('High-speed connection');
    }
    
    if (fp.hardware?.deviceMemory && fp.hardware.deviceMemory >= 8) {
      score.client += 0.2;
      score.developer += 0.1;
      indicators.push('High memory device');
    }
    
    // Mobile indicators (job seekers often use mobile)
    if (fp.features?.touchscreen && fp.hardware?.maxTouchPoints && fp.hardware.maxTouchPoints > 0) {
      score.job_seeker += 0.2;
      indicators.push('Mobile/touch device');
    }
    
    // Determine winner
    const maxScore = Math.max(...Object.values(score));
    const userType = Object.keys(score).find(key => score[key as keyof typeof score] === maxScore) as any || 'unknown';
    
    return {
      userType: maxScore > 0.3 ? userType : 'unknown',
      confidence: Math.min(maxScore, 1),
      indicators
    };
  }
}

// Singleton instance
export const advancedFingerprinter = new AdvancedFingerprintCollector(); 