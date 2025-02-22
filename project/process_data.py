import json
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss

# Load repositories from JSONL file
with open('foss_repositories.jsonl', 'r', encoding='utf-8') as f:
    repos = [json.loads(line) for line in f]

# Combine description and README for text representation
for repo in repos:
    repo['text'] = (repo.get('description', '') + ' ' + repo.get('readme', '')).strip()
    
    # Extract programming tags (example: from topics or languages)
    repo['tags'] = repo.get('topics', [])  # Assuming GitHub provides topics as tags

# Load sentence embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')
texts = [repo['text'] for repo in repos]
embeddings = model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)

# Create FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatIP(dimension)  # Inner product for similarity search
index.add(embeddings)

# Save FAISS index
faiss.write_index(index, 'foss_index.faiss')

# Save processed repositories with programming tags
with open('repos.json', 'w', encoding='utf-8') as f:
    json.dump(repos, f, indent=4)

print("FAISS index and repository metadata (including programming tags) saved successfully.")
