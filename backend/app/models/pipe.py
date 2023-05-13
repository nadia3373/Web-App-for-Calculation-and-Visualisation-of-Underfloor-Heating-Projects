from bson import ObjectId
from pydantic import BaseModel


class Pipe(BaseModel):
    _id: ObjectId = ObjectId()
    length: float
    model: str
    oc: float
    power: int
    price: float