from flask import Flask
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Import and register chatbot blueprint
from app import chatbot_bp, init_chatbot
app.register_blueprint(chatbot_bp)

# Initialize chatbot
init_chatbot()

# Configure CORS
frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
CORS(app, resources={
    r"/*": {
        "origins": [frontend_url, "https://meditrack-frontend.onrender.com"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

if __name__ == "__main__":
    # Run the Flask app
    port = int(os.environ.get("PORT", 5001))
    debug_mode = os.environ.get("FLASK_ENV", "production") == "development"
    print(f"Starting Flask server on port {port} in {'development' if debug_mode else 'production'} mode...")
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
