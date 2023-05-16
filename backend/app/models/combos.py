from typing import Tuple
from pydantic import BaseModel
from models.equipment import Pipe


class Combo(BaseModel):
    pipes: Tuple[Pipe, ...]
    power: float