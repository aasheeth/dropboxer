from sqlalchemy import Column, Integer, String
from db import Base

class FileModel(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    data = Column(String, nullable=False)  # base64 string
