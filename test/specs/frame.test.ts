// /test/specs/frame.test.ts
import framePage from '../pageobjects/frame.page.js';
import fs from 'fs'
describe('Frame Testing with WebDriverIO', () => {
    beforeEach(async () => {
        await framePage.open();
    });

    it('[FRAME] C3 should type into frame 1', async () => {
        await framePage.typeInFrame1('Hello');
    });

    it('[FRAME] C4 should click checkbox in frame 3', async () => {
        await framePage.clickInFrame3();
    });

    it('[FRAME] C5 should type into frame 2', async () => {
        await framePage.typeInFrame2('Hello');
    });

    it('[FRAME] C6 should type into frame 5 and click the link', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C7 test0', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C8 test1', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C9 test2', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C10 test3', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C11 test4', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C12 test5', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C13 test6', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C14 test7', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C15 test8', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C16 test9', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C17 test10', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C18 test11', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C19 test12', async () => {
        await framePage.normalTest();
          const frameValue = 'FRAME_GENERATED_VALUE';
          const data = { sharedKey: frameValue };
          fs.writeFileSync('shared-data.json', JSON.stringify(data), 'utf-8');
          console.log('Written to shared-data.json:', data);
    });

    it('[FRAME] C20 test13', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C21 test14', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C22 test15', async () => {
        await framePage.normalTest();
    });

    it('[FRAME] C23 test16', async () => {
        await framePage.normalTest();
    });    

});
