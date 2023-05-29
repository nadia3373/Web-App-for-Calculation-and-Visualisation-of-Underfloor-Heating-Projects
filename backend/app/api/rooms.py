from typing import List
from bson import ObjectId
from fastapi import APIRouter, Query

from db.database import get_database
from models.room import Room


router = APIRouter()
db = get_database()

@router.get("/rooms", response_model=List[Room])
async def get_rooms(r: str = Query(None)):
    collection = db.rooms
    if r: rooms = collection.find({"_id": ObjectId(r)})
    else: rooms = collection.find().sort("created", -1)
    return [room for room in rooms]

@router.post("/rooms", response_model=Room)
async def create_room(room: Room):
    collection = db.rooms
    print(room)
    result = collection.insert_one(room.dict())
    result = collection.find_one({"_id": ObjectId(result.inserted_id)})
    result["id"] = str(result["_id"])
    collection.update_one({"_id": ObjectId(result["id"])}, {"$set": result})
    return result