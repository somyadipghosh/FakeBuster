#!/usr/bin/env python3
"""
Launcher script for the Fake Audio Detector application.
This script checks for dependencies and starts the Streamlit application.
"""
import os
import sys
import subprocess
import importlib.util

def check_package(package_name):
    """Check if a package is installed"""
    return importlib.util.find_spec(package_name) is not None

def install_package(package):
    """Install a package using pip"""
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

def check_and_install_dependencies():
    """Check and install required dependencies"""
    required_packages = [
        "streamlit", "torch", "torchaudio", "numpy", 
        "librosa", "matplotlib", "scikit-learn", "joblib",
        "scipy", "requests", "python-dotenv"
    ]
    
    missing_packages = []
    for package in required_packages:
        if not check_package(package):
            missing_packages.append(package)
    
    if missing_packages:
        print(f"Missing dependencies: {', '.join(missing_packages)}")
        response = input("Do you want to install these packages? (y/n): ")
        if response.lower() == 'y':
            for package in missing_packages:
                print(f"Installing {package}...")
                install_package(package)
            print("All dependencies installed successfully!")
        else:
            print("Please install the missing dependencies manually and try again.")
            sys.exit(1)

def check_model():
    """Check if the model file exists and download if necessary"""
    model_path = os.path.join("models", "audio_deepfake_detector.pt")
    if not os.path.exists(model_path):
        print("Model file not found. Downloading...")
        try:
            subprocess.check_call([sys.executable, "download_model.py"])
        except subprocess.CalledProcessError:
            print("Failed to download model. Please run 'python download_model.py' manually.")
            sys.exit(1)

def main():
    """Main entry point"""
    print("✓ Checking dependencies...")
    check_and_install_dependencies()
    
    print("✓ Checking model file...")
    check_model()
    
    print("✓ Starting Streamlit application...")
    try:
        subprocess.run([sys.executable, "-m", "streamlit", "run", "app.py"])
    except KeyboardInterrupt:
        print("\n✓ Application stopped.")
        sys.exit(0)
    except Exception as e:
        print(f"Error running the application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 