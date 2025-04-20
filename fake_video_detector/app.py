import os
import tempfile
import requests
import streamlit as st
import validators
from dotenv import load_dotenv
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Get SightEngine API credentials
api_user = os.getenv("SIGHTENGINE_API_USER")
api_secret = os.getenv("SIGHTENGINE_API_SECRET")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set page configuration for Streamlit (if using Streamlit)
st.set_page_config(
    page_title="Fake AI Video Detector",
    page_icon="🔍",
    layout="centered"
)

def check_video_with_sightengine(video_path=None, video_url=None):
    """
    Check a video for AI-generated content using SightEngine API
    """
    # Define the models to use (deepfake for AI detection)
    models = "deepfake"  # Only use deepfake for now
    
    try:
        # Use file or URL based on what was provided
        if video_path:
            # SightEngine API endpoint for media upload
            url = "https://api.sightengine.com/1.0/video/check-sync.json"
            
            # For file uploads, use the files parameter properly with multipart/form-data
            files = {
                'media': open(video_path, 'rb')
            }
            data = {
                'api_user': api_user,
                'api_secret': api_secret,
                'models': models
            }
            # Make the API request with multipart form data
            response = requests.post(url, files=files, data=data)
            
        elif video_url:
            # SightEngine API endpoint for URL check
            url = "https://api.sightengine.com/1.0/video/check-sync.json"
            
            # For URL, use GET request with parameters as recommended by SightEngine docs
            # Note: SightEngine requires 'stream_url' parameter, not 'url'
            params = {
                'stream_url': video_url,
                'api_user': api_user,
                'api_secret': api_secret,
                'models': models
            }
            # Make the API request with URL parameters
            response = requests.get(url, params=params)
        
        # Check if the request was successful
        if response.status_code == 200:
            result = response.json()
            return result
        else:
            return {
                "error": True,
                "message": f"API Error: {response.status_code} - {response.text}"
            }
    except Exception as e:
        return {
            "error": True,
            "message": f"Error: {str(e)}"
        }
    finally:
        # Close the file if it was opened
        if video_path and 'files' in locals() and 'media' in files:
            files['media'].close()

def display_results(result):
    """
    Display the results from SightEngine API in a user-friendly format
    """
    if "error" in result:
        st.error(result["message"])
        return
    
    # Pretty print the full API response so we can see the structure for debugging
    st.expander("Raw API Response").write(json.dumps(result, indent=2))
    
    # Check if we have valid results
    if "status" in result and result["status"] == "success":
        st.success("Video analysis completed successfully")
        
        # Check if we have data structure expected for video check-sync API
        if "data" in result and "frames" in result["data"]:
            frames = result["data"]["frames"]
            
            # Display analysis for the first frame if available
            if len(frames) > 0:
                frame = frames[0]
                
                # Check if we have deepfake detection in the frame
                if "type" in frame and "deepfake" in frame["type"]:
                    st.subheader("Deepfake Detection")
                    deepfake_score = frame["type"]["deepfake"]
                    st.metric("Deepfake Probability", f"{deepfake_score:.2%}")
                    
                    # Provide interpretation
                    if deepfake_score > 0.7:
                        st.warning("⚠️ High probability that this video contains deepfake content")
                    elif deepfake_score > 0.4:
                        st.info("⚠️ Medium probability that this video contains deepfake content")
                    else:
                        st.success("✅ Low probability of deepfake content")
                
                # Display detailed analysis if more frames are available
                if len(frames) > 1:
                    st.subheader("Frame-by-Frame Analysis")
                    st.write(f"The API analyzed {len(frames)} frames from your video.")
                    
                    # Create an expandable section for detailed results
                    with st.expander("View Frame Details"):
                        for i, frame in enumerate(frames):
                            if "type" in frame and "deepfake" in frame["type"]:
                                st.write(f"Frame {i+1}: Deepfake Probability: {frame['type']['deepfake']:.2%}")
        else:
            st.warning("No frame analysis found in the API response. The video might be too short or couldn't be analyzed.")
    else:
        st.error(f"Analysis failed: {result.get('error', {}).get('message', 'Unknown error')}")

