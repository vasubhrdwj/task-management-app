from fastapi import APIRouter, status, Response, HTTPException, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, utils
from backend.database import get_db


router = APIRouter(prefix="/tasks", tags=["Tasks"])


# Create
@router.post(
    "/create", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED
)
def create_task(task: schemas.Task, db: Session = Depends(get_db)):
    new_task = models.Tasks(**task.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


# Read ( Get )
@router.get(
    "/{id}", response_model=schemas.TaskResponse, status_code=status.HTTP_202_ACCEPTED
)
def get_task(id: int, db: Session = Depends(get_db)):

    task = db.query(models.Tasks).filter(models.Tasks.id == id).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"task with id:{id} not found"
        )

    return task


# Update
@router.put(
    "/update/{id}",
    response_model=schemas.TaskResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def update_task(task: schemas.Task, id: int, db: Session = Depends(get_db)):
    query_task = db.query(models.Tasks).filter(models.Tasks.id == id)
    query_task_instance = query_task.first()

    if not query_task_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"task with id:{id} not found"
        )

    query_task.update(task.model_dump(), synchronize_session=False)  # type: ignore[reportGeneralTypeIssues]
    db.commit()

    updated_task = query_task.first()

    return updated_task


# Delete
@router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(id: int, db: Session = Depends(get_db)):
    query_task = db.query(models.Tasks).filter(models.Tasks.id == id)
    query_task_instance = query_task.first()

    if not query_task_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"task with id:{id} not found"
        )

    query_task.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
