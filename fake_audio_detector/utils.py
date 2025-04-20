import os
import numpy as np
import torch
import torchaudio
import librosa
import matplotlib.pyplot as plt
from io import BytesIO

def load_audio(file_path, sample_rate=16000):
    """
    Load an audio file and resample it to the desired sample rate.
    
    Args:
        file_path (str): Path to the audio file
        sample_rate (int): Desired sample rate
        
    Returns:
        numpy.ndarray: Audio waveform
        int: Sample rate
    """
    try:
        # First try loading with torchaudio
        try:
            if hasattr(file_path, 'getvalue'):  # If it's a BytesIO object from Streamlit
                with BytesIO(file_path.getvalue()) as buffer:
                    waveform, sr = torchaudio.load(buffer)
            else:
                waveform, sr = torchaudio.load(file_path)
            
            # Convert stereo to mono if needed
            if waveform.shape[0] > 1:
                waveform = torch.mean(waveform, dim=0, keepdim=True)
            
            # Resample if needed
            if sr != sample_rate:
                resampler = torchaudio.transforms.Resample(sr, sample_rate)
                waveform = resampler(waveform)
            
            return waveform.numpy().squeeze(), sample_rate
        
        except Exception as e:
            print(f"TorchAudio loading failed, trying librosa: {e}")
            # If torchaudio fails, try librosa as a fallback
            waveform, sr = librosa.load(file_path, sr=sample_rate, mono=True)
            return waveform, sr
            
    except Exception as e:
        print(f"Error loading audio: {e}")
        return None, None

def extract_features(waveform, sample_rate):
    """
    Extract audio features for deepfake detection.
    
    Args:
        waveform (numpy.ndarray): Audio waveform
        sample_rate (int): Sample rate
        
    Returns:
        numpy.ndarray: Extracted features
    """
    try:
        # Ensure the audio is long enough to extract features
        min_length = 1024
        if len(waveform) < min_length:
            # Pad audio if too short
            waveform = np.pad(waveform, (0, min_length - len(waveform)))
        
        # Extract mel spectrogram
        mel_spec = librosa.feature.melspectrogram(
            y=waveform, 
            sr=sample_rate,
            n_fft=1024,
            hop_length=512,
            n_mels=80
        )
        
        # Convert to log scale
        log_mel_spec = librosa.power_to_db(mel_spec)
        
        # Extract MFCC features
        mfcc = librosa.feature.mfcc(
            S=librosa.power_to_db(mel_spec), 
            n_mfcc=20
        )
        
        # Concatenate features
        features = np.concatenate([log_mel_spec, mfcc], axis=0)
        
        return features
    except Exception as e:
        print(f"Error extracting features: {e}")
        # Return dummy features if extraction fails
        return np.zeros((100, 100))

def plot_audio_features(waveform, sample_rate, features=None):
    """
    Generate visualizations for audio waveform and features.
    
    Args:
        waveform (numpy.ndarray): Audio waveform
        sample_rate (int): Sample rate
        features (numpy.ndarray, optional): Extracted features
        
    Returns:
        matplotlib.figure.Figure: Figure with plots
    """
    try:
        fig, axes = plt.subplots(3, 1, figsize=(10, 12))
        
        # Plot waveform
        axes[0].plot(np.linspace(0, len(waveform)/sample_rate, len(waveform)), waveform)
        axes[0].set_title('Waveform')
        axes[0].set_xlabel('Time (s)')
        axes[0].set_ylabel('Amplitude')
        
        # Plot spectrogram
        D = librosa.amplitude_to_db(np.abs(librosa.stft(waveform)), ref=np.max)
        librosa.display.specshow(D, y_axis='log', x_axis='time', sr=sample_rate, ax=axes[1])
        axes[1].set_title('Spectrogram')
        
        # Plot mel spectrogram
        mel_spec = librosa.feature.melspectrogram(y=waveform, sr=sample_rate)
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
        librosa.display.specshow(mel_spec_db, y_axis='mel', x_axis='time', sr=sample_rate, ax=axes[2])
        axes[2].set_title('Mel Spectrogram')
        
        plt.tight_layout()
        return fig
    except Exception as e:
        print(f"Error generating plots: {e}")
        # Return a simple figure with error message
        fig, ax = plt.subplots(1, 1, figsize=(10, 4))
        ax.text(0.5, 0.5, f"Error generating visualizations: {str(e)}", 
                ha='center', va='center', fontsize=12)
        ax.axis('off')
        return fig

def preprocess_for_model(waveform, sample_rate, target_length=16000):
    """
    Preprocess the audio waveform for the model.
    
    Args:
        waveform (numpy.ndarray): Audio waveform
        sample_rate (int): Sample rate
        target_length (int): Target length in samples (16000 = 1 second at 16kHz)
        
    Returns:
        torch.Tensor: Preprocessed waveform
    """
    try:
        # Convert to tensor
        waveform_tensor = torch.from_numpy(waveform).float()
        
        # Ensure correct dimensions
        if waveform_tensor.dim() == 1:
            waveform_tensor = waveform_tensor.unsqueeze(0)
        
        # Pad or trim to target length
        if waveform_tensor.shape[1] < target_length:
            # Pad
            padding = target_length - waveform_tensor.shape[1]
            waveform_tensor = torch.nn.functional.pad(waveform_tensor, (0, padding))
        else:
            # Trim
            waveform_tensor = waveform_tensor[:, :target_length]
        
        # Double check the dimensions
        assert waveform_tensor.shape[1] == target_length, f"Expected length {target_length}, got {waveform_tensor.shape[1]}"
        
        return waveform_tensor
    except Exception as e:
        print(f"Error preprocessing audio: {e}")
        # Return a dummy tensor of the expected shape
        return torch.zeros((1, target_length)) 