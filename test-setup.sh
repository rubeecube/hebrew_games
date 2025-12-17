#!/bin/bash

# Test Setup Script
# Installs all dependencies needed for automated testing

echo "🧪 Hebrew Typing Games - Test Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✓ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎭 Installing Playwright browsers..."
npx playwright install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "You can now run tests:"
echo "  npm test              - Run all tests"
echo "  npm run test:e2e      - Run E2E tests only"
echo "  npm run test:unit     - Run unit tests only"
echo "  npm run test:report   - View test report"
echo ""




