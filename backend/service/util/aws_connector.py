from .sns_wrapper import SnsWrapper
from dotenv import load_dotenv, find_dotenv
import boto3
import os

class AWSConnector:
    def __init__(self):
        print("Connected to AWS")
        load_dotenv()

    def init_session(self):
        return boto3.Session(
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'), 
            region_name='us-west-2'
        )
    
    def connect_sns(self):
        return SnsWrapper()
    
    def connect_rekognition(self):
        return self.init_session().client('rekognition', region_name='us-west-2')


