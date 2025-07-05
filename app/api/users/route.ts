import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Path to db.json file
    const dbPath = path.join(process.cwd(), 'backend', 'audio_video_auth_system', 'db.json');
    
    // Check if db.json exists
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({
        success: false,
        message: 'Database file not found',
        users: [],
        totalUsers: 0
      });
    }

    // Read and parse db.json
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    const dbData = JSON.parse(dbContent);

    // Transform the data into the expected format
    const users = Object.keys(dbData).map((username, index) => {
      const userData = dbData[username];
      
      return {
        id: (index + 1).toString(),
        name: username,
        email: `${username}@example.com`, // Generate email since it's not in db.json
        status: 'active' as const,
        addedDate: new Date().toISOString().split('T')[0], // Use current date since not in db.json
        hasFaceData: userData.face && userData.face.length > 0,
        hasVoiceData: userData.voice && userData.voice.length > 0,
        faceEmbeddings: userData.face ? userData.face.length : 0,
        voiceEmbeddings: userData.voice ? userData.voice.length : 0
      };
    });

    return NextResponse.json({
      success: true,
      message: `Successfully loaded ${users.length} users from database`,
      users: users,
      totalUsers: users.length,
      source: 'db.json',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error reading database:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to read database file',
      users: [],
      totalUsers: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
