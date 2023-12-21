from fastapi import APIRouter, status, HTTPException
from db.client import db_client
from schemas.teachers import teachers_schema, teacher_schema

router = APIRouter(prefix="/teachers",
                   tags=["teachers"],
                   responses={404: {status.HTTP_404_NOT_FOUND: "not found"}})

@router.get("/v1/get-teachers", response_model=list, status_code=status.HTTP_200_OK)
async def get_teachers():
    return teachers_schema(db_client.teachers.find())
