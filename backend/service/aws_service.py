from .util.rekognition_wrapper import RekognitionImage
from .util.rekognition_objects import (
    RekognitionFace, RekognitionCelebrity, RekognitionLabel,
    RekognitionModerationLabel, RekognitionText, show_bounding_boxes, show_polygons)

class AwsService:
    def __init__(self,aws_connector):
        self.sns_wrapper = aws_connector.connect_sns()
        self.rekognition_client = aws_connector.connect_rekognition()

    def send_message(self,phone_number, message):
        self.sns_wrapper.send_message_to_phone(phone_number, message)

    def text_from_image_path(self,path_to_file='/Users/passawityakul/Downloads/test_text.png'):
        book_file_name = path_to_file
        book_image = RekognitionImage.from_file(book_file_name, self.rekognition_client)
        texts = book_image.detect_text()
        show_polygons(book_image.image['Bytes'], [text.geometry['Polygon'] for text in texts], 'aqua')
        return texts
