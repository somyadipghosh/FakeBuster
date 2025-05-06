import os
import numpy as np
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS

# Create a minimal Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
        import time
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
            # Default uncertain result
            return jsonify({
                'prediction': 'uncertain',
                'real_score': 0.58,
                'fake_score': 0.42,
                'confidence': 0.65
            })
        
    except Exception as e:
        print(f"Error processing audio: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Simple health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Audio detection API is running'})

# Run the app
if __name__ == "__main__":
    print("Starting simplified audio detection API server...")
    print("API will be available at: http://localhost:5000/api/detect-fake-audio")
    print("Test the API is running by visiting: http://localhost:5000/api/health")
    app.run(debug=True, port=5000, host="0.0.0.0")