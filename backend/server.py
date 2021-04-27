import os

from dotenv import load_dotenv
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi import Response,status,Depends, Security,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi_auth0 import Auth0, Auth0User
from pydantic import BaseModel

from service.util.aws_connector import AWSConnector
from service.util.mysql_connector import MySQLConnector
from service.company_service import CompanyService, CreateCompanyDto, UpdateCompanyDto, UpdateOrderDto, CreateOrderDto
from service.aws_service import AwsService
load_dotenv()

app = FastAPI()

aws_connector = AWSConnector()
mysql_connector = MySQLConnector()

aws_service = AwsService(aws_connector)
company_service = CompanyService(aws_service,mysql_connector)

auth = Auth0(domain=os.getenv('AUTH0_DOMAIN'), api_audience=os.getenv('AUTH0_AUDIENCE'), scopes={'read:test':''})
print("Connected to AUTH0")

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

@app.post("/text-from-image/{vendor}")
async def create_upload_file(vendor,response: Response,uploaded_file: UploadFile = File(...), user: Auth0User = Security(auth.get_user)):
    text = {}
    if not uploaded_file.filename.lower().endswith(('.jpg','.png','jpeg')):
        response.status_code=409
        return "Image type invalid"
    file_location = f"tmp_files/{uploaded_file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(uploaded_file.file.read())
    text = aws_service.text_from_image_path(vendor,path_to_file = f"tmp_files/{uploaded_file.filename}")
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
        return company_service.get_order_with_status(status,user)
    except Exception as e:
        response.status_code=409
        return str(e)

@app.get("/avail-company-email")
def create_company(response: Response, user: Auth0User = Security(auth.get_user)):
    try:
        return company_service.company_email_avail(user.email)
    except Exception as e:
        response.status_code=409
        return str(e)

@app.patch("/company")
def create_company(dto:UpdateCompanyDto,response: Response, user: Auth0User = Security(auth.get_user)):
    try:
        return company_service.update_company(dto, user)
    except Exception as e:
        response.status_code=409
        return str(e)

@app.patch("/order")
def patch_order(dto:UpdateOrderDto,response: Response, user: Auth0User = Security(auth.get_user)):
    try:
        return company_service.update_order(dto, user)
    except Exception as e:
        response.status_code=409
        return str(e)
        
@app.get("/order/all")
def get_all_order_all(response: Response, user: Auth0User = Security(auth.get_user)):
    try:
        return company_service.get_order(user)
    except Exception as e:
        response.status_code=409
        return str(e)

@app.get("/order")
def get_all_order(response: Response, user: Auth0User = Security(auth.get_user)):
    try:
        return company_service.get_order(user)
    except Exception as e:
        response.status_code=409
        return str(e)


@app.post("/order")
def create_order(dto:CreateOrderDto, response: Response, user: Auth0User = Security(auth.get_user)):
    try:
        return company_service.insert_order(dto,user)
    except Exception as e:
        response.status_code=409
        return str(e)
@app.get("/shipping-log")
def get_shipping_log(response: Response, user: Auth0User = Security(auth.get_user)):
    try:
        return company_service.get_shipping_log(user)
    except Exception as e:
        response.status_code=409
        return str(e)


class NotificationDto(BaseModel):
    words: list=[]

@app.post("/notification")
def create_company(dto:NotificationDto,request: Request, user: Auth0User = Security(auth.get_user)):
    return company_service.send_notification(dto, user.email)




# @app.exception_handler(StarletteHTTPException)
# async def custom_http_exception_handler(request, exc):
#     print(f"OMG! An HTTP error!: {repr(exc)}")
#     return await http_exception_handler(request, exc)

