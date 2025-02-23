from flask import Flask, request, jsonify, session, redirect, url_for, make_response
from flask_cors import CORS
import faiss
import json
from sentence_transformers import SentenceTransformer
import numpy as np
import logging
import os
import requests
from collections import Counter
from dotenv import load_dotenv
from functools import lru_cache
import time
from cachetools import TTLCache, cached

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Configure CORS properly
CORS(app, 
     resources={r"/*": {"origins": ["http://localhost:3000"], 
                       "supports_credentials": True,
                       "allow_headers": ["Content-Type"],
                       "methods": ["GET", "POST", "OPTIONS"]}})

# Configure session
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# GitHub OAuth Configuration
GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
GITHUB_REDIRECT_URI = os.getenv('GITHUB_REDIRECT_URI', 'http://localhost:5000/auth/callback')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize caches
user_cache = TTLCache(maxsize=100, ttl=3600)  # Cache user data for 1 hour
repo_cache = TTLCache(maxsize=1000, ttl=3600)  # Cache repository data for 1 hour
skills_cache = TTLCache(maxsize=100, ttl=1800)  # Cache skills for 30 minutes

# Load FAISS index and metadata once at startup
try:
    index = faiss.read_index('foss_index.faiss')
    with open('repos.json', 'r') as f:
        repos = json.load(f)
    model = SentenceTransformer('all-MiniLM-L6-v2')
    logger.info("Successfully loaded FAISS index and model")
except Exception as e:
    logger.error(f"Error loading FAISS index or model: {e}")
    raise

@cached(cache=repo_cache)
def get_repo_topics(repo_full_name, headers):
    """Get repository topics with caching"""
    topics_url = f"https://api.github.com/repos/{repo_full_name}/topics"
    response = requests.get(topics_url, headers=headers)
    return response.json().get('names', []) if response.status_code == 200 else []

@cached(cache=user_cache)
def get_github_user_data(access_token):
    """Get GitHub user data with caching"""
    headers = {'Authorization': f'token {access_token}'}
    response = requests.get('https://api.github.com/user', headers=headers)
    return response.json() if response.status_code == 200 else None

@cached(cache=skills_cache)
def get_user_skills(access_token):
    """Analyze user's GitHub repositories to determine their skills with caching"""
    headers = {'Authorization': f'token {access_token}'}
    
    try:
        # Get user profile from cache or API
        user_profile = get_github_user_data(access_token)
        if not user_profile:
            return {'languages': {}, 'topics': {}, 'is_new_user': True}

        # Get repositories with pagination to handle large numbers efficiently
        repos = []
        page = 1
        while True:
            repos_url = f'https://api.github.com/user/repos?page={page}&per_page=100'
            response = requests.get(repos_url, headers=headers)
            if response.status_code != 200 or not response.json():
                break
            repos.extend(response.json())
            page += 1

        # Get starred repositories (limit to recent 100 for performance)
        starred_url = f"https://api.github.com/users/{user_profile['login']}/starred?per_page=100"
        starred = requests.get(starred_url, headers=headers).json()

        # Process repositories in batches
        languages = Counter()
        topics = Counter()
        
        # Process owned repositories
        for repo in repos:
            if repo['language']:
                languages[repo['language']] += 2
            repo_topics = get_repo_topics(repo['full_name'], headers)
            for topic in repo_topics:
                topics[topic] += 2

        # Process starred repositories
        for repo in starred:
            if repo['language']:
                languages[repo['language']] += 1
            repo_topics = get_repo_topics(repo['full_name'], headers)
            for topic in repo_topics:
                topics[topic] += 1

        return {
            'languages': dict(languages.most_common(5)),
            'topics': dict(topics.most_common(5)),
            'is_new_user': len(repos) == 0
        }

    except Exception as e:
        logger.error(f"Error in skill analysis: {str(e)}")
        return {
            'languages': {},
            'topics': {
                'good-first-issue': 3,
                'beginner-friendly': 3,
                'documentation': 2,
                'help-wanted': 2
            },
            'is_new_user': True
        }

@lru_cache(maxsize=1000)
def get_embedding(text):
    """Cache embeddings for frequently searched queries"""
    return model.encode(text)

