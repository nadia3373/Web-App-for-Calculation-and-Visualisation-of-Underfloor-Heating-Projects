from bson.objectid import ObjectId
import sys

sys.path.append('app/db')
sys.path.append('app/models')

from app.db.database import get_database
from app.models.mountingbox import MountingBox
from app.models.pipe import Pipe
from app.models.thermocontroller import ThermoController

db = get_database()

mounting_box = MountingBox(_id=ObjectId(), model="ЖК-159", price=580)

pipes = [Pipe(_id=ObjectId(), length=8.5, model="ТТ-1/2", oc=1.5, power=340, price=4620),
         Pipe(_id=ObjectId(), length=10.5, model="ТТ-2/3", oc=1.9, power=420, price=6006),
         Pipe(_id=ObjectId(), length=14, model="ТТ-01", oc=2.5, power=560, price=8707),
         Pipe(_id=ObjectId(), length=17, model="ТТ-17", oc=2.8, power=680, price=9009),
         Pipe(_id=ObjectId(), length=21, model="ТТ-02", oc=3.8, power=840, price=13117),
         Pipe(_id=ObjectId(), length=28, model="ТТ-03", oc=5.0, power=1120, price=17420),
         Pipe(_id=ObjectId(), length=35, model="ТТ-04", oc=6.3, power=1400, price=21674),
         Pipe(_id=ObjectId(), length=42, model="ТТ-05", oc=7.6, power=1680, price=26129),
         Pipe(_id=ObjectId(), length=49, model="ТТ-49", oc=9.0, power=1960, price=29750),
         Pipe(_id=ObjectId(), length=56, model="ТТ-06", oc=10.0, power=2240, price=33896),
         Pipe(_id=ObjectId(), length=63, model="ТТ-63", oc=11.0, power=2520, price=36420),
         Pipe(_id=ObjectId(), length=70, model="ТТ-07", oc=12.7, power=2800, price=40042),
         Pipe(_id=ObjectId(), length=84, model="ТТ-08", oc=15.2, power=3360, price=44665)]

thermocontrollers = [ThermoController(_id=ObjectId(), model="РТС-1", price=1800),
                     ThermoController(_id=ObjectId(), model="РТС-2", price=3550),
                     ThermoController(_id=ObjectId(), model="РТС-3", price=3900)]

db.equipment.insert_many([mounting_box.dict()] + [pipe.dict() for pipe in pipes] + [tc.dict() for tc in thermocontrollers])


# Retrieve the inserted mounting box
mounting_box = db.equipment.find_one({"model": "ЖК-159"})

# Retrieve all inserted pipes
pipes = list(db.equipment.find({"model": {"$in": ["ТТ-1/2", "ТТ-2/3", "ТТ-01", "ТТ-17", "ТТ-02", "ТТ-03", "ТТ-04", "ТТ-05", "ТТ-49", "ТТ-06", "ТТ-63", "ТТ-07", "ТТ-08"]}}))

# Retrieve all inserted thermocontrollers
thermocontrollers = list(db.equipment.find({"model": {"$in": ["РТС-1", "РТС-2", "РТС-3"]}}))

# Print the retrieved data
print(mounting_box)
print(pipes)
print(thermocontrollers)