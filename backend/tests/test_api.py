from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_create_recommendation() -> None:
    response = client.post(
        "/api/v1/recommendations",
        json={
            "student_id": "student-001",
            "subject": "Matematika",
            "quiz_score": 68,
            "completion_rate": 0.72,
            "weak_topics": ["Pecahan"],
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["difficulty"] in {
        "Fundamental Level",
        "Intermediate Level",
        "Advanced Level",
        "Fast-Track Program",
        "Visual Learning Path",
        "Microlearning Mode",
    }
    assert "pecahan" in data["recommended_tags"]
