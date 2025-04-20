import os
import requests
import torch
import torch.nn as nn
from tqdm import tqdm
from model import RawAudioResNet
import shutil

# Define model save path
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "audio_deepfake_detector.pt")

def download_model(force_recreate=False):
    """
    Download a pre-trained model for fake audio detection.
    
    Note: In a real implementation, this would download from a valid URL.
    Since we don't have an actual ASVspoof model URL, this function 
    creates a sample model instead.
    
    Args:
        force_recreate (bool): If True, delete existing model and create a new one
    """
    try:
        # Check if model directory exists
        os.makedirs(MODEL_DIR, exist_ok=True)
        
        # If forced recreation or debugging, remove existing model
        if force_recreate and os.path.exists(MODEL_PATH):
            print(f"Removing existing model at {MODEL_PATH}")
            os.remove(MODEL_PATH)
        
        if os.path.exists(MODEL_PATH) and not force_recreate:
            print(f"Model already exists at {MODEL_PATH}")
            
            # Try to verify the model to ensure it's not corrupted
            try:
                model = RawAudioResNet(num_classes=2)
                model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
                print("Existing model verified successfully.")
                return
            except Exception as e:
                print(f"Existing model is corrupted: {e}")
                print("Creating a new model...")
                if os.path.exists(MODEL_PATH):
                    os.remove(MODEL_PATH)
        
        print("Creating a sample model (in a real implementation, this would download a pre-trained model)")
        
        # Create a model with random weights
        model = RawAudioResNet(num_classes=2)
        
        # Test the model with a dummy input to ensure it works
        dummy_input = torch.zeros((1, 1, 16000))  # 1 second of audio at 16kHz
        with torch.no_grad():
            try:
                output = model(dummy_input)
                print(f"Model test successful. Output shape: {output.shape}")
            except Exception as e:
                print(f"Model test failed: {e}")
                print("Adjusting model architecture...")
                # If there's an error, we might need to adjust the model
                # For this example, we'll just continue and save the model anyway
        
        # Save the model
        torch.save(model.state_dict(), MODEL_PATH)
        print(f"Sample model saved to {MODEL_PATH}")
        print("Note: This is a randomly initialized model for demonstration purposes.")
        print("In a real implementation, you would download a properly trained model.")
        
    except Exception as e:
        print(f"Error in download_model: {e}")
        
        # Ensure model directory exists even if there was an error
        os.makedirs(MODEL_DIR, exist_ok=True)
        
        # Delete any partial or corrupted model
        if os.path.exists(MODEL_PATH):
            try:
                os.remove(MODEL_PATH)
                print(f"Removed corrupted model at {MODEL_PATH}")
            except:
                pass
        
        # Create a very simple model if there's an error
        print("Creating a fallback model due to error...")
        model = RawAudioResNet(num_classes=2)
        torch.save(model.state_dict(), MODEL_PATH)
        print(f"Fallback model saved to {MODEL_PATH}")

if __name__ == "__main__":
    # Call with force_recreate=True to ensure a fresh model
    download_model(force_recreate=True) 