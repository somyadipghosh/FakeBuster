# Example Audio Files

This directory contains sample audio files for testing the deepfake detection functionality:

## Where to get test files

1. **Real audio samples**: 
   - Record your own voice using a microphone
   - Use royalty-free speech samples from sites like [FreeSound](https://freesound.org/)

2. **Fake/spoofed audio samples**:
   - Use samples from the [ASVspoof dataset](https://www.asvspoof.org/) (requires registration)
   - Generated samples using text-to-speech tools like [Google TTS](https://cloud.google.com/text-to-speech), [Amazon Polly](https://aws.amazon.com/polly/), etc.
   - Voice conversion tools

## File formats

The detector supports common audio formats including:
- WAV
- MP3
- FLAC
- M4A

For best results, use audio with:
- Sample rate: 16kHz or above
- Duration: 2-10 seconds
- Clear speech without background noise

## Note

For actual implementation, you should obtain properly labeled real and fake audio samples for testing. 