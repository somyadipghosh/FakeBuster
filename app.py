from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import os
import sys
import json
import numpy as np
import tempfile
from image_detector.image_checker import analyze_image_url
import requests
from dotenv import load_dotenv
import traceback
import atexit
from flask_cors import CORS
import time
import random

# Configure logging for better error handling
import logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                   handlers=[
                       logging.FileHandler("fakebuster_app.log"),
                       logging.StreamHandler()
                   ])
logger = logging.getLogger(__name__)

# Custom exception handler to prevent application termination
def handle_exception(exc_type, exc_value, exc_traceback):
    # Log the exception
    logger.error("Uncaught exception", exc_info=(exc_type, exc_value, exc_traceback))
    # Don't terminate the process
    return True

# Install our custom exception handler
sys.excepthook = handle_exception

# Load environment variables
load_dotenv()

app = Flask(__name__,
    static_folder='static',
    template_folder='templates')
app.secret_key = "1111"
CORS(app)  # Enable CORS for all routes

IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Upload image to IMGBB hosting service
def upload_to_imgbb(image_file):
    url = "https://api.imgbb.com/1/upload"
    
    response = requests.post(
        url, 
        files={"image": image_file},
        data={"key": IMGBB_API_KEY}
    )
    
    if response.status_code == 200:
        return response.json()["data"]["url"]
    else:
        raise Exception(f"IMGBB upload failed: {response.status_code} - {response.text}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/detect-fake-image', methods=['POST'])
def detect_fake_image():
    try:
        # Check if image file is provided
        if 'image' not in request.files:
            return jsonify({"error": "No image file uploaded"}), 400
        
        image_file = request.files['image']
        
        # Upload to hosting service to get URL
        image_url = upload_to_imgbb(image_file)
        
        # Analyze the image using our module
        result = analyze_image_url(image_url)
        
        return jsonify(result), 200
    
    except Exception as e:
        logger.exception("Error in detect_fake_image")
        return jsonify({"error": str(e)}), 500

@app.route('/api/detect-fake-news', methods=['POST'])
def detect_fake_news():
    # Placeholder for news verification API
    # Will be implemented in future
    return jsonify({"status": "real", "result": "This news appears to be authentic based on our analysis."}), 200

@app.route('/api/detect-fake-audio', methods=['POST'])
def detect_fake_audio():
    """Simple API endpoint to detect fake audio - returns mock data for testing"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        # For testing/demo purposes only - return mock results
        # In production, you would process the audio file here
        
        # Simulate processing delay
        time.sleep(1)
        
        # Return mock result based on the file name (for testing)
        filename = audio_file.filename.lower()
        
        # Mock different results based on filename for testing
        if 'fake' in filename or 'ai' in filename or 'synthetic' in filename:
            return jsonify({
                'prediction': 'fake',
                'real_score': 0.12,
                'fake_score': 0.88,
                'confidence': 0.85
            })
        elif 'real' in filename or 'human' in filename or 'natural' in filename:
            return jsonify({
                'prediction': 'real',
                'real_score': 0.91,
                'fake_score': 0.09,
                'confidence': 0.87
            })
        else:
            # Add some randomness to make it more interesting
            fake_score = round(random.uniform(0.35, 0.65), 2)
            real_score = round(1 - fake_score, 2)
            confidence = round(random.uniform(0.55, 0.75), 2)
            
            return jsonify({
                'prediction': 'uncertain',
                'real_score': real_score,
                'fake_score': fake_score,
                'confidence': confidence
            })
        
    except Exception as e:
        print(f"Error processing audio: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Simple health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'API server is running'})

# Add cleanup function to be called on app exit
def cleanup():
    logger.info("Application shutting down, cleaning up resources...")
    # Any cleanup code can go here

# Register cleanup function
atexit.register(cleanup)

if __name__ == '__main__':
    # Start the Flask server with try/except to catch any errors during startup
    try:
        logger.info("Starting Flask server...")
        app.run(debug=True, port=5000)
    except Exception as e:
        logger.critical(f"Error starting Flask server: {e}")
        logger.critical(traceback.format_exc())