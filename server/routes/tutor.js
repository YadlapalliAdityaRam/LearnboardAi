const express = require("express");
const { askAI } = require("../config/ai");

const router = express.Router();

// POST /api/tutor/ask
router.post("/ask", async (req, res) => {
    try {
        const { question, context } = req.body;
        if (!question || !question.trim()) return res.status(400).json({ error: "Question is required" });

        console.log(`\n💬 Student question: ${question.slice(0, 100)}...`);

        const prompt = `You are an AI tutor helping a student understand educational content.

Context from the current slide:
${context || "No context provided."}

Student's question:
${question}

Provide a clear, helpful answer that:
1. Directly answers their question
2. Uses examples to clarify concepts
3. Relates back to the slide content
4. Is encouraging and supportive

Keep the answer concise but thorough (2-3 paragraphs).`;

        const answer = await askAI(prompt, "You are a helpful, patient AI tutor.", false);
        console.log("✅ Generated answer");
        res.json({ answer });
    } catch (err) {
        console.error("❌ Tutor error:", err.message);
        res.status(500).json({ error: `Failed to get answer: ${err.message}` });
    }
});

module.exports = router;
