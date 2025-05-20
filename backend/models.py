from sqlalchemy import (
    String,
    Boolean,
    TIMESTAMP,
    text,
    Enum,
    DateTime,
    ForeignKey,
)
from pydantic import EmailStr
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .database import Base
from .constants import Priority
from datetime import datetime


class User(Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4
    )
    full_name: Mapped[str] = mapped_column(String(50))
    email: Mapped[EmailStr] = mapped_column(
        String, index=True, unique=True, nullable=False
    )
    password: Mapped[str] = mapped_column(String, nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()")
    )

    task = relationship("Tasks", back_populates="owner")


class Tasks(Base):
    __tablename__ = "tasks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String, nullable=False, index=True)
    description: Mapped[str] = mapped_column(String(255))
    is_complete: Mapped[bool] = mapped_column(Boolean, server_default="False")
    due_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )
    priority: Mapped[Enum] = mapped_column(
        Enum(
            Priority,
            name="priority_enum",  # this becomes the PG type name
            create_type=True,  # emit CREATE TYPE if it doesn’t already exist
        ),
        nullable=False,
        server_default=Priority.medium.value,
    )

    # User relationship
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE")
    )
    owner = relationship("User", back_populates="task")
