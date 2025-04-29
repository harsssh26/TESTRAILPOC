import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import * as dotenv from 'dotenv';
dotenv.config();

const junitReportsPath = path.join(process.cwd(), 'junit-reports');

async function parseJUnitReports() {
    const files = fs.readdirSync(junitReportsPath).filter(file => file.endsWith('.xml'));
    const testResults: { case_id: number; status_id: number; comment: string }[] = [];

    for (const file of files) {
        const xml = fs.readFileSync(path.join(junitReportsPath, file), 'utf-8');
        const result = await parseStringPromise(xml);
        const suites = result.testsuites?.testsuite || [];

        for (const suite of suites) {
            const testcases = suite.testcase || [];
            for (const test of testcases) {
                const name = test.$.name as string;
                const matches = name.match(/C\d+/g) || [];

                if (matches.length === 0) continue;

                let status_id = 1; // passed
                let comment = 'Test passed';

                if (test.failure) {
                    status_id = 5; // failed
                    const failureMessage = test.failure[0]?.$.message || 'Test failed';
                    const failureText = test.failure[0]?._ || '';
                    comment = `Failure: ${failureMessage}\n${failureText}`.trim();
                } else if (test.skipped) {
                    status_id = 4; // retest
                    const skipMessage = test.skipped[0]?.$.message || 'Test skipped';
                    comment = `Skipped: ${skipMessage}`.trim();
                }

                for (const match of matches) {
                    const caseId = parseInt(match.replace('C', ''), 10);
                    testResults.push({ case_id: caseId, status_id, comment });
                }
            }
        }
    }
    return testResults;
}

async function uploadResultsToTestRail() {
    const TESTRAIL_HOST = process.env.TESTRAIL_HOST;
    const TESTRAIL_USERNAME = process.env.TESTRAIL_USERNAME;
    const TESTRAIL_API_TOKEN = process.env.TESTRAIL_API_TOKEN;
    const TESTRAIL_PROJECT_ID = process.env.TESTRAIL_PROJECT_ID;
    const TESTRAIL_SUITE_ID = process.env.TESTRAIL_SUITE_ID;
    const TESTRAIL_RUN_ID = process.env.TESTRAIL_RUN_ID;

    if (!TESTRAIL_HOST || !TESTRAIL_USERNAME || !TESTRAIL_API_TOKEN || !TESTRAIL_PROJECT_ID) {
        throw new Error('TestRail environment variables are not properly set.');
    }

    const client = axios.create({
        baseURL: `https://${TESTRAIL_HOST}/index.php?/api/v2`,
        auth: {
            username: TESTRAIL_USERNAME,
            password: TESTRAIL_API_TOKEN,
        },
        headers: { 'Content-Type': 'application/json' },
    });

    const testResults = await parseJUnitReports();

    if (testResults.length === 0) {
        console.log('No test results found to upload.');
        return;
    }

    let runId = TESTRAIL_RUN_ID ? parseInt(TESTRAIL_RUN_ID, 10) : 0;

    if (!runId) {
        const response = await client.post(`/add_run/${TESTRAIL_PROJECT_ID}`, {
            suite_id: TESTRAIL_SUITE_ID ? parseInt(TESTRAIL_SUITE_ID, 10) : undefined,
            name: `Automated Run ${new Date().toISOString()}`,
            include_all: false,
            case_ids: testResults.map(r => r.case_id),
        });
        runId = response.data.id;
        console.log(`Created new TestRail Run: ${runId}`);
    } else {
        console.log(`Using existing TestRail Run: ${runId}`);
    }

    await client.post(`/add_results_for_cases/${runId}`, { results: testResults });
    console.log(`Uploaded ${testResults.length} results to TestRail Run: ${runId}`);
}

uploadResultsToTestRail().catch(error => {
    console.error('Error uploading results to TestRail:', error.message);
    process.exit(1);
});
