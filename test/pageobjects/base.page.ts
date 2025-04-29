// /test/pageobjects/base.page.ts
import { find } from '../self-healing/selfHealingElement.js';

export default class BasePage {
    async open(path: string = 'https://ui.vision/demo/webtest/frames/'): Promise<void> {
        await browser.url(path);
    }

    async waitAndClick(selector: string): Promise<void> {
        const el = await find(selector);
        await el.waitForClickable();
        await el.click();
    }

    async waitAndSetValue(selector: string, value: string): Promise<void> {
        const el = await find(selector);
        await el.waitForDisplayed();
        await el.setValue(value);
    }
}
