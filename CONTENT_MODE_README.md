# 🎛️ Content Mode Configuration

This document explains how to control dynamic content and default content modes using environment variables.

## Environment Variables

### Content Mode Control

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_ENABLE_DYNAMIC_CONTENT` | `true` | Enable/disable dynamic content system |
| `VITE_FORCE_DEFAULT_CONTENT` | `false` | Force default content mode (overrides dynamic content) |

### Personas Control

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_ENABLE_PERSONAS` | `true` | Enable/disable personas feature |
| `VITE_ENABLED_PERSONAS` | - | Comma-separated list of enabled personas |
| `VITE_DISABLED_PERSONAS` | - | Comma-separated list of disabled personas |

### Development Elements Visibility

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_SHOW_DEV_ELEMENTS` | `true` | Master switch for all development elements |
| `VITE_SHOW_VISITOR_CONTROLS` | `true` | Render/remove visitor type selector from DOM |
| `VITE_SHOW_PROFILE_INSIGHTS` | `true` | Render/remove profile insights toggle from DOM |
| `VITE_SHOW_TRANSLATION_DEBUG` | `true` | Render/remove translation debug component from DOM |
| `VITE_SHOW_DEBUG_INFO` | `true` | Render/remove debug info panel from DOM |

### Chatbot Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_ENABLE_CHATBOT` | `true` | Enable/disable chatbot functionality |
| `GEMINI_API_KEY` | - | Required for chatbot to work (must be valid) |

**Enhanced API Validation:**
- **API Key Format Validation**: Checks for proper Gemini API key format (starts with "AIza", minimum length)
- **Connection Testing**: Tests actual API connectivity with retry logic
- **Error Classification**: Provides specific error messages for different failure types
- **Development Status Indicator**: Shows real-time connection status in development mode
- **Retry Mechanism**: Automatic retry with exponential backoff

**Note:** Elements are completely removed from rendering (not just hidden with CSS) for better performance and smaller bundle size. The chatbot will only render if both `VITE_ENABLE_CHATBOT=true` AND `GEMINI_API_KEY` is valid.

## Content Modes

### 1. Dynamic Content Mode (Default)
```bash
VITE_ENABLE_DYNAMIC_CONTENT=true
VITE_FORCE_DEFAULT_CONTENT=false
```
- Uses personalized content based on user analytics
- Requires analytics consent
- Personas can be enabled/disabled independently

### 2. Default Content Mode
```bash
VITE_ENABLE_DYNAMIC_CONTENT=false
# OR
VITE_FORCE_DEFAULT_CONTENT=true
```
- Uses static default content from translations
- No analytics tracking
- No personalization
- Faster loading, simpler experience

### 3. Personas Disabled
```bash
VITE_ENABLE_PERSONAS=false
```
- Disables persona-based personalization
- Still uses dynamic content if enabled
- Analytics tracking may still work for basic metrics

## Usage Examples

### Development with Static Content
```bash
# .env
VITE_ENABLE_DYNAMIC_CONTENT=false
VITE_ENABLE_PERSONAS=false
```

### Production with Full Personalization
```bash
# .env
VITE_ENABLE_DYNAMIC_CONTENT=true
VITE_ENABLE_PERSONAS=true
VITE_FORCE_DEFAULT_CONTENT=false
```

### Testing Specific Personas
```bash
# .env
VITE_ENABLE_DYNAMIC_CONTENT=true
VITE_ENABLE_PERSONAS=true
VITE_ENABLED_PERSONAS=recruiter,developer
VITE_DISABLED_PERSONAS=general_visitor
```

### Force Default for A/B Testing
```bash
# .env
VITE_ENABLE_DYNAMIC_CONTENT=true
VITE_FORCE_DEFAULT_CONTENT=true
```

### Production Configuration
```bash
# .env.production
NODE_ENV=production
VITE_SHOW_DEV_ELEMENTS=false
VITE_SHOW_VISITOR_CONTROLS=false
VITE_SHOW_PROFILE_INSIGHTS=false
VITE_SHOW_TRANSLATION_DEBUG=false
VITE_SHOW_DEBUG_INFO=false
```

### Development Configuration
```bash
# .env (development)
NODE_ENV=development
VITE_SHOW_DEV_ELEMENTS=true
VITE_SHOW_VISITOR_CONTROLS=true
VITE_SHOW_PROFILE_INSIGHTS=true
VITE_SHOW_TRANSLATION_DEBUG=true
VITE_SHOW_DEBUG_INFO=true
VITE_ENABLE_CHATBOT=true
GEMINI_API_KEY=your_actual_api_key_here
```

### Chatbot Disabled
```bash
# .env
VITE_ENABLE_CHATBOT=false
# GEMINI_API_KEY not needed when chatbot is disabled
```

### Chatbot with Invalid API Key
```bash
# .env
VITE_ENABLE_CHATBOT=true
GEMINI_API_KEY=invalid_key_or_empty
# Chatbot will not render due to invalid API key
```

## Debugging

The system includes debug logging that shows the current content mode configuration:

```javascript
// In browser console, you'll see:
Content Mode Debug: {
  PERSONAS_ENABLED: true,
  DYNAMIC_CONTENT_ENABLED: true,
  FORCE_DEFAULT_CONTENT: false,
  useDefaultContent: false,
  useDynamicContent: true,
  personasActive: true,
  analyticsConsent: true
}
```

## API Reference

### `getContentModeInfo()`
Returns current content mode configuration:

```javascript
import { getContentModeInfo } from './dynamicContent';

const modeInfo = getContentModeInfo();
console.log(modeInfo);
// {
//   personasEnabled: boolean,
//   dynamicContentEnabled: boolean,
//   forceDefaultContent: boolean,
//   isUsingDefaultContent: boolean,
//   isUsingDynamicContent: boolean
// }
```

## Priority Order

1. `VITE_FORCE_DEFAULT_CONTENT=true` - Always uses default content
2. `VITE_ENABLE_DYNAMIC_CONTENT=false` - Disables dynamic content
3. `VITE_ENABLE_PERSONAS=false` - Disables personas (but keeps dynamic content)
4. Analytics consent - Required for personas to work

## Build Scripts

### Development
```bash
npm run dev
# Uses .env file with development settings
```

### Production Build
```bash
npm run build:prod
# Uses .env.production file with production settings
```

### Preview Production Build
```bash
npm run preview:prod
# Preview the production build locally
```

## Testing

### Environment Visibility Test
Open `test-environment-visibility.html` in your browser to test:
- Development elements visibility
- Environment variable values
- Content mode detection
- Chatbot availability
- Gemini API connection status

### Gemini API Connection Test
Open `test-gemini-connection.html` in your browser to test:
- API key validation
- Connection testing with retry logic
- Error classification and reporting
- Chat functionality testing
- Real-time connection status

## Performance Impact

- **Default Content Mode**: Fastest, no analytics overhead
- **Dynamic Content Mode**: Slight overhead for content adaptation
- **Personas Disabled**: Medium performance, basic analytics only
- **Full Personalization**: Highest overhead, full analytics + personalization
- **Production Mode**: Optimized with all development elements completely removed from bundle
- **Dynamic Imports**: Development components are only loaded when needed, reducing initial bundle size
