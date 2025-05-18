// wdio.conf.ts

import { config as dotenvConfig } from 'dotenv';
import type { Options, Services } from '@wdio/types';
import type { Config as WDIOConfig } from '@wdio/sync';

dotenvConfig(); // Load .env file

// Load environment variables
const isScheduled = process.env.SCHEDULED_RUN === 'true';
const testRailUserName = process.env.TESTRAIL_USERNAME;
const testRailApiToken = process.env.TESTRAIL_API_TOKEN;
const testRailDomain = process.env.TESTRAIL_HOST;
const testRailProjectId = process.env.TESTRAIL_PROJECT_ID;
const testRailSuiteId = process.env.TESTRAIL_SUITE_ID;

// Build the reporters array conditionally
const reporters: Options.Testrunner['reporters'] = [
  'spec',
  ['allure', {
    outputDir: 'allure-results',
    disableWebdriverStepsReporting: true,
    disableWebdriverScreenshotsReporting: false,
    addConsoleLogs: true,
  }]
];

// Conditionally add TestRail reporter
if (isScheduled && testRailUserName && testRailApiToken && testRailDomain && testRailProjectId && testRailSuiteId) {
  const TestRailReporter = require('wdio-testrail-reporter').default;
  reporters.push([
    TestRailReporter,
    {
      testRailsOptions: {
        domain: testRailDomain,
        username: testRailUserName,
        apiToken: testRailApiToken,
        projectId: parseInt(testRailProjectId, 10),
        suiteId: parseInt(testRailSuiteId, 10),
      },
      runName: `Automation Run - ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      includeAll: false,
      oneReport: true,
    }
  ]);
}

// WDIO Configuration
export const config: WDIOConfig = {
  runner: 'local',

  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true,
    },
  },

  specs: ['./test/specs/**/*.ts'],
  exclude: [],

  maxInstances: 1,

  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--headless', '--disable-gpu']
    }
  }],

  logLevel: 'info',
  baseUrl: 'https://ui.vision/demo/webtest/frames/',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: ['chromedriver'],

  framework: 'mocha',
  reporters,

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  before: async () => {
    await browser.setWindowSize(1920, 1080);
  }
};
