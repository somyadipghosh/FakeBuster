import requests
import os
from dotenv import load_dotenv
import warnings
import sys

# Load environment variables from .env
load_dotenv()

# Suppress ScriptRunContext warning when running in bare mode
if 'pytest' not in sys.modules and 'sphinx' not in sys.modules:
    warnings.filterwarnings("ignore", message=".*missing ScriptRunContext.*")

API_USER = os.getenv("SIGHTENGINE_API_USER")
API_SECRET = os.getenv("SIGHTENGINE_API_SECRET")

def analyze_image_url(image_url):
    """
    Analyze an image using its URL with the Sightengine API.
    Focuses on AI-generated probability and face detection.
    
    :param image_url: URL of the image (e.g., from IMGBB).
    :return: A dictionary with AI generation probability and face detection results.
    """
    url = "https://api.sightengine.com/1.0/check.json"

    params = {
        'models': 'scam,faces',
        'api_user': API_USER,
        'api_secret': API_SECRET,
        'url': image_url
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        raise Exception(f"Sightengine API error: {response.status_code} - {response.text}")

    data = response.json()

    return {
        "scam_probability": data.get("scam", {}).get("prob", 0),
        "faces": data.get("faces", [])
    }
