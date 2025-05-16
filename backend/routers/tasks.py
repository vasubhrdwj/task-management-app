from fastapi import APIRouter, status, Response, HTTPException, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, utils
from backend.database import get_db


router = APIRouter(prefix="/tasks", tags=["Tasks"])


# Create
@router.post("/create", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db : Session = Depends(get_db)):
    new_task = models.Tasks(**task.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

# Read ( Get )

@router.get("/{id}", response_model=schemas.TaskResponse, status_code=status.HTTP_202_ACCEPTED)
def get_task(id: int, db : Session = Depends(get_db)):

    task = db.query(models.Tasks).filter(models.Tasks.id == id).first()

    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'task with id:{id} not found')
    
    return task


# Update

# Delete