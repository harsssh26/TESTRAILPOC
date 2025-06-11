// wdio.conf.ts

import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config: any = {
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
      args: ['--headless=new', '--disable-gpu']
    },
    'wdio:devtoolsOptions': {
      enableBidi: false // disable BiDi fallback
    }
  }],

  logLevel: 'info',
  baseUrl: 'https://ui.vision/demo/webtest/frames/',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: ['chromedriver'],

  framework: 'mocha',

  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
      addConsoleLogs: true,
    }]
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  before: async () => {
    await browser.setWindowSize(1920, 1080);
  }
};
