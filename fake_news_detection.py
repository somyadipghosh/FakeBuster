import google.generativeai as genai
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Set Gemini API key
genai.configure(api_key=os.getenv("AIzaSyADF-qXxPzi8fcNBf8gDqaqiMdh9-Me4ko"))

# Function to use Gemini for fake news detection
def gemini_fake_news_prediction(news_text):
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")  # or use "gemini-pro" depending on availability
        prompt = (
            "You are a fake news detection expert. "
            "Analyze the following news text and determine if it's REAL or FAKE. "
            "Respond with either 'REAL' or 'FAKE' and a one-line reasoning.\n\n"
            f"News: \"{news_text}\""
        )
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error: {str(e)}"

# Create Flask app
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)  # Enable CORS for all routes

# API endpoint for fake news detection
@app.route('/api/detect-fake-news', methods=['POST'])
def detect_fake_news():
    data = request.json
    news_text = data.get('news', '')
    
    if not news_text:
        return jsonify({'error': 'No news text provided'}), 400
    
    result = gemini_fake_news_prediction(news_text)
    
    # Determine status based on prediction
    status = "unknown"
    if "REAL" in result.upper():
        status = "real"
    elif "FAKE" in result.upper():
        status = "fake"
    
    return jsonify({
        'status': status,
        'result': result
    })

# Main route to serve the application
@app.route('/')
def index():
    return app.send_static_file('templates/index.html')

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
