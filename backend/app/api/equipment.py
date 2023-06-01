from itertools import combinations
from typing import List
from bson import ObjectId
from fastapi import APIRouter, Query
from db.database import get_database
from models.combos import Combo
from models.equipment import Equipment, MountingBox, Pipe, ThermoController
from models.room import Room


router = APIRouter()
db = get_database()

@router.get("/boxes", response_model=List[MountingBox])
async def get_boxes():
    collection = db.boxes
    boxes = collection.find()
    return [b for b in boxes]

@router.get("/equipment", response_model=Equipment)
async def get_equipment():
    collection = db.boxes
    boxes = collection.find()
    collection = db.pipes
    pipes = collection.find()
    collection = db.thermocontrollers
    thermocontrollers = collection.find()
    return Equipment(boxes=[b for b in boxes], pipes=[p for p in pipes], thermocontrollers=[t for t in thermocontrollers])

@router.get("/pipecombos", response_model=List[Combo])
async def get_combos(r: str = Query(None)):
    combos = []
    if r:
        collection = db.rooms
        room = collection.find_one({"_id": ObjectId(r)})
        if room:
            room = Room(**room)
            area = room.offarea
            collection = db.pipes
            pipes = collection.find()
            pipes = [Pipe(**p) for p in pipes]
            for i in range(1, 3):
                for c in combinations(pipes, i):
                    length = sum(pipe.length for pipe in c)
                    power = sum(pipe.power for pipe in c) / area
                    if 100 <= power < 200: combos.append(Combo(length=length, pipes=c, power=round(power)))
            combos = sorted(combos, key=lambda x: sum(pipe.price for pipe in x.pipes))
    return combos

@router.get("/thermocontrollers", response_model=List[ThermoController])
async def get_thermocontrollers():
    collection = db.thermocontrollers
    thermocontrollers = collection.find()
    return [t for t in thermocontrollers]