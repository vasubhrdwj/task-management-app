from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    TIMESTAMP,
    text,
    Enum,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship, mapped_column, Mapped
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .database import Base
from .constants import Priority


class User(Base):
    __tablename__ = "users"
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4
    )
    name = Column(String)
    email = Column(String, index=True, unique=True, nullable=False)
    password = Column(String, nullable=False)
    is_admin = Column(Boolean, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))

    # tasks = relationship("Tasks", backref="users")


class Tasks(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String)
    is_complete = Column(Boolean, server_default="False")
    due_date = Column(DateTime(timezone=True), default=text("now()"))
    priority = Column(
        Enum(
            Priority,
            name="priority_enum",  # this becomes the PG type name
            create_type=True,  # emit CREATE TYPE if it doesn’t already exist
        ),
        nullable=False,
        server_default=Priority.medium.value,
    )

    # User relationship
    # user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    # owner = relationship("User")
