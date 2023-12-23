from pydantic import BaseModel

class Student(BaseModel):
    id: str | None = None
    name: str
    age: int
    grades: list[float]
    passed: bool
    
    
class Student_grades(BaseModel):
    id: str
    grades: list[float]
    
class Student_passed(BaseModel):
    id: str
    passed: bool