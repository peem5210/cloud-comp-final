from .util.rekognition_wrapper import RekognitionImage
from .util.rekognition_objects import (
    RekognitionFace, RekognitionCelebrity, RekognitionLabel,
    RekognitionModerationLabel, RekognitionText, show_bounding_boxes, show_polygons, save_polygons)
from boto3.s3.transfer import S3Transfer

class AwsService:
    def __init__(self,aws_connector):
        print("Initialized AWS service")
        self.sns_wrapper = aws_connector.connect_sns()
        self.rekognition_client = aws_connector.connect_rekognition()
        self.s3_resource, self.s3_client = aws_connector.connect_s3()

    def send_message(self,phone_number, message):
        self.sns_wrapper.send_message_to_phone(phone_number, message)

    def text_from_image_path(self,vendor,path_to_file=''):
        if vendor == 'JT':
            begins_with = tuple([str(x) for x in range(10)])
            num = 12
        else:
            begins_with = 'TH'
            num = 14
        book_file_name = path_to_file
        book_image = RekognitionImage.from_file(book_file_name, self.rekognition_client)
        texts = book_image.detect_text()
        image = save_polygons(book_image.image['Bytes'], [text.geometry['Polygon'] for text in texts], 'aqua')
        image.save('response.png')
        data = open('response.png', 'rb')
        
        bucket_name = 'bucket-test-cloud-comp'
        bucket_location = self.s3_client.get_bucket_location(Bucket=bucket_name)
        key = 'response.png'

        self.s3_resource.Bucket(bucket_name).put_object(Key=key, Body=data)
        object_url = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
            bucket_location['LocationConstraint'],
            bucket_name,
            key)

        return {"words": [x.to_dict()['text'] for x in texts if x.to_dict()['kind']=='WORD' and len(x.to_dict()['text'])==num and x.to_dict()['text'].startswith(begins_with)], "image_url":object_url}
