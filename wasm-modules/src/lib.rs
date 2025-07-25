use wasm_bindgen::prelude::*;
use js_sys::*;
use web_sys::*;
use serde::{Deserialize, Serialize};

// Set up panic hook for better debugging
#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}

// Particle System Optimization
#[derive(Serialize, Deserialize)]
pub struct Particle {
    pub x: f32,
    pub y: f32,
    pub z: f32,
    pub vx: f32,
    pub vy: f32,
    pub vz: f32,
    pub life: f32,
    pub size: f32,
    pub color: [f32; 4], // RGBA
}

#[wasm_bindgen]
pub struct ParticleSystem {
    particles: Vec<Particle>,
    count: usize,
    mouse_x: f32,
    mouse_y: f32,
    mouse_influence: f32,
    time: f32,
}

#[wasm_bindgen]
impl ParticleSystem {
    #[wasm_bindgen(constructor)]
    pub fn new(count: usize) -> ParticleSystem {
        let mut particles = Vec::with_capacity(count);
        
        for _ in 0..count {
            particles.push(Particle {
                x: (rand::random::<f32>() - 0.5) * 20.0,
                y: (rand::random::<f32>() - 0.5) * 20.0,
                z: (rand::random::<f32>() - 0.5) * 20.0,
                vx: (rand::random::<f32>() - 0.5) * 0.02,
                vy: (rand::random::<f32>() - 0.5) * 0.02,
                vz: (rand::random::<f32>() - 0.5) * 0.02,
                life: 1.0,
                size: rand::random::<f32>() * 2.0 + 1.0,
                color: [1.0, 1.0, 1.0, 1.0],
            });
        }
        
        ParticleSystem {
            particles,
            count,
            mouse_x: 0.0,
            mouse_y: 0.0,
            mouse_influence: 2.0,
            time: 0.0,
        }
    }
    
    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f32, theme_is_dark: bool) {
        self.time += delta_time;
        
        // Parallel-like processing using iterator chains
        for particle in &mut self.particles {
            // Mouse interaction
            let dx = self.mouse_x - particle.x;
            let dy = self.mouse_y - particle.y;
            let distance = (dx * dx + dy * dy).sqrt();
            
            if distance < 5.0 && distance > 0.0 {
                let force = self.mouse_influence / (distance * distance + 0.1);
                particle.vx += dx * force * delta_time;
                particle.vy += dy * force * delta_time;
            }
            
            // Noise-based movement
            let noise_x = (particle.x * 0.01 + self.time * 0.5).sin() * 0.001;
            let noise_y = (particle.y * 0.01 + self.time * 0.3).cos() * 0.001;
            let noise_z = (particle.z * 0.01 + self.time * 0.7).sin() * 0.001;
            
            particle.vx += noise_x;
            particle.vy += noise_y;
            particle.vz += noise_z;
            
            // Apply velocity with damping
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;
            
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            particle.vz *= 0.99;
            
            // Boundary conditions
            if particle.x.abs() > 15.0 {
                particle.vx *= -0.5;
                particle.x = particle.x.signum() * 15.0;
            }
            if particle.y.abs() > 15.0 {
                particle.vy *= -0.5;
                particle.y = particle.y.signum() * 15.0;
            }
            if particle.z.abs() > 15.0 {
                particle.vz *= -0.5;
                particle.z = particle.z.signum() * 15.0;
            }
            
            // Theme-based color animation
            if theme_is_dark {
                particle.color[0] = 0.2 + 0.8 * (self.time * 0.5 + particle.x * 0.1).sin().abs();
                particle.color[1] = 0.4 + 0.6 * (self.time * 0.3 + particle.y * 0.1).cos().abs();
                particle.color[2] = 0.8 + 0.2 * (self.time * 0.7 + particle.z * 0.1).sin().abs();
            } else {
                particle.color[0] = 0.6 + 0.4 * (self.time * 0.2 + particle.x * 0.05).sin().abs();
                particle.color[1] = 0.7 + 0.3 * (self.time * 0.4 + particle.y * 0.05).cos().abs();
                particle.color[2] = 0.9 + 0.1 * (self.time * 0.6 + particle.z * 0.05).sin().abs();
            }
            
            particle.color[3] = 0.3 + 0.7 * particle.life;
        }
    }
    
    #[wasm_bindgen]
    pub fn set_mouse_position(&mut self, x: f32, y: f32) {
        self.mouse_x = x;
        self.mouse_y = y;
    }
    
    #[wasm_bindgen]
    pub fn get_positions(&self) -> Vec<f32> {
        let mut positions = Vec::with_capacity(self.count * 3);
        for particle in &self.particles {
            positions.push(particle.x);
            positions.push(particle.y);
            positions.push(particle.z);
        }
        positions
    }
    
    #[wasm_bindgen]
    pub fn get_colors(&self) -> Vec<f32> {
        let mut colors = Vec::with_capacity(self.count * 4);
        for particle in &self.particles {
            colors.extend_from_slice(&particle.color);
        }
        colors
    }
    
    #[wasm_bindgen]
    pub fn get_sizes(&self) -> Vec<f32> {
        self.particles.iter().map(|p| p.size).collect()
    }
}