# Flask API routes
@app.route('/api/detect-fake-video/upload', methods=['POST'])
def detect_fake_video_upload():
    """API endpoint to handle video file uploads and detect fake content"""
    try:
        # Check if the request contains a file
        if 'video' not in request.files:
            return jsonify({
                "error": True,
                "message": "No video file provided"
            }), 400
        
        video_file = request.files['video']
        
        # Check if the file is empty
        if video_file.filename == '':
            return jsonify({
                "error": True,
                "message": "Empty file provided"
            }), 400
        
        # Save the uploaded file to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{video_file.filename.split('.')[-1]}") as tmp_file:
            video_file.save(tmp_file.name)
            tmp_path = tmp_file.name
        
        # Analyze the video
        result = check_video_with_sightengine(video_path=tmp_path)
        
        # Clean up the temporary file
        try:
            os.unlink(tmp_path)
        except:
            pass  # Silently fail if cleanup fails
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "error": True,
            "message": f"Error processing video: {str(e)}"
        }), 500

@app.route('/api/detect-fake-video/url', methods=['POST'])
def detect_fake_video_url():
    """API endpoint to handle video URL verification"""
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                "error": True,
                "message": "No video URL provided"
            }), 400
        
        video_url = data['url']
        
        # Validate URL
        if not validators.url(video_url):
            return jsonify({
                "error": True,
                "message": "Invalid URL provided"
            }), 400
        
        # Analyze the video from URL
        result = check_video_with_sightengine(video_url=video_url)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "error": True,
            "message": f"Error processing video URL: {str(e)}"
        }), 500

# Streamlit UI components
st.title("🔍 Fake AI Video Detector")
st.markdown("""
This application uses SightEngine's AI to detect if a video is AI-generated or contains deepfake content.
Upload a video file or provide a URL to analyze.
""")

# Input options
option = st.radio(
    "Choose input method:",
    ["Upload Video", "Provide Video URL"]
)

result = None

if option == "Upload Video":
    uploaded_file = st.file_uploader("Upload a video file", type=["mp4", "mov", "avi"])
    
    if uploaded_file is not None:
        # Save the uploaded file to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{uploaded_file.name.split('.')[-1]}") as tmp_file:
            tmp_file.write(uploaded_file.getvalue())
            video_path = tmp_file.name
        
        st.video(uploaded_file)
        
        if st.button("Analyze Video"):
            with st.spinner("Analyzing video... This may take a while depending on the video size."):
                result = check_video_with_sightengine(video_path=video_path)
            
            # Clean up the temporary file
            os.unlink(video_path)
            
else:  # Provide Video URL
    video_url = st.text_input("Enter the URL of the video")
    
    if video_url:
        # Validate URL
        if validators.url(video_url):
            st.video(video_url)
            
            if st.button("Analyze Video"):
                with st.spinner("Analyzing video... This may take a while."):
                    result = check_video_with_sightengine(video_url=video_url)
        else:
            st.error("Please enter a valid URL")

# Display results if available
if result:
    display_results(result)

# Add notes about SightEngine API
st.markdown("---")
st.markdown("""
### Notes:
- You need to sign up for a [SightEngine](https://sightengine.com/) account and get API credentials
- Update the .env file with your API credentials before using this application
- SightEngine offers free API calls for testing (limited number)
""")

# Add information about how the detection works
with st.expander("How does fake video detection work?"):
    st.markdown("""
    ### Detection Technology
    SightEngine's AI analyzes various aspects of videos to detect artificially generated content:
    
    1. **Deepfake Detection**: Identifies facial manipulation techniques commonly used in deepfakes
    2. **Frame Analysis**: Examines individual frames for signs of manipulation
    
    The algorithms look for subtle inconsistencies that are typically invisible to the human eye but are
    detectable by specialized AI models trained on thousands of authentic and fake videos.
    """)

# Run Flask app when executed directly (not through Streamlit)
if __name__ == "__main__":
    app.run(debug=True, port=5000)