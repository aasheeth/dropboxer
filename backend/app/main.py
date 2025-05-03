from fastapi import FastAPI, UploadFile, File, Depends
from typing import List
from app.auth.utils import get_current_user
from app.storage import get_storage_provider
import os
from dotenv import load_dotenv
from app.auth import routes as auth_routes
from db import create_tables

load_dotenv()
storage = get_storage_provider("local")

app = FastAPI()

# Add CORS middleware
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
create_tables()

@app.post("/upload")
async def upload(
    files: List[UploadFile] = File(...),
    username: str = Depends(get_current_user)
):
    result = await storage.save_files(files, username)
    return {"saved": result}
