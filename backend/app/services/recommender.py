from app.schemas.learning import Material, RecommendationRequest, RecommendationResponse


def recommend_learning_path(payload: RecommendationRequest) -> RecommendationResponse:
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
        Material(title=f"{topic} - {difficulty.title()} Path", type=material_type, priority=index + 1)
        for index, topic in enumerate(topics[:3])
    ]

    return RecommendationResponse(
        student_id=payload.student_id,
        difficulty=difficulty,
        recommended_topics=topics[:3],
        materials=materials,
        reason=reason,
    )
