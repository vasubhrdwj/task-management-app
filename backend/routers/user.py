from fastapi import APIRouter, status, Response, HTTPException, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, utils
from backend.database import get_db
from . import oauth2
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])


@router.post(
    "/create", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED
)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

    check_existing_user = (
        db.query(models.User).filter(models.User.email == user.email).first()
    )

    if check_existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="User Already Exists"
        )

    hashed_password = utils.hash_password(user.password)
    user.password = hashed_password

    new_user = models.User(**user.model_dump())

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get("/me", response_model=schemas.UserResponse, status_code=status.HTTP_200_OK)
def read_users_me(current_user: models.User = Depends(oauth2.get_current_user)):
    return current_user


@router.get(
    "/{email}",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def get_user(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"user with email:{email} not found",
        )

    return user


@router.get(
    "/",
    response_model=List[schemas.UserResponse],
    status_code=status.HTTP_200_OK,
)
def get_all_users(db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.is_admin == False).all()

    return user
