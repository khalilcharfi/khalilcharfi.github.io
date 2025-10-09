// WASM Analytics Engine Types
export interface AnalyticsEngine {
  track_event(event_type: string, data: string): void;
  update_scroll_depth(depth: number): void;
  get_engagement_score(): number;
  classify_visitor_behavior(): string;
  get_session_data(): SessionData;
}

export interface VisitorEvent {
  event_type: string;
  timestamp: number;
  data: string;
}

export interface SessionData {
  events: VisitorEvent[];
  session_start: number;
  interaction_count: number;
  scroll_depth: number;
  time_on_page: number;
}

export interface VisitorBehavior {
  type: string;
  confidence: number;
  engagement_score: number;
  session_duration: number;
}
