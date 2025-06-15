from fastapi import APIRouter, status, Response, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import EmailStr
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
    sort_desc: bool = False,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    tasks = db.query(models.Tasks).filter(models.Tasks.user_email == current_user.email)
    if not sort_by:
        tasks = tasks.order_by(models.Tasks.id).all()

    elif sort_by == "priority":
        priority_order = case(
            (models.Tasks.priority == Priority.high.value, 1),
            (models.Tasks.priority == Priority.medium.value, 2),
            (models.Tasks.priority == Priority.low.value, 3),
        )

        if sort_desc == False:
            tasks = tasks.order_by(priority_order).all()
        else:
            tasks = tasks.order_by(priority_order.desc()).all()

    elif sort_by == "due_date":
        if sort_desc == False:
            tasks = tasks.order_by(models.Tasks.deadline).all()
        else:
            tasks = tasks.order_by(models.Tasks.deadline.desc()).all()

    elif sort_by == "status":
        if sort_desc == False:
            tasks = tasks.order_by(models.Tasks.is_complete).all()
        else:
            tasks = tasks.order_by(models.Tasks.is_complete.desc()).all()

    else:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail=f"Not a valid value"
        )

    return tasks


# Create
@router.post(
    "/create/{email_id}",
    response_model=schemas.TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    task: schemas.TaskCreate,
    email_id: EmailStr,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    if current_user.is_admin == False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not required permissions"
        )

    new_task = models.Tasks(user_email=email_id, **task.model_dump())

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
@router.patch(
    "/update/{id}",
    response_model=schemas.TaskResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def update_task(
    task: schemas.TaskUpdate,
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

    if query_task_instance.user_email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Cannot update other users task",
        )

    updated_data = task.model_dump(exclude_unset=True)

    if updated_data:
        query_task.update(updated_data, synchronize_session=False)  # type: ignore[reportGeneralTypeIssues]
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
