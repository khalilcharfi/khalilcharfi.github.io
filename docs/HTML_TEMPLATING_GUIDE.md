# HTML Templating System Guide

## Overview

This project uses **Handlebars** templating to generate `index.html` dynamically from translation data. This ensures that the no-JS fallback content stays in sync with your translations and provides excellent SEO.

## 🎯 Why Handlebars?

- ✅ **Lightweight**: Only ~20KB, minimal overhead
- ✅ **Logic-less**: Clean separation between data and presentation
- ✅ **Maintainable**: Easy to read and modify templates
- ✅ **Integrated**: Works seamlessly with existing Node.js/TypeScript setup
- ✅ **Build-time**: Generates static HTML, no runtime overhead

## 📁 Project Structure

```
project/
├── templates/
│   ├── index.hbs              # Main HTML template
│   └── partials/
│       ├── head-scripts.hbs   # JS detection & theme scripts
│       ├── critical-css.hbs   # Inline critical CSS
│       ├── no-js-banner.hbs   # Warning banner
│       ├── header.hbs         # Page header
│       ├── navigation.hbs     # Navigation menu
│       ├── about.hbs          # About section
│       ├── skills.hbs         # Skills section
│       ├── experience.hbs     # Experience section
│       ├── education.hbs      # Education section
│       ├── projects.hbs       # Projects section
│       ├── contact.hbs        # Contact section
│       └── footer.hbs         # Page footer
├── scripts/
│   └── generate-html.mjs      # Generator script
└── index.html                 # Generated output (do not edit manually!)
```

## 🔧 How It Works

### 1. Build Process

```bash
npm run build
```

**Flow:**
1. `prebuild` hook runs `npm run generate:html`
2. Generator loads translations from `src/features/i18n/data/translations.ts`
3. Handlebars compiles templates with translation data
4. Outputs `index.html` with static content
5. Vite builds React app using generated HTML as base

### 2. Manual Generation

```bash
npm run generate:html
```

Use this when you:
- Update translations
- Modify templates
- Want to preview changes without full build

### 3. Data Flow

```
translations.ts (TypeScript)
        ↓
    tsx loader
        ↓
    JSON data
        ↓
 Handlebars templates
        ↓
   index.html (Static HTML)
        ↓
   Vite build (adds React)
        ↓
   dist/index.html (Final output)
```

## ✏️ Editing Templates

### Main Template (`templates/index.hbs`)

Contains the overall HTML structure and includes partials:

```handlebars
<!DOCTYPE html>
<html class="no-js" lang="{{lang}}">
<head>
    <title>{{profile.name}} | Full-Stack Engineer Portfolio</title>
    {{> head-scripts}}
    {{> critical-css}}
</head>
<body>
    <div class="static-content">
        {{> header}}
        {{> about}}
        {{> skills}}
        <!-- ... more partials ... -->
    </div>
</body>
</html>
```

### Partials (`templates/partials/*.hbs`)

Each partial handles a specific section. Example (`about.hbs`):

```handlebars
<section id="about-section">
    <h2>{{t.about.title}}</h2>
    <p>{{t.about.professionalSummary}}</p>
    
    <h3>{{t.about.languagesTitle}}</h3>
    <ul>
        {{#each t.about.languages}}
        <li><strong>{{this.lang}}:</strong> {{this.proficiency}}</li>
        {{/each}}
    </ul>
</section>
```

## 📝 Handlebars Syntax

### Variables

```handlebars
{{profile.name}}           <!-- Simple variable -->
{{t.about.title}}          <!-- Nested property -->
```

### Loops

```handlebars
{{#each t.skills.categories.frontend.items}}
    <li>{{this}}</li>
{{/each}}
```

### Conditionals

```handlebars
{{#if this.link}}
    <a href="{{this.link}}">View Project</a>
{{/if}}
```

### Helpers

```handlebars
{{#unless @last}}, {{/unless}}  <!-- Add comma except for last item -->
```

## 🎨 Adding New Content

### 1. Add to Translations

