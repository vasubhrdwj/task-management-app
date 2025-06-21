from fastapi import FastAPI

from .database import Base, engine
from .routers import user, tasks, auth, logs
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# If not using alembic,(for dev purposes)
# Base.metadata.create_all(bind=engine)

# app = FastAPI(swagger_ui_parameters={"persistAuthorization": True})
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost",
    "https://localhost:8080",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return "This app is currently running at port 8000"


app.include_router(auth.router)
app.include_router(user.router)
app.include_router(tasks.router)
app.include_router(logs.router)
