const express = require("express");
const { askAI, parseJSON } = require("../config/ai");

const router = express.Router();

// POST /api/flashcards/generate
router.post("/generate", async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || !content.trim()) return res.status(400).json({ error: "Content is required" });

        console.log("\n🃏 Generating flashcards...");

        const prompt = `Based on this educational content, create exactly 8 study flashcards.

Content:
${content.slice(0, 8000)}

Return ONLY a valid JSON object in this EXACT format:
{
  "cards": [
    {
      "front": "What is the definition of...?",
      "back": "The answer or explanation..."
    }
  ]
}

Rules:
- Create 8 flashcards
- Front should be a clear question or key term
- Back should be a concise but complete answer
- Cover the most important concepts from the content`;

        const result = await askAI(prompt, "You are an expert educator creating study flashcards. Always respond with valid JSON only.");
        const parsed = parseJSON(result);

        if (!parsed.cards || !Array.isArray(parsed.cards)) {
            return res.status(500).json({ error: "Invalid flashcards format" });
        }

        console.log(`✅ Generated ${parsed.cards.length} flashcards`);
        res.json(parsed);
    } catch (err) {
        console.error("❌ Flashcard error:", err.message);
        res.status(500).json({ error: `Failed to generate flashcards: ${err.message}` });
    }
});

module.exports = router;
