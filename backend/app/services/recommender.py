import os
import joblib
import pandas as pd
from app.schemas.learning import Material, RecommendationRequest, RecommendationResponse

# Construct path to ML model
# backend/app/services/recommender.py -> up 4 levels to root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "models", "student_performance_model.joblib")

model = None
try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Failed to load ML model: {e}")

def recommend_learning_path(payload: RecommendationRequest) -> RecommendationResponse:
    if model:
        # Map payload to xAPI-Edu-Data features
        topic_map = {"Matematika": "Math", "Sains": "Science", "Bahasa Inggris": "English"}
        topic = topic_map.get(payload.subject, "IT")
        
        # We map available app inputs to behavioral features for ML model
        features = {
            "Topic": [topic],
            "raisedhands": [int(payload.quiz_score)],
            "VisITedResources": [int(payload.completion_rate * 100)],
            "AnnouncementsView": [50], # Default as standard proxy
            "Discussion": [50] # Default as standard proxy
        }
        
        df = pd.DataFrame(features)
        prediction = model.predict(df)[0] # 'L', 'M', or 'H'
        
        if prediction == 'L':
            difficulty = "remedial"
            reason = "Model AI mendeteksi performa (Low) berisiko berdasarkan riwayat kuis dan keaktifan."
            material_type = "practice"
        elif prediction == 'M':
            difficulty = "standard"
            reason = "Model AI mendeteksi performa (Medium), lanjutkan kurikulum secara bertahap."
            material_type = "lesson"
        else:
            difficulty = "advanced"
            reason = "Model AI mendeteksi performa (High), berikan tantangan pengayaan tambahan."
            material_type = "challenge"
            
    else:
        # Fallback dummy logic if model is not loaded
        if payload.quiz_score < 70:
            difficulty = "remedial"
            reason = "Skor quiz menunjukkan penguatan konsep dasar masih diperlukan."
            material_type = "practice"
        elif payload.completion_rate < 0.8:
            difficulty = "standard"
            reason = "Progress belajar belum konsisten, lanjutkan materi inti secara bertahap."
            material_type = "lesson"
        else:
            difficulty = "advanced"
            reason = "Performa stabil, siswa siap menerima tantangan lanjutan."
            material_type = "challenge"

    topics = payload.weak_topics or [payload.subject]
    materials = [
        Material(title=f"{t} - {difficulty.title()} Path", type=material_type, priority=index + 1)
        for index, t in enumerate(topics[:3])
    ]

    return RecommendationResponse(
        student_id=payload.student_id,
        difficulty=difficulty,
        recommended_topics=topics[:3],
        materials=materials,
        reason=reason,
    )
