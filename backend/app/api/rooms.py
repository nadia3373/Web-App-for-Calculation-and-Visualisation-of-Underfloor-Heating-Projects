from typing import List
from bson import ObjectId
from fastapi import APIRouter

from db.database import get_database
from models.room import Room


router = APIRouter()

@router.get("/rooms", response_model=List[Room])
async def get_rooms():
    collection = get_database().rooms
    rooms = collection.find().sort("created", -1)
    return [room for room in rooms]

@router.post("/rooms", response_model=Room)
async def create_room(room: Room):
    result = get_database().rooms.insert_one(room.dict())
    collection = get_database().rooms
    result = collection.find_one({"_id": ObjectId(result.inserted_id)})
    result["id"] = str(result["_id"])
    collection.update_one({"_id": ObjectId(result["id"])}, {"$set": result})
    return result