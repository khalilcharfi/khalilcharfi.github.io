# GitHub Environment Variables Guide

This guide explains how to read environment variables from GitHub in different deployment scenarios for your portfolio project.

## 🚀 Deployment Scenarios

### 1. GitHub Pages (Static Hosting)

GitHub Pages serves static files, so environment variables need to be **baked into the build** at build time.

#### Option A: GitHub Actions with Secrets (Recommended)

1. **Set up GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `GEMINI_API_KEY`: Your actual Gemini API key
     - `VITE_ENABLE_CHATBOT`: `true` or `false`
     - `VITE_ENABLE_DYNAMIC_CONTENT`: `true` or `false`
     - `VITE_SHOW_RECOMMENDED_SECTIONS`: `true` or `false` (controls "Recommended for you" section - default: `false`)
     - `VITE_SHOW_DEV_ELEMENTS`: `false` (for production)

2. **Create GitHub Actions Workflow:**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main, next ]
     pull_request:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       
       steps:
         - name: Checkout
           uses: actions/checkout@v4
           
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '18'
             cache: 'npm'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Create production .env
           run: |
             echo "GEMINI_API_KEY=${{ secrets.GEMINI_API_KEY }}" >> .env.production
             echo "VITE_ENABLE_CHATBOT=${{ secrets.VITE_ENABLE_CHATBOT }}" >> .env.production
             echo "VITE_ENABLE_DYNAMIC_CONTENT=${{ secrets.VITE_ENABLE_DYNAMIC_CONTENT }}" >> .env.production
             echo "VITE_SHOW_RECOMMENDED_SECTIONS=${{ secrets.VITE_SHOW_RECOMMENDED_SECTIONS }}" >> .env.production
             echo "VITE_SHOW_DEV_ELEMENTS=false" >> .env.production
             echo "VITE_SHOW_VISITOR_CONTROLS=false" >> .env.production
             echo "VITE_SHOW_PROFILE_INSIGHTS=false" >> .env.production
             echo "VITE_SHOW_TRANSLATION_DEBUG=false" >> .env.production
             echo "VITE_SHOW_DEBUG_INFO=false" >> .env.production
             echo "NODE_ENV=production" >> .env.production
             
         - name: Build
           run: npm run build:prod
           
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           if: github.ref == 'refs/heads/main'
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

#### Option B: Manual Build with Environment Variables

1. **Set environment variables before building:**
   ```bash
   export GEMINI_API_KEY="your_actual_api_key_here"
   export VITE_ENABLE_CHATBOT="true"
   export VITE_ENABLE_DYNAMIC_CONTENT="true"
   export VITE_SHOW_DEV_ELEMENTS="false"
   npm run build:prod
   ```

2. **Push the built files to GitHub Pages branch**

### 2. Vercel Deployment

Vercel automatically reads environment variables from their dashboard.

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add your variables:
     - `GEMINI_API_KEY`: Your API key
     - `VITE_ENABLE_CHATBOT`: `true`
     - `VITE_ENABLE_DYNAMIC_CONTENT`: `true`
     - `VITE_SHOW_DEV_ELEMENTS`: `false`

2. **Deploy:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### 3. Netlify Deployment

Similar to Vercel, Netlify reads from their dashboard.

1. **Set Environment Variables in Netlify:**
   - Go to Site settings → Environment variables
   - Add your variables

2. **Deploy:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

## 🔧 Configuration Updates

### Update Vite Config for Better GitHub Integration

