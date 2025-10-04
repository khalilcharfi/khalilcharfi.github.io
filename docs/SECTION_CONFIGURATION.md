# Section Configuration Guide

This portfolio supports configurable section ordering and visibility through environment variables. This allows you to customize which sections appear and in what order without modifying the code.

## Configuration Options

### Environment Variables

#### `VITE_SECTIONS_ORDER`
Controls the order in which sections appear on the page.

**Format:** Comma-separated list of section IDs  
**Default:** `home,about,skills,projects,experience,education,publications,certificates,contact`

**Example:**
```bash
VITE_SECTIONS_ORDER="home,projects,skills,about,contact"
```

This will render sections in the specified order. Any sections not listed will appear at the end in their default order.

#### `VITE_ENABLED_SECTIONS`
Controls which sections are visible on the page.

**Format:** Comma-separated list of section IDs  
**Default:** All sections are enabled

**Example:**
```bash
VITE_ENABLED_SECTIONS="home,about,projects,contact"
```

This will only render the specified sections, hiding all others.

## Available Section IDs

The following section IDs are available for configuration:

- `home` - Hero/landing section
- `about` - About me section with profile photo
- `skills` - Technical skills and expertise
- `projects` - Portfolio projects
- `experience` - Work experience timeline
- `education` - Educational background
- `publications` - Research publications
- `certificates` - Certifications and awards
- `contact` - Contact information and form

## Usage Examples

### Example 1: Minimal Portfolio
Show only the essential sections:

```bash
VITE_ENABLED_SECTIONS="home,about,projects,contact"
```

### Example 2: Academic Focus
Prioritize academic content:

```bash
VITE_SECTIONS_ORDER="home,about,publications,education,skills,projects,certificates,contact"
VITE_ENABLED_SECTIONS="home,about,publications,education,certificates,contact"
```

### Example 3: Developer Portfolio
Focus on technical skills and projects:

```bash
VITE_SECTIONS_ORDER="home,projects,skills,experience,about,contact"
VITE_ENABLED_SECTIONS="home,projects,skills,experience,contact"
```

### Example 4: Reverse Order
Show sections in reverse order:

```bash
VITE_SECTIONS_ORDER="contact,certificates,publications,education,experience,projects,skills,about,home"
```

## Implementation Details

### Architecture

The section configuration system consists of three main parts:

1. **Configuration Module** (`src/config/sections.ts`)
   - Defines default section IDs
   - Exports `getSectionIds()` function that reads environment variables
   - Handles order and visibility logic

2. **Navigation Component** (`src/components/Navbar.tsx`)
   - Dynamically generates navigation links based on enabled sections
   - Preserves the configured order in the menu

3. **Main App Component** (`index.tsx`)
   - Renders sections dynamically using a component map
   - Uses `useMemo` to optimize performance
   - IntersectionObserver tracks only enabled sections

### How It Works

1. **Build Time:** Environment variables are read during the build process
2. **Runtime:** The `getSectionIds()` function processes the configuration:
   - Parses `VITE_SECTIONS_ORDER` to determine order
   - Filters by `VITE_ENABLED_SECTIONS` to control visibility
   - Returns an ordered array of enabled section IDs
3. **Rendering:** Components map over this array to render sections in order
4. **Navigation:** The navbar automatically updates to reflect enabled sections

### Performance Optimizations

- **Memoization:** Section lists are memoized to avoid recalculation
- **Component Map:** Pre-built component map reduces switch statement overhead
- **Observer Filtering:** IntersectionObserver only tracks rendered sections
- **Lazy Loading:** Sections not enabled are never loaded

## Development Setup

### Local Development

Create a `.env` file in the project root:

```env
VITE_SECTIONS_ORDER="home,projects,about,contact"
VITE_ENABLED_SECTIONS="home,about,projects,contact"
```

### Production Build

Pass environment variables during build:

```bash
VITE_SECTIONS_ORDER="home,projects,skills,contact" npm run build
```

### Docker

Add to your Dockerfile:

```dockerfile
ARG VITE_SECTIONS_ORDER="home,about,skills,projects,contact"
ARG VITE_ENABLED_SECTIONS="home,about,skills,projects,contact"

ENV VITE_SECTIONS_ORDER=$VITE_SECTIONS_ORDER
ENV VITE_ENABLED_SECTIONS=$VITE_ENABLED_SECTIONS
```

### GitHub Actions / CI/CD

Add to your workflow file:

```yaml
- name: Build
  env:
    VITE_SECTIONS_ORDER: "home,projects,skills,contact"
    VITE_ENABLED_SECTIONS: "home,about,projects,skills,contact"
  run: npm run build
```

## Accessibility Considerations

- **Navigation:** Skip links automatically adapt to enabled sections
- **Focus Management:** Keyboard navigation works with any section order
- **Screen Readers:** Section landmarks are preserved regardless of order
- **ARIA:** All sections maintain proper ARIA labels and roles

## Best Practices

1. **Always include `home`:** The home section should typically be first
2. **Include `contact`:** Consider including a contact section for user engagement
3. **Logical Ordering:** Group related sections together (e.g., skills → projects → experience)
4. **Test Navigation:** Verify smooth scrolling works with your custom order
5. **Mobile Experience:** Test that the mobile menu works well with your section list

## Troubleshooting

### Sections Not Showing
- Verify section IDs are spelled correctly (case-sensitive)
- Check that environment variables are being read during build
- Ensure no typos in comma-separated lists

### Order Not Applied
- Rebuild the application after changing environment variables
- Clear browser cache if testing in production
- Verify no whitespace in section ID lists

### Navigation Issues
- Check browser console for errors
- Ensure all enabled sections have corresponding components
- Verify section IDs match between config and components

## Future Enhancements

Potential improvements to the section configuration system:

- Runtime configuration UI for dynamic section reordering
- Per-language section configurations
- User preference persistence in localStorage
- A/B testing support for different section orders
- Analytics integration to track section engagement
- Custom section visibility based on user personas

## API Reference

### `getSectionIds(): string[]`

Returns an array of section IDs that should be rendered, respecting order and visibility settings.

**Returns:** `string[]` - Array of enabled section IDs in the configured order

**Example:**
```typescript
import { getSectionIds } from './src/config/sections';

const sections = getSectionIds();
// => ['home', 'projects', 'skills', 'contact']
```

### `DEFAULT_SECTION_IDS: string[]`

Constant array containing all available section IDs in their default order.

**Type:** `readonly string[]`

**Value:**
```typescript
[
  'home',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'publications',
  'certificates',
  'contact'
]
```

## Support

If you encounter any issues or have questions about section configuration:

1. Check this documentation first
2. Review the implementation in `src/config/sections.ts`
3. Look at example configurations in this guide
4. Open an issue on GitHub with your configuration and the observed behavior
