from fastapi import FastAPI

from .database import Base, engine
from .routers import user, tasks

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def root():
    return "This is currently running at port 8000"


app.include_router(user.router)
app.include_router(tasks.router)
