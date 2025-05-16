from typing import Annotated, List, Optional
from fastapi import FastAPI, Query, status, Response, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .models import User
from . import models, schemas, utils
from .database import get_db, engine, Base
from .routers import user


Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return "This is currently running at port 8000"


app.include_router(user.router)

