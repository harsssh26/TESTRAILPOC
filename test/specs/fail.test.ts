// /test/specs/fail.test.ts
import framePage from '../pageobjects/frame.page.js';

describe('Frame Testing with WebDriverIO', () => {
    beforeEach(async () => {
        await framePage.open();
    });

    it('[FAIL] testFAIL', async () => {
        await expect(browser.getTitle()).toEqual('NonExistingTitle');
    });    

});
