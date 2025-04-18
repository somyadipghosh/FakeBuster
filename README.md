# 🕵️‍♂️ Project: FakeBuster – Real-Time Deepfake & Fake News Detector

## 🚀 Overview
FakeBuster is a browser extension and web tool that detects deepfakes and misinformation in real-time. Users can scan videos, images, or news articles as they browse online and get instant feedback on whether the content is manipulated or fake.

---

## 🧰 Tech Stack

### Frontend:
- React.js (SPA)
- Tailwind CSS (Styling)
- JavaScript (Browser Extension)

### Backend:
- Python (Flask or FastAPI)
- Hugging Face Transformers (Fake News Detection)
- Deepfake Detection API (e.g., Deepware)
- MongoDB (Optional for saving scan history)

### APIs Used:
1. Fake News Detection API (RapidAPI)
2. Fake News Detector API REST (DistilBERT Model)
3. Falah/News_Detection (Hugging Face Model)
4. Media Bias/Fact Check API
5. Deepware Scanner API (for deepfake detection)

---

## 📁 Project Structure

```
fakebuster/
├── backend/
│   ├── app.py
│   └── utils/
│       ├── fake_news.py
│       └── deepfake.py
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   └── popup.js
```

---

## 🧱 Features

### 1. Deepfake Detection
- Upload image or video URL
- Backend sends data to Deepware API
- Response includes probability of manipulation

### 2. Fake News Detection
- Paste article text or URL
- Text is tokenized and passed to a pre-trained DistilBERT model (or API)
- Returns verdict: Real, Fake, or Biased

### 3. Chrome Extension
- Injects content.js into visited pages
- Highlights suspicious content
- Allows users to scan selected articles/images with right-click

---

## 🔧 Step-by-Step Implementation

### Phase 1: Backend Setup
1. Initialize Flask or FastAPI project
2. Implement /detect-deepfake endpoint using Deepware API
3. Implement /check-news endpoint using HuggingFace or RapidAPI model
4. Enable CORS for cross-origin requests

### Phase 2: Frontend Web Tool
1. Set up React project with Tailwind CSS
2. Build UI pages:
   - Home (with scan buttons)
   - News Check
   - Image/Video Upload
3. Use Axios to call Flask APIs

### Phase 3: Browser Extension
1. Create manifest.json (v3)
2. Build content.js to scrape text/images from pages
3. Send scraped data to backend for analysis
4. Display visual warnings (e.g., red borders, tooltips)
5. Create popup.html with scan buttons

### Phase 4: Testing
1. Use FaceForensics++ samples for deepfake tests
2. Use LIAR/FakeNewsNet dataset articles for NLP validation
3. Test Chrome extension on news sites and social media

### Phase 5: Deployment (Optional)
- Host backend on Render or Railway
- Host frontend on Vercel
- Load extension in Chrome (Developer Mode)

---

## 🌟 Optional Features
- Real-time feed monitoring for Twitter or YouTube
- User dashboard for scan history
- Voice deepfake detection
- Gamified "Spot The Fake" mode for awareness

---

## 📌 Notes
- All APIs mentioned provide free tiers or open-source models
- Use Tailwind for responsive, clean UI
- Follow Chrome Extension v3 security guidelines (e.g., avoid eval)

---

Need help generating starter code for any part of this? Just ask! 😎
