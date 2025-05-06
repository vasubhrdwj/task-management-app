from sqlalchemy import Column, Integer, String, Boolean,TIMESTAMP, text
from database import Base

class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key = True, index = True)
    title = Column(String, index = True, nullable = False)
    content = Column(String, nullable = False)
    published = Column(Boolean, server_default='true')
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
