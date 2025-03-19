const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Console colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

// Utility functions
const utils = {
  logSuccess(message) {
    console.log(`${colors.green}✓ ${message}${colors.reset}`);
  },

  logError(message, error) {
    console.error(`${colors.red}✗ ${message}${colors.reset}`);
    if (error) {
      console.error(`${colors.red}${error.stack}${colors.reset}`);
    }
  },

  logInfo(message) {
    console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
  },

  logWarning(message) {
    console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
  }
};

// Main generator class
class SiteGenerator {
  constructor() {
    this.scriptDir = __dirname;
    this.rootDir = path.join(this.scriptDir, '..');
  }

  async generate() {
    try {
      utils.logInfo('Starting site generation...');
      
      // Step 1: Run the build script to generate language pages
      utils.logInfo('Generating language pages...');
      await this.runScript('build.js');
      
      utils.logSuccess('Site generation completed successfully!');
    } catch (error) {
      utils.logError('Failed to generate site', error);
      process.exit(1);
    }
  }

  async runScript(scriptName) {
    try {
      const scriptPath = path.join(this.scriptDir, scriptName);
      
      // Check if script exists
      if (!fs.existsSync(scriptPath)) {
        throw new Error(`Script not found: ${scriptPath}`);
      }
      
      // Run the script
      require(scriptPath);
      return true;
    } catch (error) {
      utils.logError(`Failed to run script: ${scriptName}`, error);
      throw error;
    }
  }
}

// Run generator
const generator = new SiteGenerator();
generator.generate().catch(error => {
  utils.logError('Fatal error during site generation', error);
  process.exit(1);
});


// Update the CONFIG object to use dist as output directory
const CONFIG = {
  paths: {
    // ... other paths
    output: path.join(__dirname, '../')
  }
  // ... other config
};