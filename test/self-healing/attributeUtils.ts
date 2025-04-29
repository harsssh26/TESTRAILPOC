// /test/self-healing/attributeUtils.ts
export function normalizeAttributes(rawAttrs: string[]): string[] {
    return [...new Set(rawAttrs.map(a => a.toLowerCase().trim()))].sort();
}

export async function extractUniqueAttributes(xpath: string): Promise<string[]> {
    try {
        const el = await $(xpath);
        const exists = await el.isExisting();

        if (!exists) {
            console.warn(`[extractUniqueAttributes] Element does not exist for xpath: ${xpath}`);
            const matched = xpath.match(/@([a-zA-Z\-]+)='([^']+)'/g);
            const attrs = matched?.map(x => x.replace(/[@'=]/g, '').replace(/\//g, '')) || [];
            return normalizeAttributes(attrs);
        }

        return [];
    } catch (err: any) {
        console.warn('[extractUniqueAttributes] Failed to extract:', err.message);
        return [];
    }
}
