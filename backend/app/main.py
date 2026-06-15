from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as learning_router
from app.api.auth import router as auth_router
from app.api.content import router as content_router
from app.core.config import settings
from app.core.database import Base, engine
from app.models import student
from app.models import content
from app.core.init_db import seed_data
from contextlib import asynccontextmanager

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_data()
    yield

app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
