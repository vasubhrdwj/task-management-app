from fastapi import APIRouter, status, Response, HTTPException, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, utils
from backend.database import get_db

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


@router.get(
    "/{id}", response_model=schemas.UserResponse, status_code=status.HTTP_202_ACCEPTED
)
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"user with id:{id} not found"
        )

    return user