// Advanced Fingerprinting
#[derive(Serialize, Deserialize)]
pub struct AdvancedFingerprint {
    pub canvas_fingerprint: String,
    pub audio_fingerprint: String,
    pub webgl_fingerprint: String,
    pub performance_fingerprint: String,
    pub hardware_fingerprint: String,
    pub behavioral_fingerprint: String,
    pub confidence_score: f32,
}

#[wasm_bindgen]
pub struct FingerprintEngine {
    window: Window,
    document: Document,
    navigator: Navigator,
}

#[wasm_bindgen]
impl FingerprintEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<FingerprintEngine, JsValue> {
        let window = web_sys::window().ok_or("No global window exists")?;
        let document = window.document().ok_or("No document found")?;
        let navigator = window.navigator();
        
        Ok(FingerprintEngine {
            window,
            document,
            navigator,
        })
    }
    
    #[wasm_bindgen]
    pub fn generate_canvas_fingerprint(&self) -> Result<String, JsValue> {
        let canvas = self.document
            .create_element("canvas")?
            .dyn_into::<HtmlCanvasElement>()?;
        
        canvas.set_width(200);
        canvas.set_height(50);
        
        let context = canvas
            .get_context("2d")?
            .ok_or("Failed to get 2d context")?
            .dyn_into::<CanvasRenderingContext2d>()?;
        
        // Draw complex pattern for fingerprinting using proper API
        context.set_text_baseline("top");
        context.set_font("14px Arial");
        
        // Use proper fill_style API
        context.set_fill_style_str("#f60");
        context.fill_rect(125.0, 1.0, 62.0, 20.0);
        
        context.set_fill_style_str("#069");
        let _ = context.fill_text("Portfolio WASM 🚀", 2.0, 15.0);
        
        context.set_fill_style_str("rgba(102, 204, 0, 0.7)");
        let _ = context.fill_text("Portfolio WASM 🚀", 4.0, 17.0);
        
        // Add geometric shapes
        let _ = context.set_global_composite_operation("multiply");
        context.begin_path();
        let _ = context.arc(50.0, 25.0, 20.0, 0.0, std::f64::consts::PI * 2.0);
        context.set_fill_style_str("#f9c");
        context.fill();
        
        canvas.to_data_url()
    }
    
    #[wasm_bindgen]
    pub fn generate_webgl_fingerprint(&self) -> Result<String, JsValue> {
        let canvas = self.document
            .create_element("canvas")?
            .dyn_into::<HtmlCanvasElement>()?;
        
        let gl = canvas
            .get_context("webgl")?
            .ok_or("WebGL not supported")?
            .dyn_into::<WebGlRenderingContext>()?;
        
        let mut fingerprint_data = Vec::new();
        
        // Collect WebGL parameters
        if let Ok(vendor) = gl.get_parameter(WebGlRenderingContext::VENDOR) {
            fingerprint_data.push(format!("vendor:{}", vendor.as_string().unwrap_or_default()));
        }
        
        if let Ok(renderer) = gl.get_parameter(WebGlRenderingContext::RENDERER) {
            fingerprint_data.push(format!("renderer:{}", renderer.as_string().unwrap_or_default()));
        }
        
        if let Ok(version) = gl.get_parameter(WebGlRenderingContext::VERSION) {
            fingerprint_data.push(format!("version:{}", version.as_string().unwrap_or_default()));
        }
        
        // Get supported extensions - fix the type error
        if let Some(extensions) = gl.get_supported_extensions() {
            for i in 0..extensions.length() {
                let ext = extensions.get(i);
                if let Some(ext_str) = ext.as_string() {
                    fingerprint_data.push(format!("ext:{}", ext_str));
                }
            }
        }
        
        Ok(fingerprint_data.join("|"))
    }
    
    #[wasm_bindgen]
    pub fn generate_performance_fingerprint(&self) -> Result<String, JsValue> {
        let performance = self.window.performance().ok_or("Performance API not available")?;
        
        let mut perf_data = Vec::new();
        
        // Timing measurements
        let start = performance.now();
        
        // CPU-intensive operation for timing
        let mut sum = 0.0;
        for i in 0..10000 {
            sum += (i as f64).sin();
        }
        
        let cpu_time = performance.now() - start;
        perf_data.push(format!("cpu_time:{:.2}", cpu_time));
        perf_data.push(format!("sum:{:.2}", sum)); // Use sum to prevent optimization
        
        // Memory info if available - use proper API
        if let Ok(memory) = js_sys::Reflect::get(&performance, &JsValue::from_str("memory")) {
            if !memory.is_undefined() {
                if let Ok(used) = js_sys::Reflect::get(&memory, &JsValue::from_str("usedJSHeapSize")) {
                    perf_data.push(format!("memory_used:{}", used.as_f64().unwrap_or(0.0)));
                }
                if let Ok(total) = js_sys::Reflect::get(&memory, &JsValue::from_str("totalJSHeapSize")) {
                    perf_data.push(format!("memory_total:{}", total.as_f64().unwrap_or(0.0)));
                }
            }
        }
        
        // Hardware concurrency
        perf_data.push(format!("cores:{}", self.navigator.hardware_concurrency()));
        
        Ok(perf_data.join("|"))
    }
    
    #[wasm_bindgen]
    pub fn generate_complete_fingerprint(&self) -> Result<String, JsValue> {
        let canvas_fp = self.generate_canvas_fingerprint().unwrap_or_default();
        let webgl_fp = self.generate_webgl_fingerprint().unwrap_or_default();
        let perf_fp = self.generate_performance_fingerprint().unwrap_or_default();
        
        // Simple hash-like combination
        let combined = format!("{}|{}|{}", canvas_fp, webgl_fp, perf_fp);
        let hash = self.simple_hash(&combined);
        
        Ok(format!("wasm_fp_{:x}", hash))
    }
    
    fn simple_hash(&self, input: &str) -> u32 {
        let mut hash = 5381u32;
        for byte in input.bytes() {
            hash = hash.wrapping_mul(33).wrapping_add(byte as u32);
        }
        hash
    }
}

