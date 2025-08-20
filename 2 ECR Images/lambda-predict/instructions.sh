
# Create an ECR repo (once)
aws ecr create-repository --region us-east-1 --repository-name lambda=predict

# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS accound-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t lambda=predict:v1 .
docker tag lambda=predict:v1 <AWS accound-id>.dkr.ecr.us-east-1.amazonaws.com/lambda=predict:v1
docker push <AWS accound-id>.dkr.ecr.us-east-1.amazonaws.com/lambda=predict:v1
