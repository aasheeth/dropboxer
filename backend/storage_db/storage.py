from typing import List
from fastapi import UploadFile
from app.storage.interface import StorageInterface
from sqlalchemy.orm import Session
from storage_db.models import FileModel
from db import get_db
import base64

class DBStorage(StorageInterface):
    def __init__(self):
        self.db: Session = next(get_db())

    async def save_files(self, files: List[UploadFile], username: str) -> List[str]:
        saved_ids = []
        for file in files:
            content = await file.read()
            encoded = base64.b64encode(content).decode("utf-8")
            file_obj = FileModel(filename=file.filename, data=encoded)
            self.db.add(file_obj)
            self.db.commit()
            self.db.refresh(file_obj)
            saved_ids.append(str(file_obj.id))
        return saved_ids