def search(query, k=5, user_skills=None):
    try:
        # Get cached embedding or compute new one
        query_embedding = get_embedding(query)
        query_embedding_normalized = query_embedding / np.linalg.norm(query_embedding)
        
        # Perform search
        distances, indices = index.search(query_embedding_normalized.reshape(1, -1), k*2)
        
        # Process results in batches for better performance
        top_repos = []
        batch_size = 10
        for i in range(0, len(indices[0]), batch_size):
            batch_indices = indices[0][i:i+batch_size]
            
            for idx in batch_indices:
                repo = {
                    "title": repos[idx]["title"],
                    "description": repos[idx]["description"],
                    "url": repos[idx]["url"],
                    "stars": repos[idx].get("stars", 0),
                    "forks": repos[idx].get("forks", 0),
                    "watchers": repos[idx].get("watchers", 0),
                    "tags": repos[idx].get("tags", []),
                    "difficulty": repos[idx].get("difficulty", "intermediate")
                }
                
                if user_skills:
                    skill_match_score = 0
                    repo_tags = set(repo["tags"])
                    user_languages = set(user_skills['languages'].keys())
                    user_topics = set(user_skills['topics'].keys())
                    
                    skill_match_score += len(repo_tags.intersection(user_languages)) * 2
                    skill_match_score += len(repo_tags.intersection(user_topics))
                    
                    if user_skills.get('is_new_user'):
                        if any(tag in repo_tags for tag in ['good-first-issue', 'beginner-friendly', 'documentation']):
                            skill_match_score += 3
                        if repo["difficulty"] == "advanced":
                            skill_match_score -= 2
                    
                    repo["skill_match_score"] = skill_match_score
                
                top_repos.append(repo)
        
        # Sort results efficiently
        if user_skills:
            top_repos.sort(key=lambda x: (x.get("skill_match_score", 0), x["stars"]), reverse=True)
        else:
            top_repos.sort(key=lambda x: x["stars"], reverse=True)
        
        return top_repos[:k]
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        return []

@app.route('/login')
def login():
    """Redirect users to GitHub for authentication"""
    force_login = request.args.get('force_login', '').lower() == 'true'
    
    if force_login:
        # Clear any existing session
        session.clear()
        # Clear any existing cookies
        resp = make_response(redirect(
            f'https://github.com/login/oauth/authorize'
            f'?client_id={GITHUB_CLIENT_ID}'
            f'&redirect_uri={GITHUB_REDIRECT_URI}'
            f'&scope=repo,read:user'
            f'&prompt=consent'  # Force consent screen
            f'&login=true'  # Force login screen
            f'&allow_signup=true'  # Allow new account creation
        ))
        # Clear GitHub session cookie
        resp.set_cookie('github_session', '', expires=0, path='/')
        return resp
    else:
        # Try to use existing session if available
        return redirect(
            f'https://github.com/login/oauth/authorize'
            f'?client_id={GITHUB_CLIENT_ID}'
            f'&redirect_uri={GITHUB_REDIRECT_URI}'
            f'&scope=repo,read:user'
        )

@app.route('/auth/callback')
def callback():
    """Handle the GitHub OAuth callback"""
    error = request.args.get('error')
    if error:
        logger.error(f"GitHub OAuth error: {error}")
        return redirect(f'{FRONTEND_URL}?error={error}')

    code = request.args.get('code')
    if not code:
        logger.error("No code received from GitHub")
        return redirect(f'{FRONTEND_URL}?error=no_code')
    
    try:
        # Exchange code for access token
        response = requests.post(
            'https://github.com/login/oauth/access_token',
            data={
                'client_id': GITHUB_CLIENT_ID,
                'client_secret': GITHUB_CLIENT_SECRET,
                'code': code,
                'redirect_uri': GITHUB_REDIRECT_URI
            },
            headers={'Accept': 'application/json'}
        )
        
        token_data = response.json()
        access_token = token_data.get('access_token')
        
        if not access_token:
            error_description = token_data.get('error_description', 'Failed to obtain access token')
            logger.error(f"GitHub token error: {error_description}")
            return redirect(f'{FRONTEND_URL}?error={error_description}')

        # Store token in session
        session['github_token'] = access_token
        
        # Get user profile
        user_response = requests.get(
            'https://api.github.com/user',
            headers={'Authorization': f'token {access_token}'}
        )
        
        if user_response.status_code != 200:
            logger.error(f"GitHub API error: {user_response.text}")
            return redirect(f'{FRONTEND_URL}?error=user_profile_error')
            
        user_data = user_response.json()
        session['user'] = {
            'login': user_data['login'],
            'avatar_url': user_data['avatar_url'],
            'html_url': user_data['html_url']
        }
        
        # Analyze user skills
        try:
            skills = get_user_skills(access_token)
            session['skills'] = skills
        except Exception as e:
            logger.error(f"Error analyzing skills: {str(e)}")
            # Continue even if skills analysis fails
            session['skills'] = {'languages': {}, 'topics': {}}
        
        logger.info(f"Successfully authenticated user: {user_data['login']}")
        return redirect(f'{FRONTEND_URL}/dashboard')
        
    except Exception as e:
        logger.error(f"Callback error: {str(e)}")
        return redirect(f'{FRONTEND_URL}?error=server_error')

@app.route('/logout')
def logout():
    """Clear user session"""
    session.clear()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/user')
def get_user():
    """Get current user data"""
    if 'user' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    return jsonify({
        'user': session['user'],
        'skills': session.get('skills', {})
    })

@app.route('/search', methods=['POST'])
def search_endpoint():
    try:
        query = request.json.get('query', '')
        if not query:
            return jsonify({"error": "Empty query"}), 400
            
        logger.info(f"Search request received: {query}")
        
        # Get user skills if authenticated
        user_skills = session.get('skills') if 'user' in session else None
        results = search(query, user_skills=user_skills)
        
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
    app.run(debug=True, host="0.0.0.0", port=5000)
