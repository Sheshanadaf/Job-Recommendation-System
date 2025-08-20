import os
import pickle
import numpy as np
import pandas as pd
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.metrics.pairwise import cosine_similarity

# Input/Output paths (SageMaker style)
INPUT_NPY = os.environ.get("SM_CHANNEL_NPY", "/opt/ml/input/data/npy")
INPUT_CSV = os.environ.get("SM_CHANNEL_CSV", "/opt/ml/input/data/csv")
OUTPUT_DIR = "/opt/ml/model"

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load embeddings and CSVs
user_embeddings = np.load(os.path.join(INPUT_NPY, "user_embeddings.npy"))
job_embeddings = np.load(os.path.join(INPUT_NPY, "job_embeddings.npy"))

user_df = pd.read_csv(os.path.join(INPUT_CSV, "user_profiles_cleaned.csv"))
job_df = pd.read_csv(os.path.join(INPUT_CSV, "job_listings_cleaned.csv"))

# Match categories to users (cosine similarity)
sims = cosine_similarity(user_embeddings, job_embeddings)
labels = [job_df.iloc[i]["category"] for i in sims.argmax(axis=1)]
user_df["job_category_label"] = labels

# Encode labels
le = LabelEncoder()
y = le.fit_transform(user_df["job_category_label"])

# Train/test split
if len(user_df) < 2:
    X_train, X_test, y_train, y_test = user_embeddings, user_embeddings, y, y
else:
    X_train, X_test, y_train, y_test = train_test_split(
        user_embeddings, y, test_size=0.2, random_state=42
    )

# Train model
clf = XGBClassifier(
    objective="multi:softmax",
    num_class=len(le.classes_),
    eval_metric="mlogloss",
    use_label_encoder=False
)
clf.fit(X_train, y_train)

# Evaluate
acc = accuracy_score(y_test, clf.predict(X_test))
print(f"Accuracy: {acc:.3f}")

# Save artifacts
model_dir = os.path.join(OUTPUT_DIR, "models")
os.makedirs(model_dir, exist_ok=True)

clf.save_model(os.path.join(model_dir, "xgb_model.json"))
with open(os.path.join(model_dir, "label_encoder.pkl"), "wb") as f:
    pickle.dump(le, f)
