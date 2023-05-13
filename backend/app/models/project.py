from typing import Dict, List
from bson import ObjectId
from pydantic import BaseModel


class Project(BaseModel):
    _id: ObjectId = ObjectId()
    created: str
    mb: List[Dict[ObjectId, int]] = []
    pipes: List[Dict[ObjectId, int]] = []
    room: ObjectId
    tc: List[Dict[ObjectId, int]] = []