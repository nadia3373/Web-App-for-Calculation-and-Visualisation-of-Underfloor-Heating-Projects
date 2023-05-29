from pydantic import BaseModel


class Point(BaseModel):
    x: float
    y: float
    yPx: float
    xPx: float