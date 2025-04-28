# chatbot_app.py
from flask import Blueprint, request, jsonify, render_template
import google.generativeai as genai
import assemblyai as aai
import os
from dotenv import load_dotenv
import logging
import pathlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from the chatbot directory
current_dir = pathlib.Path(__file__).parent.absolute()
load_dotenv(os.path.join(current_dir, '.env'))

# Create blueprint for the chatbot
chatbot_bp = Blueprint('chatbot', __name__, 
                      template_folder='templates',
                      static_folder='static',
                      url_prefix='/chatbot')

# Check for required environment variables
required_env_vars = ['GEMINI_API_KEY', 'ASSEMBLYAI_API_KEY']
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    logger.warning(f"Missing required environment variables: {', '.join(missing_vars)}")
    logger.warning("Chatbot functionality will be limited")
else:
    # Configure APIs
    try:
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        aai.settings.api_key = os.getenv('ASSEMBLYAI_API_KEY')
    except Exception as e:
        logger.error(f"Error configuring APIs: {str(e)}")

@chatbot_bp.route('/')
def index():
    response = render_template('index.html')
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com"
    return response

@chatbot_bp.route('/test')
def test():
    return render_template('test.html')

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        user_input = data.get('user_input')
        if not user_input:
            return jsonify({"error": "No input provided"}), 400

        # Check if API key is configured
        if not os.getenv('GEMINI_API_KEY'):
            return jsonify({"error": "API key not configured"}), 500

        model = genai.GenerativeModel("gemini-1.5-pro")  # Using more stable model
        response = model.generate_content(user_input)
        
        if not response:
            return jsonify({"error": "No response from AI model"}), 500
            
        chat_response = response.text if hasattr(response, 'text') else str(response)
        return jsonify({"reply": chat_response})

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": "An error occurred processing your request"}), 500

@chatbot_bp.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']
        if not audio_file.filename:
            return jsonify({"error": "Empty audio file"}), 400

        # Check if API key is configured
        if not os.getenv('ASSEMBLYAI_API_KEY'):
            return jsonify({"error": "API key not configured"}), 500

        # Create temp directory if it doesn't exist
        temp_dir = os.path.join(current_dir, "temp")
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)

        audio_path = os.path.join(temp_dir, "temp_audio.wav")
        audio_file.save(audio_path)

        try:
            transcriber = aai.Transcriber()
            transcript = transcriber.transcribe(audio_path)
            
            # Clean up the temporary file
            os.remove(audio_path)
            
            if not transcript or not transcript.text:
                return jsonify({"error": "Could not transcribe audio"}), 500

            return jsonify({"transcript": transcript.text})

        except Exception as e:
            logger.error(f"Transcription error: {str(e)}")
            return jsonify({"error": "Error transcribing audio"}), 500

    except Exception as e:
        logger.error(f"Error in transcribe endpoint: {str(e)}")
        return jsonify({"error": "An error occurred processing your request"}), 500

@chatbot_bp.errorhandler(Exception)
def handle_error(error):
    logger.error(f"Unhandled error: {str(error)}")
    return jsonify({"error": "An unexpected error occurred"}), 500

# Initialize function to create temp directory
def init_chatbot():
    temp_dir = os.path.join(current_dir, "temp")
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    logger.info("Chatbot module initialized")
