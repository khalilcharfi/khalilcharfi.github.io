# GitHub Pages Deployment Guide

This guide provides step-by-step instructions for deploying your portfolio to GitHub Pages using GitHub Actions.

## 📋 Prerequisites

1. A GitHub account
2. Your repository pushed to GitHub
3. A Gemini API key (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🚀 Quick Setup

### Step 1: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add the following secrets:

| Secret Name | Value | Required |
|------------|-------|----------|
| `GEMINI_API_KEY` | Your Gemini API key | ✅ Yes |
| `VITE_ENABLE_CHATBOT` | `true` or `false` | ⚠️ Optional (default: `true`) |
| `VITE_ENABLE_DYNAMIC_CONTENT` | `true` or `false` | ⚠️ Optional (default: `true`) |
| `VITE_ENABLE_PERSONAS` | `true` or `false` | ⚠️ Optional (default: `true`) |
| `VITE_SHOW_RECOMMENDED_SECTIONS` | `true` or `false` | ⚠️ Optional (default: `true`) |

**Important**: Only `GEMINI_API_KEY` is required. All other secrets have sensible defaults.

### Step 2: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

### Step 3: Push Your Code

The workflow will automatically trigger when you push to the `main` or `next` branch:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### Step 4: Monitor Deployment

1. Go to the **Actions** tab in your repository
2. Watch the deployment progress
3. Once complete, your site will be live at: `https://yourusername.github.io/khalilcharfi.github.io`

## 🔧 Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`) performs the following steps:

1. **Checkout**: Clones your repository
2. **Setup Node.js**: Installs Node.js 18
3. **Install Dependencies**: Runs `npm ci` for clean installation
4. **Create Environment File**: Creates `.env.production` with your secrets
5. **Build**: Runs `npm run build:prod` to create production build
6. **Upload Artifact**: Prepares the `dist` folder for deployment
7. **Deploy**: Deploys to GitHub Pages (only on `main` or `next` branches)

## 🎯 Workflow Features

- ✅ **Automatic Deployment**: Deploys on push to `main` or `next` branches
- ✅ **Manual Trigger**: Can be triggered manually via workflow_dispatch
- ✅ **Pull Request Preview**: Builds PRs without deploying (for testing)
- ✅ **Concurrent Protection**: Prevents multiple simultaneous deployments
- ✅ **Production Optimization**: All debug features disabled automatically

## 🔒 Security Best Practices

### 1. API Key Protection
- ✅ Never commit your API key to the repository
- ✅ Use GitHub Secrets for sensitive data
- ✅ Use different API keys for development and production

### 2. Environment Variables
The workflow automatically sets these to `false` in production:
- `VITE_SHOW_DEV_ELEMENTS`
- `VITE_SHOW_VISITOR_CONTROLS`
- `VITE_SHOW_PROFILE_INSIGHTS`
- `VITE_SHOW_TRANSLATION_DEBUG`
- `VITE_SHOW_DEBUG_INFO`

## 🧪 Testing Before Deployment

### Local Production Build
Test the production build locally before deploying:

```bash
# Create a local .env.production file
echo "GEMINI_API_KEY=your_api_key_here" > .env.production
echo "VITE_ENABLE_CHATBOT=true" >> .env.production
echo "VITE_SHOW_DEV_ELEMENTS=false" >> .env.production

# Build and preview
npm run build:prod
npm run preview:prod
```

Visit `http://localhost:5177` to test your production build.

## 🐛 Troubleshooting

### Build Fails with "GEMINI_API_KEY not found"
**Solution**: Make sure you've added the `GEMINI_API_KEY` secret in GitHub Settings.

### Pages Not Showing Up
**Solution**: 
1. Check that GitHub Pages is configured to use "GitHub Actions" as the source
2. Verify the workflow completed successfully in the Actions tab
3. Check that you pushed to the `main` or `next` branch

### Chatbot Not Working in Production
**Solutions**:
1. Verify `GEMINI_API_KEY` is correctly set in GitHub Secrets
2. Check browser console for error messages
3. Ensure `VITE_ENABLE_CHATBOT` is set to `true`
4. Verify your API key has the necessary permissions in Google AI Studio

### Assets Not Loading (404 errors)
**Solution**: 
1. Ensure the `base` path in `vite.config.ts` matches your repository name
2. For custom domains, set `base: '/'`
3. For GitHub Pages subpath, set `base: '/repository-name/'`

### Workflow Permission Errors
**Solution**: 
1. Go to Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"
4. Save the settings

## 🎨 Custom Domain Setup

If you want to use a custom domain:

1. Add a `CNAME` file to the `public` folder:
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. Configure DNS records at your domain provider:
   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   yourusername.github.io
   ```

3. In your repository settings → Pages, add your custom domain

4. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/', // Change from '/repository-name/' to '/'
     // ... rest of config
   });
   ```

## 📊 Monitoring Deployments

### View Deployment Status
1. Go to **Actions** tab
2. Click on the latest workflow run
3. Review build logs and deployment status

### View Live Site
After successful deployment, visit:
- GitHub Pages URL: `https://yourusername.github.io/khalilcharfi.github.io`
- Or your custom domain if configured

## 🔄 Redeploying

The workflow automatically redeploys when you:
- Push to `main` or `next` branch
- Manually trigger via "Run workflow" button in Actions tab

To force a redeployment without changes:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## 📝 Workflow Customization

### Deploy Only from Main Branch
Edit `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches: [ main ]  # Remove 'next'
```

### Add Build Notifications
Add Slack/Discord notifications:
```yaml
- name: Notify on failure
  if: failure()
  uses: some-notification-action
  with:
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Cache Node Modules
Already enabled with:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # Caches node_modules
```

## 🎉 Success Checklist

- [ ] GitHub Secrets configured
- [ ] GitHub Pages enabled with "GitHub Actions" source
- [ ] Workflow file pushed to repository
- [ ] First deployment successful
- [ ] Site accessible at GitHub Pages URL
- [ ] Chatbot working (if enabled)
- [ ] All translations loading correctly
- [ ] No console errors in browser
- [ ] Development elements hidden in production
- [ ] Service worker functioning
- [ ] PWA installable

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Gemini API Documentation](https://ai.google.dev/tutorials/web_quickstart)

## 🆘 Need Help?

If you encounter issues:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review workflow logs in the Actions tab
3. Check browser console for errors
4. Refer to the [GITHUB_ENV_GUIDE.md](./GITHUB_ENV_GUIDE.md) for environment variable details

---

**Pro Tip**: Use the `workflow_dispatch` trigger to manually deploy without pushing code. Just go to Actions → Deploy to GitHub Pages → Run workflow.

