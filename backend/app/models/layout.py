from pydantic import BaseModel


class Layout(BaseModel):
    pipe: float;
    w: float;
    h: float;
    t: float;
    off: float;
    d: float;
    iL: float;
    oL: float;
    cL: float;
    hC: float;
    cN: float;
    hZ: float;
    total: float;
    diff: float;