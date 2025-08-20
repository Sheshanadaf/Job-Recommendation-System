import json
import boto3
import time
import os

sagemaker = boto3.client("sagemaker")


def lambda_handler(event, context):
    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = event["Records"][0]["s3"]["object"]["key"]

    job_name = f"process-embeddings-{int(time.time() * 1000)}"

    response = sagemaker.create_processing_job(
        ProcessingJobName=job_name,
        RoleArn=os.environ["SAGEMAKER_ROLE"],
        ProcessingResources={
            "ClusterConfig": {
                "InstanceCount": 1,
                "InstanceType": "ml.t3.medium",
                "VolumeSizeInGB": 30,
            }
        },
        AppSpecification={
            "ImageUri": os.environ["ECR_IMAGE_URI"],
            "ContainerEntrypoint": ["python", "process_embeddings.py"]
        },
        ProcessingInputs=[
            {
                "InputName": "input-data",
                "S3Input": {
                    "S3Uri": "s3://job-recommendation-system-dataset/training",
                    "LocalPath": "/opt/ml/processing/input",
                    "S3DataType": "S3Prefix",
                    "S3InputMode": "File",
                }
            }
        ],
        ProcessingOutputConfig={
            "Outputs": [
                {
                    "OutputName": "output-data",
                    "S3Output": {
                        "S3Uri": "s3://job-recommendation-system-dataset/processed/",
                        "LocalPath": "/opt/ml/processing/output",
                        "S3UploadMode": "EndOfJob",
                    }
                }
            ]
        }
    )

    return {
        "statusCode": 200,
        "body": json.dumps(f"Started Processing Job: {job_name}")
    }
