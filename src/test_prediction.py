import joblib

# Load model and vectorizer
model = joblib.load('models/fake_news_model.pkl')
vectorizer = joblib.load('models/tfidf_vectorizer.pkl')

# Sample news
sample_text = "NASA confirms water on the moon"

# Vectorize and predict
vec = vectorizer.transform([sample_text])
pred = model.predict(vec)[0]

print("🧠 Predicted label:", pred)
