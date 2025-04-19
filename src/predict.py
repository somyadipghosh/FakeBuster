import pandas as pd
import joblib

# Load saved model and vectorizer
model = joblib.load('models/fake_news_model.pkl')
vectorizer = joblib.load('models/tfidf_vectorizer.pkl')

def predict(texts):
    # texts: list of strings
    X_vec = vectorizer.transform(texts)
    preds = model.predict(X_vec)
    return preds

# Example: load test data
test_df = pd.read_csv('datasets/processed/test_clean.csv')
sample_texts = test_df['text'][:5].tolist()

# Predict
predictions = predict(sample_texts)

# Show results
for i, text in enumerate(sample_texts):
    label = "TRUE ✅" if predictions[i] == 1 else "FAKE ❌"
    print(f"\n🔹 {label}\n{text}")
