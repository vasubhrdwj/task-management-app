from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, text, Enum, DateTime
from .database import Base
from .constants import Priority


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    # name = Column(String)
    email = Column(String, index=True, unique=True, nullable=False)
    password = Column(String, nullable=False)
    is_admin = Column(Boolean, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("now()"))



class Tasks(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String)
    is_complete = Column(Boolean, server_default="False")
    due_date = Column(DateTime)
    priority = Column(
        Enum(
            Priority,
            name="priority_enum",   # this becomes the PG type name
            create_type=True        # emit CREATE TYPE if it doesn’t already exist
        ),
        nullable=False,
        server_default=Priority.medium.value
    )
