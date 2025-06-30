from fastapi import APIRouter, status, Response, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import EmailStr
from .. import models, schemas
from backend.database import get_db
from ..routers import oauth2
from sqlalchemy import case
from ..constants import Priority, Action
from google import genai
from datetime import date
from ..config import settings


import json

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get(
    "/",
    response_model=List[schemas.TaskResponse] | str,
    status_code=status.HTTP_202_ACCEPTED,
)
def get_tasks(
    user_mail: Optional[EmailStr] = None,
    sort_by: str | None = None,
    sort_desc: bool = False,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    if not current_user.is_admin:
        tasks = db.query(models.Tasks).filter(
            models.Tasks.user_email == current_user.email
        )
    else:
        tasks = db.query(models.Tasks).filter(models.Tasks.user_email == user_mail)

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
    "/create/",
    response_model=List[schemas.TaskResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    task: schemas.TaskCreate,
    email_ids: List[EmailStr],
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    if current_user.is_admin == False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not required permissions"
        )

    created_tasks = []

    for email_id in email_ids:
        new_task = models.Tasks(user_email=email_id, **task.model_dump())
        db.add(new_task)
        created_tasks.append(new_task)

    db.commit()

    for curr_task in created_tasks:
        db.refresh(curr_task)

        # Target User
        target_user: models.User = (
            db.query(models.User).filter(models.User.email == curr_task.user_email)
        ).one()

        # Audit log creation
        log = models.AuditLog(
            action=Action.CREATE_TASK,
            admin_user_id=current_user.id,
            task_id=curr_task.id,
        )

        log.targets.append(models.AuditLogTarget(user_id=target_user.id))

        db.add(log)

    db.commit()

    return created_tasks


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

    if (
        not current_user.is_admin
        and query_task_instance.user_email != current_user.email
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Cannot update other users task",
        )

    updated_data = task.model_dump(exclude_unset=True)

    if updated_data:
        query_task.update(updated_data, synchronize_session=False)  # type: ignore[reportGeneralTypeIssues]
        db.commit()

        if set(updated_data.keys()) != {"is_complete"}:
            log: models.AuditLog = models.AuditLog(
                action=Action.UPDATE_TASK,
                admin_user_id=current_user.id,
                task_id=query_task_instance.id,
            )

            target_user: models.User = (
                db.query(models.User)
                .filter(models.User.email == query_task_instance.user_email)
                .one()
            )

            log.targets.append(models.AuditLogTarget(user_id=target_user.id))
            db.add(log)
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

    if not current_user.is_admin and query_task_email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Cannot delete other users task",
        )

    log: models.AuditLog = models.AuditLog(
        action=Action.DELETE_TASK,
        admin_user_id=current_user.id,
        task_id=query_task_instance.id,
    )

    target_user: models.User = (
        db.query(models.User).filter(models.User.email == query_task_email).one()
    )

    log.targets.append(models.AuditLogTarget(user_id=target_user.id))
    db.add(log)

    db.flush()

    query_task.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/suggest_task/", status_code=status.HTTP_202_ACCEPTED)
def suggest_task(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user),
):
    # system_instruction = """
    # You are a task-suggestion engine. When you respond, you must output **only** a single JSON object with no markdown fences, no extra quotes, and no commentary.
    # """
    today = date.today()

    user_prompt = f"""
    Generate exactly one random development task as a JSON object with these keys:

    • title (string): a concise summary  
    • description (string): one sentence explaining what to do and why it matters  
    • deadline (string, YYYY-MM-DD): a realistic date between tomorrow and 30 days from {today}
    • priority (string): one of "low", "medium", or "high"

    Do **not** add ```json``` fences, backticks, or any surrounding quotes—output pure JSON.
    """

    # client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        # config=types.GenerateContentConfig(system_instruction=system_instruction),
        contents=user_prompt,
    )

    raw = response.text

    if raw is not None and raw.startswith('"') and raw.endswith('"'):
        raw = raw[1:-1]
    #    Now un-escape the \n, \" etc:
    if raw is not None:
        raw = raw.encode("utf-8").decode("unicode_escape")
    else:
        raise HTTPException(status_code=500, detail="No response from Gemini API")

    task_obj = json.loads(raw)

    # 2️⃣ Return the dict — FastAPI will send it as JSON
    return task_obj
