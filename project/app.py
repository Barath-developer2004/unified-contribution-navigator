from flask import Flask, request, jsonify
from flask_cors import CORS
import faiss
import json
from sentence_transformers import SentenceTransformer
import numpy as np
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load FAISS index and metadata
index = faiss.read_index('foss_index.faiss')
with open('repos.json', 'r') as f:
    repos = json.load(f)

# Load Sentence Transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

def search(query, k=5):
    try:
        query_embedding = model.encode(query)
        query_embedding_normalized = query_embedding / np.linalg.norm(query_embedding)
        distances, indices = index.search(query_embedding_normalized.reshape(1, -1), k)
        
        top_repos = [
            {
                "title": repos[idx]["title"],
                "description": repos[idx]["description"],
                "url": repos[idx]["url"],
                "stars": repos[idx].get("stars", 0),
                "forks": repos[idx].get("forks", 0),
                "watchers": repos[idx].get("watchers", 0),
                "tags": repos[idx].get("tags", [])  # Programming tags
            }
            for idx in indices[0]
        ]
        return top_repos
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        return []

@app.route('/search', methods=['POST'])
def search_endpoint():
    try:
        query = request.json.get('query', '')
        if not query:
            return jsonify({"error": "Empty query"}), 400
            
        logger.info(f"Search request received: {query}")
        results = search(query)
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Endpoint error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/trending', methods=['GET'])
def get_trending_repos():
    try:
        # Sort repositories using a weighted score
        trending_repos = sorted(
            repos,
            key=lambda r: r.get("stars", 0) * 2 + r.get("forks", 0) * 1.5 + r.get("watchers", 0),
            reverse=True
        )[:10]  # Get top 10 trending

        logger.info(f"Trending repos requested, returning {len(trending_repos)} results.")
        return jsonify(trending_repos)
    except Exception as e:
        logger.error(f"Error fetching trending repos: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)  # Allow external access
