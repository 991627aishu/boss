@echo off
echo Installing NFA Automation Dependencies...

echo.
echo Step 1: Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo.
echo Step 2: Installing Python dependencies...
cd python
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo Step 3: Testing Python script...
python test_script.py
if %errorlevel% neq 0 (
    echo WARNING: Python script test failed, but continuing...
)

echo.
echo Step 4: Starting Node.js server...
cd ..
echo Starting server on http://localhost:5000
echo You can test the Python integration at: http://localhost:5000/api/test-python
node server.js
