#!/usr/bin/env node

/**
 * Automated Accessibility Testing Script
 * Tests using Lighthouse and axe-core
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(70) + '\n');
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.blue);
}

/**
 * Check if development server is running
 */
async function checkDevServer(port = 5181) {
  return new Promise((resolve) => {
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 2000
    };

    const req = http.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

/**
 * Run Lighthouse accessibility audit
 */
async function runLighthouse(port = 5181) {
  logSection('Running Lighthouse Accessibility Audit');

  return new Promise((resolve, reject) => {
    const args = [
      `http://localhost:${port}`,
      '--only-categories=accessibility',
      '--output=json',
      '--output=html',
      '--output-path=./test-results/lighthouse-report',
      '--chrome-flags="--headless --no-sandbox"',
      '--quiet'
    ];

    log('Starting Lighthouse audit...', colors.cyan);
    logInfo(`URL: http://localhost:${port}`);
    logInfo('Categories: Accessibility');

    const lighthouse = spawn('npx', ['lighthouse', ...args], {
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    lighthouse.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write('.');
    });

    lighthouse.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    lighthouse.on('close', (code) => {
      console.log(''); // New line after dots

      if (code === 0) {
        try {
          const reportPath = path.join(process.cwd(), 'test-results', 'lighthouse-report.report.json');
          
          if (fs.existsSync(reportPath)) {
            const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
            const accessibilityScore = report.categories.accessibility.score * 100;
            
            logSuccess(`Lighthouse audit completed!`);
            console.log('\n' + '-'.repeat(70));
            log(`Accessibility Score: ${accessibilityScore}/100`, 
              accessibilityScore >= 90 ? colors.green : 
              accessibilityScore >= 75 ? colors.yellow : colors.red);
            console.log('-'.repeat(70));

            // Show audit details
            const audits = report.categories.accessibility.auditRefs;
            let passed = 0;
            let failed = 0;
            let warnings = 0;

            audits.forEach(auditRef => {
              const audit = report.audits[auditRef.id];
              if (audit.score === 1) passed++;
              else if (audit.score === 0) failed++;
              else warnings++;
            });

            console.log(`\n${colors.green}Passed: ${passed}${colors.reset}`);
            console.log(`${colors.yellow}Warnings: ${warnings}${colors.reset}`);
            console.log(`${colors.red}Failed: ${failed}${colors.reset}`);

            // Show failed audits
            if (failed > 0) {
              console.log(`\n${colors.red}Failed Audits:${colors.reset}`);
              audits.forEach(auditRef => {
                const audit = report.audits[auditRef.id];
                if (audit.score === 0) {
                  console.log(`  • ${audit.title}`);
                  if (audit.description) {
                    console.log(`    ${audit.description.replace(/<[^>]*>/g, '')}`);
                  }
                }
              });
            }

            logInfo(`\nDetailed report: test-results/lighthouse-report.report.html`);
            resolve({ score: accessibilityScore, passed, failed, warnings });
          } else {
            logError('Lighthouse report not found');
            resolve({ score: 0, passed: 0, failed: 0, warnings: 0 });
          }
        } catch (error) {
          logError(`Error parsing Lighthouse report: ${error.message}`);
          resolve({ score: 0, passed: 0, failed: 0, warnings: 0 });
        }
      } else {
        logError(`Lighthouse failed with code ${code}`);
        if (errorOutput) {
          console.log('\nError output:', errorOutput);
        }
        reject(new Error(`Lighthouse exited with code ${code}`));
      }
    });
  });
}

/**
 * Run axe-core accessibility tests
 */
async function runAxeCore(port = 5181) {
  logSection('Running axe-core Accessibility Tests');

  const axeTestScript = `
    const { AxePuppeteer } = require('@axe-core/puppeteer');
    const puppeteer = require('puppeteer');
    const fs = require('fs');
    const path = require('path');

    (async () => {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setBypassCSP(true);
      
      try {
        await page.goto('http://localhost:${port}', {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        // Wait for app to load
        await page.waitForSelector('#root', { timeout: 10000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const results = await new AxePuppeteer(page)
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        // Save results
        const resultsDir = path.join(process.cwd(), 'test-results');
        if (!fs.existsSync(resultsDir)) {
          fs.mkdirSync(resultsDir, { recursive: true });
        }

        fs.writeFileSync(
          path.join(resultsDir, 'axe-results.json'),
          JSON.stringify(results, null, 2)
        );

        // Generate HTML report
        const html = generateHTMLReport(results);
        fs.writeFileSync(
          path.join(resultsDir, 'axe-report.html'),
          html
        );

        console.log(JSON.stringify({
          violations: results.violations.length,
          passes: results.passes.length,
          incomplete: results.incomplete.length,
          inapplicable: results.inapplicable.length
        }));

      } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
      } finally {
        await browser.close();
      }
    })();

    function generateHTMLReport(results) {
      return \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>axe Accessibility Report</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .card { padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .violations { background: #fee; border-left: 4px solid #c33; }
    .passes { background: #efe; border-left: 4px solid #3c3; }
    .incomplete { background: #ffc; border-left: 4px solid #cc3; }
    .number { font-size: 2em; font-weight: bold; margin: 10px 0; }
    .violation-item { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 4px; }
    .impact { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; font-weight: bold; }
    .critical { background: #c33; color: white; }
    .serious { background: #e66; color: white; }
    .moderate { background: #fc6; color: #333; }
    .minor { background: #9cf; color: #333; }
    details { margin: 10px 0; }
    summary { cursor: pointer; font-weight: bold; padding: 8px; background: #eee; border-radius: 4px; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
    .node { margin: 8px 0; padding: 8px; background: white; border-left: 3px solid #666; }
  </style>
</head>
<body>
  <h1>🔍 axe Accessibility Report</h1>
  <p>Generated: \${new Date().toLocaleString()}</p>
  
  <div class="summary">
    <div class="card violations">
      <div>Violations</div>
      <div class="number">\${results.violations.length}</div>
    </div>
    <div class="card passes">
      <div>Passes</div>
      <div class="number">\${results.passes.length}</div>
    </div>
    <div class="card incomplete">
      <div>Incomplete</div>
      <div class="number">\${results.incomplete.length}</div>
    </div>
  </div>

  <h2>Violations</h2>
  \${results.violations.length === 0 ? '<p>✓ No violations found!</p>' : results.violations.map(v => \`
    <div class="violation-item">
      <h3>\${v.help}</h3>
      <span class="impact \${v.impact}">\${v.impact}</span>
      <p>\${v.description}</p>
      <p><strong>Affects \${v.nodes.length} element(s)</strong></p>
      <details>
        <summary>View Details</summary>
        <p><strong>Tags:</strong> \${v.tags.join(', ')}</p>
        <p><strong>Help URL:</strong> <a href="\${v.helpUrl}" target="_blank">\${v.helpUrl}</a></p>
        <h4>Affected Elements:</h4>
        \${v.nodes.map(node => \`
          <div class="node">
            <p><strong>Element:</strong> <code>\${node.html}</code></p>
            <p><strong>Selector:</strong> <code>\${node.target.join(', ')}</code></p>
            \${node.failureSummary ? \`<p><strong>Issue:</strong> \${node.failureSummary}</p>\` : ''}
          </div>
        \`).join('')}
      </details>
    </div>
  \`).join('')}

  <h2>Incomplete Tests</h2>
  \${results.incomplete.length === 0 ? '<p>No incomplete tests</p>' : results.incomplete.map(i => \`
    <div class="violation-item">
      <h3>\${i.help}</h3>
      <p>\${i.description}</p>
      <p><strong>Affects \${i.nodes.length} element(s)</strong></p>
    </div>
  \`).join('')}
</body>
</html>\`;
    }
  `;

  // Write temporary test script (use .cjs for CommonJS)
  const tempScriptPath = path.join(process.cwd(), 'test-results', 'axe-test-temp.cjs');
  fs.mkdirSync(path.dirname(tempScriptPath), { recursive: true });
  fs.writeFileSync(tempScriptPath, axeTestScript);

  return new Promise((resolve, reject) => {
    log('Starting axe-core tests...', colors.cyan);
    logInfo('Running WCAG 2.0 AA and WCAG 2.1 AA tests');

    const axe = spawn('node', [tempScriptPath], {
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    axe.stdout.on('data', (data) => {
      output += data.toString();
    });

    axe.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    axe.on('close', (code) => {
      // Clean up temp script
      try {
        fs.unlinkSync(tempScriptPath);
      } catch (e) {}

      if (code === 0) {
        try {
          const results = JSON.parse(output.trim().split('\n').pop());
          
          logSuccess('axe-core tests completed!');
          console.log('\n' + '-'.repeat(70));
          log(`Violations: ${results.violations}`, 
            results.violations === 0 ? colors.green : colors.red);
          log(`Passes: ${results.passes}`, colors.green);
          log(`Incomplete: ${results.incomplete}`, colors.yellow);
          console.log('-'.repeat(70));

          if (results.violations > 0) {
            logWarning(`Found ${results.violations} accessibility violation(s)`);
          } else {
            logSuccess('No violations found!');
          }

          logInfo('\nDetailed report: test-results/axe-report.html');
          resolve(results);
        } catch (error) {
          logError(`Error parsing axe results: ${error.message}`);
          if (errorOutput) {
            console.log('\nError output:', errorOutput);
          }
          resolve({ violations: -1, passes: 0, incomplete: 0 });
        }
      } else {
        logError(`axe-core failed with code ${code}`);
        if (errorOutput) {
          console.log('\nError output:', errorOutput);
        }
        reject(new Error(`axe-core exited with code ${code}`));
      }
    });
  });
}

/**
 * Main test runner
 */
async function main() {
  console.clear();
  logSection('🔍 Accessibility Testing Suite');
  log('Testing accessibility with Lighthouse and axe-core\n', colors.cyan);

  // Auto-detect port
  let port = 5181;
  logInfo('Detecting development server port...');
  
  for (const testPort of [5181, 5173, 5177, 5174, 5175, 5176, 5178, 5179, 5180]) {
    if (await checkDevServer(testPort)) {
      port = testPort;
      logSuccess(`Found server on port ${port}\n`);
      break;
    }
  }

  const serverRunning = await checkDevServer(port);
  if (!serverRunning) {
    logError(`Development server is not running on http://localhost:${port}`);
    logInfo('Please start the dev server first:');
    console.log('  npm run dev\n');
    process.exit(1);
  }

  // Create results directory
  const resultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  try {
    // Run tests
    const lighthouseResults = await runLighthouse(port);
    const axeResults = await runAxeCore(port);

    // Final summary
    logSection('📊 Test Summary');

    console.log('\n' + colors.bright + 'Lighthouse:' + colors.reset);
    console.log(`  Score: ${lighthouseResults.score}/100`);
    console.log(`  Passed: ${lighthouseResults.passed}`);
    console.log(`  Failed: ${lighthouseResults.failed}`);
    console.log(`  Warnings: ${lighthouseResults.warnings}`);

    console.log('\n' + colors.bright + 'axe-core:' + colors.reset);
    console.log(`  Violations: ${axeResults.violations}`);
    console.log(`  Passes: ${axeResults.passes}`);
    console.log(`  Incomplete: ${axeResults.incomplete}`);

    console.log('\n' + colors.bright + 'Reports:' + colors.reset);
    console.log(`  • test-results/lighthouse-report.report.html`);
    console.log(`  • test-results/axe-report.html`);

    // Overall result
    const overallPass = lighthouseResults.score >= 90 && axeResults.violations === 0;
    
    console.log('\n' + '='.repeat(70));
    if (overallPass) {
      logSuccess('✓ All accessibility tests passed!');
    } else {
      logWarning('⚠ Some accessibility issues found - review reports for details');
    }
    console.log('='.repeat(70) + '\n');

    process.exit(overallPass ? 0 : 1);

  } catch (error) {
    logError(`\nTest suite failed: ${error.message}`);
    process.exit(1);
  }
}

// Run tests
main().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});

