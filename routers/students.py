from fastapi import APIRouter, HTTPException, status
from db.client import db_client
from models.students import Student

router = APIRouter(prefix="/students",
                   tags=["students"],
                   responses={404: {status.HTTP_404_NOT_FOUND: "not found"}})

@router.get("/", response_model=list[Student], status_code=status.HTTP_200_OK)
async def get_students():
    clients = db_client.find()