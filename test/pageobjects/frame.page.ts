// /test/pageobjects/frame.page.ts
import BasePage from './base.page.js';

class FramePage extends BasePage {
    get frame1() { return $('frame[src="frame_1.html"]'); }
    get frame2() { return $('frame[src="frame_2.html"]'); }
    get frame5() { return $('frame[src="frame_5.html"]'); }
    get frame3() { return $('frame[src="frame_3.html"]'); }
    get innerGoogleFormIframe() { return $('iframe[src*="docs.google.com/forms"]'); }

    async switchToFrame(frameElement: WebdriverIO.Element): Promise<void> {
        await frameElement.waitForExist({ timeout: 5000 });
        await frameElement.waitForDisplayed({ timeout: 5000 });
        await browser.switchToFrame(frameElement);
    }

    async typeInFrame1(text: string): Promise<void> {
        await this.switchToFrame(await this.frame1);
        await this.waitAndSetValue("//input[@name='text']", text);
        await browser.switchToParentFrame();
    }

    async typeInFrame2(text: string): Promise<void> {
        await this.switchToFrame(await this.frame2);
        await this.waitAndSetValue("//input[@name='mytext2']", text);
        await browser.switchToParentFrame();
    }

    async typeInFrame5(text: string): Promise<void> {
        await this.switchToFrame(await this.frame5);
        await this.waitAndSetValue("//input[@name='mytext5']", text);
        await browser.switchToParentFrame();
    }

    async clickInFrame5(): Promise<void> {
        await this.switchToFrame(await this.frame5);
        await this.waitAndClick("//a[text()='https://a9t9.com']");
        await browser.switchToParentFrame();
    }

    async clickInFrame3(): Promise<void> {
        await this.switchToFrame(await this.frame3);
        await this.switchToFrame(await this.innerGoogleFormIframe);
        await this.waitAndClick("//span[@role='list']//div[@class='eBFwI']//label[@for='i21']");
        await browser.switchToParentFrame();
        await browser.switchToParentFrame();
    }
}

export default new FramePage();
