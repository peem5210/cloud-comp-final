from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from utils.util import Util
app = FastAPI()
util = Util()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"Hello": "World"}

class SmsDto(BaseModel):
    phone_number: str
    message: str

@app.post("/send-sms")
def send_sms_to_phone(dto: SmsDto):
    util.send_message("+66916988521","hello")
    return dto

@app.post("/text-from-image")
def upload_from():
    util.text_from_image_path()
    return "OK"


