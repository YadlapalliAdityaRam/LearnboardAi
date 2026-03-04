from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import json
import traceback
from openai import OpenAI

# Try to load .env file if it exists
try:
    from dotenv import load_dotenv
    load_dotenv()
    if os.path.exists('.env'):
        print("📄 Loaded environment variables from .env file")
except ImportError:
    pass
except Exception:
    pass

app = Flask(__name__)
CORS(app)

# Initialize OpenRouter client (OpenAI-compatible, uses Gemini models)
client = None
GEMINI_MODEL = "google/gemini-2.0-flash-001"

try:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("\n" + "="*60)
        print("⚠️  CRITICAL: OPENROUTER_API_KEY not set!")
        print("="*60)
        print("\nTo fix this, add to your .env file:")
        print("  OPENROUTER_API_KEY=sk-or-v1-your-key-here")
        print("\nGet a key at: https://openrouter.ai/keys")
        print("="*60 + "\n")
    else:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key
        )
        print(f"✅ OpenRouter configured (Model: {GEMINI_MODEL})")

except Exception as e:
    print(f"\n❌ Error initializing OpenRouter client: {e}\n")
    client = None


def ask_ai(prompt, system_msg="You are an expert educational content creator. Always respond with valid JSON only. No markdown formatting, no code blocks, just pure JSON.", json_mode=True):
    """Call Gemini through OpenRouter"""
    if not client:
        raise Exception("API not configured. Please set OPENROUTER_API_KEY.")

    kwargs = {
        "model": GEMINI_MODEL,
        "messages": [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}

    response = client.chat.completions.create(**kwargs)
    return response.choices[0].message.content


def parse_json_response(text):
    """Parse JSON from AI response, stripping any markdown fencing"""
    text = text.strip()
    if text.startswith('```json'):
        text = text[7:]
    if text.startswith('```'):
        text = text[3:]
    if text.endswith('```'):
        text = text[:-3]
    return json.loads(text.strip())


@app.route('/')
def index():
    """Serve the main HTML page"""
    return render_template('index.html')


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "api_configured": client is not None,
        "model": GEMINI_MODEL
    }), 200


@app.route('/create-document', methods=['POST'])
def create_document():
    """Generate educational slides about a topic"""
    try:
        if not client:
            return jsonify({"error": "API key not configured. Please set OPENROUTER_API_KEY in .env file."}), 500

        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        topic = data.get('topic', '').strip()
        pages = data.get('pages', 5)

        if not topic:
            return jsonify({"error": "Topic is required"}), 400

        try:
            pages = int(pages)
            if pages < 1 or pages > 15:
                pages = 5
        except (ValueError, TypeError):
            pages = 5

        print(f"\n📚 Generating {pages} slides about: {topic}")

        prompt = f"""Create an educational lesson about "{topic}" with exactly {pages} slides.

For each slide, provide:
1. A clear, concise title
2. Detailed content (2-3 paragraphs explaining the concept)
3. 3-5 key explanation points (important takeaways)

Return ONLY a valid JSON object in this EXACT format:
{{
  "slides": [
    {{
      "title": "Introduction to {topic}",
      "content": "Detailed explanation here with 2-3 paragraphs...",
      "explanation": [
        "First key point about the concept",
        "Second key point with important details",
        "Third key point for deeper understanding"
      ]
    }}
  ]
}}

Make the content educational, engaging, and comprehensive. Each slide should build on the previous one."""

        result = ask_ai(prompt)
        parsed_result = parse_json_response(result)

        if "slides" not in parsed_result:
            return jsonify({"error": "Invalid response format. Please try again."}), 500

        if not isinstance(parsed_result["slides"], list) or len(parsed_result["slides"]) == 0:
            return jsonify({"error": "No slides were generated. Please try again."}), 500

        print(f"✅ Successfully generated {len(parsed_result['slides'])} slides")
        return jsonify(parsed_result), 200

    except Exception as e:
        print(f"\n❌ Error in create_document:")
        print(traceback.format_exc())
        error_msg = str(e)
        if "api_key" in error_msg.lower():
            error_msg = "API key is invalid or not set."
        elif "rate_limit" in error_msg.lower() or "quota" in error_msg.lower():
            error_msg = "Rate limit exceeded. Please wait and try again."
        return jsonify({"error": f"Failed to generate slides: {error_msg}"}), 500


@app.route('/analyze-pdf', methods=['POST'])
def analyze_pdf():
    """Analyze a PDF and create educational slides"""
    try:
        if not client:
            return jsonify({"error": "API key not configured."}), 500

        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']

        if not file.filename.endswith('.pdf'):
            return jsonify({"error": "File must be a PDF"}), 400

        print(f"\n📄 Analyzing PDF: {file.filename}")

        try:
            import PyPDF2
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for i, page in enumerate(pdf_reader.pages):
                try:
                    page_text = page.extract_text()
                    text += page_text + "\n\n"
                except Exception:
                    print(f"⚠️  Warning: Could not extract text from page {i+1}")
                    continue

            if not text.strip():
                return jsonify({"error": "Could not extract text from PDF."}), 400

            text = text[:15000]
            print(f"✅ Extracted {len(text)} characters from PDF")

        except Exception as pdf_error:
            print(f"❌ PDF reading error: {pdf_error}")
            return jsonify({"error": f"Failed to read PDF: {str(pdf_error)}"}), 400

        prompt = f"""Analyze this PDF content and create an educational lesson with 5-7 slides.

PDF Content:
{text}

For each slide, provide:
1. A clear, concise title
2. Detailed content explaining the main concepts (2-3 paragraphs)
3. 3-5 key explanation points

Return ONLY a valid JSON object in this EXACT format:
{{
  "slides": [
    {{
      "title": "Main Topic Title",
      "content": "Detailed explanation of the concept...",
      "explanation": ["Key point 1", "Key point 2", "Key point 3"]
    }}
  ]
}}

Focus on the most important concepts and make it educational."""

        result = ask_ai(prompt)
        parsed_result = parse_json_response(result)

        if "slides" not in parsed_result or not parsed_result["slides"]:
            return jsonify({"error": "Failed to generate slides from PDF"}), 500

        print(f"✅ Analyzed PDF and created {len(parsed_result['slides'])} slides")
        return jsonify(parsed_result), 200

    except Exception as e:
        print(f"\n❌ Error in analyze_pdf:")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to analyze PDF: {str(e)}"}), 500


