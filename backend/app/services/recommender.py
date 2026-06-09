import os
import joblib
import numpy as np
import pandas as pd
from app.schemas.learning import Material, RecommendationRequest, RecommendationResponse

# Construct path to ML model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "models", "student_behavior_model.joblib")

model = None
try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"[Lumora AI] ML Model loaded successfully from {MODEL_PATH}")
    else:
        print(f"[Lumora AI] WARNING: Model not found at {MODEL_PATH}, using fallback rules.")
except Exception as e:
    print(f"[Lumora AI] ERROR loading model: {e}")


def recommend_learning_path(payload: RecommendationRequest) -> RecommendationResponse:
    """
    Core AI recommendation engine.
    Uses the trained Random Forest model (student_behavior_model.joblib) to predict
    a student's performance level (Remedial/Standard/Advanced) based on their quiz score,
    completion rate, and subject. Falls back to rule-based logic only if the model fails.
    """
    prediction = None
    confidence = 0.0
    model_used = False

    if model is not None:
        try:
            # Map app subjects to dataset department names
            topic_map = {
                "Matematika": "Mathematics",
                "Sains": "Science",
                "Logika": "Computer Science",
                "Bahasa Inggris": "English",
            }
            department = topic_map.get(payload.subject, "Computer Science")

            # Map real app data to model features
            # - Quizzes_Avg: directly from the quiz score
            # - Assignments_Avg: derived from completion rate
            # - Attendance: estimate from engagement (higher completion = higher attendance)
            # - Participation_Score: infer from quiz score + completion combined
            # - Study_Hours: estimate from engagement metrics
            quiz_val = float(payload.quiz_score)
            comp_val = float(payload.completion_rate * 100)
            attendance = min(95.0, max(40.0, comp_val * 0.9 + quiz_val * 0.1))
            participation = min(100.0, max(10.0, (quiz_val * 0.6 + comp_val * 0.4)))
            study_hours = max(5.0, min(40.0, comp_val * 0.25 + quiz_val * 0.1))

            features = pd.DataFrame({
                "Department": [department],
                "Attendance (%)": [attendance],
                "Assignments_Avg": [comp_val],
                "Quizzes_Avg": [quiz_val],
                "Participation_Score": [participation],
                "Study_Hours_per_Week": [study_hours],
            })

            prediction = model.predict(features)[0]
            
            # Get prediction probabilities for confidence score
            proba = model.predict_proba(features)[0]
            confidence = float(np.max(proba))
            model_used = True

            print(f"[Lumora AI] Prediction: {prediction} (confidence: {confidence:.2%})")
            print(f"[Lumora AI]   Features: quiz={quiz_val}, comp={comp_val:.0f}, "
                  f"attendance={attendance:.0f}, participation={participation:.0f}, "
                  f"study_hrs={study_hours:.0f}")

        except Exception as e:
            print(f"[Lumora AI] Model prediction failed, falling back: {e}")
            prediction = None

    # Map prediction or fall back to rules
    if prediction is not None and model_used:
        conf_pct = f"{confidence:.0%}"
        if prediction == "Remedial":
            difficulty = "remedial"
            reason = (
                f"Model AI (Random Forest, confidence {conf_pct}) mendeteksi kebutuhan remedial. "
                f"Skor kuis {payload.quiz_score:.0f}/100 dan tingkat aktivitas Anda menunjukkan "
                f"bahwa penguatan konsep dasar masih diperlukan."
            )
            material_type = "practice"
        elif prediction == "Standard":
            difficulty = "standard"
            reason = (
                f"Model AI (Random Forest, confidence {conf_pct}) mendeteksi performa standar. "
                f"Skor kuis {payload.quiz_score:.0f}/100 menunjukkan pemahaman yang baik, "
                f"lanjutkan kurikulum secara bertahap."
            )
            material_type = "lesson"
        else:  # Advanced
            difficulty = "advanced"
            reason = (
                f"Model AI (Random Forest, confidence {conf_pct}) mendeteksi performa unggul. "
                f"Skor kuis {payload.quiz_score:.0f}/100 menunjukkan penguasaan materi yang kuat, "
                f"berikan tantangan pengayaan tambahan."
            )
            material_type = "challenge"
    else:
        # Fallback rule-based logic (only if model is unavailable)
        confidence = 0.0
        if payload.quiz_score < 60:
            difficulty = "remedial"
            reason = "[Fallback] Skor kuis rendah, penguatan konsep dasar diperlukan."
            material_type = "practice"
        elif payload.quiz_score < 80:
            difficulty = "standard"
            reason = "[Fallback] Performa cukup, lanjutkan materi inti secara bertahap."
            material_type = "lesson"
        else:
            difficulty = "advanced"
            reason = "[Fallback] Performa tinggi, siswa siap menerima tantangan lanjutan."
            material_type = "challenge"

    topics = payload.weak_topics or [payload.subject]
    materials = [
        Material(
            title=f"{t} - {difficulty.title()} Path",
            type=material_type,
            priority=index + 1,
        )
        for index, t in enumerate(topics[:3])
    ]

    return RecommendationResponse(
        student_id=payload.student_id,
        difficulty=difficulty,
        recommended_topics=topics[:3],
        materials=materials,
        reason=reason,
    )