Edit `src/features/i18n/data/translations.ts`:

```typescript
export const translations = {
  en: {
    newSection: {
      title: 'My New Section',
      content: 'Some content here'
    }
  }
}
```

### 2. Create Partial Template

Create `templates/partials/new-section.hbs`:

```handlebars
<section id="new-section">
    <h2>{{t.newSection.title}}</h2>
    <p>{{t.newSection.content}}</p>
</section>
```

### 3. Include in Main Template

Edit `templates/index.hbs`:

```handlebars
<div class="static-content">
    {{> header}}
    {{> about}}
    {{> new-section}}  <!-- Add your partial -->
    {{> footer}}
</div>
```

### 4. Regenerate HTML

```bash
npm run generate:html
```

## 🧪 Testing

### Test No-JS Mode

```bash
npm run test:no-js
```

This script:
- Builds the project
- Starts preview server
- Fetches HTML without JavaScript
- Validates content presence
- Reports results

### Manual Testing

1. Build the project: `npm run build`
2. Start preview: `npm run preview`
3. Open browser DevTools (F12)
4. Disable JavaScript:
   - Chrome/Edge: Cmd+Shift+P → "Disable JavaScript"
   - Firefox: about:config → `javascript.enabled` = false
5. Refresh page and verify content

## 🔍 Debugging

### Check Generated HTML

```bash
cat index.html | less
```

### Verify Translations Loaded

```bash
npm run generate:html
# Look for "✅ Translations loaded successfully"
```

### Common Issues

**Issue:** HTML not updating after translation changes
**Solution:** Run `npm run generate:html` manually

**Issue:** Partial not found error
**Solution:** Check file name matches partial name (without `.hbs`)

**Issue:** Translation data missing
**Solution:** Verify translation key exists in `translations.ts`

## 📊 Benefits

### For SEO
- ✅ Static HTML content immediately available to crawlers
- ✅ Rich, semantic markup
- ✅ Schema.org microdata included
- ✅ All content indexed without JavaScript

### For Users
- ✅ Content visible even if JavaScript fails to load
- ✅ Faster initial page load
- ✅ Works in text-only browsers
- ✅ Better accessibility

### For Developers
- ✅ Single source of truth (translations.ts)
- ✅ Type-safe translation data
- ✅ Easy to maintain and update
- ✅ Automatic regeneration on build
- ✅ Clear separation of concerns

## 🚀 Best Practices

1. **Never edit `index.html` directly** - it's auto-generated
2. **Keep templates simple** - complex logic belongs in the generator script
3. **Use partials** - break large templates into manageable pieces
4. **Test no-JS mode** - run `npm run test:no-js` after changes
5. **Update all languages** - when adding content, update all translation languages
6. **Commit templates** - version control your `.hbs` files
7. **Document changes** - update this guide when adding new sections

## 📚 Resources

- [Handlebars Documentation](https://handlebarsjs.com/)
- [HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [Schema.org Vocabulary](https://schema.org/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🔄 Workflow Example

```bash
# 1. Update translations
vim src/features/i18n/data/translations.ts

# 2. Regenerate HTML
npm run generate:html

# 3. Test locally
npm run dev

# 4. Test no-JS mode
npm run test:no-js

# 5. Build for production
npm run build

# 6. Commit changes
git add templates/ src/features/i18n/data/translations.ts
git commit -m "feat: add new section to portfolio"
```

## 💡 Tips

- Use `{{!-- comments --}}` for Handlebars comments (won't appear in output)
- Use `{{{triple}}}` braces for unescaped HTML (e.g., JSON-LD)
- Test with multiple languages by changing `lang` in generator script
- Keep partials focused on a single responsibility
- Use semantic HTML5 elements (`<section>`, `<article>`, `<nav>`, etc.)

## 🎯 Next Steps

- Add support for multiple language outputs (generate `index-de.html`, etc.)
- Create language-specific templates
- Add more custom Handlebars helpers
- Integrate with CMS for non-technical content updates
- Add template validation/linting
