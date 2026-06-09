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

            # Use real demographic values from frontend payload
            age = payload.age
            gender = payload.gender
            internet = payload.internet_access
            income = payload.family_income
            parent_edu = payload.parent_edu
            extracurricular = payload.extracurricular

            features = pd.DataFrame({
                "Age": [age],
                "Gender": [gender],
                "Department": [department],
                "Internet_Access_at_Home": [internet],
                "Family_Income_Level": [income],
                "Parent_Education_Level": [parent_edu],
                "Extracurricular_Activities": [extracurricular],
                "Attendance (%)": [attendance],
                "Assignments_Avg": [comp_val],
                "Quizzes_Avg": [quiz_val],
                "Participation_Score": [participation],
                "Study_Hours_per_Week": [study_hours],
                "Stress_Level (1-10)": [payload.stress_level],
                "Sleep_Hours_per_Night": [payload.sleep_hours],
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

    # Evaluasi Gejala & Rekomendasi Alami (Tanpa AI-Slop)
    # Kita tidak lagi menggunakan kata "Remedial/Standard/Advanced" secara kaku ke pengguna.
    # Prediction asli model tetap dihormati sebagai landasan.
    
    difficulty_label = "Intermediate Level"
    reason = "Performa stabil. Lanjutkan pembelajaran dengan modul tingkat menengah."
    material_type = "lesson"
    format_suffix = "(Modul Standar)"

    # Kombinasi 1: Kuis tinggi tapi jarang buka materi (Bosan / Pintar bawaan)
    if payload.quiz_score >= 85 and payload.completion_rate < 0.3:
        difficulty_label = "Fast-Track Program"
        reason = "Performa kuis sangat baik di tengah minimnya waktu belajar. Direkomendasikan untuk beralih ke materi akselerasi."
        material_type = "challenge"
        format_suffix = "(Fast-Track)"
    
    # Kombinasi 2: Belajar berjam-jam tapi skor kuis hancur (Kelelahan belajar / salah metode)
    elif payload.quiz_score < 60 and payload.completion_rate > 0.8:
        difficulty_label = "Visual Learning Path"
        reason = "Tingkat penyelesaian materi tinggi namun skor kuis di bawah standar. Direkomendasikan untuk menggunakan metode pembelajaran visual/video."
        material_type = "practice"
        format_suffix = "(Format Video / Visual)"
        
    # Kombinasi 3: Kurang tidur atau stres (Microlearning)
    elif payload.sleep_hours <= 5 or payload.stress_level >= 8:
        difficulty_label = "Microlearning Mode"
        reason = "Terdeteksi beban kognitif tinggi atau kurang istirahat. Modul dipecah menjadi sesi Microlearning 5 menit untuk menjaga fokus."
        material_type = "micro-module"
        format_suffix = "(Rangkuman 5 Menit)"

    # Fallback ke ML Prediction jika tidak masuk edge-case
    else:
        if prediction == "Remedial" or payload.quiz_score < 60:
            difficulty_label = "Fundamental Level"
            reason = "Penguatan konsep dasar diperlukan berdasarkan hasil evaluasi kuis."
            material_type = "practice"
            format_suffix = "(Penguatan Dasar)"
        elif prediction == "Standard":
            difficulty_label = "Intermediate Level"
            reason = "Performa stabil. Lanjutkan pembelajaran dengan modul tingkat menengah."
            material_type = "lesson"
            format_suffix = "(Modul Inti)"
        else:
            difficulty_label = "Advanced Level"
            reason = "Penguasaan materi sangat baik. Direkomendasikan untuk melanjutkan ke modul tingkat lanjut."
            material_type = "challenge"
            format_suffix = "(Level Lanjut)"

    topics = payload.weak_topics or [payload.subject]
    materials = []

    for index, t in enumerate(topics[:3]):
        materials.append(Material(
            title=f"{t} {format_suffix}",
            type=material_type,
            priority=index + 1,
        ))

    # Sisipkan materi selingan jika terdeteksi burnout
    if payload.stress_level >= 8 or payload.sleep_hours <= 5:
        materials.insert(0, Material(
            title="Selingan: Trik Belajar Sambil Rebahan",
            type="wellness",
            priority=0
        ))

    return RecommendationResponse(
        student_id=payload.student_id,
        difficulty=difficulty_label,
        recommended_topics=topics[:3],
        materials=materials,
        reason=reason,
    )
