#!/usr/bin/env python3
"""
Quick test to verify the NFA DOCX generation fixes work
"""

import sys
import os
import json

# Add the backend/python directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'python'))

def test_python_fixes():
    """Test if the Python fixes work"""
    try:
        print("🧪 Testing Python NFA DOCX generation fixes...")
        
        # Import the module
        from generate_nfa_automation import main
        
        # Test data
        test_subject = "Chess By Panchatantra"
        test_summary = "RVU clubs combined celebrate the event Chess By Panchatantra in the RV University Campus. This proposal requires administrative approval for successful execution."
        test_nfa_type = "reimbursement"
        test_bullets = "yes"
        test_table_data = '[]'
        
        print(f"📝 Test Subject: {test_subject}")
        
        # Set up sys.argv for the main function
        sys.argv = [
            'generate_nfa_automation.py',
            test_subject,
            test_summary,
            test_nfa_type,
            test_bullets,
            test_table_data
        ]
        
        print("🔄 Running NFA generation...")
        
        # Capture output
        import io
        from contextlib import redirect_stdout, redirect_stderr
        
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        
        with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
            main()
        
        stdout_output = stdout_capture.getvalue()
        stderr_output = stderr_capture.getvalue()
        
        print("📤 STDOUT Output:")
        print(stdout_output)
        
        print("📤 STDERR Output:")
        print(stderr_output)
        
        # Parse the JSON result
        try:
            result = json.loads(stdout_output.strip())
            if result.get('success'):
                print("✅ Python NFA generation test PASSED!")
                print(f"📁 Generated file: {result.get('file_path')}")
                
                # Check if file exists
                file_path = os.path.join('backend', result.get('file_path', ''))
                if os.path.exists(file_path):
                    file_size = os.path.getsize(file_path)
                    print(f"📊 File size: {file_size} bytes")
                    if file_size > 0:
                        print("✅ File created successfully and is not empty!")
                        return True
                    else:
                        print("❌ File is empty!")
                        return False
                else:
                    print("❌ Generated file does not exist!")
                    return False
            else:
                print("❌ Python NFA generation test FAILED!")
                print(f"Error: {result.get('error')}")
                return False
        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse JSON output: {e}")
            print(f"Raw output: {stdout_output}")
            return False
            
    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🔧 Quick Python NFA Fix Test")
    print("=" * 40)
    
    # Test Python generation
    test_passed = test_python_fixes()
    
    print("\n" + "=" * 40)
    print("📊 Test Result:")
    print(f"✅ Python NFA Generation: {'PASSED' if test_passed else 'FAILED'}")
    
    if test_passed:
        print("\n🎉 Python fixes are working! The issue might be:")
        print("1. Python is not available in your Node.js environment")
        print("2. The system is falling back to client-side generation")
        print("3. Check your Node.js Python execution setup")
        sys.exit(0)
    else:
        print("\n❌ Python test FAILED. Check the output above for details.")
        sys.exit(1)
