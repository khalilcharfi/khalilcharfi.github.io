# GitHub Secrets Setup Guide

## 🔐 Required GitHub Secrets

To deploy your portfolio with environment variables, you need to set up these secrets in your GitHub repository:

### 1. Go to Repository Settings
1. Navigate to your repository on GitHub
2. Click on **Settings** (in the repository menu)
3. Click on **Secrets and variables** → **Actions**

### 2. Add Required Secrets

Click **New repository secret** for each of these:

#### Required Secrets:
- **`GEMINI_API_KEY`**: Your actual Gemini API key (e.g., `AIzaSyB...`)
- **`VITE_ENABLE_CHATBOT`**: `true` or `false`
- **`VITE_ENABLE_DYNAMIC_CONTENT`**: `true` or `false`

#### Optional Secrets (will use defaults if not set):
- **`VITE_ENABLE_PERSONAS`**: `true` or `false` (default: `true`)
- **`VITE_FORCE_DEFAULT_CONTENT`**: `true` or `false` (default: `false`)

### 3. Secret Values

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `GEMINI_API_KEY` | `AIzaSyB...` | Your actual Gemini API key |
| `VITE_ENABLE_CHATBOT` | `true` | Enable chatbot functionality |
| `VITE_ENABLE_DYNAMIC_CONTENT` | `true` | Enable dynamic content |
| `VITE_ENABLE_PERSONAS` | `true` | Enable personas feature |
| `VITE_FORCE_DEFAULT_CONTENT` | `false` | Force default content mode |

## 🚀 How It Works

1. **Push to main branch**: Triggers automatic deployment to GitHub Pages
2. **GitHub Actions**: Reads your secrets and creates `.env.production`
3. **Build Process**: Uses the production environment variables
4. **Deploy**: Publishes the built site to GitHub Pages

## 🧪 Testing Your Setup

### 1. Test Locally First
```bash
# Test with production environment
npm run build:prod
npm run preview:prod
```

### 2. Test GitHub Actions
1. Push your changes to the `main` branch
2. Go to **Actions** tab in your repository
3. Watch the deployment workflow run
4. Check the build logs for any errors

### 3. Verify Deployment
1. Visit your GitHub Pages URL
2. Open browser developer tools
3. Check console for environment variable logs
4. Test the chatbot functionality

## 🔧 Troubleshooting

### Common Issues:

1. **"GEMINI_API_KEY not found"**
   - Check that the secret is set correctly in GitHub
   - Verify the secret name matches exactly: `GEMINI_API_KEY`

2. **"Build failed"**
   - Check the Actions tab for error details
   - Ensure all required secrets are set

3. **"Chatbot not working"**
   - Verify `GEMINI_API_KEY` is valid
   - Check that `VITE_ENABLE_CHATBOT` is set to `true`

### Debug Steps:

1. **Check GitHub Actions Logs:**
   - Go to Actions tab
   - Click on the latest workflow run
   - Check the "Test environment variables" step

2. **Verify Secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Ensure all required secrets are listed

3. **Test API Key:**
   - Use the `test-gemini-connection.html` file locally
   - Verify your API key works correctly

## 📋 Quick Checklist

- [ ] Set `GEMINI_API_KEY` secret
- [ ] Set `VITE_ENABLE_CHATBOT` secret
- [ ] Set `VITE_ENABLE_DYNAMIC_CONTENT` secret
- [ ] Push changes to `main` branch
- [ ] Check Actions tab for successful deployment
- [ ] Visit GitHub Pages URL to verify
- [ ] Test chatbot functionality
- [ ] Verify development elements are hidden

## 🔗 Useful Commands

```bash
# Test production build locally
npm run build:prod && npm run preview:prod

# Check environment variables in build
npm run build:prod && cat .env.production

# Deploy manually (if needed)
npm run build:prod && npx gh-pages -d dist
```

## 🆘 Need Help?

If you encounter issues:

1. Check the GitHub Actions logs first
2. Verify all secrets are set correctly
3. Test your API key using the connection test tool
4. Review the environment variable guide
5. Check that your `.env.production` file is being created correctly
