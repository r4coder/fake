from flask import Flask, request, jsonify
import pickle
import traceback
import os

app = Flask(__name__)

# -----------------------------
# LOAD MODEL SAFELY
# -----------------------------
try:
    model = pickle.load(open("model.pkl", "rb"))
    vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Model loading failed:", str(e))
    model = None
    vectorizer = None

# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.route("/")
def home():
    return jsonify({
        "status": "ML API running"
    })

# -----------------------------
# PREDICT ROUTE
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if model is None or vectorizer is None:
            return jsonify({
                "error": "Model not loaded"
            }), 500

        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({
                "error": "Invalid request. 'text' required"
            }), 400

        text = data.get("text", "").strip()

        if not text:
            return jsonify({
                "error": "Empty text"
            }), 400

        # 🔹 Vectorize
        vec = vectorizer.transform([text])

        # 🔥 Probability score
        prob = model.predict_proba(vec)[0][1] * 100

        prediction = int(prob > 50)

        return jsonify({
            "ml_score": round(prob, 2),
            "prediction": prediction
        })

    except Exception as e:
        print("🔥 ERROR:", str(e))
        traceback.print_exc()

        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

# -----------------------------
# RUN SERVER (RENDER FIX)
# -----------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)