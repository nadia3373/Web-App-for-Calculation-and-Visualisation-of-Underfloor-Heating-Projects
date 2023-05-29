from typing import Dict, List
from pydantic import BaseModel
from models.layout import Layout
from models.combos import Combo


class Project(BaseModel):
    id: str
    combos: List[Combo]
    created: str
    image: str
    mb: List[Dict[str, int]] = []
    layout: Layout
    pipes: List[Dict[str, int]] = []
    room: str
    tc: List[Dict[str, int]] = []
    total: float