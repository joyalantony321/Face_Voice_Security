import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { faceData, voiceData } = await request.json();
    
    // Here you would integrate with your Python backend
    // For now, we'll simulate the authentication process
    
    // Simulate calling your test_login.py script
    // const pythonProcess = spawn('python', ['backend/audio_video_auth_system/test_login.py']);
    
    // For demo purposes, we'll simulate authentication result
    const isAuthenticated = Math.random() > 0.3; // 70% success rate
    const mockUsers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    
    if (isAuthenticated) {
      return NextResponse.json({
        success: true,
        username: randomUser,
        message: 'Authentication successful'
      });
    } else {
      const failureType = Math.random() > 0.5 ? 'face' : 'voice';
      return NextResponse.json({
        success: false,
        step: failureType,
        message: `${failureType === 'face' ? 'Face' : 'Voice'} authentication failed`
      });
    }
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Authentication service unavailable' },
      { status: 500 }
    );
  }
}