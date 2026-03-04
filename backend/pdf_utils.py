# ==================== pdf_utils.py ====================

import io
import PyPDF2

def extract_text(file):
    """
    Extract text content from a PDF file
    
    Args:
        file: FileStorage object from Flask request.files
    
    Returns:
        str: Extracted text from all pages
    """
    try:
        # Read file into memory
        pdf_bytes = file.read()
        pdf_file = io.BytesIO(pdf_bytes)
        
        # Create PDF reader
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        # Extract text from all pages
        text = ""
        num_pages = len(pdf_reader.pages)
        
        print(f"📄 PDF has {num_pages} pages")
        
        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            page_text = page.extract_text()
            text += page_text + "\n\n"
        
        # Clean up text
        text = text.strip()
        
        if not text:
            print("⚠️ Warning: No text extracted from PDF")
            return ""
        
        print(f"✅ Extracted {len(text)} characters from PDF")
        return text
    
    except PyPDF2.errors.PdfReadError as e:
        print(f"❌ PDF Read Error: {e}")
        raise Exception("Could not read PDF. It may be corrupted or encrypted.")
    
    except Exception as e:
        print(f"❌ Error extracting text: {e}")
        raise Exception(f"Failed to extract text from PDF: {str(e)}")