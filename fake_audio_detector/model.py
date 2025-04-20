import os
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from utils import preprocess_for_model

class ResidualBlock(nn.Module):
    """Residual block with batch normalization"""
    def __init__(self, in_channels, out_channels, stride=1):
        super(ResidualBlock, self).__init__()
        self.conv1 = nn.Conv1d(in_channels, out_channels, kernel_size=3, 
                               stride=stride, padding=1, bias=False)
        self.bn1 = nn.BatchNorm1d(out_channels, track_running_stats=False)
        self.conv2 = nn.Conv1d(out_channels, out_channels, kernel_size=3, 
                               stride=1, padding=1, bias=False)
        self.bn2 = nn.BatchNorm1d(out_channels, track_running_stats=False)
        
        self.shortcut = nn.Sequential()
        if stride != 1 or in_channels != out_channels:
            self.shortcut = nn.Sequential(
                nn.Conv1d(in_channels, out_channels, kernel_size=1, 
                          stride=stride, bias=False),
                nn.BatchNorm1d(out_channels, track_running_stats=False)
            )

    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += self.shortcut(x)
        out = F.relu(out)
        return out

class RawAudioResNet(nn.Module):
    """ResNet-based model for raw audio deepfake detection"""
    def __init__(self, num_classes=2, input_length=16000):
        super(RawAudioResNet, self).__init__()
        self.in_channels = 64
        self.input_length = input_length
        
        # Initial convolutional layer
        self.conv1 = nn.Conv1d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.bn1 = nn.BatchNorm1d(64, track_running_stats=False)
        self.maxpool = nn.MaxPool1d(kernel_size=3, stride=2, padding=1)
        
        # Residual blocks
        self.layer1 = self._make_layer(64, 2, stride=1)
        self.layer2 = self._make_layer(128, 2, stride=2)
        self.layer3 = self._make_layer(256, 2, stride=2)
        self.layer4 = self._make_layer(512, 2, stride=2)
        
        # Final layers
        self.avgpool = nn.AdaptiveAvgPool1d(1)
        self.fc = nn.Linear(512, num_classes)
        
    def _make_layer(self, out_channels, num_blocks, stride):
        strides = [stride] + [1] * (num_blocks - 1)
        layers = []
        for stride in strides:
            layers.append(ResidualBlock(self.in_channels, out_channels, stride))
            self.in_channels = out_channels
        return nn.Sequential(*layers)
        
    def forward(self, x):
        # Ensure the input is the expected size
        batch_size, channels, length = x.shape
        if length != self.input_length:
            print(f"Warning: Expected input length {self.input_length}, got {length}. Resizing.")
            if length < self.input_length:
                # Pad if too short
                padding = self.input_length - length
                x = F.pad(x, (0, padding))
            else:
                # Trim if too long
                x = x[:, :, :self.input_length]
        
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.maxpool(out)
        
        out = self.layer1(out)
        out = self.layer2(out)
        out = self.layer3(out)
        out = self.layer4(out)
        
        out = self.avgpool(out)
        out = out.view(out.size(0), -1)
        out = self.fc(out)
        
        return out

class AudioDeepfakeDetector:
    """Main class for audio deepfake detection"""
    def __init__(self, model_path=None, device=None, input_length=16000):
        # Determine device
        if device is None:
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        else:
            self.device = device
            
        # Initialize model
        self.input_length = input_length
        self.model = RawAudioResNet(num_classes=2, input_length=input_length)
        
        # Load pre-trained weights if available
        if model_path and os.path.exists(model_path):
            try:
                self.model.load_state_dict(torch.load(model_path, map_location=self.device))
                print(f"Loaded model from {model_path}")
            except Exception as e:
                print(f"Error loading model weights: {e}")
                print("Using random weights instead.")
        else:
            print("No pre-trained model found. Using random weights.")
            
        self.model.to(self.device)
        self.model.eval()
        
    def predict(self, waveform, sample_rate):
        """
        Predict if audio is real or fake
        
        Args:
            waveform (numpy.ndarray): Audio waveform
            sample_rate (int): Sample rate
            
        Returns:
            dict: Prediction results containing:
                - 'score': Probability score (0-1) that audio is real
                - 'prediction': 'real' or 'fake'
        """
        try:
            # Preprocess audio to handle variable length
            x = preprocess_for_model(waveform, sample_rate, target_length=self.input_length)
            x = x.to(self.device)
            
            # Double check input shape
            if x.shape[1] != self.input_length:
                print(f"Warning: Expected length {self.input_length}, got {x.shape[1]}. Adjusting.")
                if x.shape[1] < self.input_length:
                    # Pad if needed
                    padding = self.input_length - x.shape[1]
                    x = torch.nn.functional.pad(x.unsqueeze(0), (0, padding)).squeeze(0)
                else:
                    # Trim if needed
                    x = x[:, :self.input_length]
            
            # Get model prediction
            with torch.no_grad():
                outputs = self.model(x.unsqueeze(0))  # Add batch dimension
                probs = F.softmax(outputs, dim=1)
                
            # Get results
            real_prob = probs[0, 0].item()
            fake_prob = probs[0, 1].item()
            prediction = "real" if real_prob > fake_prob else "fake"
            
            return {
                "real_score": real_prob,
                "fake_score": fake_prob,
                "prediction": prediction
            }
        except Exception as e:
            print(f"Error during prediction: {e}")
            # Return a default result if prediction fails
            return {
                "real_score": 0.5,
                "fake_score": 0.5,
                "prediction": "unknown",
                "error": str(e)
            }
    
    def get_confidence(self, result):
        """Calculate confidence score from prediction result"""
        if "error" in result:
            return 0.0
        
        if result["prediction"] == "real":
            return result["real_score"]
        elif result["prediction"] == "fake":
            return result["fake_score"]
        else:
            return 0.5 