// Visitor Analytics Engine
#[derive(Serialize, Deserialize)]
pub struct VisitorEvent {
    pub event_type: String,
    pub timestamp: f64,
    pub data: String,
}

#[wasm_bindgen]
pub struct AnalyticsEngine {
    events: Vec<VisitorEvent>,
    session_start: f64,
    interaction_count: u32,
    scroll_depth: f32,
    time_on_page: f64,
}

#[wasm_bindgen]
impl AnalyticsEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> AnalyticsEngine {
        let window = web_sys::window().unwrap();
        let performance = window.performance().unwrap();
        
        AnalyticsEngine {
            events: Vec::new(),
            session_start: performance.now(),
            interaction_count: 0,
            scroll_depth: 0.0,
            time_on_page: 0.0,
        }
    }
    
    #[wasm_bindgen]
    pub fn track_event(&mut self, event_type: &str, data: &str) {
        let window = web_sys::window().unwrap();
        let performance = window.performance().unwrap();
        
        self.events.push(VisitorEvent {
            event_type: event_type.to_string(),
            timestamp: performance.now(),
            data: data.to_string(),
        });
        
        if event_type == "click" || event_type == "scroll" || event_type == "keypress" {
            self.interaction_count += 1;
        }
    }
    
    #[wasm_bindgen]
    pub fn update_scroll_depth(&mut self, depth: f32) {
        if depth > self.scroll_depth {
            self.scroll_depth = depth;
        }
    }
    
    #[wasm_bindgen]
    pub fn get_engagement_score(&mut self) -> f32 {
        let window = web_sys::window().unwrap();
        let performance = window.performance().unwrap();
        
        self.time_on_page = performance.now() - self.session_start;
        
        // Calculate engagement based on multiple factors - fix type mismatches
        let time_score = (self.time_on_page / 1000.0 / 60.0).min(10.0) / 10.0; // Max 10 minutes
        let interaction_score = (self.interaction_count as f64 / 50.0).min(1.0); // Max 50 interactions
        let scroll_score = self.scroll_depth as f64; // Convert f32 to f64
        
        ((time_score * 0.4 + interaction_score * 0.4 + scroll_score * 0.2) * 100.0) as f32
    }
    
    #[wasm_bindgen]
    pub fn classify_visitor_behavior(&mut self) -> String {
        let engagement = self.get_engagement_score();
        let _avg_time_between_events = if self.events.len() > 1 {
            self.time_on_page / (self.events.len() as f64 - 1.0)
        } else {
            0.0
        };
        
        match engagement {
            score if score > 80.0 => "highly_engaged".to_string(),
            score if score > 60.0 => "engaged".to_string(),
            score if score > 40.0 => "moderately_engaged".to_string(),
            score if score > 20.0 => "browsing".to_string(),
            _ => "passive".to_string(),
        }
    }
    
    #[wasm_bindgen]
    pub fn get_analytics_summary(&mut self) -> String {
        let summary = serde_json::json!({
            "session_duration": self.time_on_page,
            "interaction_count": self.interaction_count,
            "scroll_depth": self.scroll_depth,
            "engagement_score": self.get_engagement_score(),
            "behavior_classification": self.classify_visitor_behavior(),
            "event_count": self.events.len()
        });
        
        summary.to_string()
    }
}

