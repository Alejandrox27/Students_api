from pydantic import BaseModel

class Student(BaseModel):
    id: str | None = None
    name: str
    age: int
    grades: str