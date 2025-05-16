from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, models, utils
from ..database import get_db


router = APIRouter(tags=["Authentication"])


@router.post("/login")
def login(user_cred: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_cred.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials"
        )

    if not utils.verify(user_cred.password, user.password):  # type: ignore[reportGeneralTypeIssues]
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials"
        )

    return "success"