```typescript
// vite.config.ts
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Environment variables that should be available in the browser
    const clientEnv = {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_ENABLE_CHATBOT': JSON.stringify(env.VITE_ENABLE_CHATBOT),
        'process.env.VITE_ENABLE_DYNAMIC_CONTENT': JSON.stringify(env.VITE_ENABLE_DYNAMIC_CONTENT),
        'process.env.VITE_SHOW_DEV_ELEMENTS': JSON.stringify(env.VITE_SHOW_DEV_ELEMENTS),
        'process.env.VITE_SHOW_VISITOR_CONTROLS': JSON.stringify(env.VITE_SHOW_VISITOR_CONTROLS),
        'process.env.VITE_SHOW_PROFILE_INSIGHTS': JSON.stringify(env.VITE_SHOW_PROFILE_INSIGHTS),
        'process.env.VITE_SHOW_TRANSLATION_DEBUG': JSON.stringify(env.VITE_SHOW_TRANSLATION_DEBUG),
        'process.env.VITE_SHOW_DEBUG_INFO': JSON.stringify(env.VITE_SHOW_DEBUG_INFO),
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.DEV': JSON.stringify(mode === 'development'),
        'process.env.PROD': JSON.stringify(mode === 'production')
    };

    return {
        define: clientEnv,
        // ... rest of your config
    };
});
```

### Update Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:prod": "vite build --mode production",
    "build:github": "vite build --mode production --outDir dist",
    "preview": "vite preview",
    "preview:prod": "vite preview --mode production",
    "deploy:github": "npm run build:github && gh-pages -d dist"
  }
}
```

## 🔒 Security Best Practices

### 1. Never Commit Sensitive Data
```bash
# .gitignore (already configured)
.env
.env.*
!.env.example
```

### 2. Use Different Keys for Different Environments
- **Development**: Use a test/development API key
- **Production**: Use your production API key
- **Staging**: Use a separate staging key

### 3. Environment-Specific Configuration

#### Development (.env)
```bash
GEMINI_API_KEY=your_dev_api_key_here
VITE_ENABLE_CHATBOT=true
VITE_SHOW_DEV_ELEMENTS=true
NODE_ENV=development
```

#### Production (.env.production)
```bash
GEMINI_API_KEY=your_prod_api_key_here
VITE_ENABLE_CHATBOT=true
VITE_SHOW_DEV_ELEMENTS=false
NODE_ENV=production
```

## 🧪 Testing Environment Variables

### 1. Local Testing
```bash
# Test with production environment
npm run build:prod
npm run preview:prod

# Test with development environment
npm run dev
```

### 2. GitHub Actions Testing
```yaml
- name: Test Environment Variables
  run: |
    echo "Testing environment variables..."
    node -e "
      console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
      console.log('VITE_ENABLE_CHATBOT:', process.env.VITE_ENABLE_CHATBOT);
      console.log('NODE_ENV:', process.env.NODE_ENV);
    "
```

### 3. Runtime Environment Detection
```typescript
// In your React components
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.DEV === true;
const apiKey = process.env.GEMINI_API_KEY;

console.log('Environment:', {
  isProduction,
  isDevelopment,
  hasApiKey: !!apiKey,
  chatbotEnabled: process.env.VITE_ENABLE_CHATBOT === 'true'
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Environment variables not loading:**
   - Check if variables are prefixed with `VITE_` for client-side access
   - Verify the `.env` file is in the project root
   - Restart the development server after adding new variables

2. **Build fails with missing variables:**
   - Ensure all required variables are set in your deployment environment
   - Check that production variables are properly configured

3. **API key not working in production:**
   - Verify the API key is correctly set in your deployment platform
   - Check that the key has the necessary permissions
   - Test the key using the `test-gemini-connection.html` tool

### Debug Environment Variables

```typescript
// Add this to your main component for debugging
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment Variables:', {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Set' : 'Not set',
      VITE_ENABLE_CHATBOT: process.env.VITE_ENABLE_CHATBOT,
      VITE_ENABLE_DYNAMIC_CONTENT: process.env.VITE_ENABLE_DYNAMIC_CONTENT,
      NODE_ENV: process.env.NODE_ENV,
      DEV: process.env.DEV,
      PROD: process.env.PROD
    });
  }
}, []);
```

## 📋 Quick Setup Checklist

- [ ] Set up GitHub Secrets (if using GitHub Actions)
- [ ] Configure deployment platform environment variables
- [ ] Update `.env.production` with production values
- [ ] Test local build with `npm run build:prod`
- [ ] Test deployment with environment variables
- [ ] Verify chatbot works in production
- [ ] Check that development elements are hidden in production

## 🔗 Useful Links

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
