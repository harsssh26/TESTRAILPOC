// /test/specs/frame.test.ts
import framePage from '../pageobjects/frame.page.js';

describe('Frame Testing with WebDriverIO', () => {
    beforeEach(async () => {
        await framePage.open();
    });

    it('[FRAME] [DAILY] C3 should type into frame 1', async () => {
        await framePage.typeInFrame1('Hello');
    });

    it('[FRAME] [DAILY] C4 should click checkbox in frame 3', async () => {
        await framePage.clickInFrame3();
    });

    it('[FRAME] [DAILY] C5 should type into frame 2', async () => {
        await framePage.typeInFrame2('Hello');
    });

    it('[AFRAME] [DAILY] C6 should type into frame 5 and click the link', async () => {
        await framePage.normalTest();
    });

    it('[AFRAME] [DAILY] C7 test0', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [DAILY] C8 test1', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [DAILY] C9 test2', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [DAILY] C10 test3', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [DAILY] C11 test4', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C12 test5', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C13 test6', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C14 test7', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C15 test8', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C16 test9', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C17 test10', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C18 test11', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C19 test12', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C20 test13', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C21 test14', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C22 test15', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] [WEEKLY] C23 test16', async () => {
        await framePage.normalTest();
    });    

});
