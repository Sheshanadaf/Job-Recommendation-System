
# Create an ECR repo (once)
aws ecr create-repository --region us-east-1 --repository-name sbert-embed-processor

# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS accound-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t sbert-embed-processor:v1 .
docker tag sbert-embed-processor:v1 <AWS accound-id>.dkr.ecr.us-east-1.amazonaws.com/sbert-embed-processor:v1
docker push <AWS accound-id>.dkr.ecr.us-east-1.amazonaws.com/sbert-embed-processor:v1
