from typing import List
from pydantic import BaseModel

from models.point import Point
from models.wall import Wall


class Room(BaseModel):
    area: float
    created: str
    id: str
    image: str
    name: str
    offarea: float
    offpoints: List[Point]
    points: List[Point]
    walls: List[Wall]