from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({"status": "OK", "message": "MediTrack Chatbot API is running"})

if __name__ == '__main__':
    print("Starting simple Flask application on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True)