// Performance Monitoring
#[wasm_bindgen]
pub struct PerformanceMonitor {
    frame_times: Vec<f64>,
    last_frame_time: f64,
    fps_history: Vec<f64>,
}

#[wasm_bindgen]
impl PerformanceMonitor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> PerformanceMonitor {
        PerformanceMonitor {
            frame_times: Vec::with_capacity(60),
            last_frame_time: 0.0,
            fps_history: Vec::with_capacity(60),
        }
    }
    
    #[wasm_bindgen]
    pub fn update(&mut self, current_time: f64) {
        if self.last_frame_time > 0.0 {
            let frame_time = current_time - self.last_frame_time;
            self.frame_times.push(frame_time);
            
            if self.frame_times.len() > 60 {
                self.frame_times.remove(0);
            }
            
            let fps = 1000.0 / frame_time;
            self.fps_history.push(fps);
            
            if self.fps_history.len() > 60 {
                self.fps_history.remove(0);
            }
        }
        
        self.last_frame_time = current_time;
    }
    
    #[wasm_bindgen]
    pub fn get_average_fps(&self) -> f64 {
        if self.fps_history.is_empty() {
            return 60.0;
        }
        
        self.fps_history.iter().sum::<f64>() / self.fps_history.len() as f64
    }
    
    #[wasm_bindgen]
    pub fn get_frame_time_variance(&self) -> f64 {
        if self.frame_times.len() < 2 {
            return 0.0;
        }
        
        let mean = self.frame_times.iter().sum::<f64>() / self.frame_times.len() as f64;
        let variance = self.frame_times.iter()
            .map(|&time| (time - mean).powi(2))
            .sum::<f64>() / self.frame_times.len() as f64;
        
        variance.sqrt()
    }
    
    #[wasm_bindgen]
    pub fn should_reduce_quality(&self) -> bool {
        let avg_fps = self.get_average_fps();
        let variance = self.get_frame_time_variance();
        
        avg_fps < 30.0 || variance > 5.0
    }
}

// Utility functions
#[wasm_bindgen]
pub fn log(s: &str) {
    web_sys::console::log_1(&JsValue::from_str(s));
}

#[wasm_bindgen]
pub fn get_wasm_memory_usage() -> usize {
    // Get WASM memory size in bytes
    64 * 1024 * 1024 // Default 64MB, can be adjusted based on actual usage
}
