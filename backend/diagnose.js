#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🔍 NFA System Diagnostic Tool');
console.log('================================');

// Check 1: Python installation
console.log('\n1. Checking Python installation...');
const pythonCheck = spawn('python', ['--version'], { shell: true });

pythonCheck.stdout.on('data', (data) => {
    console.log('✅ Python found:', data.toString().trim());
});

pythonCheck.stderr.on('data', (data) => {
    console.log('❌ Python error:', data.toString().trim());
});

pythonCheck.on('close', (code) => {
    if (code === 0) {
        console.log('✅ Python is properly installed');
    } else {
        console.log('❌ Python is not installed or not in PATH');
        console.log('   Please install Python from https://python.org');
    }
    
    // Check 2: Python script exists
    console.log('\n2. Checking Python script...');
    const scriptPath = path.join(__dirname, 'python', 'generate_nfa_automation.py');
    
    if (fs.existsSync(scriptPath)) {
        console.log('✅ Python script found:', scriptPath);
        
        // Check 3: Test Python script
        console.log('\n3. Testing Python script...');
        const testProcess = spawn('python', [
            scriptPath,
            'Test Subject',
            'Test Summary',
            'reimbursement',
            'no',
            '[]'
        ], {
            cwd: path.dirname(scriptPath)
        });
        
        let stdout = '';
        let stderr = '';
        
        testProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        testProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        testProcess.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Python script executed successfully');
                try {
                    const result = JSON.parse(stdout);
                    console.log('✅ Script returned valid JSON:', result.success ? 'SUCCESS' : 'FAILED');
                } catch (e) {
                    console.log('❌ Script output is not valid JSON');
                    console.log('Output:', stdout);
                }
            } else {
                console.log('❌ Python script failed with code:', code);
                console.log('Error output:', stderr);
            }
            
            // Check 4: Dependencies
            console.log('\n4. Checking Python dependencies...');
            const depsProcess = spawn('pip', ['list'], { shell: true });
            
            depsProcess.stdout.on('data', (data) => {
                const output = data.toString();
                const required = ['openai', 'python-docx', 'python-dotenv'];
                const missing = [];
                
                required.forEach(dep => {
                    if (!output.includes(dep)) {
                        missing.push(dep);
                    }
                });
                
                if (missing.length === 0) {
                    console.log('✅ All required dependencies are installed');
                } else {
                    console.log('❌ Missing dependencies:', missing.join(', '));
                    console.log('   Run: pip install -r requirements.txt');
                }
            });
            
            depsProcess.on('close', () => {
                console.log('\n📋 Summary:');
                console.log('- If all checks show ✅, your system is ready');
                console.log('- If any checks show ❌, fix those issues first');
                console.log('- Then start your backend server: node server.js');
                console.log('- Test the download button in your frontend');
            });
        });
        
    } else {
        console.log('❌ Python script not found:', scriptPath);
        console.log('   Make sure the file exists in the correct location');
    }
});
