// /test/specs/frame.test.ts
import framePage from '../../pageobjects/frame.page.js';

describe('Frame Testing with WebDriverIO: [FRAME]', () => {
    beforeEach(async () => {
        await framePage.open();
    });

    it('[DAILY] C3 should type into frame 1', async () => {
        await framePage.typeInFrame1('Hello');
    });

    it('[DAILY] C4 should click checkbox in frame 3', async () => {
        await framePage.clickInFrame3();
    });

    it('[DAILY] C5 should type into frame 2', async () => {
        await framePage.typeInFrame2('Hello');
    });

    it('[DAILY] C6 should type into frame 5 and click the link', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C7 test0', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C8 test1', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C9 test2', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C10 test3', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C11 test4', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C55 test48', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C56 test49', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C57 test50', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C58 test51', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C59 test52', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C60 test53', async () => {
        await framePage.normalTest();
    });

    it('[DAILY] C61 test54', async () => {
        await framePage.normalTest();
    });

});
