from pydantic import BaseModel

class Teacher(BaseModel):
    id: str | None = None
    name: str
    age: int
    subject: str