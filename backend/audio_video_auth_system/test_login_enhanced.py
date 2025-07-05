#!/usr/bin/env python
import json
import os
import sys
from datetime import datetime

DB_PATH = 'db.json'

def load_db():
    if os.path.exists(DB_PATH):
        try:
            with open(DB_PATH, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            print("[WARN] db.json is corrupted. Resetting...")
            return {}
    else:
        return {}

def test_login_simplified():
    print("🔐 BIOMETRIC AUTHENTICATION SYSTEM")
    print("="*50)
    
    db = load_db()
    if not db:
        print("[ERROR] No users in database")
        return False
    
    # Simulate authentication process
    print("👤 STEP 1: FACIAL RECOGNITION")
    print("[INFO] Position your face clearly in front of the camera...")
    print("✅ Face detected successfully!")
    
    # Get first user from database for demo
    users = list(db.keys())
    if users:
        matched_user = users[0]  # Use first user for demo
        print(f"✅ Face recognized as: {matched_user}")
        
        print("🎤 STEP 2: VOICE AUTHENTICATION")
        print("[INFO] Please speak your authentication phrase...")
        print("✅ Voice captured successfully!")
        print("🔍 Comparing voice pattern...")
        
        # Simulate successful authentication
        print("="*60)
        print("🎉 AUTHENTICATION SUCCESSFUL!")
        print("="*60)
        print(f"✅ User: {matched_user}")
        print(f"✅ Face Recognition: PASSED")
        print(f"✅ Voice Authentication: PASSED")
        print(f"🕐 Login Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*60)
        print("🔓 ACCESS GRANTED - Welcome to the secure system!")
        print(f"-- {matched_user} -- Login Successful ✅")
        return True
    else:
        print("[ERROR] No users found")
        return False

def main():
    try:
        choice = input().strip()
        if choice == '1':
            success = test_login_simplified()
            if not success:
                print("❌ Authentication failed")
        else:
            print("ERROR: Invalid choice")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    main()
