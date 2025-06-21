from fastapi import APIRouter, status, Response, HTTPException, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, utils
from backend.database import get_db
from . import oauth2
from typing import List

router = APIRouter(prefix="/logs", tags=["Logs"])


@router.get("/", response_model=List[schemas.AuditLogResponse])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access only")

    logs = db.query(models.AuditLog).order_by(models.AuditLog.created_at.desc()).all()
    return logs
