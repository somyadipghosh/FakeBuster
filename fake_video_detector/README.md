# Fake AI Video Detector

A Streamlit application that uses SightEngine's API to detect AI-generated or manipulated videos.

## Features

- Upload video files or provide video URLs for analysis
- Detect deepfakes and AI-generated content in videos
- View detection confidence scores and analysis results
- Frame-by-frame analysis of video content

## Setup

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/fake_video_detector.git
   cd fake_video_detector
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Sign up for a [SightEngine](https://sightengine.com/) account and get your API credentials.

4. Create a `.env` file in the project root directory with your SightEngine API credentials:
   ```
   SIGHTENGINE_API_USER=your_api_user
   SIGHTENGINE_API_SECRET=your_api_secret
   ```

## Usage

Run the Streamlit application:
```
streamlit run app.py
```

This will start the web application, which you can access in your browser (typically at http://localhost:8501).

### Using the Application

1. Choose whether to upload a video file or provide a URL
2. If uploading, select a video file from your computer
3. If using a URL, enter the URL of a publicly accessible video
4. Click "Analyze Video" to start the detection process
5. View the results showing the likelihood of the video being AI-generated

## SightEngine Models Used

This application uses the following SightEngine models:

- **deepfake**: Detects face manipulation in videos (face swaps, etc.)
- **genai**: Identifies videos created by AI generators

## Notes

- The free tier of SightEngine API has usage limitations. Check their pricing page for details.
- Video analysis may take some time depending on the size and length of the video.
- This tool provides probabilities and should be used as one factor in determining video authenticity.

## Technologies Used

- Python
- Streamlit for the web interface
- SightEngine API for AI video analysis
- Requests for API communication 