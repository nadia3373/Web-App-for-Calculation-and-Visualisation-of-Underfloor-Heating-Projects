from datetime import datetime
from fastapi import APIRouter

from db.database import get_database
from models.room import Room


router = APIRouter()


@router.post("/rooms", response_model=Room)
async def create_room(room: Room):
    new_room = {
        "walls": [wall.dict() for wall in room.walls],
        "created_date": datetime.now()
    }
    print(room)
    result = get_database().rooms.insert_one(new_room)
    print(result)
    return {**new_room, "id": str(result.inserted_id)}