from bson import ObjectId
from pydantic import BaseModel


class ThermoController(BaseModel):
    _id: ObjectId = ObjectId()
    model: str
    price: float