// /test/self-healing/selfHealingElement.ts
import { saveLocatorData, findMatchingLocatorByAnyAttribute } from './locatorStorage.js';
import { getNewLocatorSuggestion } from './geminiHelper.js';
import { extractUniqueAttributes } from './attributeUtils.js';

function redactSensitiveValues(html: string): string {
    return html
        .replace(/(<input[^>]*\svalue\s*=\s*["'])[^"']+?(["'])/gi, '$1[REDACTED]$2')
        .replace(/>([^<]{2,40}@(gmail|yahoo|hotmail|salesforce)\.[a-z]{2,6})</gi, '>[REDACTED]<')
        .replace(/>(admin|user|testuser|salesforceadmin|loginname)[^<]*</gi, '>[REDACTED]<')
        .replace(/(<(input|textarea)[^>]*type=["']?(password)["']?[^>]*>)/gi, match =>
            match.replace(/value\s*=\s*["'][^"']*["']/gi, 'value="[REDACTED]"')
        );
}

async function selfHeal(originalLocator: string): Promise<string> {
    let xpath = originalLocator;

    let errorMessage = 'Unknown failure';

    try {
        await $(xpath).waitForExist({ timeout: 5000 });
        return xpath;
    } catch (err: any) {
        errorMessage = err.message || err.toString();
        const isRecoverable = err.name.includes('NoSuchElement') ||
            errorMessage.includes('no such element') ||
            errorMessage.includes('invalid selector') ||
            errorMessage.includes('still not existing after');

        if (!isRecoverable) throw err;

        console.warn('Self-heal triggered:', errorMessage);
    }

    const attributes = await extractUniqueAttributes(xpath);
    const candidates = findMatchingLocatorByAnyAttribute(attributes);

    for (const entry of candidates) {
        const suggestions = [...(entry.suggested_locators || [])].reverse();

        for (const suggestion of suggestions) {
            try {
                await $(suggestion).waitForExist({ timeout: 5000 });
                console.log(`Used stored suggestion${entry.matchScore !== 1 ? ' (fuzzy match)' : ''}: ${suggestion}`);
                return suggestion;
            } catch {
                console.warn(`Stored suggestion failed: ${suggestion}`);
            }
        }
    }

    const rawPageSource = await browser.getPageSource();
    const pageSource = redactSensitiveValues(rawPageSource);
    console.log('[REDACT] DOM sanitized before AI suggestion.');

    for (let i = 0; i < 3; i++) {
        const newLocator = await getNewLocatorSuggestion(xpath, pageSource);
        if (!newLocator) continue;

        try {
            await $(newLocator).waitForExist({ timeout: 5000 });
            saveLocatorData(attributes, errorMessage, newLocator);
            return newLocator;
        } catch (err: any) {
            saveLocatorData(attributes, err.message, newLocator);
        }
    }

    throw new Error('Self-healing failed after all fallback attempts.');
}

export async function find(selector: string): Promise<WebdriverIO.Element> {
    const healed = await selfHeal(selector);
    return await $(healed);
}

export { selfHeal };
