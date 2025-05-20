from pydantic import BaseModel, EmailStr, StrictBool, StrictInt
from typing import Optional
from datetime import datetime
from .constants import Priority


class UserBase(BaseModel):
    email: EmailStr
    is_admin: StrictBool
    full_name: Optional[str | None]


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    class Config:
        from_attributes = True


class TaskCreate(BaseModel):
    title: str
    description: str
    is_complete: StrictBool
    due_date: datetime
    priority: Optional[Priority] = Priority.medium


class TaskResponse(TaskCreate):
    due_date: datetime
    user_email: str

    owner: UserResponse

    class Config:
        from_attributes = True
        use_enum_values = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None
