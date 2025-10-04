# 🚀 Deployment Quick Start

Get your portfolio live on GitHub Pages in 5 minutes!

## ⚡ Quick Setup (5 Steps)

### 1️⃣ Configure GitHub Secrets (2 minutes)

Go to your GitHub repository:
```
Settings → Secrets and variables → Actions → New repository secret
```

Add this **required** secret:
- **Name**: `GEMINI_API_KEY`
- **Value**: Your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 2️⃣ Enable GitHub Pages (30 seconds)

Go to:
```
Settings → Pages → Source → Select "GitHub Actions" → Save
```

### 3️⃣ Push Your Code (30 seconds)

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 4️⃣ Wait for Deployment (2 minutes)

Watch the progress:
```
Repository → Actions tab → "Deploy to GitHub Pages" workflow
```

### 5️⃣ Visit Your Site! 🎉

Your site will be live at:
```
https://YOUR_USERNAME.github.io/khalilcharfi.github.io
```

---

## 🔧 Optional Configuration

### Additional Secrets (All Optional - Have Defaults)

| Secret Name | Default | Description |
|------------|---------|-------------|
| `VITE_ENABLE_CHATBOT` | `true` | Enable AI chatbot |
| `VITE_ENABLE_DYNAMIC_CONTENT` | `true` | Enable dynamic content |
| `VITE_SHOW_RECOMMENDED_SECTIONS` | `true` | Show "Recommended for you" section |

---

## ✅ Verify Setup

Before pushing, run:
```bash
npm run deploy:verify
```

This checks if everything is configured correctly.

---

## 🐛 Troubleshooting

### Build Fails?
- ✅ Check that `GEMINI_API_KEY` secret is set
- ✅ Review the error in the Actions tab

### Site Not Loading?
- ✅ Ensure GitHub Pages source is set to "GitHub Actions"
- ✅ Wait 2-3 minutes after deployment completes
- ✅ Check if workflow completed successfully

### Chatbot Not Working?
- ✅ Verify `GEMINI_API_KEY` is correct
- ✅ Check browser console for errors
- ✅ Ensure API key has proper permissions

---

## 📚 Detailed Documentation

For complete instructions, see:
- [Full GitHub Pages Deployment Guide](./GITHUB_PAGES_DEPLOYMENT.md)
- [Environment Variables Guide](./GITHUB_ENV_GUIDE.md)

---

## 🆘 Still Having Issues?

1. Run: `npm run deploy:verify`
2. Check: Actions tab for error logs
3. Review: [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md)
4. Inspect: Browser console for errors

---

## 🎯 What the Workflow Does

```
1. Checkout code
2. Install Node.js 18
3. Install dependencies (npm ci)
4. Create production .env file with your secrets
5. Build project (npm run build:prod)
6. Deploy to GitHub Pages
```

All automatically! ✨

---

**Pro Tip**: You can manually trigger deployment anytime:
```
Actions → Deploy to GitHub Pages → Run workflow → Run workflow
```

