import os

from dotenv import load_dotenv
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi import Response,status,Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi_auth0 import Auth0, Auth0User
from pydantic import BaseModel

from service.util.aws_connector import AWSConnector
from service.util.mysql_connector import MySQLConnector
from service.company_service import CompanyService, CreateCompanyDto
from service.aws_service import AwsService
load_dotenv()

app = FastAPI()

aws_connector = AWSConnector()
mysql_connector = MySQLConnector()

aws_service = AwsService(aws_connector)
company_service = CompanyService(aws_service,mysql_connector)

auth = Auth0(domain=os.getenv('AUTH0_DOMAIN'), api_audience=os.getenv('AUTH0_AUDIENCE'), scopes={'read:test':''})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/test", status_code=200, dependencies=[Depends(auth.implicit_scheme)])
def test(response: Response, user: Auth0User = Security(auth.get_user)):
    return user

class SmsDto(BaseModel):
    phone_number: str
    message: str

@app.post("/send-sms")
def send_sms_to_phone(dto: SmsDto,response: Response, user: Auth0User = Security(auth.get_user)):
    aws_service.send_message(dto.phone_number, dto.message)
    return dto

@app.post("/text-from-image")
async def create_upload_file(response: Response,uploaded_file: UploadFile = File(...), user: Auth0User = Security(auth.get_user)):
    text = {}
    if not uploaded_file.filename.endswith('.jpg') and not uploaded_file.filename.endswith('.png'):
        response.status_code=409
        return "Image type invalid"
    file_location = f"tmp_files/{uploaded_file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(uploaded_file.file.read())
    text = aws_service.text_from_image_path(path_to_file = f"tmp_files/{uploaded_file.filename}")
    return text

@app.post("/company")
def create_company(dto:CreateCompanyDto,response: Response, user: Auth0User = Security(auth.get_user)):
    try:
        return company_service.insert_company(dto, user)
    except Exception as e:
        response.status_code=409
        return str(e)

@app.get("/company")
def get_company(response: Response, user: Auth0User = Security(auth.get_user)):
    try:
        return company_service.get_company_from_user(user)
    except Exception as e:
        response.status_code=409
        return str(e)

@app.get("/order/{status}")
def order_by_status(status, response: Response, user: Auth0User = Security(auth.get_user)):
    try:
        return company_service.get_order_with_status(status)
    except Exception as e:
        response.status_code=409
        return str(e)

@app.get("/avail-company-email/{email}")
def create_company(email,response: Response, user: Auth0User = Security(auth.get_user)):
    try:
        return company_service.company_email_avail(email)
    except Exception as e:
        response.status_code=409
        return str(e)






# @app.exception_handler(StarletteHTTPException)
# async def custom_http_exception_handler(request, exc):
#     print(f"OMG! An HTTP error!: {repr(exc)}")
#     return await http_exception_handler(request, exc)

