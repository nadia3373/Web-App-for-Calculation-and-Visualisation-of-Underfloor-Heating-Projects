from bson.objectid import ObjectId
import sys

sys.path.append('app/db')
sys.path.append('app/models')

from app.db.database import get_database
from app.models.equipment import MountingBox, Pipe, ThermoController

db = get_database()

mounting_box = MountingBox(id=str(ObjectId()), model="ЖК-159", price=580)

pipes = [Pipe(id=str(ObjectId()), length=8.5, model="ТТ-1/2", oc=1.5, power=340, price=4620),
         Pipe(id=str(ObjectId()), length=10.5, model="ТТ-2/3", oc=1.9, power=420, price=6006),
         Pipe(id=str(ObjectId()), length=14, model="ТТ-01", oc=2.5, power=560, price=8707),
         Pipe(id=str(ObjectId()), length=17, model="ТТ-17", oc=2.8, power=680, price=9009),
         Pipe(id=str(ObjectId()), length=21, model="ТТ-02", oc=3.8, power=840, price=13117),
         Pipe(id=str(ObjectId()), length=28, model="ТТ-03", oc=5.0, power=1120, price=17420),
         Pipe(id=str(ObjectId()), length=35, model="ТТ-04", oc=6.3, power=1400, price=21674),
         Pipe(id=str(ObjectId()), length=42, model="ТТ-05", oc=7.6, power=1680, price=26129),
         Pipe(id=str(ObjectId()), length=49, model="ТТ-49", oc=9.0, power=1960, price=29750),
         Pipe(id=str(ObjectId()), length=56, model="ТТ-06", oc=10.0, power=2240, price=33896),
         Pipe(id=str(ObjectId()), length=63, model="ТТ-63", oc=11.0, power=2520, price=36420),
         Pipe(id=str(ObjectId()), length=70, model="ТТ-07", oc=12.7, power=2800, price=40042),
         Pipe(id=str(ObjectId()), length=84, model="ТТ-08", oc=15.2, power=3360, price=44665)]

thermocontrollers = [ThermoController(id=str(ObjectId()), model="РТС-1", price=1800),
                     ThermoController(id=str(ObjectId()), model="РТС-2", price=3550),
                     ThermoController(id=str(ObjectId()), model="РТС-3", price=3900),
                     ThermoController(id=str(ObjectId()), model="РТС-4", price=4600)]

# db.equipment.insert_many([mounting_box.dict()] + [pipe.dict() for pipe in pipes] + [tc.dict() for tc in thermocontrollers])

if db.boxes.find_one({"model": "ЖК-159"}) is None:
    print("Монтажная коробка добавлена")
    db.boxes.insert_one(mounting_box.dict())

for pipe in pipes:
    if db.pipes.find_one({"model": pipe.model}) is None:
        print(f"Труба {pipe.model} добавлена")
        db.pipes.insert_one(pipe.dict())

for tc in thermocontrollers:
    if db.thermocontrollers.find_one({"model": tc.model}) is None:
        print(f"Термоконтроллер {tc.model} добавлен")
        db.thermocontrollers.insert_one(tc.dict())