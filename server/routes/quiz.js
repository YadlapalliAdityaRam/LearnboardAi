const express = require("express");
const { askAI, parseJSON } = require("../config/ai");

const router = express.Router();

// POST /api/quiz/generate
router.post("/generate", async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || !content.trim()) return res.status(400).json({ error: "Content is required" });

        console.log("\n📝 Generating quiz...");

        const prompt = `Based on this educational content, create a quiz with exactly 5 multiple-choice questions.

Content:
${content.slice(0, 8000)}

Return ONLY a valid JSON object in this EXACT format:
{
  "questions": [
    {
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}

Rules:
- Each question must have exactly 4 options
- "correct" is the zero-based index of the correct option (0, 1, 2, or 3)
- Questions should test understanding, not just memorization
- Make questions clear and unambiguous`;

        const result = await askAI(prompt, "You are an expert quiz creator. Always respond with valid JSON only.");
        const parsed = parseJSON(result);

        if (!parsed.questions || !Array.isArray(parsed.questions)) {
            return res.status(500).json({ error: "Invalid quiz format" });
        }

        // Validate
        parsed.questions.forEach((q) => {
            q.correct = parseInt(q.correct) || 0;
            if (q.correct < 0 || q.correct >= (q.options?.length || 4)) q.correct = 0;
        });

        console.log(`✅ Generated ${parsed.questions.length} quiz questions`);
        res.json(parsed);
    } catch (err) {
        console.error("❌ Quiz error:", err.message);
        res.status(500).json({ error: `Failed to generate quiz: ${err.message}` });
    }
});

module.exports = router;
