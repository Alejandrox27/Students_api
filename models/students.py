from pydantic import BaseModel

class Student(BaseModel):
    id: str | None = None
    name: str
    age: int
    grades: list[int]
    
    
class Student_grades(BaseModel):
    id: str
    grades: list[int]