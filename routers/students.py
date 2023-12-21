from fastapi import APIRouter, HTTPException, status
from db.client import db_client
from models.students import Student
from schemas.students import users_schema, user_schema
from bson import ObjectId

router = APIRouter(prefix="/students",
                   tags=["students"],
                   responses={404: {status.HTTP_404_NOT_FOUND: "not found"}})

@router.get("/v1/get", response_model=list[Student], status_code=status.HTTP_200_OK)
async def get_students():
    return users_schema(db_client.students.find())

@router.post("/v1/post", response_model=Student, status_code=status.HTTP_201_CREATED)
async def post_student(student: Student):
    dict_student = student.dict()
    del dict_student["id"]
    
    id = db_client.students.insert_one(dict_student).inserted_id
    
    student = db_client.students.find_one({"_id": ObjectId(id)})
    
    return user_schema(student)

@router.patch("/v1/update_grades", response_model=Student, status_code=status.HTTP_200_OK)
async def update_grades():
    pass