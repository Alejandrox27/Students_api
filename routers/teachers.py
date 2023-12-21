from fastapi import APIRouter, status, HTTPException
from db.client import db_client

router = APIRouter(prefix="/teachers",
                   tags="teachers",
                   responses={404: {status.HTTP_404_NOT_FOUND: "not found"}})

@router.get("/", response_model=list, status_code=status.HTTP_200_OK)
async def get_teachers():
    pass