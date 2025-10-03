// List of personas/visitor profiles and whether they are enabled.
// Set a value to false to globally disable that profile without touching logic elsewhere.
// This file can be imported wherever persona-specific behaviour is needed.

// ------- Build-time control via env vars ------------------------------------
// 1. VITE_ENABLED_PERSONAS  – comma-separated list (e.g. "general_visitor,recruiter")
// 2. VITE_DISABLED_PERSONAS – comma-separated list to explicitly switch off
//    (takes precedence over ENABLED_PERSONAS).
// If neither env var is defined, everything defaults to true.
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

  // General
  'general_visitor',
  'returning_visitor',
  'potential_collaborator',
] as const;

type Persona = typeof ALL_PERSONAS[number];

const parseCsv = (value: string | undefined): Set<Persona> => {
  if (!value) return new Set();
  return new Set(value.split(',').map(s => s.trim()) as Persona[]);
};

const enabledEnv = parseCsv((import.meta as any).env?.VITE_ENABLED_PERSONAS);
const disabledEnv = parseCsv((import.meta as any).env?.VITE_DISABLED_PERSONAS);

export const ENABLED_PERSONAS: Record<Persona, boolean> = ALL_PERSONAS.reduce((acc, persona) => {
  // Priority: explicit disable > explicit enable > default true
  if (disabledEnv.has(persona)) {
    acc[persona] = false;
  } else if (enabledEnv.size > 0) {
    acc[persona] = enabledEnv.has(persona);
  } else {
    acc[persona] = true;
  }
  return acc;
}, {} as Record<Persona, boolean>);

// Convenience boolean: is the Personas feature as a whole enabled?
export const PERSONAS_FEATURE_ENABLED: boolean = Object.values(ENABLED_PERSONAS).some(Boolean); 