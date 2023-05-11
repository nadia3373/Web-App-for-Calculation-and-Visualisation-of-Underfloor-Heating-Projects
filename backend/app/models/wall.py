from pydantic import BaseModel

from models.point import Point


class Wall(BaseModel):
    angle: float
    finish: Point
    length: float
    start: Point