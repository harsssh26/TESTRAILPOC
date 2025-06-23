// /test/specs/frame1.test.ts
import framePage from '../pageobjects/frame.page.js';
import fs from 'fs'
describe('Frame Testing with WebDriverIO', () => {
    beforeEach(async () => {
        await framePage.open();
    });

    it('[FRAME1] C24 test17', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C25 test18', async () => {
        await framePage.normalTest();
        const raw = fs.readFileSync('shared-data.json', 'utf-8');
        const json = JSON.parse(raw);
        console.log('Read from shared-data.json:', json.sharedKey);
        await framePage.normalTest();
    });

    it('[MAC] C26 test19', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C27 test20', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C28 test21', async () => {
        await framePage.normalTest();
    });

    it('[MAC] C29 test22', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C30 test23', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C31 test24', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C32 test25', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C33 test26', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C34 test27', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C35 test28', async () => {
        await framePage.normalTest();
    });

    it('[MAC] C36 test29', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C37 test30', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C38 test31', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C39 test32', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C40 test33', async () => {
        await framePage.normalTest();
    });

    it('[MAC] C41 test34', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C42 test35', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C43 test36', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C44 test37', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C45 test38', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C46 test39', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C47 test40', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C48 test41', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C49 test42', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C50 test43', async () => {
        await framePage.normalTest();
    });

    it('[MAC] C51 test44', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C52 test45', async () => {
        await framePage.normalTest();
    });

    it('[MAC] C53 test46', async () => {
        await framePage.normalTest();
    });

    it('[FRAME1] C54 test47', async () => {
        await framePage.normalTest();
    });
});