# ==================== ai_engine.py ====================

import os
import json
from openai import OpenAI

# ----------------------------------------------------
# OPENAI SETUP
# ----------------------------------------------------

# Get API key from environment variable
API_KEY = os.getenv("OPENAI_API_KEY")

if not API_KEY:
    print("⚠️ WARNING: OPENAI_API_KEY not set in environment variables!")
    print("Please set it with: export OPENAI_API_KEY='your-key-here'")
    client = None
else:
    client = OpenAI(api_key=API_KEY)
    print("✅ OpenAI client initialized successfully")


# ----------------------------------------------------
# CHECK OPENAI CONNECTION
# ----------------------------------------------------

def check_openai_response():
    """Test OpenAI API connection"""
    if not client:
        return {
            "success": False,
            "message": "OpenAI API key not configured"
        }
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "Say 'API is working!' in exactly those words."}
            ],
            max_tokens=20
        )
        
        result = response.choices[0].message.content.strip()
        
        return {
            "success": True,
            "message": "OpenAI API is working correctly",
            "test_response": result
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": f"OpenAI API error: {str(e)}"
        }


# ----------------------------------------------------
# CREATE DOCUMENT FROM TOPIC
# ----------------------------------------------------

def create_document(topic, num_slides=5):
    """
    Generate educational slides on a given topic using OpenAI
    
    Args:
        topic (str): The subject to create slides about
        num_slides (int): Number of slides to generate (3-10)
    
    Returns:
        dict: Contains 'slides' array with title, content, and explanation
    """
    
    if not client:
        print("❌ OpenAI client not initialized")
        return {"slides": []}
    
    try:
        prompt = f"""Create an educational lesson on "{topic}" with exactly {num_slides} slides.

For each slide, provide:
1. A clear, engaging title
2. Detailed content (2-4 paragraphs) that teaches the concept thoroughly
3. 3-4 key insights or bullet points that highlight the most important takeaways

Format your response as valid JSON with this exact structure:
{{
  "slides": [
    {{
      "title": "Slide Title Here",
      "content": "Detailed explanation here. Use \\n\\n for paragraph breaks.",
      "explanation": [
        "First key insight",
        "Second key insight",
        "Third key insight"
      ]
    }}
  ]
}}

Make the content engaging, educational, and appropriate for someone learning this topic for the first time.
Include examples where helpful. Use clear, accessible language.

IMPORTANT: Return ONLY valid JSON, no additional text before or after."""

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert educational content creator. You create clear, engaging, and comprehensive learning materials. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=4000
        )
        
        content = response.choices[0].message.content.strip()
        
        # Try to extract JSON if there's extra text
        if content.startswith("```json"):
            content = content.split("```json")[1].split("```")[0].strip()
        elif content.startswith("```"):
            content = content.split("```")[1].split("```")[0].strip()
        
        result = json.loads(content)
        
        # Validate structure
        if "slides" not in result or not isinstance(result["slides"], list):
            raise ValueError("Invalid response structure")
        
        # Ensure all required fields exist
        for slide in result["slides"]:
            if "title" not in slide:
                slide["title"] = "Untitled"
            if "content" not in slide:
                slide["content"] = "No content available"
            if "explanation" not in slide:
                slide["explanation"] = ["No explanation available"]
        
        print(f"✅ Generated {len(result['slides'])} slides for '{topic}'")
        return result
    
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        print(f"Raw response: {content[:500]}")
        return create_fallback_document(topic, num_slides)
    
    except Exception as e:
        print(f"❌ Error creating document: {e}")
        return create_fallback_document(topic, num_slides)


# ----------------------------------------------------
# ANALYZE PDF CONTENT
# ----------------------------------------------------

