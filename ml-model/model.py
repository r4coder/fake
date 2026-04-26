import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# -----------------------------
# HELPER FUNCTIONS
# -----------------------------

def safe_col(df, col):
    return df[col].fillna("") if col in df.columns else ""

def to_label(x):
    x = str(x).lower()
    if x in ["1", "spam", "phishing", "fraud", "yes", "true"]:
        return 1
    return 0

# -----------------------------
# LOAD DATASETS
# -----------------------------

job_data = pd.read_csv("../dataset/fake_job_postings.csv")
phishing_data = pd.read_csv("../dataset/Phishing_Email.csv")
spam_data = pd.read_csv("../dataset/SpamAssasin.csv")
enron_data = pd.read_csv("../dataset/Enron.csv")

# 🔥 NEW: Custom dataset
custom_data = pd.read_csv("../dataset/custom_scams.csv")

# -----------------------------
# CLEAN JOB DATASET
# -----------------------------

job_data["text"] = (
    safe_col(job_data, "title") + " " +
    safe_col(job_data, "description") + " " +
    safe_col(job_data, "requirements")
)

job_data = job_data[["text", "fraudulent"]]
job_data.rename(columns={"fraudulent": "label"}, inplace=True)

# -----------------------------
# CLEAN PHISHING DATASET
# -----------------------------

phishing_data["text"] = phishing_data["text_combined"].fillna("")
phishing_data["label"] = phishing_data["label"].apply(to_label)
phishing_data = phishing_data[["text", "label"]].dropna()

# -----------------------------
# CLEAN SPAMASSASSIN DATASET
# -----------------------------

spam_data["text"] = (
    safe_col(spam_data, "subject") + " " +
    safe_col(spam_data, "body")
)

spam_data["label"] = spam_data["label"].apply(to_label)
spam_data = spam_data[["text", "label"]].dropna()

# -----------------------------
# CLEAN ENRON DATASET
# -----------------------------

enron_data["text"] = (
    safe_col(enron_data, "subject") + " " +
    safe_col(enron_data, "body")
)

enron_data["label"] = enron_data["label"].apply(to_label)
enron_data = enron_data[["text", "label"]].dropna()

# -----------------------------
# CLEAN CUSTOM DATA
# -----------------------------

custom_data["label"] = custom_data["label"].apply(to_label)
custom_data = custom_data[["text", "label"]].dropna()

# -----------------------------
# COMBINE ALL DATA
# -----------------------------

data = pd.concat([
    job_data,
    phishing_data,
    spam_data,
    enron_data,
    custom_data   # 🔥 IMPORTANT
], ignore_index=True)

# Shuffle
data = data.sample(frac=1, random_state=42)

print("Total samples:", len(data))
print("\nClass distribution:")
print(data["label"].value_counts())

# -----------------------------
# VECTORIZATION
# -----------------------------

X = data["text"]
y = data["label"]

vectorizer = TfidfVectorizer(
    max_features=15000,
    stop_words="english",
    ngram_range=(1, 2),
    min_df=2
)

X_vec = vectorizer.fit_transform(X)

# -----------------------------
# TRAIN-TEST SPLIT
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X_vec, y, test_size=0.2, random_state=42
)

# -----------------------------
# TRAIN MODEL (WITH PROBABILITY 🔥)
# -----------------------------

base_model = LogisticRegression(max_iter=300, class_weight="balanced")
model = CalibratedClassifierCV(base_model)
model.fit(X_train, y_train)

# -----------------------------
# EVALUATION
# -----------------------------

y_pred = model.predict(X_test)

print("\nModel Evaluation:\n")
print(classification_report(y_test, y_pred))

# -----------------------------
# SAVE MODEL
# -----------------------------

pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("\n✅ Improved model with probability trained successfully!")