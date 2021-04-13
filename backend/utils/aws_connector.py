from .sns_wrapper import SnsWrapper
from .rekognition_wrapper import RekognitionImage
from dotenv import load_dotenv, find_dotenv
import boto3
import os
from pprint import pprint

from .rekognition_objects import (
    RekognitionFace, RekognitionCelebrity, RekognitionLabel,
    RekognitionModerationLabel, RekognitionText, show_bounding_boxes, show_polygons)


class AWSConnector:
    def __init__(self):
        load_dotenv()
        self.sns_wrapper = SnsWrapper()
        self.rekognition_client = self.init_session().client('rekognition', region_name='us-west-2')

    def init_session(self):
        return boto3.Session(
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'), 
            region_name='us-west-2'
        )

    def send_message(self,phone_number, message):
        self.sns_wrapper.send_message_to_phone(phone_number, message)

    def text_from_image_path(self,path_to_file='/Users/passawityakul/Downloads/test_text.png'):
        book_file_name = path_to_file
        book_image = RekognitionImage.from_file(book_file_name, self.rekognition_client)
        texts = book_image.detect_text()
        show_polygons(book_image.image['Bytes'], [text.geometry['Polygon'] for text in texts], 'aqua')
        return texts
