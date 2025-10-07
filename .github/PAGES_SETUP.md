# 🚀 GitHub Pages Setup Guide

## 🔧 **Required Setup Steps**

### **1. Enable GitHub Pages**
1. Go to your repository **Settings**
2. Navigate to **Pages** section
3. Under **Source**, select **"GitHub Actions"**
4. Save the settings

### **2. Create Deployment Environments**

#### **Production Environment:**
1. Go to **Settings** → **Environments**
2. Click **"New environment"**
3. Name: `github-pages`
4. Click **"Configure environment"**
5. Add protection rules if needed:
   - ✅ **Required reviewers** (optional)
   - ✅ **Wait timer** (optional)
6. Click **"Save protection rules"**

#### **Staging Environment:**
1. Go to **Settings** → **Environments**
2. Click **"New environment"**
3. Name: `github-pages-staging`
4. Click **"Configure environment"**
5. Add protection rules if needed
6. Click **"Save protection rules"**

### **3. Verify Permissions**
Ensure your repository has the following permissions:
- ✅ **Actions** enabled
- ✅ **Pages** enabled
- ✅ **Contents** read access
- ✅ **Metadata** read access

## 🧪 **Test Deployment**

### **Run Test Workflow:**
```bash
# Test staging deployment
gh workflow run test-deploy.yml -f test_environment=staging

# Test production deployment
gh workflow run test-deploy.yml -f test_environment=production
```

### **Check Deployment Status:**
```bash
# View workflow runs
gh run list --workflow=test-deploy.yml

# View specific run
gh run view <run-id> --log
```

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **1. "Unable to get ACTIONS_ID_TOKEN_REQUEST_URL"**
**Solution:** Ensure the workflow has the correct permissions:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

#### **2. "Environment not found"**
**Solution:** Create the required environments:
- `github-pages` (for production)
- `github-pages-staging` (for staging)

#### **3. "Pages build failed"**
**Solution:** Check the build output and ensure:
- All required files are present
- No build errors
- Proper file structure

#### **4. "Permission denied"**
**Solution:** Verify repository settings:
- Actions are enabled
- Pages are enabled
- Correct source is selected

## 📋 **Deployment Workflow**

### **Automatic Deployment:**
- **Push to `main`** → Deploys to production
- **Push to `next`** → Deploys to staging
- **Manual trigger** → Choose environment

### **Manual Deployment:**
```bash
# Deploy to production
gh workflow run deploy.yml -f environment=production

# Deploy to staging
gh workflow run deploy.yml -f environment=staging
```

## 🔒 **Security Considerations**

### **Environment Protection:**
- **Production:** Consider adding required reviewers
- **Staging:** Can be auto-deployed
- **Secrets:** Store in environment-specific secrets if needed

### **Branch Protection:**
- Require pull request reviews
- Require status checks
- Require up-to-date branches

## 📊 **Monitoring**

### **Check Deployment Status:**
1. Go to **Actions** tab
2. Find your deployment workflow
3. Check the logs for any errors
4. Verify the deployment URL

### **View Deployed Site:**
- **Production:** `https://khalilcharfi.github.io`
- **Staging:** `https://khalilcharfi.github.io` (next branch)

## 🎯 **Next Steps**

1. ✅ **Enable GitHub Pages** in repository settings
2. ✅ **Create environments** (github-pages, github-pages-staging)
3. ✅ **Test deployment** using test-deploy.yml
4. ✅ **Verify permissions** are correct
5. ✅ **Run main deployment** workflow

---

*Follow these steps to set up GitHub Pages deployment* 🚀
*Last updated: $(date)*
