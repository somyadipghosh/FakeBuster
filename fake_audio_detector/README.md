# Fake Audio Detector

A Streamlit application for detecting deepfake/spoofed audio using models based on the ASVspoof Challenge.

## Features

- Upload audio files for deepfake detection
- Real-time probability score for audio authenticity
- Visualizations of audio characteristics
- Easy-to-use web interface

## Quick Start

The easiest way to run the application:

```
python run.py
```

This script will:
1. Check and install missing dependencies
2. Download a model if needed
3. Start the Streamlit application

## Detailed Installation

For detailed installation instructions, see [SETUP.md](SETUP.md).

## Usage

1. Upload an audio file (WAV, MP3, FLAC, or M4A format)
2. Click the "Analyze Audio" button
3. View the detailed analysis results, including:
   - Probability of the audio being real or fake
   - Visualization of audio characteristics
   - Explanation of the detection results

## Project Structure

- `app.py`: Main Streamlit application
- `model.py`: Contains the deepfake detection model implementation
- `utils.py`: Utility functions for audio processing
- `download_model.py`: Script to download pre-trained models
- `run.py`: Helper script to set up and run the application
- `models/`: Directory containing pre-trained models
- `examples/`: Sample audio files for testing

## Model Information

This application uses models developed for the ASVspoof Challenge, a community-led initiative to promote the development of countermeasures against spoofed/deepfake speech.

## Requirements

- Python 3.8+
- Libraries: streamlit, torch, torchaudio, librosa, numpy, etc. (see requirements.txt)

## Contributing

Contributions are welcome! Some ways to contribute:
- Add support for more audio formats
- Improve the detection model
- Enhance the user interface
- Add more visualization options

## License

This project is available under the MIT License. 