import json
import os
from face_utils import capture_face_embedding, compare_embeddings as compare_face
from voice_utils import capture_voice_embedding, compare_embeddings as compare_voice

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

def match_face_to_user(face_embedding, db):
    best_match = None
    best_score = 0

    for name, data in db.items():
        user_faces = data["face"]
        for stored_face in user_faces:
            if compare_face(face_embedding, stored_face):
                sim = compare_face(face_embedding, stored_face, return_score=True)
                if sim > best_score:
                    best_score = sim
                    best_match = name

    if best_match:
        print(f"[DEBUG] Best face match: {best_match} (similarity: {best_score:.4f})")
    return best_match

def test_login(db, interactive=True):
    print("[TEST] Authenticating...")
    face_embedding = capture_face_embedding()
    if face_embedding is None:
        return {"success": False, "message": "No face detected"}

    matched_user = match_face_to_user(face_embedding, db)
    if matched_user:
        voice_embedding = capture_voice_embedding()
        if voice_embedding and compare_voice(voice_embedding, db[matched_user]["voice"]):
            return {"success": True, "username": matched_user}
        else:
            return {"success": False, "message": "Voice mismatch"}
    else:
        return {"success": False, "message": "Face not recognized"}


if __name__ == "__main__":
    db = load_db()
    test_login(db)
