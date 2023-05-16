from typing import List
from pydantic import BaseModel

from models.point import Point


class Room(BaseModel):
    area: float
    created: str
    id: str
    name: str
    points: List[Point]