def analyze_pdf_content(text, max_slides=5):
    """
    Analyze PDF text and create educational slides
    
    Args:
        text (str): Extracted text from PDF
        max_slides (int): Maximum number of slides to generate
    
    Returns:
        dict: Contains 'slides' array
    """
    
    if not client:
        print("❌ OpenAI client not initialized")
        return {"slides": []}
    
    # Limit text length to avoid token limits
    max_chars = 12000
    if len(text) > max_chars:
        text = text[:max_chars] + "..."
    
    try:
        prompt = f"""Analyze the following document and create {max_slides} educational slides that teach the main concepts.

Document text:
{text}

Create slides that:
1. Identify the key topics and concepts
2. Explain them clearly and comprehensively
3. Provide insights and takeaways

Format your response as valid JSON with this exact structure:
{{
  "slides": [
    {{
      "title": "Main Topic or Concept",
      "content": "Detailed explanation of this concept from the document. Use \\n\\n for paragraph breaks.",
      "explanation": [
        "Key insight 1",
        "Key insight 2",
        "Key insight 3"
      ]
    }}
  ]
}}

IMPORTANT: Return ONLY valid JSON, no additional text."""

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert at analyzing documents and creating educational content. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=3000
        )
        
        content = response.choices[0].message.content.strip()
        
        # Extract JSON if wrapped in code blocks
        if content.startswith("```json"):
            content = content.split("```json")[1].split("```")[0].strip()
        elif content.startswith("```"):
            content = content.split("```")[1].split("```")[0].strip()
        
        result = json.loads(content)
        
        # Validate and ensure structure
        if "slides" not in result or not isinstance(result["slides"], list):
            raise ValueError("Invalid response structure")
        
        for slide in result["slides"]:
            if "title" not in slide:
                slide["title"] = "Document Summary"
            if "content" not in slide:
                slide["content"] = "Content extracted from document"
            if "explanation" not in slide:
                slide["explanation"] = ["Key point from document"]
        
        print(f"✅ Analyzed PDF and generated {len(result['slides'])} slides")
        return result
    
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        return create_fallback_pdf_analysis(text, max_slides)
    
    except Exception as e:
        print(f"❌ Error analyzing PDF: {e}")
        return create_fallback_pdf_analysis(text, max_slides)


# ----------------------------------------------------
# ANSWER STUDENT DOUBTS
# ----------------------------------------------------

def answer_doubt(question, context):
    """
    Answer a student's question using the slide context
    
    Args:
        question (str): Student's question
        context (str): Current slide content for context
    
    Returns:
        str: AI tutor's answer
    """
    
    if not client:
        return "Sorry, the AI tutor is not available right now. Please check your API configuration."
    
    try:
        prompt = f"""You are a friendly and knowledgeable AI tutor helping a student understand a topic.

Current lesson context:
{context}

Student's question:
{question}

Provide a clear, helpful answer that:
1. Directly addresses their question
2. Uses the lesson context when relevant
3. Provides examples if helpful
4. Encourages further learning

Keep your answer concise but thorough (2-4 paragraphs)."""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a patient, encouraging AI tutor who explains concepts clearly and helps students learn effectively."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        answer = response.choices[0].message.content.strip()
        print(f"✅ Generated answer for question: {question[:50]}...")
        return answer
    
    except Exception as e:
        print(f"❌ Error answering doubt: {e}")
        return "I apologize, but I encountered an error while processing your question. Please try again or rephrase your question."


# ----------------------------------------------------
# FALLBACK FUNCTIONS
# ----------------------------------------------------

def create_fallback_document(topic, num_slides):
    """Create a basic document structure when AI generation fails"""
    slides = []
    for i in range(num_slides):
        slides.append({
            "title": f"{topic} - Part {i+1}",
            "content": f"This is slide {i+1} about {topic}.\n\nThe AI system encountered an issue generating detailed content. Please try again or check your API configuration.",
            "explanation": [
                "This is a placeholder slide",
                "The content generation system needs configuration",
                "Please ensure OpenAI API key is set correctly"
            ]
        })
    return {"slides": slides}


def create_fallback_pdf_analysis(text, num_slides):
    """Create basic slides from PDF text when AI analysis fails"""
    # Split text into chunks
    words = text.split()
    chunk_size = len(words) // num_slides if len(words) > num_slides else len(words)
    
    slides = []
    for i in range(min(num_slides, 3)):
        start = i * chunk_size
        end = start + chunk_size
        chunk = " ".join(words[start:end])[:500]
        
        slides.append({
            "title": f"Document Section {i+1}",
            "content": chunk + "...",
            "explanation": [
                "This is extracted content from your PDF",
                "AI analysis was unavailable",
                "Check your API configuration for full analysis"
            ]
        })
    
    return {"slides": slides}