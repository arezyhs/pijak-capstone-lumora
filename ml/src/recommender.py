from dataclasses import dataclass


@dataclass
class StudentPerformance:
    quiz_score: float
    completion_rate: float
    weak_topics: list[str]


def recommend(performance: StudentPerformance) -> dict[str, object]:
    if performance.quiz_score < 70:
        difficulty = "remedial"
    elif performance.completion_rate < 0.8:
        difficulty = "standard"
    else:
        difficulty = "advanced"

    return {
        "difficulty": difficulty,
        "recommended_topics": performance.weak_topics[:3],
    }
