#!/usr/bin/env node

/**
 * Test Runner Script
 * Orchestrates running all tests (E2E and Unit) and generates combined reports
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Ensure test-results directory exists
function ensureTestResultsDir() {
  const dirs = [
    'test-results',
    'test-results/screenshots',
    'test-results/videos',
    'test-results/html-report',
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Print colored output
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Print section header
function printHeader(title) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${title}`, 'bright');
  log('='.repeat(60) + '\n', 'cyan');
}

// Run unit tests with Jest
async function runUnitTests() {
  printHeader('Running Unit Tests (Jest)');
  
  try {
    const { stdout, stderr } = await execPromise('npx jest --verbose --coverage');
    log(stdout, 'reset');
    if (stderr) log(stderr, 'yellow');
    log('✓ Unit tests completed successfully', 'green');
    return { success: true, output: stdout };
  } catch (error) {
    log('✗ Unit tests failed', 'red');
    if (error.stdout) log(error.stdout, 'reset');
    if (error.stderr) log(error.stderr, 'red');
    return { success: false, output: error.stdout || error.message };
  }
}

// Run E2E tests with Playwright
async function runE2ETests() {
  printHeader('Running E2E Tests (Playwright)');
  
  try {
    const { stdout, stderr } = await execPromise('npx playwright test --reporter=list');
    log(stdout, 'reset');
    if (stderr) log(stderr, 'yellow');
    log('✓ E2E tests completed successfully', 'green');
    return { success: true, output: stdout };
  } catch (error) {
    log('✗ E2E tests failed', 'red');
    if (error.stdout) log(error.stdout, 'reset');
    if (error.stderr) log(error.stderr, 'red');
    return { success: false, output: error.stdout || error.message };
  }
}

// Generate summary report
function generateSummary(unitResult, e2eResult, startTime) {
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  printHeader('Test Summary');
  
  log(`Total Duration: ${duration}s\n`, 'cyan');
  
  log('Unit Tests:', 'bright');
  log(`  Status: ${unitResult.success ? '✓ PASSED' : '✗ FAILED'}`, unitResult.success ? 'green' : 'red');
  
  log('\nE2E Tests:', 'bright');
  log(`  Status: ${e2eResult.success ? '✓ PASSED' : '✗ FAILED'}`, e2eResult.success ? 'green' : 'red');
  
  log('\n' + '='.repeat(60), 'cyan');
  
  const allPassed = unitResult.success && e2eResult.success;
  
  if (allPassed) {
    log('\n🎉 All tests passed!', 'green');
    log('\nNext steps:', 'bright');
    log('  - View HTML report: npm run test:report', 'cyan');
    log('  - View coverage: open test-results/coverage/index.html', 'cyan');
  } else {
    log('\n⚠️  Some tests failed', 'red');
    log('\nTroubleshooting:', 'bright');
    log('  - Check test output above for details', 'cyan');
    log('  - Review screenshots in test-results/screenshots/', 'cyan');
    log('  - Review videos in test-results/videos/', 'cyan');
  }
  
  log('');
  
  return allPassed;
}

// Save summary to file
function saveSummaryToFile(unitResult, e2eResult, duration, allPassed) {
  const summary = {
    timestamp: new Date().toISOString(),
    duration: duration,
    unitTests: {
      status: unitResult.success ? 'passed' : 'failed',
    },
    e2eTests: {
      status: e2eResult.success ? 'passed' : 'failed',
    },
    overallStatus: allPassed ? 'passed' : 'failed',
  };

  const summaryPath = path.join('test-results', 'test-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  log(`Summary saved to: ${summaryPath}`, 'cyan');
}

// Main execution
async function main() {
  const startTime = Date.now();
  
  log('\n🧪 Hebrew Typing Games - Automated Test Suite', 'bright');
  log('Starting comprehensive test execution...\n', 'cyan');
  
  // Ensure directories exist
  ensureTestResultsDir();
  
  // Run tests
  const unitResult = await runUnitTests();
  const e2eResult = await runE2ETests();
  
  // Generate summary
  const allPassed = generateSummary(unitResult, e2eResult, startTime);
  
  // Save summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  saveSummaryToFile(unitResult, e2eResult, duration, allPassed);
  
  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log('\n✗ Unhandled error occurred:', 'red');
  log(error.stack || error.message, 'red');
  process.exit(1);
});

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { runUnitTests, runE2ETests, generateSummary };




