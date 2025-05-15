from typing import Annotated, List, Optional
from fastapi import FastAPI, Query, status, Response, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import User
import models, schemas, utils
from database import get_db, engine, Base



Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return "This is currently running at port 8000"


@app.post("/users/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = utils.hash_password(user.password)
    user.password = hashed_password
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.get("/users/{id}", response_model=schemas.UserResponse, status_code=status.HTTP_202_ACCEPTED)
def get_user(id : int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'user with id:{id} not found')

    return user