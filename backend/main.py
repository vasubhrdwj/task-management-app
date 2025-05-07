from typing import Annotated, List, Optional
from fastapi import FastAPI, Query, status, Response, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import User
import models, schemas
from database import get_db, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()



@app.get("/")
def root():
    return "This is currently running at port 8000"

@app.get("/sqlalchemy_test")
def test_users(db: Session = Depends(get_db)):
    return {"status": "success"}

@app.post("/users/", response_model=schemas.UserResponse, status_code=201)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user