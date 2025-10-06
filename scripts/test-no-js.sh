#!/bin/bash

# Quick No-JS Testing Script
# Tests what users see when JavaScript is disabled

echo "🧪 Testing No-JS Mode"
echo "===================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}⚠️  dist folder not found. Building production version...${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Build failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} Build completed"
fi

# Check if preview server is running
if ! curl -s http://localhost:4173 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Preview server not running. Starting it...${NC}"
    npm run preview &
    SERVER_PID=$!
    echo "   Waiting for server to start..."
    sleep 5
else
    echo -e "${GREEN}✓${NC} Preview server is running"
    SERVER_PID=""
fi

echo ""

# Fetch HTML
echo "📄 Fetching HTML (simulating no-JS browser)..."
curl -s http://localhost:4173 > /tmp/no-js-test.html

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to fetch HTML${NC}"
    [ -n "$SERVER_PID" ] && kill $SERVER_PID
    exit 1
fi

echo -e "${GREEN}✓${NC} HTML fetched successfully"
echo ""

# Test for critical elements
echo "🔍 Checking for critical content..."
echo ""

# Function to check for content
check_content() {
    local pattern=$1
    local description=$2
    
    if grep -q "$pattern" /tmp/no-js-test.html; then
        echo -e "  ${GREEN}✓${NC} $description"
        return 0
    else
        echo -e "  ${RED}✗${NC} $description"
        return 1
    fi
}

# Run checks
PASS=0
FAIL=0

check_content "<!DOCTYPE html>" "DOCTYPE declaration" && ((PASS++)) || ((FAIL++))
check_content "<html" "HTML tag" && ((PASS++)) || ((FAIL++))
check_content "class=\"no-js\"" "No-JS class on HTML" && ((PASS++)) || ((FAIL++))
check_content "<title>" "Title tag" && ((PASS++)) || ((FAIL++))
check_content "Khalil Charfi" "Name in content" && ((PASS++)) || ((FAIL++))
check_content "<meta name=\"description\"" "Meta description" && ((PASS++)) || ((FAIL++))
check_content "application/ld+json" "Structured data (JSON-LD)" && ((PASS++)) || ((FAIL++))
check_content "og:title" "Open Graph tags" && ((PASS++)) || ((FAIL++))
check_content "twitter:card" "Twitter card tags" && ((PASS++)) || ((FAIL++))
check_content "no-js-banner" "No-JS warning banner" && ((PASS++)) || ((FAIL++))
check_content "static-content" "Static fallback content" && ((PASS++)) || ((FAIL++))
check_content "Full-Stack Engineer" "Professional title" && ((PASS++)) || ((FAIL++))
check_content "linkedin.com" "LinkedIn link" && ((PASS++)) || ((FAIL++))
check_content "github.com" "GitHub link" && ((PASS++)) || ((FAIL++))
check_content "<noscript>" "Noscript tag" && ((PASS++)) || ((FAIL++))
check_content "skip-link" "Skip to content link" && ((PASS++)) || ((FAIL++))

echo ""
echo "===================="
echo -e "Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC}"
echo ""

# Check for specific no-JS features
echo "🎨 Checking No-JS specific features..."
echo ""

check_content "no-js-banner.*role=\"status\"" "ARIA live region for banner" && ((PASS++)) || ((FAIL++))
check_content "static-content" "Static content section" && ((PASS++)) || ((FAIL++))
check_content "Get In Touch" "Contact section" && ((PASS++)) || ((FAIL++))
check_content "Core Technical Skills\|Core Skills" "Skills section" && ((PASS++)) || ((FAIL++))
check_content "Professional Experience" "Experience section" && ((PASS++)) || ((FAIL++))
check_content "Education" "Education section" && ((PASS++)) || ((FAIL++))
check_content "itemscope.*itemtype.*schema.org/Person" "Schema.org markup" && ((PASS++)) || ((FAIL++))

echo ""

# Check file size
FILE_SIZE=$(wc -c < /tmp/no-js-test.html)
FILE_SIZE_KB=$((FILE_SIZE / 1024))

echo "📊 HTML Statistics:"
echo "   File size: ${FILE_SIZE_KB} KB"
echo "   Lines: $(wc -l < /tmp/no-js-test.html)"
echo ""

# Validate HTML structure
echo "🔍 Validating HTML structure..."
echo ""

# Check for common issues
if grep -q "<script" /tmp/no-js-test.html; then
    echo -e "  ${GREEN}✓${NC} Script tags present (for JS-enabled browsers)"
fi

if grep -q "defer" /tmp/no-js-test.html; then
    echo -e "  ${GREEN}✓${NC} Scripts use defer attribute"
fi

if grep -q "onerror" /tmp/no-js-test.html; then
    echo -e "  ${GREEN}✓${NC} Script error handling present"
fi

echo ""

# Test with text browser (if available)
if command -v lynx &> /dev/null; then
    echo "📱 Testing with Lynx (text browser)..."
    echo "   (First 20 lines of text-only view)"
    echo ""
    lynx -dump http://localhost:4173 2>/dev/null | head -20
    echo "   ..."
    echo ""
elif command -v w3m &> /dev/null; then
    echo "📱 Testing with w3m (text browser)..."
    echo "   (First 20 lines of text-only view)"
    echo ""
    w3m -dump http://localhost:4173 2>/dev/null | head -20
    echo "   ..."
    echo ""
else
    echo -e "${YELLOW}ℹ️  Install lynx or w3m to test with text browsers${NC}"
    echo "   brew install lynx    # macOS"
    echo "   apt install lynx     # Linux"
    echo ""
fi

# Summary
echo "===================="
echo "📁 Full HTML saved to: /tmp/no-js-test.html"
echo ""
echo "💡 To view the full HTML:"
echo "   cat /tmp/no-js-test.html | less"
echo "   open /tmp/no-js-test.html  # macOS"
echo ""
echo "🧪 To test in browser:"
echo "   1. Open http://localhost:4173 (preview server)"
echo "   2. Open DevTools (F12)"
echo "   3. Cmd+Shift+P (Mac) or Ctrl+Shift+P (Win/Linux)"
echo "   4. Type 'Disable JavaScript' and select it"
echo "   5. Refresh the page"
echo ""
echo "📝 Note: Testing against production build (dist/) not dev server"
echo ""

# Cleanup
if [ -n "$SERVER_PID" ]; then
    echo "🧹 Stopping dev server..."
    kill $SERVER_PID 2>/dev/null
fi

# Exit with appropriate code
if [ $FAIL -gt 0 ]; then
    exit 1
else
    echo -e "${GREEN}✅ All checks passed!${NC}"
    exit 0
fi
