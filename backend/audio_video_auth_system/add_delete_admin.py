#!/usr/bin/env python3
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

def save_db(db):
    with open(DB_PATH, 'w') as f:
        json.dump(db, f, indent=4)

def add_user_simplified(name, workspace_code=None):
    print(f"[INFO] Adding user: {name}")
    print("[INFO] Simulating face capture...")
    print("[INFO] Simulating voice capture...")
    
    db = load_db()
    
    if name in db:
        print(f"[ERROR] User '{name}' already exists in database.")
        return False
    
    # Simulate biometric data (in real implementation, this would capture actual biometrics)
    import random
    face_embedding = [random.random() for _ in range(128)]  # Simulate face embedding
    voice_embedding = [random.random() for _ in range(256)]  # Simulate voice embedding
    
    user_data = {
        "face": face_embedding,
        "voice": voice_embedding,
        "created_date": str(datetime.now().date()),
        "workspace": workspace_code if workspace_code else "default"
    }
    
    db[name] = user_data
    save_db(db)
    
    print(f"✅ User '{name}' added successfully!")
    print(f"📊 Total users in database: {len(db)}")
    return True

def main():
    print("🔐 BIOMETRIC USER REGISTRATION")
    print("="*50)
    
    # Read from stdin for web integration
    try:
        choice = input().strip()
        if choice == '1':
            name = input().strip()
            workspace_code = input().strip()
            workspace_code = workspace_code if workspace_code else None
            
            success = add_user_simplified(name, workspace_code)
            if success:
                print("SUCCESS: User added with biometric data")
            else:
                print("ERROR: Failed to add user")
        else:
            print("ERROR: Invalid choice")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    main()
