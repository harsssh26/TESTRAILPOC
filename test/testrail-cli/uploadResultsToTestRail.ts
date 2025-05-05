import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import * as dotenv from 'dotenv';

dotenv.config();

const junitReportsPath = path.join(process.cwd(), 'junit-reports');
const today = new Date().toISOString().split('T')[0]; // "2025-05-05"
const runName = `Automated Run Demo - ${today}`;
const cacheFile = path.join(process.cwd(), '.testrail-run.json');


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

async function getOrCreateTestRun(client: any, projectId: string, suiteId: number, testResults: any[]): Promise<number> {
    // Step 1: Use cache if exists
    if (fs.existsSync(cacheFile)) {
        try {
            const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
            if (cached?.date === today && typeof cached.run_id === 'number') {
                console.log(`Using cached TestRail Run ID: ${cached.run_id}`);
                return cached.run_id;
            }
        } catch (err) {
            console.warn('Failed to read cache:', err.message);
        }
    }

    // Step 2: Try finding existing run
    try {
        const response = await client.get(`/get_runs/${projectId}`, {
            params: {
                is_completed: 0,
                suite_id: suiteId,
            },
        });

        const runs = Array.isArray(response.data) ? response.data : response.data.runs;
        const existing = runs.find((run: any) => run.name === runName);

        if (existing) {
            console.log(`Using existing TestRail Run: ${existing.id}`);
            fs.writeFileSync(cacheFile, JSON.stringify({ run_id: existing.id, date: today }, null, 2));
            return existing.id;
        }
    } catch (err: any) {
        console.warn('Failed to fetch existing runs:', err.message);
    }

    // Step 3: Create new run
    const created = await client.post(`/add_run/${projectId}`, {
        suite_id: suiteId,
        name: runName,
        include_all: false,
        case_ids: testResults.map(r => r.case_id),
    });

    const newRunId = created.data.id;
    console.log(`Created new TestRail Run: ${newRunId}`);
    fs.writeFileSync(cacheFile, JSON.stringify({ run_id: newRunId, date: today }, null, 2));
    return newRunId;
}


async function uploadResultsToTestRail() {
    const {
        TESTRAIL_HOST,
        TESTRAIL_USERNAME,
        TESTRAIL_API_TOKEN,
        TESTRAIL_PROJECT_ID,
        TESTRAIL_SUITE_ID,
        TESTRAIL_RUN_ID,
        SCHEDULED_RUN,
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

    let runId = TESTRAIL_RUN_ID ? parseInt(TESTRAIL_RUN_ID, 10) : 0;
    const isScheduledRun = SCHEDULED_RUN === 'true';

    if (!runId && isScheduledRun) {
        runId = await getOrCreateTestRun(client, TESTRAIL_PROJECT_ID, parseInt(TESTRAIL_SUITE_ID), testResults);
    } else if (runId) {
        console.log(`Using existing TestRail Run from ENV: ${runId}`);
    } else {
        console.log(`Skipping TestRail run creation due to unscheduled re-run`);
        return;
    }

    await client.post(`/add_results_for_cases/${runId}`, { results: testResults });
    console.log(`Uploaded ${testResults.length} results to TestRail Run: ${runId}`);
}

uploadResultsToTestRail().catch(error => {
    console.error('Error uploading results to TestRail:', error.message);
    process.exit(1);
});
