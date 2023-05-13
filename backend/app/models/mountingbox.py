from bson import ObjectId
from pydantic import BaseModel


class MountingBox(BaseModel):
    _id: ObjectId = ObjectId()
    model: str
    price: float