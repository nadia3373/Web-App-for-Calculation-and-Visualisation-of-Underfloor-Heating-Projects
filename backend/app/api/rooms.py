from typing import List
from fastapi import APIRouter

from db.database import get_database
from models.room import Room


router = APIRouter()


@router.get("/rooms", response_model=List[Room])
async def get_rooms():
    collection = get_database().rooms
    rooms = []
    for room in collection.find():
        room_obj = Room(created=room["created"], id=str(room["_id"]), name=room["name"], walls=room["walls"])
        rooms.append(room_obj)
    return rooms

@router.post("/rooms", response_model=Room)
async def create_room(room: Room):
    print(room)
    result = get_database().rooms.insert_one(room.dict())
    room.id = str(result.inserted_id)
    print(result)
    return room