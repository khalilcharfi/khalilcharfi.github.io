# Personas Configuration Guide

## Overview

This portfolio application supports multiple visitor personas/profiles to tailor content and experiences. By default, only a selected subset of personas are enabled to optimize performance and relevance.

**🛡️ Safety Fallback**: The `general_visitor` persona is **always enabled** as a fallback to ensure the application works for all visitors, even if no other personas match. It can only be disabled by explicitly setting `VITE_DISABLED_PERSONAS=general_visitor`.

## Default Enabled Personas

The following 6 personas are enabled by default:

### General Visitors
- ✅ **general_visitor** - Generic visitors exploring the portfolio (always enabled as fallback)
- ✅ **returning_visitor** - Users who have visited before

### Developer / Technical
- ✅ **software_developer** - Software developers and engineers exploring the portfolio

### Recruitment Professionals
- ✅ **recruiter** - Professional recruiters
- ✅ **hr_manager** - HR managers and hiring decision-makers
- ✅ **agency_recruiter** - Agency-based recruiters

## All Available Personas

### Professional / Recruitment (5 total)
- `recruiter` ✅ (enabled)
- `hr_manager` ✅ (enabled)
- `agency_recruiter` ✅ (enabled)
- `technical_lead` ❌ (disabled)
- `c_level_executive` ❌ (disabled)

### Business / Client (5 total)
- `startup_founder` ❌ (disabled)
- `product_manager` ❌ (disabled)
- `project_manager` ❌ (disabled)
- `business_owner` ❌ (disabled)
- `enterprise_client` ❌ (disabled)

### Geographic / Local (4 total)
- `local_business` ❌ (disabled)
- `remote_work_advocate` ❌ (disabled)
- `international_client` ❌ (disabled)
- `local_tech_community` ❌ (disabled)

### Developer / Technical (2 total)
- `software_developer` ✅ (enabled)
- `peer_developer` ❌ (disabled)

### General (3 total)
- `general_visitor` ✅ (enabled - fallback)
- `returning_visitor` ✅ (enabled)
- `potential_collaborator` ❌ (disabled)

## How to Configure

### Option 1: Edit Default Configuration (Recommended)

Edit the `DEFAULT_ENABLED_PERSONAS` array in `/src/config/personaSettings.ts`:

```typescript
const DEFAULT_ENABLED_PERSONAS: readonly Persona[] = [
  'general_visitor',
  'returning_visitor',
  'software_developer',
  'recruiter',
  'hr_manager',
  'agency_recruiter',
  // Add more personas here as needed
] as const;
```

### Option 2: Use Environment Variables

#### Enable Specific Personas
Set `VITE_ENABLED_PERSONAS` in your `.env` file:

```bash
# Enable only these personas
VITE_ENABLED_PERSONAS=general_visitor,recruiter,hr_manager
```

#### Disable Specific Personas
Set `VITE_DISABLED_PERSONAS` in your `.env` file (takes precedence):

```bash
# Disable these personas explicitly
VITE_DISABLED_PERSONAS=technical_lead,c_level_executive
```

#### Enable All Personas
```bash
VITE_ENABLED_PERSONAS=recruiter,hr_manager,technical_lead,c_level_executive,agency_recruiter,startup_founder,product_manager,project_manager,business_owner,enterprise_client,local_business,remote_work_advocate,international_client,local_tech_community,software_developer,peer_developer,general_visitor,returning_visitor,potential_collaborator
```

### Priority Order

The configuration follows this priority:

1. **ALWAYS**: `general_visitor` is enabled as fallback (safety net)
2. **Highest**: `VITE_DISABLED_PERSONAS` (explicit disable - can override fallback)
3. **Medium**: `VITE_ENABLED_PERSONAS` (explicit enable)
4. **Lowest**: `DEFAULT_ENABLED_PERSONAS` (default configuration)

> **Note**: The `general_visitor` persona acts as a universal fallback and is always enabled unless explicitly disabled. This ensures visitors always see appropriate content even if they don't match any specific persona.

## Configuration Examples

### Example 1: Only General Visitors
```typescript
const DEFAULT_ENABLED_PERSONAS: readonly Persona[] = [
  'general_visitor',
] as const;
```

### Example 2: Full Recruitment Focus
```typescript
const DEFAULT_ENABLED_PERSONAS: readonly Persona[] = [
  'recruiter',
  'hr_manager',
  'technical_lead',
  'c_level_executive',
  'agency_recruiter',
] as const;
```

### Example 3: Business & Client Focus
```typescript
const DEFAULT_ENABLED_PERSONAS: readonly Persona[] = [
  'startup_founder',
  'product_manager',
  'project_manager',
  'business_owner',
  'enterprise_client',
  'general_visitor',
] as const;
```

## Checking Configuration

To verify which personas are enabled in your build:

```bash
# Check the generated configuration
npm run build
# Then inspect the console output or check ENABLED_PERSONAS export
```

## Best Practices

1. **Start Small**: Begin with 3-5 most relevant personas
2. **Keep General Visitor**: Always include `general_visitor` in your enabled list (it's a fallback anyway)
3. **Monitor Performance**: More personas = more conditional logic
4. **Test Changes**: Verify persona detection works correctly
5. **Document Changes**: Update this file when modifying defaults
6. **Use Environment Variables**: For deployment-specific configurations
7. **Don't Disable Fallback**: Avoid disabling `general_visitor` unless you have a specific reason

## Impact of Disabled Personas

When a persona is disabled:
- Persona-specific content sections won't be rendered
- Analytics won't track that persona type
- Navigation and UI won't show persona-specific options
- Performance improves due to less conditional rendering

## File Location

Configuration file: `/src/config/personaSettings.ts`

## Related Documentation

- [Dynamic Portfolio README](./docs/DYNAMIC_PORTFOLIO_README.md)
- [Performance Optimization Guide](./docs/PERFORMANCE_OPTIMIZATION_GUIDE.md)
- [Project Structure](./docs/PROJECT_STRUCTURE.md)

