from typing import Tuple
from pydantic import BaseModel
from models.equipment import Pipe


class Combo(BaseModel):
    length: float
    pipes: Tuple[Pipe, ...]
    power: float