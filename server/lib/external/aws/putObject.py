import boto3

# AWS session
session = boto3.session.Session()

# Initialize S3 client with your credentials and custom endpoint
s3Client = session.client(
    service_name='s3',
    aws_access_key_id='',  # Replace with your actual AWS access key
    # Replace with your actual AWS secret key
    aws_secret_access_key='',
    # Optional: Use if you're targeting a custom endpoint (e.g., S3-compatible storage)
    endpoint_url='',
)

# Define key and buffer
aws_key = "fzWcDFq9nv6DKPm8/test.json"
buffer = "tesstst"

# Define upload parameters
upload_params = {
    'Bucket': 'bizflydev',  # Replace with your bucket name
    'Key': aws_key,
    'Body': buffer
}

# Upload the object
try:
    response = s3Client.put_object(**upload_params)
    print('Successfully uploaded data with SSE-C:', response)
except Exception as e:
    print('Error occurred:', e)
