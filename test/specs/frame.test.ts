// /test/specs/frame.test.ts
import framePage from '../pageobjects/frame.page.js';

describe('Frame Testing with WebDriverIO', () => {
    beforeEach(async () => {
        await framePage.open();
    });

    it('C3 should type into frame 1', async () => {
        await framePage.typeInFrame1('Hello');
    });

    it('C4 should click checkbox in frame 3', async () => {
        await framePage.clickInFrame3();
    });

    // it('C5 should type into frame 2', async () => {
    //     await framePage.typeInFrame2('Hello');
    // });

    // it('C6 should type into frame 5 and click the link', async () => {
    //     await framePage.typeInFrame5('Hello');
    //     await framePage.clickInFrame5();
    // });
});
