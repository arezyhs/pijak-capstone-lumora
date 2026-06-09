from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as learning_router
from app.api.auth import router as auth_router
from app.api.content import router as content_router
from app.core.config import settings
from app.core.database import Base, engine
from app.models import student

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "lumora-api"}


app.include_router(auth_router, prefix=f"{settings.api_prefix}/auth", tags=["auth"])
app.include_router(learning_router, prefix=settings.api_prefix, tags=["learning"])
app.include_router(content_router, prefix=settings.api_prefix, tags=["content"])
