from typing import Dict, List
from pydantic import BaseModel


class Project(BaseModel):
    id: str
    created: str
    image: str
    mb: List[Dict[str, int]] = []
    pipes: List[Dict[str, int]] = []
    room: str
    tc: List[Dict[str, int]] = []