import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import * as dotenv from 'dotenv';

dotenv.config();

const junitReportsPath = path.join(process.cwd(), 'junit-reports');

async function parseJUnitReports() {
    const onlyFile = process.env.RESULT_FILE;
    const files = onlyFile
        ? [onlyFile]
        : fs.readdirSync(junitReportsPath).filter(file => file.endsWith('.xml'));

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

                let status_id = 1;
                let comment = 'Test passed';

                if (test.failure) {
                    status_id = 5;
                    const failureMessage = test.failure[0]?.$.message || 'Test failed';
                    const failureText = test.failure[0]?._ || '';
                    comment = `Failure: ${failureMessage}\n${failureText}`.trim();
                } else if (test.skipped) {
                    status_id = 4;
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
    const {
        TESTRAIL_HOST,
        TESTRAIL_USERNAME,
        TESTRAIL_API_TOKEN,
        TESTRAIL_PROJECT_ID,
        TESTRAIL_SUITE_ID,
        SCHEDULED_RUN
    } = process.env;

    if (!TESTRAIL_HOST || !TESTRAIL_USERNAME || !TESTRAIL_API_TOKEN || !TESTRAIL_PROJECT_ID || !TESTRAIL_SUITE_ID) {
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

    const isScheduledRun = SCHEDULED_RUN === 'true';

    if (!isScheduledRun) {
        console.log(`Skipping TestRail run creation due to unscheduled re-run`);
        return;
    }

    const created = await client.post(`/add_run/${TESTRAIL_PROJECT_ID}`, {
        suite_id: parseInt(TESTRAIL_SUITE_ID, 10),
        name: `Automated Run Demo`,
        include_all: false,
        case_ids: testResults.map(r => r.case_id),
    });

    const runId = created.data.id;
    console.log(`Created new TestRail Run: ${runId}`);

    await client.post(`/add_results/${runId}`, { results: testResults });
    console.log(`Uploaded ${testResults.length} results to TestRail Run: ${runId}`);
}

uploadResultsToTestRail().catch(error => {
    console.error('Error uploading results to TestRail:', error.message);
    process.exit(1);
});
