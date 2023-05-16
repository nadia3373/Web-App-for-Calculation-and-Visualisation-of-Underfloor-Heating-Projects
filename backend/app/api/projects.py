from typing import List
from bson import ObjectId
from fastapi import APIRouter, Query
from db.database import get_database
from models.project import Project


router = APIRouter()
db = get_database()

@router.get("/projects", response_model=List[Project])
async def get_projects(r: str = Query(None)):
    projects = []
    collection = db.projects
    if r:
        result = collection.find_one({"_id": ObjectId(r)})
        projects.append(Project(result))
    else:
        result = collection.find()
        projects = [p for p in result]
    return projects