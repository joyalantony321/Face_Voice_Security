import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { action, userName, workspaceCode } = await request.json();
    
    let scriptPath: string;
    let args: string[] = [];
    
    // Determine which Python script to run
    if (action === 'add_user') {
      scriptPath = path.join(process.cwd(), 'backend', 'audio_video_auth_system', 'add_delete_admin.py');
    } else if (action === 'authenticate') {
      scriptPath = path.join(process.cwd(), 'backend', 'audio_video_auth_system', 'test_login_enhanced.py');
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid action specified' },
        { status: 400 }
      );
    }
    
    // Spawn Python process
    const pythonProcess = spawn('python', [scriptPath], {
      cwd: path.join(process.cwd(), 'backend', 'audio_video_auth_system'),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let error = '';
    
    // Handle Python script output
    pythonProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log('Python Output:', text);
    });
    
    pythonProcess.stderr.on('data', (data) => {
      const text = data.toString();
      error += text;
      console.error('Python Error:', text);
    });
    
    // Send input to Python script if needed
    if (action === 'add_user' && userName) {
      // Simulate user input for add_delete_admin.py
      setTimeout(() => {
        pythonProcess.stdin.write('1\n'); // Choose option 1 (add user)
        setTimeout(() => {
          pythonProcess.stdin.write(`${userName}\n`); // Enter user name
          if (workspaceCode) {
            setTimeout(() => {
              pythonProcess.stdin.write(`${workspaceCode}\n`); // Enter workspace code
            }, 500);
          }
        }, 500);
      }, 1000);
    } else if (action === 'authenticate') {
      // Simulate user input for test_login_enhanced.py
      setTimeout(() => {
        pythonProcess.stdin.write('1\n'); // Choose option 1 (start authentication)
      }, 1000);
    }
    
    return new Promise((resolve) => {
      pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
        
        // Parse output for specific results
        let success = false;
        let username = null;
        let message = '';
        
        if (action === 'add_user') {
          success = output.includes('added successfully') || output.includes('SUCCESS');
          message = success ? `User ${userName} added successfully` : 'Failed to add user';
        } else if (action === 'authenticate') {
          success = output.includes('Login Successful ✅');
          const userMatch = output.match(/-- (.*?) -- Login Successful/);
          username = userMatch ? userMatch[1] : null;
          message = success ? `Authentication successful for ${username}` : 'Authentication failed';
        }
        
        resolve(NextResponse.json({
          success,
          username,
          message,
          output,
          error: error || null,
          exitCode: code
        }));
      });
      
      // Handle process errors
      pythonProcess.on('error', (err) => {
        console.error('Failed to start Python process:', err);
        resolve(NextResponse.json({
          success: false,
          message: 'Failed to start Python process',
          error: err.message
        }, { status: 500 }));
      });
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}