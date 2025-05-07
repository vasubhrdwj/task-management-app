from sqlalchemy import Column, Integer, String, Boolean,TIMESTAMP, text
from database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key = True, index = True)
    name = Column(String)
    email = Column(String, index = True, unique = True, nullable = False)
    password = Column(String, nullable = False)
    is_admin = Column(Boolean, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
