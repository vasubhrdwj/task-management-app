from fastapi import APIRouter, status, Response, HTTPException, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, utils
from backend.database import get_db
from . import oauth2
from typing import List

router = APIRouter(prefix="/logs", tags=["Logs"])

@router.get("/", response_model=List[schemas.AuditLogResponse])