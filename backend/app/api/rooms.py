from typing import List
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
    print(room)
    result = get_database().rooms.insert_one(room.dict())
    print(result)
    return room