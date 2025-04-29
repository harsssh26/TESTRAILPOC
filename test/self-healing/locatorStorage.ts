// /test/self-healing/locatorStorage.ts
import fs from 'fs';
import path from 'path';
import { normalizeAttributes } from './attributeUtils.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCATOR_FILE = path.join(__dirname, '../../ai-locators.json');


function readJsonFile(): any[] {
    if (!fs.existsSync(LOCATOR_FILE)) return [];
    return JSON.parse(fs.readFileSync(LOCATOR_FILE, 'utf-8'));
}

function writeJsonFile(data: any[]): void {
    fs.writeFileSync(LOCATOR_FILE, JSON.stringify(data, null, 2));
}

export function buildCompositeKey(attrs: string[], tagName = '', forAttr = ''): string {
    const base = normalizeAttributes(attrs);
    if (tagName) base.push(`tag:${tagName}`);
    if (forAttr) base.push(`for:${forAttr}`);
    return base.join('//');
}

export function saveLocatorData(attrList: string[], errorMessage: string, newLocator: string, tagName = '', forAttr = ''): void {
    const data = readJsonFile();
    const compositeKey = buildCompositeKey(attrList, tagName, forAttr);

    const alreadyExistsAnywhere = data.some(entry =>
        entry.suggested_locators.some((loc: any) =>
            typeof loc === 'string' ? loc === newLocator : loc?.xpath === newLocator
        )
    );
    if (alreadyExistsAnywhere) {
        console.log(`Skipping duplicate suggestion already present: ${newLocator}`);
        return;
    }

    let entry = data.find(e => e.original_locator === compositeKey);
    if (!entry) {
        entry = {
            original_locator: compositeKey,
            error_message: errorMessage,
            suggested_locators: [newLocator]
        };
        data.push(entry);
        writeJsonFile(data);
        return;
    }

    const alreadyExistsInEntry = entry.suggested_locators.some((loc: any) =>
        typeof loc === 'string' ? loc === newLocator : loc?.xpath === newLocator
    );

    if (!alreadyExistsInEntry) {
        entry.suggested_locators.push(newLocator);
    }

    writeJsonFile(data);
}

export function findMatchingLocatorByAnyAttribute(attributes: string[], tagName = '', forAttr = ''): any[] {
    const data = readJsonFile();
    const normalizedInput = normalizeAttributes(attributes);

    for (const entry of data) {
        const entryKey = entry.original_locator;
        const entryAttrs = entryKey.split('//').map((a: string) => a.toLowerCase().trim());
        const entrySet = new Set(entryAttrs);

        const intersection = normalizedInput.filter(a => entrySet.has(a));
        const matchScore = intersection.length / Math.max(normalizedInput.length, entryAttrs.length);

        console.log(`Comparing [${normalizedInput}] with stored: [${entryAttrs}] => Match: ${matchScore}`);

        if (matchScore >= 0.7) {
            console.log(`MATCH FOUND with score ${matchScore * 100}%: ${entry.original_locator}`);
            return [{ ...entry, matchScore }];
        }
    }

    console.log('No matching locator found for:', normalizedInput);
    return [];
}
