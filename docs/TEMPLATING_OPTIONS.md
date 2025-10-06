# HTML Templating Options for Static Generation

## Overview
This document compares different approaches for generating `index.html` from translation data.

## ✅ Recommended: Handlebars (Node.js)

### Pros
- ✅ Lightweight (~20KB)
- ✅ Logic-less templates (clean separation)
- ✅ Easy to learn syntax
- ✅ Works with existing Node.js setup
- ✅ Can import TypeScript data via tsx
- ✅ No build tool changes needed

### Cons
- ⚠️ Limited logic in templates (but this is actually good for maintainability)

### Example
```handlebars
<h1>{{profile.name}}</h1>
<p>{{profile.title}}</p>

{{#each skills.categories.frontend.items}}
  <li>{{this}}</li>
{{/each}}
```

### Installation
```bash
npm install --save-dev handlebars tsx
```

---

## Alternative 1: EJS (Embedded JavaScript)

### Pros
- ✅ Full JavaScript in templates
- ✅ Very flexible
- ✅ Similar to ERB/PHP syntax
- ✅ Works with Node.js

### Cons
- ⚠️ Can lead to messy templates with too much logic
- ⚠️ Less separation of concerns

### Example
```ejs
<h1><%= profile.name %></h1>
<p><%= profile.title %></p>

<% skills.categories.frontend.items.forEach(item => { %>
  <li><%= item %></li>
<% }) %>
```

---

## Alternative 2: Nunjucks

### Pros
- ✅ Powerful templating (like Jinja2)
- ✅ Inheritance and includes
- ✅ Good for complex templates

### Cons
- ⚠️ Slightly heavier
- ⚠️ More features than needed for simple use case

---

## Alternative 3: Mustache

### Pros
- ✅ Very simple
- ✅ Logic-less
- ✅ Multi-language support

### Cons
- ⚠️ Too limited (no helpers)
- ⚠️ Harder to format complex data

---

## ❌ Not Recommended: Full SSGs

### Hugo, Jekyll, Eleventy, Pelican
These are **overkill** for your use case because:
- ❌ You already have a React app and build system
- ❌ Would require restructuring your entire project
- ❌ Add unnecessary complexity
- ❌ Require learning new tools/languages
- ❌ Don't integrate with your existing translations

---

## 🎯 Final Recommendation: Handlebars

**Use Handlebars** because it:
1. Integrates seamlessly with your existing setup
2. Keeps templates clean and maintainable
3. Has excellent documentation
4. Is widely used and well-supported
5. Runs at build time (no runtime overhead)
6. Can be added to your existing build pipeline

## Implementation Plan

```bash
# 1. Install dependencies
npm install --save-dev handlebars tsx

# 2. Create template file
# templates/index.hbs

# 3. Create generator script
# scripts/generate-html.mjs (already created!)

# 4. Add to build process
# package.json: "prebuild": "npm run generate:html"
```

## Build Process Flow

```
┌─────────────────────────────────────────────────┐
│ 1. npm run build                                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ 2. npm run generate:html (prebuild hook)       │
│    - Load translations.ts via tsx               │
│    - Load template (index.hbs)                  │
│    - Merge data with template                   │
│    - Output: index.html                         │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ 3. Vite builds React app                       │
│    - Uses generated index.html as base          │
│    - Adds <script> tags for React               │
│    - Outputs to dist/                           │
└─────────────────────────────────────────────────┘
```

## Benefits of This Approach

1. **SEO**: Static HTML content is immediately available to crawlers
2. **No-JS Support**: Full content visible without JavaScript
3. **Performance**: No client-side rendering needed for initial content
4. **Maintainability**: Single source of truth (translations.ts)
5. **DX**: Simple npm script, integrates with existing workflow
6. **Flexibility**: Easy to update template or add new languages

## Example Usage

```bash
# Generate HTML manually
npm run generate:html

# Generate during build (automatic)
npm run build

# Test no-JS version
npm run test:no-js
```

## Template Structure

```
project/
├── templates/
│   ├── index.hbs          # Main template
│   ├── partials/
│   │   ├── head.hbs       # <head> section
│   │   ├── nav.hbs        # Navigation
│   │   ├── about.hbs      # About section
│   │   ├── skills.hbs     # Skills section
│   │   └── footer.hbs     # Footer
├── scripts/
│   └── generate-html.mjs  # Generator script
└── index.html             # Generated output
```

## Conclusion

**Handlebars is the sweet spot** for your project:
- Not too simple (Mustache)
- Not too complex (Nunjucks, full SSGs)
- Just right for generating semantic HTML from structured data
- Perfect integration with your existing Node.js/TypeScript setup
