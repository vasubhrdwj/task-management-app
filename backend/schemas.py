from pydantic import BaseModel, EmailStr, StrictBool, field_validator
from typing import Optional, Any
from datetime import datetime, date
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
    deadline: date
    priority: Optional[Priority] = Priority.medium

    @field_validator("priority", mode="before")
    @classmethod
    def lower_case(cls, value: Any) -> Any:
        if isinstance(value, str):
            return value.lower()

        return value


class TaskResponse(TaskCreate):
    id: int
    user_email: str
    is_complete: StrictBool

    class Config:
        from_attributes = True
        use_enum_values = True


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[date] = None
    priority: Optional[Priority] = None
    is_complete: Optional[StrictBool] = None

    @field_validator("priority", mode="before")
    @classmethod
    def lower_case(cls, value: Any) -> Any:
        if isinstance(value, str):
            return value.lower()

        return value


class TaskListResponse(TaskResponse):
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None
