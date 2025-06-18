from sqlalchemy import (
    String,
    Boolean,
    TIMESTAMP,
    text,
    Enum,
    DateTime,
    ForeignKey,
    Date,
)
from pydantic import EmailStr
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .database import Base
from .constants import Priority
from datetime import datetime, date


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
    gender: Mapped[str] = mapped_column(String, nullable=False)
    dob: Mapped[date] = mapped_column(Date, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()")
    )

    task = relationship("Tasks", back_populates="owner")


class Tasks(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False, index=True)
    description: Mapped[str] = mapped_column(String(255))
    is_complete: Mapped[bool] = mapped_column(Boolean, server_default="False")
    deadline: Mapped[date] = mapped_column(
        Date, server_default=text("CURRENT_DATE + INTERVAL '10 days'")
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

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()")
    )

    # User relationship
    user_email: Mapped[str] = mapped_column(
        String, ForeignKey("users.email", ondelete="CASCADE")
    )
    owner = relationship("User", back_populates="task")
