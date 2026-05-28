const { askAI, parseJSON } = require("../config/ai");
const pdf = require("pdf-parse");

const resolvers = {
    Query: {
        healthCheck: () => "OK"
    },
    Mutation: {
        generateLesson: async (_, { topic, pages }) => {
            if (!topic || !topic.trim()) throw new Error("Topic is required");
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
                throw new Error("No slides generated. Try again.");
            }

            console.log(`✅ Generated ${parsed.slides.length} slides`);
            return parsed;
        },
        analyzePdf: async (_, { fileBase64 }) => {
            if (!fileBase64) throw new Error("No file content provided");
            const buffer = Buffer.from(fileBase64, "base64");
            const data = await pdf(buffer);
            const text = data.text.slice(0, 15000);

            if (!text.trim()) throw new Error("Could not extract text from PDF.");
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
                throw new Error("Failed to generate slides from PDF");
            }

            console.log(`✅ Created ${parsed.slides.length} slides from PDF`);
            return parsed;
        },
        askTutor: async (_, { question, context }) => {
            if (!question || !question.trim()) throw new Error("Question is required");
            if (!context || !context.trim()) throw new Error("Context is required");
            
            const prompt = `You are a helpful AI tutor for a student. 
Context from their current slide:
${context.slice(0, 5000)}

Student's question:
${question}

Provide a clear, encouraging, and educational answer. Keep it under 3 paragraphs.`;

            const result = await askAI(prompt, "You are a helpful tutor.");
            return result;
        },
        generateQuiz: async (_, { content }) => {
            if (!content || !content.trim()) throw new Error("Content is required");
            
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
                throw new Error("Invalid quiz format");
            }

            parsed.questions.forEach((q) => {
                q.correct = parseInt(q.correct) || 0;
                if (q.correct < 0 || q.correct >= (q.options?.length || 4)) q.correct = 0;
            });

            return parsed;
        },
        generateFlashcards: async (_, { content }) => {
            if (!content || !content.trim()) throw new Error("Content is required");
            
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
                throw new Error("Invalid flashcards format");
            }

            return parsed;
        }
    }
};

module.exports = resolvers;
