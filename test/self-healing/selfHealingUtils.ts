// /test/self-healing/selfHealingUtils.ts
import { selfHeal } from './selfHealingElement.js';
import { $, browser } from '@wdio/globals'
export async function findElement(xpath: string): Promise<WebdriverIO.Element> {
    const healedXpath = await selfHeal(xpath);
    return await $(healedXpath);
}

export async function findElementInIframe(frameSelector: string, xpath: string): Promise<WebdriverIO.Element> {
    await browser.switchToFrame(await $(frameSelector));
    const healedXpath = await selfHeal(xpath);
    return await $(healedXpath);
}
