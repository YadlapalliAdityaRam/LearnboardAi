const OpenAI = require("openai");

const GEMINI_MODEL = "google/gemini-2.0-flash-001";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

async function askAI(prompt, systemMsg = "You are an expert educational content creator. Always respond with valid JSON only.", jsonMode = true) {
    const opts = {
        model: GEMINI_MODEL,
        messages: [
            { role: "system", content: systemMsg },
            { role: "user", content: prompt },
        ],
        temperature: 0.7,
    };
    if (jsonMode) opts.response_format = { type: "json_object" };

    const response = await client.chat.completions.create(opts);
    return response.choices[0].message.content;
}

function parseJSON(text) {
    let t = text.trim();
    if (t.startsWith("```json")) t = t.slice(7);
    if (t.startsWith("```")) t = t.slice(3);
    if (t.endsWith("```")) t = t.slice(0, -3);
    return JSON.parse(t.trim());
}

module.exports = { askAI, parseJSON, GEMINI_MODEL };
