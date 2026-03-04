# 📦 INSTALLATION GUIDE

Complete guide to install all dependencies for LearnBoard AI

## 🔧 Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Internet connection

## ✅ Step-by-Step Installation

### 1. Check Python Version

```bash
python --version
# or
python3 --version
```

You should see Python 3.8 or higher.

### 2. Upgrade pip (Recommended)

```bash
python -m pip install --upgrade pip
# or
python3 -m pip install --upgrade pip
```

### 3. Install Dependencies

**Option A: Using requirements.txt (Recommended)**
```bash
pip install -r requirements.txt
```

**Option B: Install packages individually**
```bash
pip install Flask==3.0.0
pip install flask-cors==4.0.0
pip install openai==1.6.1
pip install PyPDF2==3.0.1
pip install Werkzeug==3.0.1
```

**For Linux/Mac users who get permission errors:**
```bash
pip install -r requirements.txt --user
```

**For systems with externally-managed Python:**
```bash
pip install -r requirements.txt --break-system-packages
```

### 4. Verify Installation

Create a file called `verify_install.py`:

```python
#!/usr/bin/env python3

import sys

print("Checking Python version...")
print(f"Python {sys.version}")
print()

packages = {
    'Flask': 'flask',
    'flask-cors': 'flask_cors',
    'OpenAI': 'openai',
    'PyPDF2': 'PyPDF2',
    'Werkzeug': 'werkzeug'
}

print("Checking installed packages:")
print("-" * 50)

all_installed = True

for name, module in packages.items():
    try:
        mod = __import__(module)
        version = getattr(mod, '__version__', 'unknown')
        print(f"✅ {name:15} - Version {version}")
    except ImportError:
        print(f"❌ {name:15} - NOT INSTALLED")
        all_installed = False

print("-" * 50)

if all_installed:
    print("\n✅ All packages installed successfully!")
    print("You're ready to run LearnBoard AI!")
else:
    print("\n❌ Some packages are missing.")
    print("Run: pip install -r requirements.txt")

print()
```

Run it:
```bash
python verify_install.py
```

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'PyPDF2'"

**Solution 1: Install PyPDF2 directly**
```bash
pip install PyPDF2
```

**Solution 2: Try alternative PyPDF2 package**
```bash
pip install pypdf2
```

**Solution 3: Install specific version**
```bash
pip install PyPDF2==3.0.1
```

### Issue: "ERROR: externally-managed-environment"

This happens on newer Linux systems (Debian 12, Ubuntu 23.04+).

**Solution 1: Use virtual environment (Recommended)**
```bash
# Create virtual environment
python3 -m venv learnboard_env

# Activate it
# On Linux/Mac:
source learnboard_env/bin/activate
# On Windows:
learnboard_env\Scripts\activate

# Install packages
pip install -r requirements.txt
```

**Solution 2: Use --break-system-packages flag**
```bash
pip install -r requirements.txt --break-system-packages
```

**Solution 3: Use --user flag**
```bash
pip install -r requirements.txt --user
```

### Issue: "Permission denied"

**Solution: Use --user flag**
```bash
pip install -r requirements.txt --user
```

### Issue: "Could not find a version that satisfies the requirement"

**Solution 1: Update pip**
```bash
python -m pip install --upgrade pip
```

**Solution 2: Use latest available versions**
```bash
pip install Flask flask-cors openai PyPDF2 Werkzeug
```

### Issue: SSL Certificate errors

**Solution:**
```bash
pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt
```

## 🌐 Using Virtual Environment (Best Practice)

Virtual environments keep your project dependencies isolated.

### Create Virtual Environment

```bash
# Navigate to project directory
cd learnboard-ai

# Create virtual environment
python3 -m venv venv

# Activate it
# Linux/Mac:
source venv/bin/activate
# Windows CMD:
venv\Scripts\activate.bat
# Windows PowerShell:
venv\Scripts\Activate.ps1
```

### Install Dependencies in Virtual Environment

```bash
# After activating virtual environment
pip install -r requirements.txt
```

### Run Application in Virtual Environment

```bash
# Make sure venv is activated (you should see (venv) in prompt)
python app.py
```

### Deactivate Virtual Environment

```bash
deactivate
```

## 📝 Alternative: Install Latest Versions

If specific versions cause issues, try installing latest stable versions:

```bash
pip install Flask
pip install flask-cors
pip install openai
pip install PyPDF2
pip install Werkzeug
```

## 🔍 Check What's Installed

```bash
# List all installed packages
pip list

# Check specific package
pip show PyPDF2
pip show Flask
pip show openai
```

## 💡 Quick Start After Installation

Once all packages are installed:

1. **Set OpenAI API Key:**
   ```bash
   export OPENAI_API_KEY='your-key-here'
   ```

2. **Test Installation:**
   ```bash
   python test_backend.py
   ```

3. **Start Backend:**
   ```bash
   python app.py
   ```

4. **Open index.html in browser**

## 🆘 Still Having Issues?

1. **Check Python version:** Must be 3.8 or higher
2. **Check pip version:** `pip --version`
3. **Try virtual environment:** Cleanest installation method
4. **Check internet connection:** Required for pip installs
5. **Try installing one package at a time:** Helps identify which package causes issues

## 📋 Minimum Requirements

```
Python >= 3.8
pip >= 20.0
```

## 🎯 Success Checklist

- [ ] Python 3.8+ installed
- [ ] pip updated to latest version
- [ ] All packages from requirements.txt installed
- [ ] verify_install.py shows all ✅
- [ ] test_backend.py can import all modules
- [ ] OpenAI API key configured

---

**Ready?** Run `python app.py` and open index.html!
