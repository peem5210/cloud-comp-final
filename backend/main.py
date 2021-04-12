from typing import Optional
from fastapi import FastAPI, File, UploadFile
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
async def create_upload_file(uploaded_file: UploadFile = File(...)):
    if not uploaded_file.filename.endswith('.jpg') and not uploaded_file.filename.endswith('.png'):
        return "Image not valid"
    file_location = f"tmp_files/{uploaded_file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(uploaded_file.file.read())
    util.text_from_image_path(path_to_file = f"tmp_files/{uploaded_file.filename}")
    return {"info": f"file '{uploaded_file.filename}' saved at '{file_location}'"}


@app.post("/files/")
async def create_file(file: bytes = File(...)):
    return {"file_size": len(file)}

