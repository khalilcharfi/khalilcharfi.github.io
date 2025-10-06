#!/bin/bash

# Setup Git Hooks Script
# This script installs Git hooks to run CI tests before pushing

echo "🔧 Setting up Git hooks..."
echo ""

# Get the git hooks directory
HOOKS_DIR=".git/hooks"

# Check if .git directory exists
if [ ! -d ".git" ]; then
  echo "❌ Error: Not a git repository"
  exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# Create pre-push hook
cat > "$HOOKS_DIR/pre-push" << 'EOF'
#!/bin/bash

# Pre-push hook to run CI tests
# This ensures all tests pass before pushing to remote

echo ""
echo "🚀 Running pre-push checks..."
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Flag to track if any test fails
FAILED=0

# Function to run a test and track failures
run_test() {
  local test_name=$1
  local test_command=$2
  
  echo "📋 Running: $test_name"
  echo "   Command: $test_command"
  echo ""
  
  if eval "$test_command"; then
    echo -e "${GREEN}✅ $test_name passed${NC}"
    echo ""
    return 0
  else
    echo -e "${RED}❌ $test_name failed${NC}"
    echo ""
    FAILED=1
    return 1
  fi
}

# Run translation validation
run_test "Translation Validation" "npm run ci:validate-translations"

# Check if we should skip build tests (for speed)
if [ "$SKIP_BUILD_TESTS" = "1" ]; then
  echo -e "${YELLOW}⚠️  Skipping build tests (SKIP_BUILD_TESTS=1)${NC}"
  echo ""
else
  # Run build verification
  run_test "Build Verification" "npm run ci:build"
  
  # Run bundle size check
  run_test "Bundle Size Check" "npm run ci:bundle-size"
fi

# Summary
echo "================================"
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All pre-push checks passed!${NC}"
  echo ""
  echo "Proceeding with push..."
  exit 0
else
  echo -e "${RED}❌ Some pre-push checks failed!${NC}"
  echo ""
  echo "Push aborted. Please fix the errors above."
  echo ""
  echo "To skip these checks (not recommended), use:"
  echo "  git push --no-verify"
  echo ""
  echo "To skip only build tests (faster), use:"
  echo "  SKIP_BUILD_TESTS=1 git push"
  exit 1
fi
EOF

# Make the hook executable
chmod +x "$HOOKS_DIR/pre-push"

echo "✅ Pre-push hook installed successfully!"
echo ""

# Create pre-commit hook (optional, lighter checks)
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash

# Pre-commit hook for quick validation
# Runs lighter checks before committing

echo ""
echo "🔍 Running pre-commit checks..."
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Check for translation validation only (fast)
echo "📋 Validating translations..."
if npm run ci:validate-translations > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Translations validated${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}❌ Translation validation failed${NC}"
  echo ""
  echo "Run 'npm run ci:validate-translations' to see details"
  echo ""
  echo "To skip this check (not recommended), use:"
  echo "  git commit --no-verify"
  exit 1
fi
EOF

# Make the hook executable
chmod +x "$HOOKS_DIR/pre-commit"

echo "✅ Pre-commit hook installed successfully!"
echo ""

# Summary
echo "================================"
echo "📝 Git Hooks Summary:"
echo ""
echo "✓ pre-commit:  Validates translations (fast)"
echo "✓ pre-push:    Runs full CI test suite"
echo ""
echo "🎯 Usage:"
echo ""
echo "  Normal commit/push:"
echo "    git commit -m 'message'"
echo "    git push"
echo ""
echo "  Skip hooks (not recommended):"
echo "    git commit --no-verify"
echo "    git push --no-verify"
echo ""
echo "  Skip build tests (faster push):"
echo "    SKIP_BUILD_TESTS=1 git push"
echo ""
echo "✨ Setup complete!"
