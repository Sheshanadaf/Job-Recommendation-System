# Use AWS DLC that already includes PyTorch (CPU)
FROM public.ecr.aws/deep-learning-containers/pytorch-inference:2.5.1-cpu-py311-ubuntu22.04-sagemaker-v1.42

# Install lightweight additional libraries; torch is already included
RUN pip install --no-cache-dir \
    sentence-transformers==2.6.1 \
    pandas==2.2.2 \
    numpy==1.26.4 \
    scikit-learn==1.4.2 \
    xgboost==2.0.3

# (Optional) Pre-download the embedding model so jobs run faster/offline
RUN python - <<'PY'
from sentence_transformers import SentenceTransformer
_ = SentenceTransformer('all-MiniLM-L6-v2')
PY

# Copy both scripts into the container
COPY process_embeddings.py /opt/ml/code/process_embeddings.py
COPY train_from_npy.py /opt/ml/code/train


# Default working directory
WORKDIR /opt/ml/code

# Use entrypoint for flexibility: SageMaker jobs can override the script to run
ENTRYPOINT ["python"]
