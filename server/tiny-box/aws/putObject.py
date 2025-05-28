import os

import boto3
import botocore.exceptions
from dotenv import load_dotenv
from botocore.config import Config

load_dotenv()

# config = Config(
#     s3={'addressing_style': 'path'}
# )

AWS_END_POINT = os.getenv("AWS_END_POINT")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

print(f"""
AWS_END_POINT: {AWS_END_POINT}
AWS_ACCESS_KEY_ID: {AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY: {AWS_SECRET_ACCESS_KEY}
AWS_BUCKET_NAME: {AWS_BUCKET_NAME}
""")
# TODO: giảm version nếu storage đang dùng minio/ceph không dùng aws chuẩn còn version mới có lỗi (chưa rõ lỗi chính xác)
# đây là version lỗi
# pip show boto3
# Name: boto3
# Version: 1.38.21
# Summary: The AWS SDK for Python
# Home-page: https://github.com/boto/boto3
# Author: Amazon Web Services
# Author-email:
# License: Apache License 2.0
# Location: C:\Users\Admin\miniconda3\Lib\site-packages
# Requires: botocore, jmespath, s3transfer
# Required-by:
# code:BadDigest message:<nil> region:<nil> requestId:tx00000buy76j retryable:(bool=false) statusCode:(float64=400) time:2025-05-28T08:11:23.993Z


# AWS session
session = boto3.session.Session()
# Initialize S3 client with your credentials and custom endpoint
s3Client = session.client(
    service_name='s3',
    # Optional: Use if you're targeting a custom endpoint (e.g., S3-compatible storage)
    endpoint_url=AWS_END_POINT,
    # Replace with your actual AWS access key
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    # Replace with your actual AWS secret key
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name='us-east-1',
    use_ssl=True,
    config=Config(s3={'use_accelerate_endpoint': False})
)

# try:
#     response = s3Client.list_buckets()
#     print('Successfully uploaded data with SSE-C:', response)
# except Exception as e:
#     print('Error occurred:', e)

# Define key and buffer
aws_key = "222222222222222222222/test.txt"
buffer = "ff"

# Upload file
with open("D:\\github\\basic-aws-sdk\\server\\tiny-box\\aws\\putObject.js", "rb") as f:
    try:
        s3Client.upload_fileobj(f, AWS_BUCKET_NAME, aws_key)
        print('Successfully uploaded data')
    except botocore.exceptions.ClientError as e:
        print('AWS-specific error occurred:', e)
    except Exception as e:
        print('General error occurred:', e)
