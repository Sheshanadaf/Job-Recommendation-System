import os
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

INPUT_DIR = "/opt/ml/processing/input"
OUTPUT_DIR = "/opt/ml/processing/output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1) Load CSVs (they will be placed in INPUT_DIR by SageMaker)
user_df = pd.read_csv(os.path.join(INPUT_DIR, "user_profiles_cleaned.csv"))
job_df  = pd.read_csv(os.path.join(INPUT_DIR, "job_listings_cleaned.csv"))

# 2) Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# 3) Generate embeddings
user_emb = model.encode(user_df["user_text_clean"].tolist(), show_progress_bar=True)
job_emb  = model.encode(job_df["job_text_clean"].tolist(),  show_progress_bar=True)

# 4) Save .npy
np.save(os.path.join(OUTPUT_DIR, "user_embeddings.npy"), user_emb)
np.save(os.path.join(OUTPUT_DIR, "job_embeddings.npy"),  job_emb)

print("User Embeddings Shape:", user_emb.shape)
print("Job Embeddings Shape:", job_emb.shape)
print("SBERT Embedding Generation Completed.")
