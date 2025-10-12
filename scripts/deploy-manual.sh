#!/bin/bash
set -e

echo "🚀 Manual Deployment Script for GitHub Pages"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build production
echo -e "${BLUE}📦 Step 1: Building production...${NC}"
npm run build:prod
echo -e "${GREEN}✅ Build complete!${NC}"
echo ""

# Step 2: Navigate to dist and verify large files
echo -e "${BLUE}📊 Step 2: Verifying file sizes...${NC}"
cd dist
echo "Large JS files:"
ls -lh assets/*.js | grep -E 'vendor-|index-CDzn' | awk '{print "  " $9 ": " $5}'
echo ""

# Step 3: Initialize git and configure
echo -e "${BLUE}🔧 Step 3: Initializing git repository...${NC}"
rm -rf .git
git init
git config user.name "Khalil Charfi"
git config user.email "khalil.charfi@outlook.com"

# Disable LFS completely
git config lfs.repositoryformatversion ""
git config filter.lfs.required false
git config filter.lfs.clean "cat"
git config filter.lfs.smudge "cat"
git config filter.lfs.process ""
git config core.autocrlf false
git config core.eol lf

echo -e "${GREEN}✅ Git configured (LFS disabled)${NC}"
echo ""

# Step 4: Create branch and stage files
echo -e "${BLUE}📋 Step 4: Staging files...${NC}"
git branch -M gh-pages
git add -A

# Verify staging
staged_count=$(git diff --cached --numstat | wc -l | tr -d ' ')
echo -e "${GREEN}✅ Staged $staged_count files${NC}"
echo ""

# Step 5: Verify git object sizes for large JS files
echo -e "${BLUE}🔍 Step 5: Verifying git object sizes...${NC}"
verification_failed=false

for jsfile in assets/vendor-*.js assets/index-CDzn_0SX.js; do
  if [ -f "$jsfile" ]; then
    filesize=$(wc -c < "$jsfile")
    object_id=$(git ls-files -s "$jsfile" | awk '{print $2}')
    git_size=$(git cat-file -s "$object_id" 2>/dev/null || echo "0")
    
    if [ "$filesize" -eq "$git_size" ]; then
      echo -e "  ${GREEN}✅${NC} $jsfile: $filesize bytes (git: $git_size bytes)"
    else
      echo -e "  ${RED}❌${NC} $jsfile: FILE=$filesize bytes, GIT=$git_size bytes"
      verification_failed=true
    fi
  fi
done

if [ "$verification_failed" = true ]; then
  echo -e "${RED}❌ Size verification failed! Git is truncating files.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ All file sizes verified!${NC}"
echo ""

# Step 6: Commit
echo -e "${BLUE}💾 Step 6: Creating commit...${NC}"
commit_message="Deploy: Manual production build $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$commit_message"
echo -e "${GREEN}✅ Committed!${NC}"
echo ""

# Step 7: Push to GitHub
echo -e "${BLUE}📤 Step 7: Pushing to gh-pages branch...${NC}"
echo -e "${YELLOW}⚠️  This will force push to gh-pages!${NC}"
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}⏸️  Deployment cancelled.${NC}"
  exit 0
fi

git push -f https://github.com/khalilcharfi/khalilcharfi.github.io.git gh-pages

echo -e "${GREEN}✅ Push complete!${NC}"
echo ""

# Step 8: Verify on GitHub
echo -e "${BLUE}🔍 Step 8: Verifying on GitHub...${NC}"
cd ..
sleep 3
git fetch origin gh-pages 2>/dev/null

# Check a large file
large_file="assets/vendor-three-C2c03BIj.js"
if git show origin/gh-pages:$large_file > /dev/null 2>&1; then
  github_size=$(git show origin/gh-pages:$large_file | wc -c | tr -d ' ')
  local_size=$(wc -c < dist/$large_file | tr -d ' ')
  
  if [ "$github_size" -eq "$local_size" ]; then
    echo -e "${GREEN}✅ Verified: $large_file is $github_size bytes on GitHub${NC}"
  else
    echo -e "${RED}⚠️  Size mismatch: Local=$local_size bytes, GitHub=$github_size bytes${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Could not verify file on GitHub${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "  1. Wait 1-2 minutes for GitHub Pages to deploy"
echo "  2. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)"
echo "  3. Visit: https://khalilcharfi.github.io"
echo ""
echo "🔍 To check file size on live site:"
echo "  curl -sI https://khalilcharfi.github.io/$large_file | grep content-length"

