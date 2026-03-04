import os
from google import genai
from dotenv import load_dotenv

def test_api_key():
    """
    Test if your Google Gemini API key is working
    """
    
    print("=" * 50)
    print("Testing Google Gemini API Key")
    print("=" * 50)
    
    # Step 1: Load environment variables
    print("\n[Step 1] Loading environment variables...")
    load_dotenv()
    
    # Step 2: Check if API key exists
    print("[Step 2] Checking if API key exists...")
    api_key = os.getenv('GOOGLE_API_KEY')
    
    if not api_key:
        print("❌ FAILED: API key not found!")
        print("\nPlease check:")
        print("1. Create a .env file in your project directory")
        print("2. Add this line: GOOGLE_API_KEY=your_api_key_here")
        print("3. Replace 'your_api_key_here' with your actual key")
        return False
    
    print(f"✓ API key found: {api_key[:10]}...{api_key[-4:]}")
    
    # Step 3: Try to initialize client
    print("\n[Step 3] Initializing Gemini client...")
    try:
        client = genai.Client(api_key=api_key)
        print("✓ Client initialized successfully")
    except Exception as e:
        print(f"❌ FAILED to initialize client: {e}")
        return False
    
    # Step 4: Test API call
    print("\n[Step 4] Testing API with a simple request...")
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents="Say 'Hello! API is working!' in one sentence."
        )
        
        print("✓ API call successful!")
        print(f"\n📝 Response from Gemini:")
        print(f"   {response.text}")
        
    except Exception as e:
        print(f"❌ FAILED: {e}")
        print("\nCommon issues:")
        print("1. Invalid API key - Get a new one from https://makersuite.google.com/app/apikey")
        print("2. API key not activated - Wait a few minutes after creation")
        print("3. Billing not enabled - Check Google Cloud Console")
        print("4. API quota exceeded - Check your usage limits")
        return False
    
    # Step 5: Success!
    print("\n" + "=" * 50)
    print("✅ ALL TESTS PASSED! Your API key is working!")
    print("=" * 50)
    return True


if __name__ == "__main__":
    test_api_key()