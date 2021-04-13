from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from utils.aws_connector import AWSConnector
from utils.mysql_connector import MySQLConnector


app = FastAPI()
aws_connector = AWSConnector()
mysql_connector = MySQLConnector()
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
        aws_connector.send_message(dto.phone_number, dto.message)
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
        text = aws_connector.text_from_image_path(path_to_file = f"tmp_files/{uploaded_file.filename}")
    except(Exception) as e:
         return HTTPException(status_code=304, detail=str(e)) 
    return text

@app.get("/get-order")
def get_all_order():
    try:
        message = mysql_connector.get_order()
        if(not message[0]):
            response = JSONResponse(content=jsonable_encoder({'success':message[0], 'status':message[1]}), status_code=200)
        else:
            response = JSONResponse(content=jsonable_encoder({'success':message[0], 'status':message[1], 'data':message[2], 'columns':message[3]}), status_code=200)
    except(Exception) as e:
         return HTTPException(status_code=304, detail=str(e)) 
    return response

# @app.exception_handler(StarletteHTTPException)
# async def custom_http_exception_handler(request, exc):
#     print(f"OMG! An HTTP error!: {repr(exc)}")
#     return await http_exception_handler(request, exc)

