// /wdio.conf.ts
import { config as dotenvConfig } from 'dotenv';
import type { Options } from '@wdio/types';

dotenvConfig();

const isScheduled = process.env.SCHEDULED_RUN === 'true';
const testRailUserName = process.env.TESTRAIL_USERNAME;
const testRailApiToken = process.env.TESTRAIL_API_TOKEN;
const testRailDomain = process.env.TESTRAIL_HOST;
const testRailProjectId = process.env.TESTRAIL_PROJECT_ID;
const testRailSuiteId = process.env.TESTRAIL_SUITE_ID;

const reporters: Options.Testrunner['reporters'] = [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false
    }]
  ];

export const config: WebdriverIO.Config = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true
    }
  },
  specs: ['./test/specs/**/*.ts'],
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
  services: ['devtools'],
  framework: 'mocha',
  reporters,
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  /**
   * Dynamically load the TestRail reporter at runtime using async import
   */
  onPrepare: async function () {
    if (isScheduled && testRailDomain && testRailUserName && testRailApiToken) {
      const { default: WdioTestRailReporter } = await import('wdio-testrail-reporter');
      config.reporters!.push([
        WdioTestRailReporter,
        {
          testRailOptions: {
            domain: testRailDomain,
            username: testRailUserName,
            apiToken: testRailApiToken,
            projectId: parseInt(testRailProjectId!),
            suiteId: parseInt(testRailSuiteId!)
          },
          reporterOptions: {
            runName: `Automation Run - ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
            includeAll: false,
            oneReport: true
          }
        }
      ]);
    }
  },
  before: async () => {
    await browser.setWindowSize(1920, 1080);
  }
};
