from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from .. import schemas, models, utils
from ..database import get_db
from . import oauth2


router = APIRouter(tags=["Authentication"])


@router.post("/login")
# def login(user_cred: schemas.UserLogin, db: Session = Depends(get_db)):
def login(user_cred: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.email == user_cred.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials"
        )

    if not utils.verify(user_cred.password, user.password):  # type: ignore[reportGeneralTypeIssues]
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials"
        )
    access_token = oauth2.create_access_token(data={"user_id": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}
