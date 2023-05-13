from typing import List
from bson import ObjectId
from pydantic import BaseModel, Field

from models.point import Point


class Room(BaseModel):
    area: float
    created: str
    _id: ObjectId = ObjectId()
    name: str
    points: List[Point]