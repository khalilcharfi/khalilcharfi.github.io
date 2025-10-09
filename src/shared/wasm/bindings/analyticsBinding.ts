// TypeScript binding for WASM Analytics Engine
import { WASMLoader } from '../loaders/wasmLoader';
import type { VisitorEvent, SessionData, VisitorBehavior } from '../types';

export class AnalyticsBinding {
  private engine: any = null;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await WASMLoader.loadWASM();
    this.engine = WASMLoader.getAnalyticsEngine();
  }

  /**
   * Track an event
   */
  async trackEvent(eventType: string, data: string): Promise<void> {
    if (!this.engine) {
      console.warn('Analytics engine not available');
      return;
    }

    try {
      this.engine.track_event(eventType, data);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  /**
   * Update scroll depth
   */
  async updateScrollDepth(depth: number): Promise<void> {
    if (!this.engine) {
      console.warn('Analytics engine not available');
      return;
    }

    try {
      this.engine.update_scroll_depth(depth);
    } catch (error) {
      console.error('Error updating scroll depth:', error);
    }
  }

  /**
   * Get engagement score
   */
  async getEngagementScore(): Promise<number> {
    if (!this.engine) {
      console.warn('Analytics engine not available');
      return 0;
    }

    try {
      return this.engine.get_engagement_score();
    } catch (error) {
      console.error('Error getting engagement score:', error);
      return 0;
    }
  }

  /**
   * Classify visitor behavior
   */
  async classifyVisitorBehavior(): Promise<string> {
    if (!this.engine) {
      console.warn('Analytics engine not available');
      return 'unknown';
    }

    try {
      return this.engine.classify_visitor_behavior();
    } catch (error) {
      console.error('Error classifying visitor behavior:', error);
      return 'unknown';
    }
  }

  /**
   * Get session data
   */
  async getSessionData(): Promise<SessionData | null> {
    if (!this.engine) {
      console.warn('Analytics engine not available');
      return null;
    }

    try {
      return this.engine.get_session_data();
    } catch (error) {
      console.error('Error getting session data:', error);
      return null;
    }
  }

  /**
   * Get comprehensive visitor behavior analysis
   */
  async getVisitorBehavior(): Promise<VisitorBehavior | null> {
    if (!this.engine) {
      console.warn('Analytics engine not available');
      return null;
    }

    try {
      const type = await this.classifyVisitorBehavior();
      const engagementScore = await this.getEngagementScore();
      const sessionData = await this.getSessionData();
      
      return {
        type,
        confidence: 0.8, // Default confidence
        engagement_score: engagementScore,
        session_duration: sessionData?.time_on_page || 0
      };
    } catch (error) {
      console.error('Error getting visitor behavior:', error);
      return null;
    }
  }

  /**
   * Check if analytics engine is available
   */
  isAvailable(): boolean {
    return this.engine !== null;
  }
}
