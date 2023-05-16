from typing import List
from pydantic import BaseModel


class MountingBox(BaseModel):
    id: str
    model: str
    price: float


class Pipe(BaseModel):
    id: str
    length: float
    model: str
    oc: float
    power: int
    price: float


class ThermoController(BaseModel):
    id: str
    model: str
    price: float


class Equipment(BaseModel):
    boxes: List[MountingBox]
    pipes: List[Pipe]
    thermocontrollers: List[ThermoController]