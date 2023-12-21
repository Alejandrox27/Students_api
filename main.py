from fastapi import FastAPI, APIRouter, status
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="main",
              description="API students",
              version="1.0",
              prefix="/basic",
              tags=["basic"],
              responses={200: {status.HTTP_200_OK: "Ok"}})

origins = ["*"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    return {"status": status.HTTP_200_OK,
            "msg": "ok"}
