from typing import List
from bson import ObjectId
from fastapi import APIRouter, Query
from db.database import get_database
from models.project import Project


router = APIRouter()
db = get_database()

@router.get("/projects", response_model=List[Project])
async def get_projects(pid: str = Query(None), rid: str = Query(None)):
    projects = []
    collection = db.projects
    if pid: results = collection.find({"_id": ObjectId(pid)})
    else: results = collection.find({"room": ObjectId(rid)}) if rid else collection.find()
    if results: projects = [p for p in results]
    return projects