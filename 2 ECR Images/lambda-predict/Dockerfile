# Use AWS Lambda Python 3.10 base imagek
FROM public.ecr.aws/lambda/python:3.9.2025.08.15.15

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Lambda function code
COPY lambda_function.py ${LAMBDA_TASK_ROOT}

# Set Lambda handler
CMD ["lambda_function.lambda_handler"]
