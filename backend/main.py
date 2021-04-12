from typing import Optional
from fastapi import FastAPI, File, UploadFile,HTTPException
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
    try:
        util.send_message(dto.phone_number,dto.message)
    except(Exception) as e:
         return HTTPException(status_code=304, detail=str(e)) 
    return dto

@app.post("/text-from-image")
async def create_upload_file(uploaded_file: UploadFile = File(...)):
    text = {}
    if not uploaded_file.filename.endswith('.jpg') and not uploaded_file.filename.endswith('.png'):
        return HTTPException(status_code=304, detail='Image type invalid')
    try:
        file_location = f"tmp_files/{uploaded_file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(uploaded_file.file.read())
        text = util.text_from_image_path(path_to_file = f"tmp_files/{uploaded_file.filename}")
    except(Exception) as e:
         return HTTPException(status_code=304, detail=str(e)) 
    return text


# @app.exception_handler(StarletteHTTPException)
# async def custom_http_exception_handler(request, exc):
#     print(f"OMG! An HTTP error!: {repr(exc)}")
#     return await http_exception_handler(request, exc)