@app.route('/ask-doubt', methods=['POST'])
def ask_doubt():
    """Answer student questions about slide content"""
    try:
        if not client:
            return jsonify({"error": "API key not configured"}), 500

        data = request.json
        question = data.get('question', '').strip()
        context = data.get('context', '').strip()

        if not question:
            return jsonify({"error": "Question is required"}), 400

        print(f"\n💬 Student question: {question[:100]}...")

        prompt = f"""You are an AI tutor helping a student understand educational content.

Context from the current slide:
{context}

Student's question:
{question}

Provide a clear, helpful answer that:
1. Directly answers their question
2. Uses examples to clarify concepts
3. Relates back to the slide content
4. Is encouraging and supportive

Keep the answer concise but thorough (2-3 paragraphs)."""

        answer = ask_ai(prompt, system_msg="You are a helpful, patient AI tutor.", json_mode=False)
        print(f"✅ Generated answer")
        return jsonify({"answer": answer}), 200

    except Exception as e:
        print(f"\n❌ Error in ask_doubt:")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to get answer: {str(e)}"}), 500


@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    """Generate a quiz from lesson content"""
    try:
        if not client:
            return jsonify({"error": "API key not configured"}), 500

        data = request.json
        content = data.get('content', '').strip()

        if not content:
            return jsonify({"error": "Content is required"}), 400

        print(f"\n📝 Generating quiz...")

        prompt = f"""Based on this educational content, create a quiz with exactly 5 multiple-choice questions.

Content:
{content[:8000]}

Return ONLY a valid JSON object in this EXACT format:
{{
  "questions": [
    {{
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }}
  ]
}}

Rules:
- Each question must have exactly 4 options
- "correct" is the zero-based index of the correct option (0, 1, 2, or 3)
- Questions should test understanding, not just memorization
- Make questions clear and unambiguous"""

        result = ask_ai(prompt, "You are an expert quiz creator. Always respond with valid JSON only.")
        parsed = parse_json_response(result)

        if "questions" not in parsed or not isinstance(parsed["questions"], list):
            return jsonify({"error": "Invalid quiz format"}), 500

        for q in parsed["questions"]:
            if "correct" not in q:
                q["correct"] = 0
            q["correct"] = int(q["correct"])
            if q["correct"] < 0 or q["correct"] >= len(q.get("options", [])):
                q["correct"] = 0

        print(f"✅ Generated {len(parsed['questions'])} quiz questions")
        return jsonify(parsed), 200

    except Exception as e:
        print(f"\n❌ Error in generate_quiz:")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to generate quiz: {str(e)}"}), 500


@app.route('/generate-flashcards', methods=['POST'])
def generate_flashcards():
    """Generate flashcards from lesson content"""
    try:
        if not client:
            return jsonify({"error": "API key not configured"}), 500

        data = request.json
        content = data.get('content', '').strip()

        if not content:
            return jsonify({"error": "Content is required"}), 400

        print(f"\n🃏 Generating flashcards...")

        prompt = f"""Based on this educational content, create exactly 8 study flashcards.

Content:
{content[:8000]}

Return ONLY a valid JSON object in this EXACT format:
{{
  "cards": [
    {{
      "front": "What is the definition of...?",
      "back": "The answer or explanation..."
    }}
  ]
}}

Rules:
- Create 8 flashcards
- Front should be a clear question or key term
- Back should be a concise but complete answer
- Cover the most important concepts from the content"""

        result = ask_ai(prompt, "You are an expert educator creating study flashcards. Always respond with valid JSON only.")
        parsed = parse_json_response(result)

        if "cards" not in parsed or not isinstance(parsed["cards"], list):
            return jsonify({"error": "Invalid flashcards format"}), 500

        print(f"✅ Generated {len(parsed['cards'])} flashcards")
        return jsonify(parsed), 200

    except Exception as e:
        print(f"\n❌ Error in generate_flashcards:")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to generate flashcards: {str(e)}"}), 500


if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 LearnBoard AI Backend")
    print(f"🤖 Model: {GEMINI_MODEL} (via OpenRouter)")
    print("="*60)

    if os.environ.get("OPENROUTER_API_KEY"):
        print("✅ OpenRouter API key is configured")
    else:
        print("❌ OpenRouter API key is NOT set!")
        print("\nAdd to .env file: OPENROUTER_API_KEY=sk-or-v1-your-key")
        print("Get a key at: https://openrouter.ai/keys")

    print("\n📡 Server: http://127.0.0.1:8000")
    print("📝 Press Ctrl+C to stop")
    print("="*60 + "\n")

    app.run(debug=True, host='127.0.0.1', port=8000)