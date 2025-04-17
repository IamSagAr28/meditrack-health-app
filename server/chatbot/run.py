from flask import Flask
# Use a proper import that doesn't depend on the module name
import os
import sys
from dotenv import load_dotenv

# Add the current directory to the path so we can import app properly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import chatbot_bp, init_chatbot

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Register chatbot blueprint
app.register_blueprint(chatbot_bp)

# Initialize chatbot
init_chatbot()

if __name__ == "__main__":
    # Run Flask app
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
