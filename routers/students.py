from fastapi import APIRouter, HTTPException, status
from db.client import db_client
from models.students import Student, Student_grades
from schemas.students import users_schema, user_schema
from bson import ObjectId
from pymongo import ReturnDocument

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

@router.patch("/v1/update_grades", status_code=status.HTTP_200_OK)
async def update_grades(student: Student_grades):
    student_dict = student.dict(exclude_unset=True)
    del student_dict["id"]
    
    return user_schema((db_client.students.find_one_and_update({"_id": ObjectId(student.dict(exclude_unset=True)["id"])}, 
                                            {"$set": student_dict},
                                            return_document=ReturnDocument.AFTER)))