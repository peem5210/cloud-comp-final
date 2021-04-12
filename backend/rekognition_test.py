from rekognition_wrapper import RekognitionImage
from dotenv import load_dotenv, find_dotenv
import boto3
import os
from pprint import pprint

from rekognition_objects import (
    RekognitionFace, RekognitionCelebrity, RekognitionLabel,
    RekognitionModerationLabel, RekognitionText, show_bounding_boxes, show_polygons)
    
load_dotenv()
session = boto3.Session(
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

rekognition_client = session.client('rekognition')


# rekognition_image = RekognitionImage(image, image_name, rekognition_client)
book_file_name = '/Users/passawityakul/Downloads/test_text.png'
book_image = RekognitionImage.from_file(book_file_name, rekognition_client)
print(f"Detecting text in {book_image.image_name}...")
texts = book_image.detect_text()
print(f"Found {len(texts)} text instances. Here are the first seven:")
for text in texts[:7]:
    pprint(text.to_dict())
show_polygons(book_image.image['Bytes'], [text.geometry['Polygon'] for text in texts], 'aqua')
