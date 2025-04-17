from flask import Flask, redirect, url_for
import os
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(current_dir, '.env'))

# Create Flask application
app = Flask(__name__)

# Import and register blueprint
from app import chatbot_bp, init_chatbot
app.register_blueprint(chatbot_bp)

# Setup root route to redirect to chatbot
@app.route('/')
def index():
    return redirect(url_for('chatbot.index'))

# Initialize chatbot
init_chatbot()

if __name__ == '__main__':
    try:
        logger.info("Starting MediTrack Chatbot on port 5001")
        app.run(host='0.0.0.0', port=5001, debug=True)
    except Exception as e:
        logger.error(f"Error starting server: {str(e)}")
