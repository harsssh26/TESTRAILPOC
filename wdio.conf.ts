// /wdio.conf.ts
import { config as dotenvConfig } from 'dotenv'
import type { Options } from '@wdio/types'

dotenvConfig()

const istDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(new Date())

const isScheduled = process.env.SCHEDULED_RUN === 'true'
const testRailUserName = process.env.TESTRAIL_USERNAME
const testRailApiToken = process.env.TESTRAIL_API_TOKEN
const testRailDomain = process.env.TESTRAIL_HOST
const testRailProjectId = process.env.TESTRAIL_PROJECT_ID
const testRailSuiteId = process.env.TESTRAIL_SUITE_ID

const reporters: Options.Testrunner['reporters'] = [
  'spec',
  ['junit', {
    outputDir: './junit-reports',
    outputFileFormat: (opts: any) =>
      `results-${opts.cid}.${opts.capabilities.browserName}.xml`
  }]
]

if (isScheduled && testRailDomain && testRailUserName && testRailApiToken) {
  reporters.push(['testrail', {
    domain: testRailDomain,
    username: testRailUserName,
    apiToken: testRailApiToken,
    projectId: parseInt(testRailProjectId!),
    suiteId: parseInt(testRailSuiteId!),
    runName: `Automation Run Demo`,
    includeAll: false,
    oneReport: true
  }])
}

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
  reporters: reporters,
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
  before: async () => {
    await browser.setWindowSize(1920, 1080)
  }
}


