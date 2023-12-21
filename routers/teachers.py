from fastapi import APIRouter, status, HTTPException
from db.client import db_client
from schemas.teachers import teachers_schema, teacher_schema
from models.teacher import Teacher

router = APIRouter(prefix="/teachers",
                   tags=["teachers"],
                   responses={404: {status.HTTP_404_NOT_FOUND: "not found"}})

@router.get("/v1/get-teachers", response_model=list, status_code=status.HTTP_200_OK)
async def get_teachers():
    return teachers_schema(db_client.teachers.find())

@router.post("/v1/post-teacher", response_model=Teacher, status_code=status.HTTP_201_CREATED)
async def post_teacher(teacher: Teacher):
    teacher_dict = teacher.dict()
    del teacher_dict["id"]
    
    id = db_client.teachers.insert_one(teacher_dict).inserted_id
    
    return teacher_schema(db_client.teachers.find_one({"_id": id}))