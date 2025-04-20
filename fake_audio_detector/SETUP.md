# Setup Instructions

Follow these steps to set up and run the Fake Audio Detector application:

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Git (optional, for cloning the repository)

## Installation

1. Clone or download this repository:
   ```
   git clone https://github.com/yourusername/fake_audio_detector.git
   cd fake_audio_detector
   ```

   Or download and extract the ZIP file.

2. Create a virtual environment (recommended):
   ```
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. There are two ways to set up and run the application:

   ### Option 1: Using the Helper Script (Recommended)
   
   The `run.py` script will automatically check and install dependencies, download the model, and start the application:
   
   ```
   python run.py
   ```
   
   ### Option 2: Manual Setup
   
   If you prefer to set up manually:
   
   ```
   pip install -r requirements.txt
   python download_model.py
   streamlit run app.py
   ```

## Running the Application

Once started, the application will be available in your browser at http://localhost:8501

## Using the Application

1. Upload an audio file using the file uploader (supported formats: WAV, MP3, FLAC, M4A)
2. Click the "Analyze Audio" button
3. View the results showing the probability of the audio being real or fake

## Troubleshooting

### Common Issues

1. **Audio libraries installation problems**:
   - On Windows, you might need Visual C++ Build Tools
   - On Linux: `sudo apt-get install libasound2-dev portaudio19-dev libportaudio2 libportaudiocpp0 ffmpeg`
   - On macOS: `brew install portaudio ffmpeg`

2. **Model download issues**:
   - If the automatic model download fails, manually create a directory named `models` and place a compatible model file there
   - Ensure the model file is named `audio_deepfake_detector.pt`

3. **Audio file loading issues**:
   - Ensure your audio file is not corrupted
   - Try converting your audio to WAV format, which tends to have better compatibility

4. **Streamlit display issues**:
   - Try running with a different browser
   - Clear your browser cache

### Need Help?

If you encounter any issues not covered here, please:
1. Check the FAQ section in the README
2. Open an issue on the GitHub repository
3. Contact the maintainers 