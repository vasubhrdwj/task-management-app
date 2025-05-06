from typing import Annotated, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import uvicorn
from fastapi import FastAPI, Query, status, Response, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import Post
import models, schemas
from database import get_db, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()



@app.get("/")
def root():
    return "This is currently running at port 8000"

@app.get("/sqlalchemy_test")
def test_posts(db: Session = Depends(get_db)):
    return {"status": "success"}

@app.post("/posts/", response_model=schemas.PostResponse)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
    new_post = models.Post(**post.model_dump())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post



@app.get("/posts/{id}", response_model=schemas.PostResponse)
def get_post(id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post