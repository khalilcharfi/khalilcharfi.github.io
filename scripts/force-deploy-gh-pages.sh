#!/bin/bash

# Force deploy to gh-pages branch
# This script builds the project and force pushes to gh-pages

set -e

echo "🚀 Force Deploying to gh-pages branch..."

# Build the project
echo "🏗️ Building project..."
npm run build:prod

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found. Build failed."
    exit 1
fi

echo "✅ Build completed successfully"

# Store current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📋 Current branch: $CURRENT_BRANCH"

# Create or checkout gh-pages branch
echo "📋 Setting up gh-pages branch..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "📋 gh-pages branch exists, checking out..."
    git checkout gh-pages
    git pull origin gh-pages
else
    echo "📋 Creating gh-pages branch..."
    git checkout --orphan gh-pages
fi

# Remove all files except .git
echo "🧹 Cleaning gh-pages branch..."
git rm -rf . || true

# Copy dist contents to root
echo "📦 Copying built files..."
cp -r dist/* .

# Add all files
git add .

# Commit changes
echo "💾 Committing changes..."
git commit --no-verify -m "🚀 Force Deploy from $CURRENT_BRANCH ($(git rev-parse --short HEAD))

📊 Build Info:
- Source Branch: $CURRENT_BRANCH
- Commit: $(git rev-parse HEAD)
- Build Time: $(date -u)
- Bundle Size: $(find . -name '*.js' -o -name '*.css' | xargs gzip -c | wc -c | awk '{print int($1/1024) " KB"}')

🤖 Force deployed by manual script"

# Force push to gh-pages
echo "🚀 Force pushing to gh-pages..."
git push origin gh-pages --force

echo "✅ Successfully force deployed to gh-pages branch!"

# Return to original branch
echo "🔄 Returning to $CURRENT_BRANCH branch..."
git checkout $CURRENT_BRANCH

echo "🎉 Force deployment completed!"
echo "🌐 Your site should be available at: https://khalilcharfi.github.io"
