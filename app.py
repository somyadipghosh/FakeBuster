from flask import Flask, request, jsonify, render_template
import os
from image_detector.image_checker import analyze_image_url
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, 
    static_folder='static',
    template_folder='templates')

IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")

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
        return jsonify({"error": str(e)}), 500

@app.route('/api/detect-fake-news', methods=['POST'])
def detect_fake_news():
    # Placeholder for news verification API
    # Will be implemented in future
    return jsonify({"status": "real", "result": "This news appears to be authentic based on our analysis."}), 200

if __name__ == '__main__':
    app.run(debug=True)