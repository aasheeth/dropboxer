from abc import ABC, abstractmethod
from typing import List
from fastapi import UploadFile

class StorageInterface(ABC):
    @abstractmethod
    async def save_files(self, files: List[UploadFile], username: str) -> List[str]:
        """Save uploaded files and return their storage identifiers"""
        pass
