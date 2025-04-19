import streamlit as st
import requests
from dotenv import load_dotenv
import os
from image_checker import analyze_image_url
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image

load_dotenv()

IMGBB_API_KEY = os.getenv("IMGBB_API_KEY")

# Create Flask app for API
app = Flask(__name__)
CORS(app)

def upload_to_imgbb(image_file):
    url = "https://api.imgbb.com/1/upload"
    payload = {
        "key": IMGBB_API_KEY,
        "image": image_file.getvalue()
    }

    response = requests.post(url, files={"image": image_file}, data={"key": IMGBB_API_KEY})
    if response.status_code == 200:
        return response.json()["data"]["url"]
    else:
        raise Exception(f"IMGBB upload failed: {response.status_code} - {response.text}")

# API endpoint for fake image detection
@app.route('/api/detect-fake-image', methods=['POST'])
def detect_fake_image_api():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
            
        image_file = request.files['image']
        
        # Convert to PIL Image for processing
        img = Image.open(image_file)
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format=img.format if img.format else 'JPEG')
        img_byte_arr.seek(0)
        
        # Upload to image hosting
        try:
            image_url = upload_to_imgbb(img_byte_arr)
            result = analyze_image_url(image_url)
            
            # Include additional info for frontend
            result["explanation"] = "Analysis performed using AI detection algorithms."
            return jsonify(result), 200
            
        except Exception as e:
            return jsonify({"error": f"Analysis failed: {str(e)}"}), 500
            
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Run the API server when script is executed directly
if __name__ == '__main__':
    # For Streamlit UI
    st.title("🕵️‍♂️ Fake Image Detector")

    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])

    if uploaded_file is not None:
        st.image(uploaded_file, caption='Uploaded Image', use_column_width=True)

        try:
            image_url = upload_to_imgbb(uploaded_file)
            result = analyze_image_url(image_url)

            scam_prob = result["scam_probability"] * 100
            faces = result["faces"]

            st.markdown(f"### 🧠 AI-generated (scam) probability: **{scam_prob:.2f}%**")
            st.markdown(f"### 👥 Faces detected: **{len(faces)}**")

        except Exception as e:
            st.error(f"Analysis failed: {e}")
    
    # Run Flask server for API
    app.run(debug=True, host='127.0.0.1', port=5000)

