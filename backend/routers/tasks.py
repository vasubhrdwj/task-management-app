from fastapi import APIRouter, status, Response, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas, utils
from backend.database import get_db
from ..routers import oauth2
from sqlalchemy import case
from ..constants import Priority

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get(
    "/",
    response_model=List[schemas.TaskListResponse] | str,
    status_code=status.HTTP_202_ACCEPTED,
)
def get_tasks(
    sort_by: str | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    tasks = db.query(models.Tasks).filter(models.Tasks.user_email == current_user.email)
    if not sort_by:
        return tasks

    if sort_by == "priority":
        priority_order = case(
            (models.Tasks.priority == Priority.high.value, 1),
            (models.Tasks.priority == Priority.medium.value, 2),
            (models.Tasks.priority == Priority.low.value, 3),
        )
        tasks = tasks.order_by(priority_order).all()

    return tasks


# Create
@router.post(
    "/create", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED
)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    new_task = models.Tasks(user_email=current_user.email, **task.model_dump())

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


# Read ( Get )
@router.get(
    "/{id}", response_model=schemas.TaskResponse, status_code=status.HTTP_202_ACCEPTED
)
def get_task(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):

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
def update_task(
    task: schemas.TaskCreate,
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    query_task = db.query(models.Tasks).filter(models.Tasks.id == id)
    query_task_instance = query_task.first()

    if not query_task_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"task with id:{id} not found"
        )

    query_task_email = query_task_instance.user_email

    if query_task_email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Cannot update other users task",
        )

    query_task.update(task.model_dump(), synchronize_session=False)  # type: ignore[reportGeneralTypeIssues]
    db.commit()

    updated_task = query_task.first()

    return updated_task


# Delete
@router.delete(
    "/delete/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_task(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    query_task = db.query(models.Tasks).filter(models.Tasks.id == id)
    query_task_instance = query_task.first()

    if not query_task_instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"task with id:{id} not found"
        )

    query_task_email = query_task_instance.user_email

    if query_task_email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Cannot delete other users task",
        )

    query_task.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
