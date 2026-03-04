# 🚀 QUICK START GUIDE

Get LearnBoard AI running in 5 minutes!

## ⚡ Quick Setup (3 Steps)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Your OpenAI API Key
```bash
export OPENAI_API_KEY='your-api-key-here'
```

### 3. Start the Application
```bash
# Terminal 1: Start backend
python app.py

# Then open index.html in your browser
```

That's it! 🎉

---

## 📝 Detailed Instructions

### Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (save it somewhere safe!)

### Setting API Key by Operating System

**macOS/Linux:**
```bash
export OPENAI_API_KEY='sk-your-key-here'
```

**Windows (Command Prompt):**
```cmd
set OPENAI_API_KEY=sk-your-key-here
```

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="sk-your-key-here"
```

### Using the Startup Script (Optional)
```bash
# Make it executable (macOS/Linux only)
chmod +x start.sh

# Run it
./start.sh
```

---

## 🧪 Testing Your Setup

Run the test script to verify everything works:
```bash
python test_backend.py
```

You should see:
```
✅ Health Check: PASSED
✅ Root Endpoint: PASSED
✅ OpenAI Connection: PASSED
```

---

## 🎯 First Use

1. **Backend should show:**
```
============================================================
🚀 LearnBoard AI Backend Starting...
============================================================
📍 Server: http://127.0.0.1:8000
```

2. **Open index.html in browser**
   - Double-click the file, or
   - Right-click → Open with → Chrome/Firefox/Safari

3. **Try it out:**
   - Click "Create New Lesson"
   - Enter "Solar System" as topic
   - Click "Generate"
   - Wait 10-30 seconds for AI to create lesson

---

## ❌ Common Issues

### "Cannot connect to backend"
→ Make sure `python app.py` is running in terminal

### "OpenAI API error"
→ Check API key is set: `echo $OPENAI_API_KEY`

### "Module not found"
→ Run: `pip install -r requirements.txt`

### Port 8000 already in use
→ Edit `app.py`, change port from 8000 to 8001
→ Edit `index.html`, change API_URL to use port 8001

---

## 📂 File Overview

```
├── app.py              → Backend server (Flask)
├── ai_engine.py        → OpenAI integration
├── pdf_utils.py        → PDF processing
├── index.html          → Frontend UI
├── requirements.txt    → Python packages
├── start.sh           → Startup script
├── test_backend.py    → Testing script
└── README.md          → Full documentation
```

---

## 💡 Pro Tips

1. **Keep terminal open** - Backend must run continuously
2. **Use Chrome/Firefox** - Best browser compatibility
3. **Start with short lessons** - Try 3-5 slides first
4. **PDF must have text** - Scanned images won't work
5. **Check API credits** - Monitor usage on OpenAI dashboard

---

## 🆘 Need Help?

1. Check README.md for detailed troubleshooting
2. Run `python test_backend.py` to diagnose issues
3. Look at terminal output for error messages
4. Check browser console (F12) for frontend errors

---

**Ready to start learning? Run the backend and open index.html!** 🎓
