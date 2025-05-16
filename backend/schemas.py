from pydantic import BaseModel, EmailStr, StrictBool, StrictInt
from typing import Optional
from datetime import datetime
from .constants import Priority



class UserCreate(BaseModel):
    email: EmailStr
    password: str
    is_admin: StrictBool


class UserResponse(BaseModel):
    email: EmailStr
    created_at: datetime
    is_admin: bool

    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    title: str
    description: str
    is_complete: StrictBool
    # due_date: datetime
    priority: Optional[Priority] = None


class TaskResponse(TaskCreate):
    id: StrictInt
    due_date: datetime

    class Config:
        from_attributes = True
        use_enum_values = True
