// /wdio.conf.ts
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

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
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless', '--disable-gpu'],
      }
    }
  ],
  logLevel: 'info',
  baseUrl: 'https://ui.vision/demo/webtest/frames/',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['devtools'],
  framework: 'mocha',

  reporters: [
    'spec',
    ['junit', {
      outputDir: './junit-reports',
      outputFileFormat: function (options) {
        return `results-${options.cid}.${(options.capabilities as any).browserName}.xml`;

      }
    }]
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },

  before: async function () {
    await browser.setWindowSize(1920, 1080);
  }
};



