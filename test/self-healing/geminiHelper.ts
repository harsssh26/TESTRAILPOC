// /test/self-healing/geminiHelper.ts
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function getNewLocatorSuggestion(incorrectLocator: string, pageSource: string): Promise<string | null> {
    const prompt = `
The following XPath failed to locate the correct element in a live browser session:

Failed XPath: "${incorrectLocator}"

Below is the full page DOM snapshot.

Your task:
1. Analyze the failed XPath.
2. Identify its intended target **by surrounding labels, attributes, or element purpose**.
3. Return a single, corrected XPath expression that accurately locates the **same intended element**.

Rules:
- The XPath must target the same **functional intent** as the original (e.g. checkbox for a label, input field, button, etc).
- DO NOT guess or suggest unrelated elements.
- Ensure XPath is minimal, robust, and **clickable**.
- It should work directly in a browser via automation.

DOM Snapshot:
${pageSource}

Output:
Only return a valid, full XPath string. Do not include explanations or extra text.
`;

    try {
        const response = await axios.post(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: prompt }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const match = raw?.match(/\/\/[^\n"]+/);
        return match ? match[0].trim() : null;
    } catch (err: any) {
        console.error('Gemini API call failed:', err.message);
        throw new Error('Failed to fetch suggestion from Gemini AI.');
    }
}
