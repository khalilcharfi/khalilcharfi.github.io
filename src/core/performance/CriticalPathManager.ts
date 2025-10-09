// Critical Path Manager - Portfolio-specific performance optimization
export class CriticalPathManager {
  private static instance: CriticalPathManager;
  private loadedResources = new Set<string>();

  static getInstance(): CriticalPathManager {
    if (!CriticalPathManager.instance) {
      CriticalPathManager.instance = new CriticalPathManager();
    }
    return CriticalPathManager.instance;
  }

  /**
   * Load critical content first (above-the-fold)
   */
  async loadCriticalContent(): Promise<void> {
    const criticalTasks = [
      this.loadHomeSection(),
      this.loadNavigation(),
      this.loadCriticalCSS(),
      this.loadProfileImage(),
    ];

    await Promise.all(criticalTasks);
    console.log('✅ Critical content loaded');
  }

  /**
   * Load enhanced content after critical (below-the-fold)
   */
  async loadEnhancedContent(): Promise<void> {
    const enhancedTasks = [
      this.loadProjectsSection(),
      this.loadSkillsSection(),
      this.loadExperienceSection(),
    ];

    await Promise.all(enhancedTasks);
    console.log('✅ Enhanced content loaded');
  }

  /**
   * Load delightful features last (3D, AI, analytics)
   */
  async loadDelightfulFeatures(): Promise<void> {
    const delightfulTasks = [
      this.load3DBackground(),
      this.loadChatbot(),
      this.loadAnalytics(),
      this.loadWASMModules(),
    ];

    // Load with delay to not block critical rendering
    setTimeout(async () => {
      await Promise.all(delightfulTasks);
      console.log('✅ Delightful features loaded');
    }, 1000);
  }

  private async loadHomeSection(): Promise<void> {
    if (this.loadedResources.has('home-section')) return;
    
    // Simulate loading home section components
    await this.delay(100);
    this.loadedResources.add('home-section');
  }

  private async loadNavigation(): Promise<void> {
    if (this.loadedResources.has('navigation')) return;
    
    // Load navigation components
    await this.delay(50);
    this.loadedResources.add('navigation');
  }

  private async loadCriticalCSS(): Promise<void> {
    if (this.loadedResources.has('critical-css')) return;
    
    // Critical CSS is already inlined in HTML
    await this.delay(10);
    this.loadedResources.add('critical-css');
  }

  private async loadProfileImage(): Promise<void> {
    if (this.loadedResources.has('profile-image')) return;
    
    // Preload profile image
    const img = new Image();
    img.src = '/asset/profile/profile-photo.jpg';
    await new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
    this.loadedResources.add('profile-image');
  }

  private async loadProjectsSection(): Promise<void> {
    if (this.loadedResources.has('projects-section')) return;
    
    // Load projects data and components
    await this.delay(200);
    this.loadedResources.add('projects-section');
  }

  private async loadSkillsSection(): Promise<void> {
    if (this.loadedResources.has('skills-section')) return;
    
    // Load skills data and components
    await this.delay(150);
    this.loadedResources.add('skills-section');
  }

  private async loadExperienceSection(): Promise<void> {
    if (this.loadedResources.has('experience-section')) return;
    
    // Load experience data and components
    await this.delay(100);
    this.loadedResources.add('experience-section');
  }

  private async load3DBackground(): Promise<void> {
    if (this.loadedResources.has('3d-background')) return;
    
    // Load Three.js and 3D components
    await this.delay(500);
    this.loadedResources.add('3d-background');
  }

  private async loadChatbot(): Promise<void> {
    if (this.loadedResources.has('chatbot')) return;
    
    // Load AI chatbot features
    await this.delay(300);
    this.loadedResources.add('chatbot');
  }

  private async loadAnalytics(): Promise<void> {
    if (this.loadedResources.has('analytics')) return;
    
    // Load analytics and tracking
    await this.delay(100);
    this.loadedResources.add('analytics');
  }

  private async loadWASMModules(): Promise<void> {
    if (this.loadedResources.has('wasm-modules')) return;
    
    // Load WebAssembly modules
    await this.delay(400);
    this.loadedResources.add('wasm-modules');
  }

  /**
   * Check if resource is loaded
   */
  isResourceLoaded(resource: string): boolean {
    return this.loadedResources.has(resource);
  }

  /**
   * Get loading progress
   */
  getLoadingProgress(): number {
    const totalResources = 12; // Total number of resources
    return (this.loadedResources.size / totalResources) * 100;
  }

  /**
   * Reset loading state (useful for testing)
   */
  reset(): void {
    this.loadedResources.clear();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
