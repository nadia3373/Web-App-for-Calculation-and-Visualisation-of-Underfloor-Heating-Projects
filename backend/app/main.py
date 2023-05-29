from json import JSONEncoder
from bson import ObjectId
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.equipment import router as equipment_router
from api.projects import router as projects_router
from api.rooms import router as rooms_router

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

app = FastAPI()
app.json_encoder = CustomJSONEncoder

origins = [
    "http://127.0.0.1",
    "http://localhost",
    # "http://127.0.0.1:80",
    # "http://localhost:80",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(equipment_router)
app.include_router(projects_router)
app.include_router(rooms_router)

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/greet/{name}")
def say_hello(name: str):
    return f"Hello {name}"