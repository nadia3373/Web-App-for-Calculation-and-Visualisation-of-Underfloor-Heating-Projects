from datetime import datetime
from typing import List
from pydantic import BaseModel

from models.wall import Wall


class Room(BaseModel):
    created_date: datetime = datetime.now()
    walls: List[Wall]