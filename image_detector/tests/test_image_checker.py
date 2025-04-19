import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from image_detector.image_checker import analyze_image

image_url = "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png"  # Replace if needed

result = analyze_image(image_url)
print("Sightengine Analysis:")
print(result)
