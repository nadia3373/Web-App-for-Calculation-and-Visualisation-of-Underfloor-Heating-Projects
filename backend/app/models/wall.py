from typing import List
from pydantic import BaseModel
from models.point import Point


class Wall(BaseModel):
    angle: float
    length: float
    points: List[Point]
    position: str
    type: str