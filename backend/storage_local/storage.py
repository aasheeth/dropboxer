import os
from fastapi import UploadFile
from typing import List
from app.storage.interface import StorageInterface

UPLOAD_FOLDER = "uploaded_files"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class LocalStorage(StorageInterface):
    async def save_files(self, files: List[UploadFile], username: str) -> List[str]:
        saved_paths = []
        for file in files:
            filename = f"{username}_{file.filename}"
            path = os.path.join(UPLOAD_FOLDER, filename)
            with open(path, "wb") as f:
                content = await file.read()
                f.write(content)
            saved_paths.append(path)
        return saved_paths

