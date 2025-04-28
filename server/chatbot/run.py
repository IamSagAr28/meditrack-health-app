from flask import Flask, redirect, Response
# Use a proper import that doesn't depend on the module name
import os
import sys
from dotenv import load_dotenv
from flask_cors import CORS

# Add the current directory to the path so we can import app properly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import chatbot_bp, init_chatbot

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Add custom CSP headers to allow scripts, media, and other resources
@app.after_request
def add_security_headers(response):
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; connect-src 'self' https://*.googleapis.com https://*.assemblyai.com; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; media-src 'self' blob:;"
    return response

# Configure CORS with specific allowed origins
allowed_origins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://127.0.0.1:59819',
    'http://127.0.0.1:60265',
    'https://meditrack-frontend.onrender.com',
    'https://meditrack-app.netlify.app',
    'https://medi-care1528-4b4f90.netlify.app'
]

CORS(app, resources={r"/*": {"origins": allowed_origins}}, supports_credentials=True)

# Register chatbot blueprint
app.register_blueprint(chatbot_bp)

# Initialize chatbot
init_chatbot()

# Add root path redirect to chatbot
@app.route('/')
def root_redirect():
    return redirect('/chatbot/')

if __name__ == "__main__":
    # Run Flask app
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)

# Make sure the application binds to the port provided by Render
app.config['PORT'] = int(os.environ.get("PORT", 5001))
