#!/bin/bash

# GitHub Pages Deployment Script
# This script helps you deploy your portfolio to GitHub Pages with environment variables

set -e  # Exit on any error

echo "🚀 Starting GitHub Pages deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if gh-pages is installed
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js and npm."
    exit 1
fi

# Check if we have a .env.production file
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.production
        echo "📝 Please edit .env.production with your production values before deploying."
        echo "   Don't forget to set your actual GEMINI_API_KEY!"
        read -p "Press Enter to continue after editing .env.production..."
    else
        echo "❌ Error: No .env.production or .env.example found."
        echo "   Please create .env.production with your production environment variables."
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build for production
echo "🔨 Building for production..."
npm run build:prod

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "🎉 Deployment complete!"
echo "🌐 Your site should be available at: https://yourusername.github.io/khalilcharfi.github.io"
echo ""
echo "📋 Next steps:"
echo "   1. Check your GitHub repository settings for Pages configuration"
echo "   2. Verify your site is working correctly"
echo "   3. Test the chatbot functionality"
echo "   4. Check that development elements are hidden"
