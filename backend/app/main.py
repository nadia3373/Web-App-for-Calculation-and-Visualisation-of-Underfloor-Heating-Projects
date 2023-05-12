from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.rooms import router as rooms_router

app = FastAPI()

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

app.include_router(rooms_router)

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/greet/{name}")
def say_hello(name: str):
    return f"Hello {name}"