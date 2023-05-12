from datetime import datetime
from typing import List
from pydantic import BaseModel

from models.wall import Wall


class Room(BaseModel):
    created: str
    id: str = None
    name: str
    walls: List[Wall]