import json
import boto3
import time
import os
import uuid
sagemaker = boto3.client("sagemaker")

def lambda_handler(event, context):
    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = event["Records"][0]["s3"]["object"]["key"]

    job_name = f"train-model-{int(time.time() * 1000)}-{str(uuid.uuid4())[:8]}"

    response = sagemaker.create_training_job(
        TrainingJobName=job_name,
        RoleArn=os.environ["SAGEMAKER_ROLE"],
        AlgorithmSpecification={
            "TrainingImage": os.environ["ECR_IMAGE_URI"],
            "TrainingInputMode": "File",
            "EnableSageMakerMetricsTimeSeries": False
        },
        InputDataConfig=[
            {
                "ChannelName": "npy",
                "DataSource": {
                    "S3DataSource": {
                        "S3DataType": "S3Prefix",
                        "S3Uri": "s3://job-recommendation-system-dataset/processed/",
                        "S3DataDistributionType": "FullyReplicated"
                    }
                }
            },
            {
                "ChannelName": "csv",
                "DataSource": {
                    "S3DataSource": {
                        "S3DataType": "S3Prefix",
                        "S3Uri": "s3://job-recommendation-system-dataset/training/",
                        "S3DataDistributionType": "FullyReplicated"
                    }
                }
            }
        ],  #COMMA ERE is critica
        OutputDataConfig={
            "S3OutputPath": "s3://job-recommendation-system-dataset/models/latest/"
        },
        ResourceConfig={
            "InstanceType": "ml.t3.2xlarge",
            "InstanceCount": 1,
            "VolumeSizeInGB": 30,
        },
        StoppingCondition={"MaxRuntimeInSeconds": 3600},
        HyperParameters={
            "script": "train_from_npy.py"  # This will be passed as argument to container
        }
    )

    return {
        "statusCode": 200,
        "body": json.dumps(f"Started Training Job: {job_name}")
    }
