import face_recognition
import cv2
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def capture_face_embedding(samples=5):
    cap = cv2.VideoCapture(0)
    embeddings = []

    print(f"[INFO] Capturing {samples} face samples. Please look straight at the camera...")

    while len(embeddings) < samples:
        ret, frame = cap.read()
        if not ret:
            print("[ERROR] Camera failed.")
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb)

        if not face_locations:
            continue

        encodings = face_recognition.face_encodings(rgb, face_locations)
        if encodings:
            embeddings.append(encodings[0])

        # Show feedback frame
        cv2.putText(frame, f"Sample {len(embeddings)}/{samples}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow("Capturing Face", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    if len(embeddings) == 0:
        print("[ERROR] No valid face encodings captured.")
        return None

    avg_embedding = np.mean(embeddings, axis=0)
    return avg_embedding.tolist()

def compare_embeddings(e1, e2, threshold=0.75, return_score=False):
    from sklearn.metrics.pairwise import cosine_similarity
    similarity = cosine_similarity([e1], [e2])[0][0]
    if return_score:
        return similarity
    return similarity >= threshold

