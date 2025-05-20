from fastapi import FastAPI

from .database import Base, engine
from .routers import user, tasks, auth
from datetime import datetime

Base.metadata.create_all(bind=engine)

app = FastAPI(swagger_ui_parameters={"persistAuthorization": True})


@app.get("/")
def root():
    return "This app is currently running at port 8000"


app.include_router(auth.router)

app.include_router(user.router)
app.include_router(tasks.router)
