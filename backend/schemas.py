from pydantic import BaseModel, EmailStr, StrictBool
from datetime import datetime

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