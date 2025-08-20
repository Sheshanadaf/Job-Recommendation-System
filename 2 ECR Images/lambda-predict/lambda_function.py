import os, json, io, tarfile, boto3, pickle
import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.metrics.pairwise import cosine_similarity

# ---- S3 config ----
BUCKET = os.environ.get("BUCKET", "job-recommendation-system-dataset")
MODEL_PREFIX = "models/latest/"
TRAINING_PREFIX = "training/"
PROCESSED_PREFIX = "processed/"
TOP_K = int(os.environ.get("TOP_K", "5"))

s3 = boto3.client("s3")

def _download_and_extract_model():
    print("Listing objects in S3 under:", MODEL_PREFIX)
    response = s3.list_objects_v2(Bucket=BUCKET, Prefix=MODEL_PREFIX)
    objects = response.get("Contents", [])
    print(f"Found {len(objects)} objects")

    if not objects:
        raise FileNotFoundError("No model objects found in S3 under prefix: " + MODEL_PREFIX)

    tar_objects = [obj for obj in objects if obj["Key"].endswith("model.tar.gz")]
    print(f"Found {len(tar_objects)} .tar.gz files")

    if not tar_objects:
        raise FileNotFoundError("No model.tar.gz found under " + MODEL_PREFIX)

    latest_tar = max(tar_objects, key=lambda x: x["LastModified"])["Key"]
    print("Latest tar.gz found:", latest_tar)

    tar_bytes = io.BytesIO(s3.get_object(Bucket=BUCKET, Key=latest_tar)["Body"].read())
    os.makedirs("/tmp/model", exist_ok=True)

    with tarfile.open(fileobj=tar_bytes, mode="r:gz") as t:
        t.extractall("/tmp/model")
        print("Extracted files:", t.getnames())

    model_path = "/tmp/model/models/xgb_model.json"
    encoder_path = "/tmp/model/models/label_encoder.pkl"
    print("Model path:", model_path)
    print("Encoder path:", encoder_path)

    model = XGBClassifier()
    model.load_model(model_path)
    print("Model loaded successfully")
    with open(encoder_path, "rb") as f:
        label_encoder = pickle.load(f)
    print("Label encoder loaded successfully")

    return model, label_encoder


def lambda_handler(event, context):
    try:
        print("Event received:", event)
        user_id = (event.get("user_id") or
                   (event.get("queryStringParameters") or {}).get("user_id"))
        print("User ID:", user_id)
        if not user_id:
            return {"statusCode": 400, "body": json.dumps({"error":"user_id is required"})}

        model, label_encoder = _download_and_extract_model()

        # Load CSVs
        user_csv = "/tmp/user_profiles_cleaned.csv"
        job_csv  = "/tmp/job_listings_cleaned.csv"
        print("Downloading CSVs from S3...")
        s3.download_file(BUCKET, TRAINING_PREFIX + "user_profiles_cleaned.csv", user_csv)
        s3.download_file(BUCKET, TRAINING_PREFIX + "job_listings_cleaned.csv", job_csv)
        print("CSV download completed")

        user_df = pd.read_csv(user_csv)
        job_df  = pd.read_csv(job_csv)
        print(f"user_df shape: {user_df.shape}, job_df shape: {job_df.shape}")

        # Load embeddings
        user_emb_file = "/tmp/user_embeddings.npy"
        job_emb_file  = "/tmp/job_embeddings.npy"
        print("Downloading embeddings from S3...")
        s3.download_file(BUCKET, PROCESSED_PREFIX + "user_embeddings.npy", user_emb_file)
        s3.download_file(BUCKET, PROCESSED_PREFIX + "job_embeddings.npy", job_emb_file)
        print("Embeddings download completed")

        user_embeddings = np.load(user_emb_file)
        job_embeddings  = np.load(job_emb_file)
        print("User embeddings shape:", user_embeddings.shape)
        print("Job embeddings shape:", job_embeddings.shape)

        # Find user index
        mask = user_df["id"].astype(str) == str(user_id)
        print("User mask sum:", mask.sum())
        if not mask.any():
            return {"statusCode": 404, "body": json.dumps({"error": f"User {user_id} not found"})}
        idx = int(np.nonzero(mask.values)[0][0])
        print("User index:", idx)
        user_vec = user_embeddings[idx].reshape(1, -1)

        # Predict category
        pred_int = model.predict(user_vec)
        predicted_category = label_encoder.inverse_transform(pred_int)[0]
        print("Predicted category:", predicted_category)

        # Compute Top-K job similarities
        sims = cosine_similarity(user_vec, job_embeddings)[0]
        top_idx = sims.argsort()[-TOP_K:][::-1]
        top_jobs = job_df.iloc[top_idx].copy()
        top_jobs["similarity_score"] = sims[top_idx]
        print("Top jobs computed:", top_jobs)

        results = top_jobs.to_dict(orient="records")
        return {
            "statusCode": 200,
            "body": json.dumps({
                "user_id": user_id,
                "predicted_category": predicted_category,
                "top_jobs": results
            })
        }

    except Exception as e:
        print("Exception occurred:", str(e))
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
