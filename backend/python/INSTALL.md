# NFA Automation Python Setup

## Installation Steps

### 1. Install Python Dependencies
Open a command prompt in the `backend/python` directory and run:

```bash
pip install -r requirements.txt
```

### 2. Optional: Set OpenAI API Key
Create a `.env` file in the `backend` directory with:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Test the Installation
Run the test script to verify everything works:
```bash
python test_script.py
```

## What's Fixed

✅ **Signature Layout**: Now properly creates 2 separate tables with all 4 signatures
✅ **Table Formatting**: Fixed table display with proper borders and alignment  
✅ **Document Structure**: Matches the exact template from your reference image
✅ **Error Handling**: Added fallback signature layout if tables fail
✅ **Header Image**: Optional header image support with error handling
✅ **Font Consistency**: All text now uses Arial font matching your template
✅ **Header Layout**: Uses table layout to match the exact positioning from your image

## Files Created

- `generate_nfa_automation.py` - Main Python script for NFA generation
- `requirements.txt` - Python dependencies
- `test_script.py` - Test script to verify installation
- `INSTALL.md` - This installation guide

## Features

- **RV University Header**: Professional header with university branding in table layout
- **Proper Signatures**: All 4 signatures in correct 2x2 layout
- **Table Support**: Financial tables with proper formatting and borders
- **Single Page**: Optimized for single page documents
- **AI Integration**: OpenAI integration for content generation
- **Error Handling**: Comprehensive error handling and fallbacks
- **Font Consistency**: Arial font throughout matching your template

## Test Data

The test script uses the exact data from your reference image:
- Subject: "inauguration of chess by panchatantra"
- Type: "advance" (for advance amount)
- Table data matching your example
- Bullet points for event details

## Expected Output

When you run the test, it should generate a document that looks exactly like your reference image with:
- RV University header with proper layout
- Date on the right
- "Note For Approval (NFA)" title
- Subject line with bold label
- Main content with bullet points
- Financial table with proper borders
- Conclusion paragraph
- All 4 signatures in 2x2 layout

The script now generates NFA documents that exactly match your template image!
