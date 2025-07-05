import os
import json
from face_utils import capture_face_embedding, compare_embeddings as compare_face
from voice_utils import capture_voice_embedding

DB_PATH = 'db.json'
NUM_FACE_SAMPLES = 5  # You can change this if needed

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

def add_user(db, name=None):
    if not name:
        name = input("Enter new user name: ").strip()
    if name in db:
        print("[WARN] User already exists.")
        return db

    print(f"[INFO] Capturing {NUM_FACE_SAMPLES} face samples for better accuracy...")

    face_embeddings = []
    for i in range(NUM_FACE_SAMPLES):
        print(f"[INFO] Capturing face sample {i+1}/{NUM_FACE_SAMPLES}...")
        embedding = capture_face_embedding()
        if embedding:
            face_embeddings.append(embedding)
        else:
            print(f"[WARN] Sample {i+1} failed. Skipping...")

    if len(face_embeddings) == 0:
        print("[ERROR] No face samples captured. Try again.")
        return db

    print("[INFO] Recording your voice saying your secret phrase...")
    voice_embedding = capture_voice_embedding()
    if voice_embedding is None:
        print("[ERROR] Voice capture failed. Try again.")
        return db

    db[name] = {
        "face": face_embeddings,  # Store as list
        "voice": voice_embedding
    }

    print(f"[INFO] User '{name}' added successfully with {len(face_embeddings)} face samples.")
    return db

def delete_user(db, name=None):
    if not name:
        name = input("Enter name to delete: ").strip()

    print("Available users:")
    for i, name in enumerate(db.keys(), 1):
        print(f"{i}. {name}")
    choice = input("Enter the name to delete: ").strip()

    if choice in db:
        del db[choice]
        print(f"[INFO] User '{choice}' deleted.")
    else:
        print("[WARN] Name not found in database.")
    return db

def main():
    db = load_db()
    action = input("Choose action (add / delete / use): ").lower().strip()

    if action == "add":
        db = add_user(db)
    elif action == "delete":
        db = delete_user(db)
    elif action == "use":
        print("[INFO] To authenticate a user, run: python test_login.py")
    else:
        print("[ERROR] Invalid option.")

    save_db(db)

if __name__ == "__main__":
    main()
