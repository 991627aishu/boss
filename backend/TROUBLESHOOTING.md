# NFA Download Button Troubleshooting

## Quick Fix Steps

### 1. Check if Python is Installed
Open command prompt and run:
```bash
python --version
```
If not installed, download from https://python.org

### 2. Install Python Dependencies
```bash
cd backend/python
pip install -r requirements.txt
```

### 3. Test Python Script Directly
```bash
cd backend/python
python test_script.py
```

### 4. Test Backend Integration
Start your backend server and visit:
```
http://localhost:5000/api/test-python
```

### 5. Check Server Logs
When you click the download button, check the console logs for error messages.

## Common Issues and Solutions

### Issue 1: "Python script not found"
**Solution**: Make sure the file `backend/python/generate_nfa_automation.py` exists

### Issue 2: "Failed to start Python script"
**Solution**: 
- Install Python from https://python.org
- Make sure Python is in your system PATH
- Try using `python3` instead of `python` in the command

### Issue 3: "Module not found" errors
**Solution**: Install required packages:
```bash
pip install openai python-docx python-dotenv
```

### Issue 4: Document downloads but looks wrong
**Solution**: The fallback system is working. Install Python dependencies to get proper formatting.

### Issue 5: No download happens at all
**Solution**: Check browser console for JavaScript errors

## Testing Steps

1. **Test Backend Health**: Visit `http://localhost:5000/api/health`
2. **Test Python Script**: Visit `http://localhost:5000/api/test-python`
3. **Test NFA Generation**: Use your frontend form to generate an NFA

## Fallback System

If Python script fails, the system will automatically create a simple text-based NFA document as a fallback. This ensures the download button always works, even without Python.

## Getting Help

If issues persist:
1. Check the server console logs
2. Check browser developer console
3. Test the Python script manually
4. Verify all file paths are correct
