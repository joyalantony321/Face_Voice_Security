import sounddevice as sd
import numpy as np
import librosa
from resemblyzer import VoiceEncoder, preprocess_wav
from sklearn.metrics.pairwise import cosine_similarity
import tempfile
import scipy.io.wavfile

encoder = VoiceEncoder()

def capture_voice_embedding(duration=4):
    print("[INFO] Recording voice for 4 seconds...")
    fs = 16000
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
    sd.wait()

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        scipy.io.wavfile.write(f.name, fs, recording)
        try:
            wav = preprocess_wav(f.name)
            embedding = encoder.embed_utterance(wav)
            return embedding.tolist()
        except Exception as e:
            print(f"[ERROR] Voice preprocessing failed: {e}")
            return None

def compare_embeddings(e1, e2, threshold=0.75):
    sim = cosine_similarity([e1], [e2])[0][0]
    return sim >= threshold
