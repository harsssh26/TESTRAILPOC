// /test/specs/frame2.test.ts
import framePage from '../pageobjects/frame.page.js';
import fs from 'fs'

describe('Frame Testing with WebDriverIO', () => {
    beforeEach(async () => {
        await framePage.open();
    });

    it('[FRAME2] C55 test48', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C56 test49', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C57 test50', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C58 test51', async () => {
        await framePage.normalTest();
        const raw = fs.readFileSync('shared-data.json', 'utf-8');
        const json = JSON.parse(raw);
        console.log('Read from shared-data.json:', json.sharedKey);
        await framePage.normalTest();
    });

    it('[FRAME2] C59 test52', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C60 test53', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C61 test54', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C62 test55', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C63 test56', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C64 test57', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C65 test58', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C66 test59', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C67 test60', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C68 test61', async () => {
        await framePage.normalTest();
    });

    it('[FRAME2] C69 test62', async () => {
        await framePage.normalTest();
    });


});