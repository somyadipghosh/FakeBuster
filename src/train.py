import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

# Load cleaned datasets
train_df = pd.read_csv('datasets/processed/train_clean.csv')
valid_df = pd.read_csv('datasets/processed/valid_clean.csv')

# Features and labels
X_train, y_train = train_df['text'], train_df['label']
X_valid, y_valid = valid_df['text'], valid_df['label']

# Vectorize text using TF-IDF
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train)
X_valid_vec = vectorizer.transform(X_valid)

# Train logistic regression model
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

# Evaluate
y_pred = model.predict(X_valid_vec)

# ✅ Print classification report and accuracy
print("📊 Validation Results:")
print(classification_report(y_valid, y_pred))
print("Accuracy:", accuracy_score(y_valid, y_pred))  # 👈 added line

# Save model and vectorizer
os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/fake_news_model.pkl')
joblib.dump(vectorizer, 'models/tfidf_vectorizer.pkl')
print("✅ Model and vectorizer saved in /models")

# Show label distribution and data preview
print(train_df['label'].value_counts())
print(train_df.head())
