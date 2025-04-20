import os
import numpy as np
import time
import matplotlib.pyplot as plt
from pathlib import Path
from datetime import datetime
import traceback
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile

from model import AudioDeepfakeDetector
from utils import load_audio, extract_features, plot_audio_features

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define model path
MODEL_PATH = os.path.join("models", "audio_deepfake_detector.pt")

def load_model():
    """Load model for audio detection"""
    try:
        return AudioDeepfakeDetector(model_path=MODEL_PATH)
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return None

@app.route('/api/detect-fake-audio', methods=['POST'])
def detect_fake_audio():
    """API endpoint to detect fake audio"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        # Save uploaded file to temp directory
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio_file.filename)[1]) as tmp:
            audio_file.save(tmp.name)
            tmp_path = tmp.name
        
        # Load audio
        waveform, sample_rate = load_audio(tmp_path)
        
        if waveform is None:
            os.unlink(tmp_path)  # Clean up temp file
            return jsonify({'error': 'Error loading audio file'}), 400
        
        # Extract features
        features = extract_features(waveform, sample_rate)
        
        # Load model and make prediction
        detector = load_model()
        if detector is None:
            os.unlink(tmp_path)  # Clean up temp file
            return jsonify({'error': 'Failed to load the model'}), 500
            
        result = detector.predict(waveform, sample_rate)
        
        # Check if there was an error in prediction
        if "error" in result:
            os.unlink(tmp_path)  # Clean up temp file
            return jsonify({'error': result['error']}), 500
        
        # Compute confidence
        confidence = detector.get_confidence(result)
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        # Return result
        return jsonify({
            'prediction': result['prediction'],
            'real_score': float(result['real_score']),
            'fake_score': float(result['fake_score']),
            'confidence': float(confidence)
        })
        
    except Exception as e:
        # Ensure temp file is cleaned up even if there's an error
        try:
            if 'tmp_path' in locals():
                os.unlink(tmp_path)
        except:
            pass
        
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

# Only run the app when this script is executed directly
if __name__ == "__main__":
    print("Starting Flask API server for fake audio detection...")
    app.run(debug=True, port=5000)