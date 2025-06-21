from pydantic import BaseModel, EmailStr, StrictBool, field_validator
from typing import Optional, Any, List
from datetime import datetime, date
from .constants import Priority, Action
from uuid import UUID


class UserBase(BaseModel):
    email: EmailStr
    is_admin: StrictBool
    full_name: str
    gender: str
    dob: date


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: UUID

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


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None


class TaskSummary(BaseModel):
    id: int
    title: str


class UserSummary(BaseModel):
    id: UUID
    email: EmailStr


class AuditLogResponse(BaseModel):
    id: UUID
    created_at: datetime
    action: Action
    admin_user_id: UUID
    task: Optional[TaskSummary]
    targets: List[UserSummary]

    class Config:
        from_attributes = True
