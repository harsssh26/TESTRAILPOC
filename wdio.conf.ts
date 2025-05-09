// wdio.conf.ts
import type { Options } from '@wdio/types';
import * as fs from 'fs';
import { promisify } from 'util';

// Debugger only in non-headless mode
const debuggerOnFailure = true;

// ENV variables
export const isHeadless = process.env.HEADLESS === 'true' ? 'headless' : 'disable-infobars';
export const testRailUserName = process.env.TEST_RAIL_USERNAME;
export const testRailPassword = process.env.TEST_RAIL_PASSWORD;

const isScheduled = process.env.SCHEDULED_RUN === 'true';

const istDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(new Date());

let orgSystemDate: string | undefined;


// Reporters setup
const customReporters: Options.Testrunner['reporters'] = [
  'spec',
  ['allure', {
    outputDir: 'allure-results',
    disableWebdriverStepsReporting: true,
    disableWebdriverScreenshotsReporting: false,
    addConsoleLogs: true,
  }],
];

if (isScheduled) {
  customReporters.push(['testrail', {
    projectId: 35,
    suiteId: 3311,
    domain: 'sothebysdigitalqa.testrail.io',
    username: testRailUserName,
    apiToken: testRailPassword,
    runName: `Automation Report - ${istDate}`,
    oneReport: true,
    includeAll: false
  }]);
}

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true
    }
  },

  specs: [
    './test/specs/**/*.ts' // ignored if --spec is passed
  ],
  exclude: [],

  maxInstances: 1,

  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['disable-popup-blocking', 'disable-notifications', isHeadless]
    }
  }],

  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 30000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: 'mocha',
  reporters: customReporters,

  mochaOpts: {
    ui: 'bdd',
    timeout: 6000000
  },

  before: async () => {
    await browser.setWindowSize(1920, 1080);
    await browser.maximizeWindow();
  },

  afterTest: async function (test, context, { error, passed }) {
    if (!passed) {
      await browser.takeScreenshot();
      if (error && debuggerOnFailure && isHeadless !== 'headless') {
        console.log("--------- ERROR ---------");
        console.log(error);
        console.log("--------- ERROR ---------");
        await browser.debug();
      }
    }
  }
};
