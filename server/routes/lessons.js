const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const { askAI, parseJSON } = require("../config/ai");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// POST /api/lessons/generate
router.post("/generate", async (req, res) => {
    try {
        const { topic, pages = 5 } = req.body;
        if (!topic || !topic.trim()) return res.status(400).json({ error: "Topic is required" });

        const numPages = Math.min(Math.max(parseInt(pages) || 5, 1), 15);
        console.log(`\n📚 Generating ${numPages} slides about: ${topic}`);

        const prompt = `Create an educational lesson about "${topic}" with exactly ${numPages} slides.

For each slide, provide:
1. A clear, concise title
2. Detailed content (2-3 paragraphs explaining the concept)
3. 3-5 key explanation points (important takeaways)

Return ONLY a valid JSON object in this EXACT format:
{
  "slides": [
    {
      "title": "Introduction to ${topic}",
      "content": "Detailed explanation here with 2-3 paragraphs...",
      "explanation": [
        "First key point about the concept",
        "Second key point with important details",
        "Third key point for deeper understanding"
      ]
    }
  ]
}

Make the content educational, engaging, and comprehensive. Each slide should build on the previous one.`;

        const result = await askAI(prompt);
        const parsed = parseJSON(result);

        if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
            return res.status(500).json({ error: "No slides generated. Try again." });
        }

        console.log(`✅ Generated ${parsed.slides.length} slides`);
        res.json(parsed);
    } catch (err) {
        console.error("❌ Lesson generation error:", err.message);
        res.status(500).json({ error: `Failed to generate lesson: ${err.message}` });
    }
});

// POST /api/lessons/analyze-pdf
router.post("/analyze-pdf", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        if (!req.file.originalname.endsWith(".pdf")) return res.status(400).json({ error: "File must be a PDF" });

        console.log(`\n📄 Analyzing PDF: ${req.file.originalname}`);

        const data = await pdf(req.file.buffer);
        const text = data.text.slice(0, 15000);

        if (!text.trim()) return res.status(400).json({ error: "Could not extract text from PDF." });
        console.log(`✅ Extracted ${text.length} characters`);

        const prompt = `Analyze this PDF content and create an educational lesson with 5-7 slides.

PDF Content:
${text}

For each slide, provide:
1. A clear, concise title
2. Detailed content explaining the main concepts (2-3 paragraphs)
3. 3-5 key explanation points

Return ONLY a valid JSON object in this EXACT format:
{
  "slides": [
    {
      "title": "Main Topic Title",
      "content": "Detailed explanation of the concept...",
      "explanation": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ]
}

Focus on the most important concepts and make it educational.`;

        const result = await askAI(prompt);
        const parsed = parseJSON(result);

        if (!parsed.slides || parsed.slides.length === 0) {
            return res.status(500).json({ error: "Failed to generate slides from PDF" });
        }

        console.log(`✅ Created ${parsed.slides.length} slides from PDF`);
        res.json(parsed);
    } catch (err) {
        console.error("❌ PDF analysis error:", err.message);
        res.status(500).json({ error: `Failed to analyze PDF: ${err.message}` });
    }
});

module.exports = router;
