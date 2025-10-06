// List of personas/visitor profiles and whether they are enabled.
// Set a value to false to globally disable that profile without touching logic elsewhere.
// This file can be imported wherever persona-specific behaviour is needed.

// ------- Build-time control via env vars ------------------------------------
// 1. VITE_ENABLED_PERSONAS  – comma-separated list (e.g. "general_visitor,recruiter")
// 2. VITE_DISABLED_PERSONAS – comma-separated list to explicitly switch off
//    (takes precedence over ENABLED_PERSONAS).
// If neither env var is defined, uses DEFAULT_ENABLED_PERSONAS below.
// 
// FALLBACK: 'general_visitor' is ALWAYS enabled as a safety fallback unless
// explicitly disabled via VITE_DISABLED_PERSONAS.
// ---------------------------------------------------------------------------

const ALL_PERSONAS = [
  // Professional / Recruitment
  'recruiter',
  'hr_manager',
  'technical_lead',
  'c_level_executive',
  'agency_recruiter',

  // Business / Client
  'startup_founder',
  'product_manager',
  'project_manager',
  'business_owner',
  'enterprise_client',

  // Geographic / Local
  'local_business',
  'remote_work_advocate',
  'international_client',
  'local_tech_community',

  // Developer / Technical
  'software_developer',
  'peer_developer',

  // General
  'general_visitor',
  'returning_visitor',
  'potential_collaborator',
] as const;

type Persona = typeof ALL_PERSONAS[number];

// ============================================================================
// CONFIGURATION: Default enabled personas (when no env vars are set)
// Edit this array to control which personas are enabled by default
// ============================================================================
const DEFAULT_ENABLED_PERSONAS: readonly Persona[] = [
  'general_visitor',
  'returning_visitor',
  'software_developer',
  'recruiter',
  'hr_manager',
  'agency_recruiter',
] as const;
// ============================================================================

const parseCsv = (value: string | undefined): Set<Persona> => {
  if (!value) return new Set();
  return new Set(value.split(',').map(s => s.trim()) as Persona[]);
};

const enabledEnv = parseCsv((import.meta as any).env?.VITE_ENABLED_PERSONAS);
const disabledEnv = parseCsv((import.meta as any).env?.VITE_DISABLED_PERSONAS);
const defaultEnabledSet = new Set(DEFAULT_ENABLED_PERSONAS);

export const ENABLED_PERSONAS: Record<Persona, boolean> = ALL_PERSONAS.reduce((acc, persona) => {
  // Priority: explicit disable > explicit enable > default configuration
  // EXCEPTION: general_visitor is ALWAYS enabled as fallback (unless explicitly disabled)
  if (persona === 'general_visitor' && !disabledEnv.has('general_visitor')) {
    acc[persona] = true;
  } else if (disabledEnv.has(persona)) {
    acc[persona] = false;
  } else if (enabledEnv.size > 0) {
    acc[persona] = enabledEnv.has(persona);
  } else {
    // Use default configuration instead of enabling all
    acc[persona] = defaultEnabledSet.has(persona);
  }
  return acc;
}, {} as Record<Persona, boolean>);

// Convenience boolean: is the Personas feature as a whole enabled?
export const PERSONAS_FEATURE_ENABLED: boolean = Object.values(ENABLED_PERSONAS).some(Boolean); 